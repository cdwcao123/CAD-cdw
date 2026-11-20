"""Inspect DXF or draw reviewed lane candidates in a new DXF."""
import argparse
import json
import math
from collections import Counter
from pathlib import Path
import ezdxf


def geometry_bounds(lanes):
    xs, ys = [], []
    for lane in lanes:
        for line in lane.get('border_line_points', []):
            xs.extend(p['x'] for p in line if isinstance(p, dict) and 'x' in p and 'y' in p)
            ys.extend(p['y'] for p in line if isinstance(p, dict) and 'x' in p and 'y' in p)
        for point in lane.get('traverse_point_array', []):
            xs.append(point['x'])
            ys.append(point['y'])
    if not xs:
        raise ValueError('No lane geometry to draw')
    return min(xs), min(ys), max(xs), max(ys)


def lane_anchor(lane):
    points = [
        point for point in lane.get('traverse_point_array', [])
        if isinstance(point.get('x'), (int, float)) and isinstance(point.get('y'), (int, float))
    ]
    if not points:
        raise ValueError('Lane has no numeric point coordinates')
    return (
        (min(point['x'] for point in points) + max(point['x'] for point in points)) / 2,
        (min(point['y'] for point in points) + max(point['y'] for point in points)) / 2,
    )


def dxf_color_attribs(color):
    text = str(color or '')
    if text.startswith('rgb:') and text[4:].isdigit():
        return {'true_color': int(text[4:])}
    if text.startswith('aci:') and text[4:].isdigit():
        value = int(text[4:])
        if 0 < value < 256:
            return {'color': value}
    return {}


def point_color_order(point):
    value = point.get('color_layer_order')
    return int(value) if isinstance(value, (int, float)) else 10000


def polyline_length(points):
    return sum(
        math.hypot(points[index]['x'] - points[index - 1]['x'], points[index]['y'] - points[index - 1]['y'])
        for index in range(1, len(points))
    )


def project_distance(point, line):
    best = float('inf')
    for index in range(1, len(line)):
        ax, ay = line[index - 1]['x'], line[index - 1]['y']
        bx, by = line[index]['x'], line[index]['y']
        dx, dy = bx - ax, by - ay
        length2 = dx * dx + dy * dy
        if length2 < 1e-12:
            px, py = ax, ay
        else:
            ratio = max(0.0, min(1.0, ((point[0] - ax) * dx + (point[1] - ay) * dy) / length2))
            px, py = ax + ratio * dx, ay + ratio * dy
        best = min(best, math.hypot(point[0] - px, point[1] - py))
    return best


def sampled_gaps(source, target, count=24):
    total = polyline_length(source)
    if total <= 1e-9:
        return []
    gaps = []
    travelled = 0.0
    next_distance = 0.0
    for index in range(1, len(source)):
        ax, ay = source[index - 1]['x'], source[index - 1]['y']
        bx, by = source[index]['x'], source[index]['y']
        length = math.hypot(bx - ax, by - ay)
        while length > 1e-9 and travelled + length >= next_distance and len(gaps) < count:
            ratio = (next_distance - travelled) / length
            gaps.append(project_distance((ax + ratio * (bx - ax), ay + ratio * (by - ay)), target))
            next_distance += total / count
        travelled += length
    return gaps


def corridor_geometry_issues(lane):
    boundaries = lane.get('border_line_points') or []
    if len(boundaries) != 2 or any(len(line) < 2 for line in boundaries):
        return []
    quality = lane.get('boundary_geometry_quality')
    if isinstance(quality, dict):
        return ['unstable_or_nonparallel_boundaries'] if quality.get('valid') is False else []
    gaps = sampled_gaps(boundaries[0], boundaries[1]) + sampled_gaps(boundaries[1], boundaries[0])
    if len(gaps) < 4:
        return ['unstable_or_nonparallel_boundaries']
    ordered = sorted(gaps)
    median = ordered[len(ordered) // 2]
    p10 = ordered[int((len(ordered) - 1) * 0.1)]
    p90 = ordered[int((len(ordered) - 1) * 0.9)]
    width_spread = (p90 - p10) / median if median > 1e-9 else float('inf')

    def direction(line):
        sx = sy = 0.0
        for index in range(1, len(line)):
            dx = line[index]['x'] - line[index - 1]['x']
            dy = line[index]['y'] - line[index - 1]['y']
            length = math.hypot(dx, dy)
            if length > 1e-9:
                sx += dx / length
                sy += dy / length
        length = math.hypot(sx, sy)
        return (sx / length, sy / length) if length > 1e-9 else None

    direction_a, direction_b = direction(boundaries[0]), direction(boundaries[1])
    parallelism = abs(direction_a[0] * direction_b[0] + direction_a[1] * direction_b[1]) if direction_a and direction_b else 0.0
    issues = []
    if width_spread > 1.0:
        issues.append('unstable_boundary_width')
    if parallelism < 0.35:
        issues.append('different_boundary_direction')
    return issues


def boundary_pair_issues(lane):
    issues = []
    boundaries = lane.get('border_line_points') or []
    if len(boundaries) != 2 or any(len(line) < 2 for line in boundaries):
        issues.append('requires_two_original_boundary_lines')
    colors = lane.get('boundary_line_colors') or []
    if len(colors) != 2:
        issues.append('missing_boundary_colors')
    elif not colors[0] or not colors[1] or colors[0] == 'unknown' or colors[1] == 'unknown':
        issues.append('unknown_boundary_color')
    elif colors[0] != colors[1]:
        issues.append('different_boundary_colors')
    if lane.get('single_line_used') is True or lane.get('network_source') == 'single_line_geometry':
        issues.append('single_line_is_not_a_laneway')
    issues.extend(corridor_geometry_issues(lane))
    return issues


def lane_data_issues(lane):
    issues = boundary_pair_issues(lane)
    points = lane.get('traverse_point_array') or []
    if not points:
        issues.append('missing_survey_points')
    for point in sorted(points, key=lambda item: (
        point_color_order(item),
        str(item.get('color_group') or item.get('source_circle_color') or ''),
        str(item.get('point_name') or ''),
    )):
        if not str(point.get('point_name') or '').strip():
            issues.append('missing_point_name')
            break
    for point in points:
        elevation = point.get('z_bottom')
        if not isinstance(elevation, (int, float)):
            elevation = point.get('elevation')
        if not isinstance(elevation, (int, float)):
            issues.append('missing_point_elevation')
            break
    return issues


def add_lane_into(layout, lane, marker, text_height):
    anchor_x, anchor_y = lane_anchor(lane)
    local = lambda x, y: (x - anchor_x, y - anchor_y)
    collected = lane.get('network_source') is None
    boundary_layer = 'COLLECTED_BOUNDARY' if collected else 'LANE_BOUNDARY'
    colors = lane.get('boundary_line_colors') or []
    lineweight = 35
    for index, line in enumerate(lane.get('border_line_points', [])):
        if len(line) >= 2:
            color_attribs = dxf_color_attribs(colors[index] if index < len(colors) else None)
            layout.add_lwpolyline(
                [local(p['x'], p['y']) for p in line],
                dxfattribs={
                    'layer': boundary_layer,
                    'lineweight': lineweight,
                    **color_attribs,
                },
            )
    points = lane.get('traverse_point_array', [])
    if len(points) >= 2:
        lane_label = str(lane.get('laneway_name') or '').strip()
        if collected and lane_label:
            midpoint = points[len(points) // 2]
            layout.add_text(lane_label, height=text_height * 1.15, dxfattribs={'layer': 'LANE_LABEL'}).set_placement(
                local(midpoint['x'], midpoint['y'] + marker * 3.0)
            )
    for point in points:
        if lane.get('network_source') is not None and point.get('point_source') == 'geometry':
            continue
        x, y = point.get('x'), point.get('y')
        if not isinstance(x, (int, float)) or not isinstance(y, (int, float)):
            continue
        point_radius = point.get('circle_radius')
        if not isinstance(point_radius, (int, float)) or point_radius <= 0 or point_radius > marker * 2.5:
            point_radius = marker
        local_x, local_y = local(x, y)
        source_color = point.get('source_circle_color') or point.get('circle_color')
        layout.add_circle((local_x, local_y), point_radius, dxfattribs={
            'layer': 'SURVEY_POINT_REVIEWED',
            **dxf_color_attribs(source_color),
        })
        point_name = str(point.get('point_name') or '').strip()
        elevation = point.get('z_bottom')
        if not isinstance(elevation, (int, float)):
            elevation = point.get('elevation')
        if point_name or isinstance(elevation, (int, float)):
            elevation_suffix = str(point.get('elevation_suffix') or '').strip()
            label = ' '.join(
                part for part in [
                    point_name,
                    f'{elevation:.3f}{elevation_suffix}' if isinstance(elevation, (int, float)) else ('标高未知' if point_name else ''),
                ] if part
            )
            label_color = point.get('name_text_color') or point.get('elevation_text_color')
            layout.add_text(label, height=text_height, dxfattribs={
                'layer': 'POINT_LABEL_REVIEWED',
                **dxf_color_attribs(label_color),
            }).set_placement(
                local(x + point_radius * 1.4, y + point_radius * 1.2)
            )


def lane_elevation(lane):
    value = lane.get('elevation_median')
    if isinstance(value, (int, float)):
        return value
    values = [
        point.get('z_bottom') if isinstance(point.get('z_bottom'), (int, float)) else point.get('elevation')
        for point in lane.get('traverse_point_array', [])
    ]
    values = sorted(value for value in values if isinstance(value, (int, float)))
    return values[len(values) // 2] if values else None


def dxf_bounds(doc):
    xs, ys = [], []
    for entity in doc.modelspace():
        try:
            points = list(entity.vertices_in_wcs())
        except AttributeError:
            points = []
            kind = entity.dxftype()
            if kind == 'POINT':
                points = [entity.dxf.location]
            elif kind == 'CIRCLE':
                center = entity.dxf.center
                radius = entity.dxf.radius
                points = [
                    ezdxf.math.Vec3(center.x - radius, center.y - radius, center.z),
                    ezdxf.math.Vec3(center.x + radius, center.y + radius, center.z),
                ]
            elif entity.dxf.hasattr('insert'):
                points = [entity.dxf.insert]
        for point in points:
            xs.append(point.x)
            ys.append(point.y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def active_view(doc):
    view = doc.viewports.get('*Active')
    if view is None:
        view = doc.viewports.new('*Active')
    return view[0] if isinstance(view, (list, tuple)) else view


def set_drawing_bounds(doc, min_x, min_y, max_x, max_y, pad):
    extmin = (min_x - pad, min_y - pad, 0)
    extmax = (max_x + pad, max_y + pad, 0)
    msp = doc.modelspace()
    msp.dxf.extmin = extmin
    msp.dxf.extmax = extmax
    msp.dxf.limmin = (min_x - pad, min_y - pad)
    msp.dxf.limmax = (max_x + pad, max_y + pad)
    doc.update_extents()
    doc.update_limits()


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='mode', required=True)
    inspect = sub.add_parser('inspect')
    inspect.add_argument('dxf')
    draw = sub.add_parser('draw')
    draw.add_argument('json')
    draw.add_argument('output')
    draw.add_argument('points_file', nargs='?')
    points_draw = sub.add_parser('draw-points')
    points_draw.add_argument('network')
    points_draw.add_argument('output')
    points_draw.add_argument('points_file')
    args = parser.parse_args()
    if args.mode == 'inspect':
        doc = ezdxf.readfile(args.dxf)
        active = active_view(doc)
        modelspace = doc.modelspace()
        handle_to_block = {
            entity.dxf.handle: entity.dxf.name
            for entity in modelspace
            if entity.dxftype() == 'INSERT'
        }
        redraw_blocks = [
            handle_to_block.get(handle)
            for handle, _sort_handle in modelspace.get_redraw_order()
            if handle_to_block.get(handle)
        ]
        print(json.dumps({
            'dxfversion': doc.dxfversion,
            'units': doc.units,
            'entity_types': dict(Counter(e.dxftype() for e in doc.modelspace())),
            'block_entity_types': {
                block.name: dict(Counter(entity.dxftype() for entity in block))
                for block in doc.blocks
                if not block.name.startswith('*Model_Space') and not block.name.startswith('*Paper_Space')
            },
            'bounds': dxf_bounds(doc),
            'extmin': tuple(doc.header.get('$EXTMIN', ())),
            'extmax': tuple(doc.header.get('$EXTMAX', ())),
            'sortents': doc.header.get('$SORTENTS'),
            'redraw_count': sum(1 for _ in doc.modelspace().get_redraw_order()),
            'redraw_block_order': redraw_blocks,
            'active_view': None if active is None else {
                'attributes': sorted(active.dxf.all_existing_dxf_attribs()),
                'center': tuple(active.dxf.center),
                'height': active.dxf.height,
                'target': tuple(active.dxf.target),
                'direction': tuple(active.dxf.direction),
            },
            'renderer': 'ezdxf',
        }, ensure_ascii=False))
        return
    if args.mode == 'draw-points':
        lanes = json.loads(Path(args.network).read_text(encoding='utf-8-sig'))
        points = json.loads(Path(args.points_file).read_text(encoding='utf-8-sig'))
        if not isinstance(lanes, list) or not isinstance(points, list):
            raise ValueError('Expected lane and point arrays')
        context_lanes = [lane for lane in lanes if not boundary_pair_issues(lane)]
        if not context_lanes:
            raise ValueError('No same-color double boundary lines available for point context')
        target = Path(args.output)
        if target.suffix.lower() != '.dxf':
            raise ValueError('Output must be DXF')
        doc = ezdxf.new('R2010')
        doc.units = 0
        coordinate_points = [point for point in points if isinstance(point.get('x'), (int, float)) and isinstance(point.get('y'), (int, float))]
        lane_bounds = geometry_bounds(context_lanes)
        if coordinate_points:
            bounds = (
                min(lane_bounds[0], min(point['x'] for point in coordinate_points)),
                min(lane_bounds[1], min(point['y'] for point in coordinate_points)),
                max(lane_bounds[2], max(point['x'] for point in coordinate_points)),
                max(lane_bounds[3], max(point['y'] for point in coordinate_points)),
            )
        else:
            bounds = lane_bounds
        span_x, span_y = bounds[2] - bounds[0], bounds[3] - bounds[1]
        diagonal = (span_x * span_x + span_y * span_y) ** 0.5
        marker = max(0.05, min(1.0, diagonal * 0.0002))
        text_height = marker * 1.8
        for layer, color, lineweight in [
            ('POINT_CONTEXT_BOUNDARY', 5, 25),
            ('SURVEY_POINT_REVIEWED', 1, 35),
            ('POINT_LABEL_REVIEWED', 1, 13),
        ]:
            doc.layers.new(layer, dxfattribs={'color': color, 'lineweight': lineweight})
        msp = doc.modelspace()
        for lane in context_lanes:
            for line in lane.get('border_line_points', []):
                coordinates = [(p['x'], p['y']) for p in line]
                if len(coordinates) >= 2:
                    msp.add_lwpolyline(coordinates, dxfattribs={'layer': 'POINT_CONTEXT_BOUNDARY', 'color': 5, 'lineweight': 25})
        point_refs = []
        coordinate_points.sort(key=lambda point: (
            point_color_order(point),
            str(point.get('color_group') or point.get('circle_color') or ''),
            round(point['x'], 3),
            round(point['y'], 3),
            str(point.get('point_name') or ''),
        ))
        for index, point in enumerate(coordinate_points):
            radius = point.get('circle_radius')
            if not isinstance(radius, (int, float)) or radius <= 0 or radius > marker * 2.5:
                radius = marker
            name = f'POINT_{index + 1:05d}'
            block = doc.blocks.new(name)
            source_color = point.get('circle_color') or point.get('source_circle_color')
            block.add_circle((0, 0), radius, dxfattribs={
                'layer': 'SURVEY_POINT_REVIEWED',
                **dxf_color_attribs(source_color),
            })
            point_name = str(point.get('point_name') or '').strip()
            elevation = point.get('elevation')
            elevation_suffix = str(point.get('elevation_suffix') or '').strip()
            label = ' '.join(
                part for part in [
                    point_name,
                    f'{elevation:.3f}{elevation_suffix}' if isinstance(elevation, (int, float)) else ('标高未知' if point_name else ''),
                ] if part
            )
            label_color = point.get('name_text_color') or point.get('elevation_text_color')
            block.add_text(label, height=text_height, dxfattribs={
                'layer': 'POINT_LABEL_REVIEWED',
                **dxf_color_attribs(label_color),
            }).set_placement(
                (radius * 1.4, radius * 1.2)
            )
            point_refs.append(msp.add_blockref(name, (point['x'], point['y'], 0)))
        min_x, min_y, max_x, max_y = bounds
        pad = max(marker * 8, max(span_x, span_y) * 0.03)
        set_drawing_bounds(doc, min_x, min_y, max_x, max_y, pad)
        center = ((min_x + max_x) / 2, (min_y + max_y) / 2)
        view_height = max(span_y, span_x / 1.6) * 1.12 + pad * 2
        active = active_view(doc)
        active.dxf.center = center
        active.dxf.height = view_height
        active.dxf.aspect_ratio = 1.6
        active.dxf.target = (0, 0, 0)
        active.dxf.direction = (0, 0, 1)
        doc.header['$TILEMODE'] = 1
        if point_refs:
            msp.set_redraw_order([(reference.dxf.handle, f'{index + 1:08X}') for index, reference in enumerate(point_refs)])
            doc.header['$SORTENTS'] = 16
        with target.open('x', encoding='utf-8', newline='') as stream:
            doc.write(stream)
        print(json.dumps({
            'output': str(target),
            'points': len(point_refs),
            'boundary_lanes': len(context_lanes),
            'invalid_boundary_lanes': len(lanes) - len(context_lanes),
            'renderer': 'ezdxf',
        }, ensure_ascii=False))
        return
    lanes = json.loads(Path(args.json).read_text(encoding='utf-8-sig'))
    if not isinstance(lanes, list):
        raise ValueError('Expected a lane array')
    reviewed = []
    if args.points_file:
        reviewed = json.loads(Path(args.points_file).read_text(encoding='utf-8-sig'))
        if not isinstance(reviewed, list):
            raise ValueError('Expected a reviewed lane array for survey points')
    target = Path(args.output)
    if target.suffix.lower() != '.dxf':
        raise ValueError('Output must be DXF')
    display_network = [] if reviewed else [
        lane for lane in lanes
        if any(point.get('point_source') != 'geometry' for point in lane.get('traverse_point_array', []))
    ]
    ordered = [(lane, 'network') for lane in display_network] + [(lane, 'collected') for lane in reviewed]
    ordered.sort(key=lambda item: (
        lane_elevation(item[0]) is None,
        lane_elevation(item[0]) if lane_elevation(item[0]) is not None else 0,
        item[1],
        str(item[0].get('laneway_code') or ''),
    ))
    drawable = []
    skipped = []
    for item in ordered:
        lane = item[0]
        issues = lane_data_issues(lane)
        if issues:
            skipped.append({
                'laneway_code': lane.get('laneway_code'),
                'issues': sorted(set(issues)),
            })
            continue
        drawable.append(item)
    if not drawable:
        raise ValueError('No complete same-color double-line lane with point name, elevation and raw boundary data')

    bounds = geometry_bounds([lane for lane, _kind in drawable])
    span_x, span_y = bounds[2] - bounds[0], bounds[3] - bounds[1]
    diagonal = (span_x * span_x + span_y * span_y) ** 0.5
    marker = max(0.05, min(1.0, diagonal * 0.0002))
    text_height = marker * 1.8

    doc = ezdxf.new('R2010')
    doc.units = 0
    for layer, color, lineweight in [
        ('LANE_BOUNDARY', 5, 35),
        ('POINT_LABEL', 7, 13),
        ('LANE_LABEL', 7, 13),
        ('SURVEY_POINT_REVIEWED', 1, 35),
        ('POINT_LABEL_REVIEWED', 1, 13),
        ('COLLECTED_BOUNDARY', 6, 30),
    ]:
        doc.layers.new(layer, dxfattribs={'color': color, 'lineweight': lineweight})
    msp = doc.modelspace()

    block_refs = []
    for index, (lane, kind) in enumerate(drawable):
        prefix = 'LANE' if kind == 'network' else 'COLLECTED_LANE'
        name = f'{prefix}_{index + 1:04d}'
        block = doc.blocks.new(name)
        add_lane_into(block, lane, marker, text_height)
        anchor_x, anchor_y = lane_anchor(lane)
        reference = msp.add_blockref(name, (anchor_x, anchor_y, 0))
        block_refs.append(reference)
    if block_refs:
        msp.set_redraw_order([
            (reference.dxf.handle, f'{index + 1:08X}')
            for index, reference in enumerate(block_refs)
        ])
        doc.header['$SORTENTS'] = 16
    min_x, min_y, max_x, max_y = bounds
    pad = max(marker * 8, max(span_x, span_y) * 0.03)
    set_drawing_bounds(doc, min_x, min_y, max_x, max_y, pad)
    active = active_view(doc)
    center = ((min_x + max_x) / 2, (min_y + max_y) / 2)
    view_height = max(span_y, span_x / 1.6) * 1.12 + pad * 2
    active.dxf.center = center
    active.dxf.height = view_height
    active.dxf.aspect_ratio = 1.6
    # AutoCAD interprets VIEWCTR as target + active viewport center. Keep the
    # target at WCS zero for large survey coordinates, then center the viewport.
    active.dxf.target = (0, 0, 0)
    active.dxf.direction = (0, 0, 1)
    doc.header['$TILEMODE'] = 1
    # Exclusive creation prevents replacing a drawing supplied by the user.
    with target.open('x', encoding='utf-8', newline='') as stream:
        doc.write(stream)
    print(json.dumps({
        'output': str(target),
        'lanes': len(block_refs),
        'input_lanes': len(lanes),
        'skipped_incomplete_lanes': skipped,
        'bounds': bounds,
        'view_height': view_height,
        'renderer': 'ezdxf',
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()

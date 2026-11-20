"""Small standard-library DXF reader/writer used when ezdxf is not installed."""
import argparse
from collections import Counter
import json
import math
from pathlib import Path


ACI_RGB = {
    1: (255, 0, 0),
    2: (255, 255, 0),
    3: (0, 255, 0),
    4: (0, 255, 255),
    5: (0, 0, 255),
    6: (255, 0, 255),
    7: (255, 255, 255),
    8: (128, 128, 128),
    30: (255, 127, 0),
}


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def color_value(color):
    text = str(color or "")
    if text.startswith("aci:") and text[4:].isdigit():
        value = int(text[4:])
        return value if 0 < value < 256 else 7
    if text.startswith("rgb:") and text[4:].isdigit():
        value = int(text[4:])
        rgb = ((value >> 16) & 255, (value >> 8) & 255, value & 255)
        return min(ACI_RGB, key=lambda aci: sum((rgb[index] - ACI_RGB[aci][index]) ** 2 for index in range(3)))
    return 7


def polyline_length(points):
    return sum(
        math.hypot(points[index]["x"] - points[index - 1]["x"], points[index]["y"] - points[index - 1]["y"])
        for index in range(1, len(points))
    )


def project_distance(point, line):
    best = float("inf")
    for index in range(1, len(line)):
        ax, ay = line[index - 1]["x"], line[index - 1]["y"]
        bx, by = line[index]["x"], line[index]["y"]
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
        ax, ay = source[index - 1]["x"], source[index - 1]["y"]
        bx, by = source[index]["x"], source[index]["y"]
        length = math.hypot(bx - ax, by - ay)
        while length > 1e-9 and travelled + length >= next_distance and len(gaps) < count:
            ratio = (next_distance - travelled) / length
            gaps.append(project_distance((ax + ratio * (bx - ax), ay + ratio * (by - ay)), target))
            next_distance += total / count
        travelled += length
    return gaps


def corridor_geometry_issues(lane):
    boundaries = lane.get("border_line_points") or []
    if len(boundaries) != 2 or any(len(line) < 2 for line in boundaries):
        return []
    quality = lane.get("boundary_geometry_quality")
    if isinstance(quality, dict):
        return ["unstable_or_nonparallel_boundaries"] if quality.get("valid") is False else []
    gaps = sampled_gaps(boundaries[0], boundaries[1]) + sampled_gaps(boundaries[1], boundaries[0])
    if len(gaps) < 4:
        return ["unstable_or_nonparallel_boundaries"]
    ordered = sorted(gaps)
    median = ordered[len(ordered) // 2]
    p10 = ordered[int((len(ordered) - 1) * 0.1)]
    p90 = ordered[int((len(ordered) - 1) * 0.9)]
    spread = (p90 - p10) / median if median > 1e-9 else float("inf")

    def direction(line):
        sx = sy = 0.0
        for index in range(1, len(line)):
            dx = line[index]["x"] - line[index - 1]["x"]
            dy = line[index]["y"] - line[index - 1]["y"]
            length = math.hypot(dx, dy)
            if length > 1e-9:
                sx += dx / length
                sy += dy / length
        length = math.hypot(sx, sy)
        return (sx / length, sy / length) if length > 1e-9 else None

    direction_a, direction_b = direction(boundaries[0]), direction(boundaries[1])
    parallelism = abs(direction_a[0] * direction_b[0] + direction_a[1] * direction_b[1]) if direction_a and direction_b else 0.0
    issues = []
    if spread > 1.0:
        issues.append("unstable_boundary_width")
    if parallelism < 0.35:
        issues.append("different_boundary_direction")
    return issues


def boundary_pair_issues(lane):
    issues = []
    boundaries = lane.get("border_line_points") or []
    if len(boundaries) != 2 or any(len(line) < 2 for line in boundaries):
        issues.append("requires_two_original_boundary_lines")
    colors = lane.get("boundary_line_colors") or []
    if len(colors) != 2:
        issues.append("missing_boundary_colors")
    elif not colors[0] or not colors[1] or colors[0] == "unknown" or colors[1] == "unknown":
        issues.append("unknown_boundary_color")
    elif colors[0] != colors[1]:
        issues.append("different_boundary_colors")
    if lane.get("single_line_used") is True or lane.get("network_source") == "single_line_geometry":
        issues.append("single_line_is_not_a_laneway")
    issues.extend(corridor_geometry_issues(lane))
    return issues


def lane_data_issues(lane):
    issues = boundary_pair_issues(lane)
    points = lane.get("traverse_point_array") or []
    if not points:
        issues.append("missing_survey_points")
    if any(not str(point.get("point_name") or "").strip() for point in points):
        issues.append("missing_point_name")
    if any(not isinstance(point.get("z_bottom", point.get("elevation")), (int, float)) for point in points):
        issues.append("missing_point_elevation")
    return issues


def geometry_bounds(lanes):
    xs, ys = [], []
    for lane in lanes:
        for line in lane.get("border_line_points", []):
            xs.extend(point["x"] for point in line)
            ys.extend(point["y"] for point in line)
        for point in lane.get("traverse_point_array", []):
            xs.append(point["x"])
            ys.append(point["y"])
    if not xs:
        raise ValueError("No lane geometry to draw")
    return min(xs), min(ys), max(xs), max(ys)


def lane_anchor(lane):
    points = lane.get("traverse_point_array") or []
    return (
        (min(point["x"] for point in points) + max(point["x"] for point in points)) / 2,
        (min(point["y"] for point in points) + max(point["y"] for point in points)) / 2,
    )


def dxf_pairs(doc):
    lines = doc.replace("\r", "").split("\n")
    for index in range(0, len(lines) - 1, 2):
        try:
            yield int(lines[index].strip()), lines[index + 1]
        except ValueError:
            raise ValueError("Invalid ASCII DXF group code")


def inspect_dxf(path):
    data = Path(path).read_bytes()
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        text = data.decode("gb18030", errors="replace")
    pairs = list(dxf_pairs(text))
    section = ""
    current_block = None
    entity_types = Counter()
    block_types = {}
    inserts = []
    header = {}
    for index, (code, value) in enumerate(pairs):
        token = value.strip()
        if code == 0 and token == "SECTION" and index + 1 < len(pairs):
            next_code, next_value = pairs[index + 1]
            if next_code == 2:
                section = next_value.strip()
            continue
        if code == 0 and token == "ENDSEC":
            section = ""
            continue
        if section == "HEADER" and code == 9:
            variable = token
            values = []
            for next_code, next_value in pairs[index + 1:index + 5]:
                if next_code == 9:
                    break
                values.append((next_code, next_value.strip()))
            if values:
                header[variable] = values
        if section == "BLOCKS" and code == 0 and token == "BLOCK":
            following = pairs[index + 1:index + 4]
            name = next((value.strip() for next_code, value in following if next_code == 2), "")
            current_block = name or None
            if current_block:
                block_types.setdefault(current_block, Counter())
            continue
        if section == "BLOCKS" and code == 0 and token == "ENDBLK":
            current_block = None
            continue
        if code == 0 and token:
            if section == "ENTITIES":
                entity_types[token] += 1
                if token == "INSERT":
                    following = pairs[index + 1:index + 4]
                    name = next((value.strip() for next_code, value in following if next_code == 2), "")
                    if name:
                        inserts.append(name)
            elif section == "BLOCKS" and current_block and token not in ("SEQEND", "VERTEX"):
                block_types[current_block][token] += 1

    def header_number(variable, default=0.0):
        values = header.get(variable, [])
        return next((float(value) for code, value in values if code in (10, 40)), default)

    extmin = (
        header_number("$EXTMIN", 0.0),
        next((float(value) for code, value in header.get("$EXTMIN", []) if code == 20), 0.0),
        next((float(value) for code, value in header.get("$EXTMIN", []) if code == 30), 0.0),
    )
    extmax = (
        header_number("$EXTMAX", 0.0),
        next((float(value) for code, value in header.get("$EXTMAX", []) if code == 20), 0.0),
        next((float(value) for code, value in header.get("$EXTMAX", []) if code == 30), 0.0),
    )
    view_center = (
        header_number("$VIEWCTR", (extmin[0] + extmax[0]) / 2),
        next((float(value) for code, value in header.get("$VIEWCTR", []) if code == 20), (extmin[1] + extmax[1]) / 2),
        0.0,
    )
    return {
        "dxfversion": next((value for code, value in header.get("$ACADVER", []) if code == 1), "AC1009"),
        "units": 0,
        "entity_types": dict(entity_types),
        "block_entity_types": {name: dict(counter) for name, counter in block_types.items() if not name.startswith("*")},
        "bounds": (extmin[0], extmin[1], extmax[0], extmax[1]),
        "extmin": extmin,
        "extmax": extmax,
        "sortents": None,
        "redraw_count": len(inserts),
        "redraw_block_order": inserts,
        "active_view": {
            "attributes": ["center", "height", "target", "direction"],
            "center": view_center,
            "height": header_number("$VIEWSIZE", max(extmax[1] - extmin[1], 1.0)),
            "target": (0.0, 0.0, 0.0),
            "direction": (0.0, 0.0, 1.0),
        },
        "renderer": "standard-library",
    }


class DxfDocument:
    def __init__(self):
        self.layers = {"0": 7}
        self.blocks = {}
        self.entities = []

    def layer(self, name, color=7):
        self.layers.setdefault(name, color)

    def block_polyline(self, block, points, layer, color):
        self.blocks.setdefault(block, []).append(("POLYLINE", layer, color, points))

    def block_circle(self, block, center, radius, layer, color):
        self.blocks.setdefault(block, []).append(("CIRCLE", layer, color, center, radius))

    def block_text(self, block, text, point, height, layer, color, rotation=0.0):
        self.blocks.setdefault(block, []).append(("TEXT", layer, color, text, point, height, rotation))

    def insert(self, block, point, layer="0"):
        self.entities.append(("INSERT", block, point, layer))

    def model_line(self, points, layer, color):
        self.entities.append(("POLYLINE", layer, color, points))

    def write(self, path, bounds, view_height):
        min_x, min_y, max_x, max_y = bounds
        pad = max((max_x - min_x), (max_y - min_y), 1.0) * 0.03
        center = ((min_x + max_x) / 2, (min_y + max_y) / 2)
        output = []

        def pair(code, value):
            output.extend((str(code), str(value)))

        def section(name):
            pair(0, "SECTION")
            pair(2, name)

        def end_section():
            pair(0, "ENDSEC")

        def write_entity(entity):
            kind = entity[0]
            if kind == "POLYLINE":
                _, layer, color, points = entity
                pair(0, "POLYLINE")
                pair(8, layer)
                pair(62, color)
                pair(66, 1)
                pair(70, 0)
                pair(10, 0.0)
                pair(20, 0.0)
                pair(30, 0.0)
                for point in points:
                    pair(0, "VERTEX")
                    pair(8, layer)
                    pair(10, point[0])
                    pair(20, point[1])
                    pair(30, 0.0)
                pair(0, "SEQEND")
                pair(8, layer)
            elif kind == "CIRCLE":
                _, layer, color, center, radius = entity
                pair(0, "CIRCLE")
                pair(8, layer)
                pair(62, color)
                pair(10, center[0])
                pair(20, center[1])
                pair(30, 0.0)
                pair(40, radius)
            elif kind == "TEXT":
                _, layer, color, text, point, height, rotation = entity
                pair(0, "TEXT")
                pair(8, layer)
                pair(62, color)
                pair(10, point[0])
                pair(20, point[1])
                pair(30, 0.0)
                pair(40, height)
                pair(1, text)
                pair(50, rotation)
            elif kind == "INSERT":
                _, block, point, layer = entity
                pair(0, "INSERT")
                pair(8, layer)
                pair(2, block)
                pair(10, point[0])
                pair(20, point[1])
                pair(30, 0.0)
                pair(41, 1.0)
                pair(42, 1.0)
                pair(43, 1.0)

        section("HEADER")
        for name, values in (
            ("$ACADVER", ((1, "AC1009"),)),
            ("$EXTMIN", ((10, min_x - pad), (20, min_y - pad), (30, 0.0))),
            ("$EXTMAX", ((10, max_x + pad), (20, max_y + pad), (30, 0.0))),
            ("$LIMMIN", ((10, min_x - pad), (20, min_y - pad))),
            ("$LIMMAX", ((10, max_x + pad), (20, max_y + pad))),
            ("$VIEWCTR", ((10, center[0]), (20, center[1]))),
            ("$VIEWSIZE", ((40, view_height),)),
            ("$TILEMODE", ((70, 1),)),
        ):
            pair(9, name)
            for code, value in values:
                pair(code, value)
        end_section()

        section("TABLES")
        pair(0, "TABLE")
        pair(2, "LAYER")
        pair(70, len(self.layers))
        for name, color in self.layers.items():
            pair(0, "LAYER")
            pair(2, name)
            pair(70, 0)
            pair(62, color)
            pair(6, "CONTINUOUS")
        pair(0, "ENDTAB")
        end_section()

        section("BLOCKS")
        for name, entities in self.blocks.items():
            pair(0, "BLOCK")
            pair(8, "0")
            pair(2, name)
            pair(70, 0)
            pair(10, 0.0)
            pair(20, 0.0)
            pair(30, 0.0)
            pair(3, name)
            pair(1, "")
            for entity in entities:
                write_entity(entity)
            pair(0, "ENDBLK")
            pair(8, "0")
        end_section()

        section("ENTITIES")
        for entity in self.entities:
            write_entity(entity)
        end_section()
        pair(0, "EOF")
        with Path(path).open("x", encoding="utf-8", newline="") as stream:
            stream.write("\r\n".join(output) + "\r\n")


def point_local(point, anchor):
    return point["x"] - anchor[0], point["y"] - anchor[1]


def add_lane_block(doc, block_name, lane, marker, text_height):
    anchor = lane_anchor(lane)
    colors = lane.get("boundary_line_colors") or []
    collected = lane.get("network_source") is None
    boundary_layer = "COLLECTED_BOUNDARY" if collected else "LANE_BOUNDARY"
    for index, line in enumerate(lane.get("border_line_points") or []):
        points = [point_local(point, anchor) for point in line]
        doc.block_polyline(block_name, points, boundary_layer, color_value(colors[index] if index < len(colors) else None))
    for point in lane.get("traverse_point_array") or []:
        x, y = point_local(point, anchor)
        radius = point.get("circle_radius")
        if not isinstance(radius, (int, float)) or radius <= 0 or radius > marker * 2.5:
            radius = marker
        color = color_value(point.get("source_circle_color") or point.get("circle_color"))
        doc.block_circle(block_name, (x, y), radius, "SURVEY_POINT_REVIEWED", color)
        elevation = point.get("z_bottom", point.get("elevation"))
        suffix = str(point.get("elevation_suffix") or "").strip()
        label = " ".join(part for part in (
            str(point.get("point_name") or "").strip(),
            f"{elevation:.3f}{suffix}" if isinstance(elevation, (int, float)) else "标高未知",
        ) if part)
        doc.block_text(
            block_name,
            label,
            (x + radius * 1.4, y + radius * 1.2),
            text_height,
            "POINT_LABEL_REVIEWED",
            color_value(point.get("name_text_color") or point.get("elevation_text_color")),
        )
    return anchor


def draw_points(network_file, output, points_file):
    lanes = read_json(network_file)
    points = read_json(points_file)
    if not isinstance(lanes, list) or not isinstance(points, list):
        raise ValueError("Expected lane and point arrays")
    context_lanes = [lane for lane in lanes if not boundary_pair_issues(lane)]
    if not context_lanes:
        raise ValueError("No same-color double boundary lines available for point context")
    coordinate_points = [point for point in points if isinstance(point.get("x"), (int, float)) and isinstance(point.get("y"), (int, float))]
    lane_bounds = geometry_bounds(context_lanes)
    bounds = lane_bounds
    if coordinate_points:
        bounds = (
            min(lane_bounds[0], min(point["x"] for point in coordinate_points)),
            min(lane_bounds[1], min(point["y"] for point in coordinate_points)),
            max(lane_bounds[2], max(point["x"] for point in coordinate_points)),
            max(lane_bounds[3], max(point["y"] for point in coordinate_points)),
        )
    span_x, span_y = bounds[2] - bounds[0], bounds[3] - bounds[1]
    diagonal = math.hypot(span_x, span_y)
    marker = max(0.05, min(1.0, diagonal * 0.0002))
    text_height = marker * 1.8
    doc = DxfDocument()
    for layer, color in (
        ("POINT_CONTEXT_BOUNDARY", 5),
        ("SURVEY_POINT_REVIEWED", 1),
        ("POINT_LABEL_REVIEWED", 1),
    ):
        doc.layer(layer, color)
    for lane in context_lanes:
        colors = lane.get("boundary_line_colors") or []
        for index, line in enumerate(lane.get("border_line_points") or []):
            doc.model_line(
                [(point["x"], point["y"]) for point in line],
                "POINT_CONTEXT_BOUNDARY",
                color_value(colors[index] if index < len(colors) else None),
            )
    coordinate_points.sort(key=lambda point: (
        int(point.get("color_layer_order", 10000)) if isinstance(point.get("color_layer_order"), (int, float)) else 10000,
        str(point.get("color_group") or point.get("circle_color") or ""),
        round(point["x"], 3),
        round(point["y"], 3),
        str(point.get("point_name") or ""),
    ))
    point_refs = []
    for index, point in enumerate(coordinate_points):
        name = f"POINT_{index + 1:05d}"
        radius = point.get("circle_radius")
        if not isinstance(radius, (int, float)) or radius <= 0 or radius > marker * 2.5:
            radius = marker
        doc.block_circle(name, (0.0, 0.0), radius, "SURVEY_POINT_REVIEWED", color_value(point.get("circle_color")))
        elevation = point.get("elevation")
        suffix = str(point.get("elevation_suffix") or "").strip()
        label = " ".join(part for part in (
            str(point.get("point_name") or "").strip(),
            f"{elevation:.3f}{suffix}" if isinstance(elevation, (int, float)) else "标高未知",
        ) if part)
        doc.block_text(
            name,
            label,
            (radius * 1.4, radius * 1.2),
            text_height,
            "POINT_LABEL_REVIEWED",
            color_value(point.get("name_text_color") or point.get("elevation_text_color")),
        )
        doc.insert(name, (point["x"], point["y"]))
        point_refs.append(name)
    min_x, min_y, max_x, max_y = bounds
    pad = max(marker * 8, max(span_x, span_y) * 0.03)
    view_height = max(span_y, span_x / 1.6) * 1.12 + pad * 2
    doc.write(output, bounds, view_height)
    print(json.dumps({
        "output": str(output),
        "points": len(point_refs),
        "boundary_lanes": len(context_lanes),
        "invalid_boundary_lanes": len(lanes) - len(context_lanes),
        "renderer": "standard-library",
    }, ensure_ascii=False))


def draw_lanes(network_file, output, reviewed_file=None):
    lanes = read_json(network_file)
    reviewed = read_json(reviewed_file) if reviewed_file else []
    if not isinstance(lanes, list) or not isinstance(reviewed, list):
        raise ValueError("Expected lane arrays")
    display_network = [] if reviewed else [
        lane for lane in lanes
        if any(point.get("point_source") != "geometry" for point in lane.get("traverse_point_array") or [])
    ]
    ordered = [(lane, "network") for lane in display_network] + [(lane, "collected") for lane in reviewed]

    def elevation(lane):
        values = sorted(
            point.get("z_bottom", point.get("elevation"))
            for point in lane.get("traverse_point_array") or []
            if isinstance(point.get("z_bottom", point.get("elevation")), (int, float))
        )
        return values[len(values) // 2] if values else None

    ordered.sort(key=lambda item: (
        elevation(item[0]) is None,
        elevation(item[0]) if elevation(item[0]) is not None else 0,
        item[1],
        str(item[0].get("laneway_code") or ""),
    ))
    drawable, skipped = [], []
    for lane, kind in ordered:
        issues = lane_data_issues(lane)
        if issues:
            skipped.append({"laneway_code": lane.get("laneway_code"), "issues": sorted(set(issues))})
        else:
            drawable.append((lane, kind))
    if not drawable:
        raise ValueError("No complete same-color double-line lane with point name, elevation and raw boundary data")
    bounds = geometry_bounds([lane for lane, _kind in drawable])
    span_x, span_y = bounds[2] - bounds[0], bounds[3] - bounds[1]
    diagonal = math.hypot(span_x, span_y)
    marker = max(0.05, min(1.0, diagonal * 0.0002))
    text_height = marker * 1.8
    doc = DxfDocument()
    for layer, color in (
        ("LANE_BOUNDARY", 5),
        ("POINT_LABEL", 7),
        ("LANE_LABEL", 7),
        ("SURVEY_POINT_REVIEWED", 1),
        ("POINT_LABEL_REVIEWED", 1),
        ("COLLECTED_BOUNDARY", 6),
    ):
        doc.layer(layer, color)
    for index, (lane, kind) in enumerate(drawable):
        prefix = "LANE" if kind == "network" else "COLLECTED_LANE"
        block_name = f"{prefix}_{index + 1:04d}"
        anchor = add_lane_block(doc, block_name, lane, marker, text_height)
        doc.insert(block_name, anchor)
    min_x, min_y, max_x, max_y = bounds
    pad = max(marker * 8, max(span_x, span_y) * 0.03)
    view_height = max(span_y, span_x / 1.6) * 1.12 + pad * 2
    doc.write(output, bounds, view_height)
    print(json.dumps({
        "output": str(output),
        "lanes": len(drawable),
        "input_lanes": len(lanes),
        "skipped_incomplete_lanes": skipped,
        "bounds": bounds,
        "view_height": view_height,
        "renderer": "standard-library",
    }, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="mode", required=True)
    inspect = sub.add_parser("inspect")
    inspect.add_argument("dxf")
    draw = sub.add_parser("draw")
    draw.add_argument("json")
    draw.add_argument("output")
    draw.add_argument("points_file", nargs="?")
    points_draw = sub.add_parser("draw-points")
    points_draw.add_argument("network")
    points_draw.add_argument("output")
    points_draw.add_argument("points_file")
    args = parser.parse_args()
    if args.mode == "inspect":
        print(json.dumps(inspect_dxf(args.dxf), ensure_ascii=False))
    elif args.mode == "draw-points":
        draw_points(args.network, args.output, args.points_file)
    else:
        draw_lanes(args.json, args.output, args.points_file)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Extract a traceable, deliberately limited DXF evidence inventory."""
import argparse
import collections
import hashlib
import json
import platform
import sys
from pathlib import Path


VENDOR = Path(__file__).resolve().parent.parent / 'vendor' / 'win_amd64_cp39'
if (sys.implementation.name == 'cpython' and sys.version_info[:2] == (3, 9)
        and sys.platform == 'win32' and platform.machine().lower() in ('amd64', 'x86_64')):
    sys.path.insert(0, str(VENDOR))
else:
    sys.stderr.write('Bundled dependencies require 64-bit Windows and CPython 3.9.\n')
    sys.exit(2)


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def entity_record(entity):
    dxf = entity.dxf
    kind = entity.dxftype()
    item = {'handle': dxf.get('handle'), 'type': kind,
            'layer': dxf.get('layer', '0'), 'color': dxf.get('color', 256),
            'linetype': dxf.get('linetype', 'BYLAYER'),
            'lineweight': dxf.get('lineweight', -1)}
    for attr in ('text', 'height', 'name', 'rotation', 'tag', 'style',
                 'width', 'width_factor', 'oblique', 'attachment_point',
                 'radius', 'start_angle', 'end_angle', 'major_axis',
                 'ratio', 'start_param', 'end_param', 'elevation',
                 'xscale', 'yscale', 'zscale', 'row_count', 'column_count',
                 'row_spacing', 'column_spacing', 'dimtype', 'dimstyle',
                 'actual_measurement', 'defpoint', 'defpoint2', 'defpoint3',
                 'defpoint4', 'defpoint5', 'text_midpoint', 'flags',
                 'insert', 'start', 'end', 'center', 'extrusion'):
        if dxf.hasattr(attr):
            value = dxf.get(attr)
            if isinstance(value, (str, int, float)):
                item[attr] = value
            elif hasattr(value, '__iter__'):
                item[attr] = list(value)
    if kind == 'MTEXT':
        item['raw_text'] = entity.text
        item['plain_text'] = entity.plain_text()
    if kind == 'LWPOLYLINE':
        item['vertices_xyseb'] = [list(point) for point in entity.get_points('xyseb')]
        item['closed'] = entity.closed
    if kind == 'POLYLINE':
        item['vertices'] = [list(vertex.dxf.location) for vertex in entity.vertices]
        item['closed'] = entity.is_closed
    if kind == 'INSERT':
        item['attributes'] = [entity_record(attribute) for attribute in entity.attribs]
    return item


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('drawing', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    if args.drawing.suffix.lower() != '.dxf':
        parser.error('Only DXF is supported; convert DWG separately.')
    if args.drawing.resolve() == args.output.resolve():
        parser.error('Output cannot overwrite the input drawing.')
    if args.output.exists():
        parser.error('Output already exists; choose a new path.')
    try:
        import ezdxf
    except ImportError:
        parser.error('Bundled dependencies are missing or incomplete; verify the skill package.')
    try:
        doc = ezdxf.readfile(str(args.drawing))
        layouts = []
        for layout in doc.layouts:
            counts = collections.Counter()
            records = []
            for entity in layout:
                kind = entity.dxftype()
                counts[kind] += 1
                records.append(entity_record(entity))
            layouts.append({'name': layout.name, 'entity_counts': dict(counts), 'entities': records})
        layers = [{'name': layer.dxf.name, 'color': layer.dxf.get('color'),
                   'linetype': layer.dxf.get('linetype'), 'lineweight': layer.dxf.get('lineweight')}
                  for layer in doc.layers]
        xrefs = [block.name for block in doc.blocks if block.block.is_xref]
        blocks = [{'name': block.name, 'base_point': list(block.block.dxf.base_point),
                   'is_xref': block.block.is_xref,
                   'entities': [entity_record(entity) for entity in block]}
                  for block in doc.blocks if not block.name.startswith('*Model_Space')
                  and not block.name.startswith('*Paper_Space')]
        result = {'source': str(args.drawing.resolve()), 'sha256': digest(args.drawing),
                  'parser': 'ezdxf ' + ezdxf.__version__, 'dxf_version': doc.dxfversion,
                  'insunits': doc.header.get('$INSUNITS', 0), 'layers': layers,
                  'layouts': layouts, 'blocks': blocks, 'external_references': xrefs,
                  'limitations': ['Block definitions are separate; inserts, nested blocks and arrays are not expanded or transformed.',
                                  'External references are not resolved; dynamic blocks and proxy objects are not interpreted.',
                                  'Coordinates use the entity DXF coordinate system and are not necessarily WCS.',
                                  'Dimension measurement fields are stored values, not independently calculated or rendered values.',
                                  'Text formatting, fonts, visibility, viewport rendering and inherited visual properties are not fully interpreted.',
                                  'Geometry and entity fields are partial; this is not a complete DXF export.']}
        with args.output.open('x', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2, allow_nan=False)
            f.write('\n')
    except Exception as exc:
        print('Extraction failed: {}'.format(exc), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())

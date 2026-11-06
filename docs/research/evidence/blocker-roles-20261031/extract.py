#!/usr/bin/env python3
"""Project Enemy-controller role fields using each installed bundle's type tree."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from unity_assets import Reader, bundle, serialized


def trees(data):
    r = Reader(data, '>')
    r.read(48)
    r.e = '<'
    r.cs()
    r.val('i')
    enabled = r.val('B')
    assert enabled
    result = []
    for _ in range(r.val('i')):
        cl = r.val('i')
        r.val('B')
        r.val('h')
        if cl == 114:
            r.read(16)
        r.read(16)
        count, size = r.val('ii')
        raw, strings = r.read(count * 32), r.read(size)
        nodes = []
        def string(offset):
            if offset & 0x80000000:
                return {49: 'Array', 840: 'string'}.get(offset & 0x7fffffff, f'common:{offset & 0x7fffffff}')
            return strings[offset:strings.index(0, offset)].decode()
        for index in range(count):
            version, level, flags, typ, name, width, number, meta, ref = struct.unpack_from('<HBBIIiiiQ', raw, index * 32)
            nodes.append(dict(level=level, flags=flags, type=string(typ), name=string(name), width=width, meta=meta, children=[]))
        stack = []
        for index, node in enumerate(nodes):
            while stack and nodes[stack[-1]]['level'] >= node['level']:
                stack.pop()
            if stack:
                nodes[stack[-1]]['children'].append(index)
            stack.append(index)
        result.append(nodes)
        r.read(r.val('i') * 4)
    return result


def fields(raw, nodes):
    r = Reader(raw)
    selected = {}
    def walk(index):
        node = nodes[index]
        start = r.p
        if node['type'] == 'string':
            r.string()
        elif node['flags'] & 1:
            count = r.val('i')
            assert 0 <= count <= len(raw)
            assert len(node['children']) == 2
            for _ in range(count):
                walk(node['children'][1])
        elif node['children']:
            for child in node['children']:
                walk(child)
        else:
            assert node['width'] >= 0, node
            r.read(node['width'])
        if node['name'] in {'_specificBlockMask', '_sideTypeIndex', '_blockVolume', '_ignoreBlockMode'}:
            selected[node['name']] = dict(offset=start, value=int.from_bytes(raw[start:r.p], 'little', signed=True))
        if node['meta'] & 0x4000:
            r.align()
        assert r.p <= len(raw), (r.p, len(raw), node)
    walk(0)
    assert r.p == len(raw), (r.p, len(raw))
    return selected


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    sources, matches, kinds = [], [], {}
    controllers = 0
    for path in sorted((args.game / 'Arknights_Data/StreamingAssets/AB/Windows/battle').glob('enm_pfb_*.ab')):
        data = path.read_bytes()
        sources.append(dict(name=path.name, bytes=len(data), sha256=hashlib.sha256(data).hexdigest()))
        for name, data in bundle(path)[0]:
            if name.endswith(('.resS', '.resource')):
                continue
            state = serialized(data)
            layouts = trees(data)
            objects = {obj['id']: obj for obj in state['objects']}
            for obj in state['objects']:
                layout = layouts[obj['typeid']]
                if not any(node['name'] == '_specificBlockMask' for node in layout):
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                selected = fields(raw, layout)
                controllers += 1
                key = obj['scriptid']
                kinds[key] = kinds.get(key, 0) + 1
                if not selected['_specificBlockMask']['value']:
                    continue
                go = objects[struct.unpack_from('<q', raw, 4)[0]]
                reader = Reader(data, p=go['start'])
                reader.read(reader.val('i') * 12)
                reader.val('i')
                go_name = reader.string()
                matches.append(dict(bundle=path.name, file=name, controllerPathId=str(obj['id']), scriptId=key,
                                    gameObject=go_name, bytes=obj['size'], sha256=hashlib.sha256(raw).hexdigest(), fields=selected))
    output = dict(date='2026-10-31', scope='Initial Enemy and derived controller fields in enm_pfb_*.ab; no hotfix/runtime overrides.',
                  sources=sources, controllers=controllers, scriptTypes=kinds, nonzeroMasks=matches,
                  tools=[dict(path=str(path.relative_to(ROOT)), sha256=hashlib.sha256(path.read_bytes()).hexdigest())
                         for path in [Path(__file__).resolve(), ROOT / '.agents/skills/arkbattle-native-research/scripts/unity_assets.py']])
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(controllers=controllers, types=len(kinds), nonzeroMasks=matches), ensure_ascii=False))

if __name__ == '__main__':
    main()

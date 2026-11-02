#!/usr/bin/env python3
"""Decode selected Nymph MonoBehaviours from installed Unity type trees."""
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
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized


def trees(data):
    reader = Reader(data, '>')
    reader.read(48)
    reader.e = '<'
    reader.cs()
    reader.val('i')
    assert reader.val('B')
    layouts = []
    for _ in range(reader.val('i')):
        class_id = reader.val('i')
        reader.val('B')
        reader.val('h')
        if class_id == 114:
            reader.read(16)
        reader.read(16)
        count, size = reader.val('ii')
        raw, strings = reader.read(count * 32), reader.read(size)
        def string(offset):
            if offset & 0x80000000:
                return {49: 'Array', 840: 'string'}.get(offset & 0x7fffffff, f'common:{offset & 0x7fffffff}')
            return strings[offset:strings.index(0, offset)].decode()
        nodes = []
        for index in range(count):
            _, level, flags, typ, name, width, _, meta, _ = struct.unpack_from('<HBBIIiiiQ', raw, index * 32)
            nodes.append(dict(level=level, flags=flags, type=string(typ), name=string(name), width=width, meta=meta, children=[]))
        stack = []
        for index, node in enumerate(nodes):
            while stack and nodes[stack[-1]]['level'] >= node['level']:
                stack.pop()
            if stack:
                nodes[stack[-1]]['children'].append(index)
            stack.append(index)
        layouts.append(nodes)
        reader.read(reader.val('i') * 4)
    return layouts


def decode(raw, nodes):
    reader = Reader(raw)
    def walk(index):
        node = nodes[index]
        if node['type'] == 'string':
            value = reader.string()
        elif node['flags'] & 1:
            value = [walk(node['children'][1]) for _ in range(reader.val('i'))]
        elif node['children']:
            value = {nodes[child]['name']: walk(child) for child in node['children']}
        else:
            data = reader.read(node['width'])
            fmt = {'float': '<f', 'double': '<d', 'bool': '<?', 'int': '<i', 'unsigned int': '<I', 'SInt64': '<q', 'UInt64': '<Q', 'common:222': '<i', 'common:161': '<f', 'common:928': '<?', 'common:814': '<q'}.get(node['type'])
            value = struct.unpack(fmt, data)[0] if fmt and struct.calcsize(fmt) == len(data) else dict(type=node['type'], hex=data.hex())
        if node['meta'] & 0x4000:
            reader.align()
        return value
    result = walk(0)
    assert reader.p == len(raw), (reader.p, len(raw))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--bundle', action='append', required=True)
    parser.add_argument('--find', default='nymph')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    rows, sources = [], []
    templates = []
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    for relative in args.bundle:
        path = base / relative
        sources.append(fingerprint(path))
        files, version = bundle(path)
        for filename, data in files:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = serialized(data)
            layouts = trees(data)
            names = {}
            transforms = {}
            for obj in state['objects']:
                if obj['classid'] == 1:
                    reader = Reader(data[obj['start']:obj['start'] + obj['size']])
                    reader.read(reader.val('i') * 12)
                    reader.val('i')
                    names[obj['id']] = reader.string()
                elif obj['classid'] == 4:
                    transform = decode(data[obj['start']:obj['start'] + obj['size']], layouts[obj['typeid']])
                    transforms[obj['id']] = (transform['common:374']['m_PathID'], transform['m_Father']['m_PathID'])
            transform_by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                owner = struct.unpack_from('<q', raw, 4)[0]
                name = names.get(owner, '')
                hierarchy = []
                tid = transform_by_owner.get(owner)
                while tid:
                    go, parent = transforms[tid]
                    hierarchy.append(dict(name=names[go], gameObjectPathId=str(go), transformPathId=str(tid)))
                    tid = parent
                if args.find not in name and args.find.encode() not in raw and not relative.startswith('charpack/'):
                    continue
                value = decode(raw, layouts[obj['typeid']])
                if relative.startswith('charpack/'):
                    buffs = [entry.get('buffKey') for key in ['_buffs', '_activeBuffs']
                             for entry in value.get(key, {}).get('Array', [])]
                    if not ('_modes' in value or name == 'S1' and '_attack' in value or name == 'ActiveEP'
                            or 'nymph_s_1[ep_damage]' in buffs or 'nymph_t_1' in buffs):
                        continue
                elif relative.endswith('[uc]skills.ab') and name != 'skchr_nymph_1':
                    continue
                elif relative.endswith('[uc]projectiles.ab') and (name != 'projectile_chr_nymph_s1' or '_actionController' not in value):
                    continue
                raw_file = f'{path.stem}-{obj["id"]}.bin'
                if '_templates' in value:
                    selected = []
                    for index, template in enumerate(value['_templates']['Array']):
                        if template['templateKey'] not in ['ep_damage_based_on_damage_value', 'nymph_s_1[ep_damage]', 'nymph_t_1', 'nymph_t_1[listener]', 'nymph_t_1[ep_damage]']:
                            continue
                        entry = dict(template)
                        entry['templateIndex'] = index
                        entry['events'] = [dict(event=event['key'], actions=json.loads(event['value']['SerializedState']))
                                           for event in entry.pop('eventToActions')['_items']['Array']]
                        selected.append(entry)
                    templates.append(dict(bundle=relative, file=filename, pathId=str(obj['id']), sha256=hashlib.sha256(raw).hexdigest(), templates=selected))
                    value['_templates'] = dict(Array=[entry['templateKey'] for entry in selected])
                    raw_file = None
                else:
                    (args.out / raw_file).write_bytes(raw)
                rows.append(dict(bundle=relative, unityVersion=version, file=filename, pathId=str(obj['id']), typeId=obj['typeid'], name=name, hierarchy=hierarchy, sha256=hashlib.sha256(raw).hexdigest(), rawFile=raw_file, value=value))
                print(relative, name, obj['id'], list(value), flush=True)
    result = dict(provenance=dict(collectedOn='2026-11-02', script=fingerprint(Path(__file__)), tools=[fingerprint(TOOLS / name) for name in ['assets.py', 'unity_assets.py', 'native.py']], sources=sources, scope='Installed serialized configuration and type-tree decoding; selected Nymph S1, ActiveEP and talent-1 content only; static binding, not active XLua or runtime observation.'), result=rows)
    (args.out / 'decoded-content.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    if templates:
        (args.out / 'selected-templates.json').write_text(json.dumps(dict(provenance=result['provenance'], result=templates), ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

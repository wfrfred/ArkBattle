#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Decode the current installed Ash character and S2 skill resource bindings."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / 'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
spec = importlib.util.spec_from_file_location('existing_type_tree_decoder', HELPER)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)


def decode(raw, nodes):
    """Use installed type trees; retain byte fields numerically and top-field offsets."""
    r = Reader(raw)
    top_fields = {}
    def walk(index):
        node = nodes[index]
        start = r.p
        if node['type'] == 'string':
            value = r.string()
        elif node['flags'] & 1:
            value = [walk(node['children'][1]) for _ in range(r.val('i'))]
        elif node['children']:
            value = {nodes[child]['name']: walk(child) for child in node['children']}
        else:
            data = r.read(node['width'])
            fmt = {'float': '<f', 'double': '<d', 'bool': '<?', 'int': '<i',
                   'unsigned int': '<I', 'SInt64': '<q', 'UInt64': '<Q',
                   'common:222': '<i', 'common:161': '<f',
                   'common:928': '<B', 'common:814': '<q'}.get(node['type'])
            value = struct.unpack(fmt, data)[0] if fmt and struct.calcsize(fmt) == len(data) else dict(type=node['type'], hex=data.hex())
        end = r.p
        if node['meta'] & 0x4000:
            r.align()
        if node['level'] == 1:
            top_fields[node['name']] = dict(offset=start, bytes=end-start,
                serializedType=node['type'], hex=raw[start:end].hex())
        return value
    result = walk(0)
    assert r.p == len(raw), (r.p, len(raw))
    return result, top_fields

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
native_inputs = {
    'GameAssembly.dll': 'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
    'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat': 'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5',
}
native_sources = [fingerprint(args.game / rel) for rel in native_inputs]
for source, rel in zip(native_sources, native_inputs):
    if source['sha256'] != native_inputs[rel]:
        raise ValueError('Native input differs; do not apply this batch event labels to it: ' + rel)
inputs = {
    'charpack/char_456_ash.ab': 'c675a7ba388ceb8f484558a7eae5ea9c96f66dd43b813a3b9f0ee3c63defdc43',
    'battle/prefabs/[uc]skills.ab': '0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3',
    'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin': '10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99',
}
sources = [fingerprint(base / rel) for rel in inputs]
for source, rel in zip(sources, inputs):
    if source['sha256'] != inputs[rel]:
        raise ValueError('Current resource differs from recorded witness: ' + rel)
script_files = {}
for filename, data in bundle(base / list(inputs)[-1])[0]:
    if filename.endswith(('.resS', '.resource')):
        continue
    script_files[filename] = (data, {o['id']: o for o in serialized(data)['objects'] if o['classid'] == 115})
rows = []
containers = []
script_objects = {}
hierarchy_objects = []
selected = {
    8466356838105471859,   # Character: _modes[2] references S2
    19486450107865971,     # S2 UnitMode: _attack reference
    8324062437122366323,  # actual S2 RangedAttack
    7918768805007055731,  # counter sharing actual S2 attack GameObject
    -2996655092864802062, # actual skchr_ash_2 CastSkillWithLimitTimes
    -336944217143008526,  # skill's ability sequence
    -5680160276593925390, # sequence Switch ability supplies mode=2 buff
}
for rel in list(inputs)[:2]:
    for filename, data in bundle(base / rel)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        state = serialized(data)
        layouts, externals = decoder.trees(data)
        names, transforms = {}, {}
        for obj in state['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 1:
                r = Reader(raw)
                r.read(r.val('i') * 12)
                r.val('i')
                names[obj['id']] = r.string()
            elif obj['classid'] == 4:
                value = decoder.decode(raw, layouts[obj['typeid']])
                transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
        by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        wanted_hierarchy = set()
        for obj in state['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 142:
                value = decoder.decode(raw, layouts[obj['typeid']])
                entries = [e for e in value['m_Container']['Array'] if any(n in e['common:155'] for n in ['char_456_ash', 'skchr_ash_2'])]
                containers.append(dict(bundle=rel, file=filename, pathId=str(obj['id']), sha256=hashlib.sha256(raw).hexdigest(), selectedEntries=entries))
            if obj['classid'] != 114 or obj['id'] not in selected:
                continue
            owner = struct.unpack_from('<q', raw, 4)[0]
            hierarchy, tid = [], by_owner.get(owner)
            while tid:
                go, parent = transforms[tid]
                hierarchy.append(dict(name=names[go], gameObjectPathId=str(go), transformPathId=str(tid)))
                tid = parent
            if rel.startswith('battle/') and not any(h['name'] == 'skchr_ash_2' for h in hierarchy):
                continue
            wanted_hierarchy.update(int(h[key]) for h in hierarchy for key in ['gameObjectPathId', 'transformPathId'])
            value, field_offsets = decode(raw, layouts[obj['typeid']])
            ptr = value['common:490']
            external = externals[ptr['m_FileID'] - 1]
            script_file = external['path'].split('/')[-1]
            sd, scripts = script_files[script_file]
            so = scripts[ptr['m_PathID']]
            binding = script(so, sd)
            script_raw = sd[so['start']:so['start'] + so['size']]
            script_name = f'monoscript-{so["id"]}.bin'
            (args.out / script_name).write_bytes(script_raw)
            script_objects[str(so['id'])] = dict(bundle=list(inputs)[-1], file=script_file, pathId=str(so['id']), rawFile=script_name, sha256=hashlib.sha256(script_raw).hexdigest(), value=binding)
            raw_name = f'{"ash" if rel.startswith("charpack") else "skill"}-{obj["id"]}.bin'
            (args.out / raw_name).write_bytes(raw)
            row = dict(bundle=rel, file=filename, pathId=str(obj['id']), hierarchy=hierarchy, name=names.get(owner, ''), typeId=obj['typeid'], monoScript=dict(file=script_file, **binding), externalScriptReference=external, rawFile=raw_name, sha256=hashlib.sha256(raw).hexdigest(), fieldOffsets=field_offsets, value=value)
            rows.append(row)
            print('/'.join(h['name'] for h in reversed(hierarchy)), obj['id'], binding['cl'])
        for obj in state['objects']:
            if obj['id'] not in wanted_hierarchy:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            raw_name = f'hierarchy-{obj["id"]}.bin'
            (args.out / raw_name).write_bytes(raw)
            value, _ = decode(raw, layouts[obj['typeid']])
            hierarchy_objects.append(dict(bundle=rel, file=filename, pathId=str(obj['id']),
                classId=obj['classid'], rawFile=raw_name, sha256=hashlib.sha256(raw).hexdigest(), value=value))
assert {int(row['pathId']) for row in rows} == selected, 'required current components not all found'
result = dict(provenance=dict(collectedOn=datetime.date.today().isoformat(), script=fingerprint(Path(__file__)), helper=fingerprint(HELPER), tools=[fingerprint(TOOLS / name) for name in ['assets.py', 'unity_assets.py', 'native.py']], nativeSources=native_sources, sources=sources, scope='Static installed Ash Prefab and skchr_ash_2 resource bindings only. No live client/XLua or attack/cancellation observation.', decodeBoundary='Unresolved shared byte type common:928 is retained as an integer, not coerced to bool; enum/event labels require current metadata/native evidence. Array wrapper and unresolved common field names are preserved.'), result=dict(containerEntries=containers, components=rows, hierarchyObjects=hierarchy_objects, monoScripts=list(script_objects.values())))
(args.out / 'ash-s2-content.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')

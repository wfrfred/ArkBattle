#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Resolve installed ymtro prefab hierarchy and exact MonoScript PPtrs."""
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
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
relative = 'battle/enm_pfb_12.ab'
scripts_relative = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
expected = {
    relative: '2e9056a509d746f71fb22261f8f2daf8d41fbaebc7787f6d6a15d447576a2f2f',
    scripts_relative: '10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99',
}
sources = [fingerprint(base / rel) for rel in expected]
for source, rel in zip(sources, expected):
    if source['sha256'] != expected[rel]:
        raise ValueError('Resource input differs from the recorded witness: ' + rel)
script_files = {}
for filename, data in bundle(base / scripts_relative)[0]:
    if filename.endswith(('.resS', '.resource')):
        continue
    script_files[filename] = (data, {o['id']: o for o in serialized(data)['objects'] if o['classid'] == 115})
rows = []
hierarchy_objects = []
script_objects = {}
containers = []
selected = {
    -8440417371917263266,  # Root Enemy
    -7751935427412369826,  # Default UnitMode
    6559147715892665950,   # Bus Talent
    109810286188617310,    # DurbusAbility
    -5766570821806596514,  # Selector
    -8228304665366897058,  # Selector CircleRange
    4943122091596242526,   # Passenger validator
}
for filename, data in bundle(base / relative)[0]:
    if filename.endswith(('.resS', '.resource')):
        continue
    state = serialized(data)
    objects = {obj['id']: obj for obj in state['objects']}
    layouts, externals = reader.trees(data)
    names, transforms = {}, {}
    for obj in state['objects']:
        raw = data[obj['start']:obj['start'] + obj['size']]
        if obj['classid'] == 1:
            r = Reader(raw)
            r.read(r.val('i') * 12)
            r.val('i')
            names[obj['id']] = r.string()
        elif obj['classid'] == 4:
            v = reader.decode(raw, layouts[obj['typeid']])
            transforms[obj['id']] = (v['common:374']['m_PathID'], v['m_Father']['m_PathID'])
    by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
    wanted_hierarchy = set()
    for obj in state['objects']:
        if obj['classid'] != 142:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        val = reader.decode(raw, layouts[obj['typeid']])
        entries = [entry for entry in val['m_Container']['Array']
                   if entry['common:155'] == 'dyn/battle/prefabs/enemies/enemy_1302_ymtro_2.prefab']
        if len(entries) != 1 or entries[0]['common:778']['asset'] != {'m_FileID': 0, 'm_PathID': -290578867173269922}:
            raise ValueError('Exact ymtro_2 prefab container binding changed')
        containers.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
            objectSha256=hashlib.sha256(raw).hexdigest(), selectedEntry=entries[0]))
    for obj in state['objects']:
        if obj['id'] not in selected:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        owner = struct.unpack_from('<q', raw, 4)[0]
        hierarchy, tid = [], by_owner.get(owner)
        while tid:
            go, parent = transforms[tid]
            hierarchy.append(dict(name=names[go], gameObjectPathId=str(go), transformPathId=str(tid)))
            tid = parent
        if not any(h['name'] == 'enemy_1302_ymtro_2' for h in hierarchy):
            raise ValueError('Selected component is outside the SH16 root hierarchy')
        wanted_hierarchy.update(int(h[key]) for h in hierarchy for key in ['gameObjectPathId', 'transformPathId'])
        value = reader.decode(raw, layouts[obj['typeid']])
        ptr = value['common:490']
        if ptr['m_FileID'] == 0:
            raise ValueError('expected external MonoScript; local resolution must be explicit')
        external = externals[ptr['m_FileID'] - 1]
        script_file = external['path'].split('/')[-1]
        if script_file not in script_files:
            raise ValueError('MonoScript CAB is not in known current script bundle: ' + script_file)
        sd, scripts = script_files[script_file]
        so = scripts[ptr['m_PathID']]
        binding = script(so, sd)
        sr = sd[so['start']:so['start'] + so['size']]
        script_name = f'monoscript-{so["id"]}.bin'
        (args.out / script_name).write_bytes(sr)
        script_objects[str(so['id'])] = dict(bundle=scripts_relative, file=script_file,
            pathId=str(so['id']), classId=115, rawFile=script_name,
            sha256=hashlib.sha256(sr).hexdigest(), value=binding)
        raw_name = f'ymtro-{obj["id"]}.bin'
        (args.out / raw_name).write_bytes(raw)
        rows.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
            name=names.get(owner, ''), hierarchy=hierarchy, typeId=obj['typeid'],
            scriptPPtr=ptr, externalScriptReference=external,
            monoScript=dict(bundle=scripts_relative, file=script_file, **binding),
            rawFile=raw_name, sha256=hashlib.sha256(raw).hexdigest(), value=value))
    for object_id in sorted(wanted_hierarchy):
        obj = objects[object_id]
        raw = data[obj['start']:obj['start'] + obj['size']]
        raw_name = f'hierarchy-{object_id}.bin'
        (args.out / raw_name).write_bytes(raw)
        hierarchy_objects.append(dict(bundle=relative, file=filename, pathId=str(object_id),
            classId=obj['classid'], typeId=obj['typeid'], rawFile=raw_name,
            sha256=hashlib.sha256(raw).hexdigest(), value=reader.decode(raw, layouts[obj['typeid']])))
if {int(row['pathId']) for row in rows} != selected:
    raise ValueError('Required SH16 components were not all found')
provenance = dict(collectedOn=datetime.date.today().isoformat(), script=fingerprint(Path(__file__)),
    helper=fingerprint(HELPER), tools=[fingerprint(TOOLS / name) for name in ['assets.py', 'unity_assets.py']],
    sources=sources,
    scope='Exact installed enemy_1302_ymtro_2 prefab container, Root Enemy, Default UnitMode and Bus Talent/Ability/Selector/Validator/Range only; static, no live XLua or battle execution.')
result = dict(containerEntries=containers, components=rows, hierarchyObjects=hierarchy_objects,
              monoScripts=list(script_objects.values()),
              attachmentBoundary='Default._generalAbilities is empty; the Bus Talent and DurbusAbility share a GameObject below Default/Talents. Native Talent discovery/attachment must be checked separately.')
(args.out / 'ymtro-prefab-binding.json').write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
for row in rows:
    print('/'.join(h['name'] for h in reversed(row['hierarchy'])), row['pathId'], row['monoScript']['ns'] + '.' + row['monoScript']['cl'], list(row['value']))

#!/usr/bin/env python3
"""Re-read selected attack components from current installed Unity type trees."""
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized

DECODER = ROOT / 'docs/research/evidence/healing-settlement-20261103/content/extract_content.py'
spec = importlib.util.spec_from_file_location('archived_config_decoder', DECODER)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)
BASE = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data/StreamingAssets/AB/Windows')
OUT = ROOT / 'docs/research/evidence/facing-conditions-20261114/attack/current-config'
SELECT = {
    'battle/enm_pfb_base_0.ab': [-5684249958478128563, 1127596193800444493, 1607977390229740109, -5603903004385289651],
    'battle/prefabs/[uc]skills.ab': [-8621369842960336780, 3130726341302253684, 8290759946353997940, -7093873934366587530, 1225678316375065974, 7099121255691404662],
    'charpack/char_117_myrrh.ab': [-6208793881063593099, 6123565879521897333, -4946051259289834635],
}
OUT.mkdir(parents=True, exist_ok=True)
rows, sources = [], []
for relative, selected in SELECT.items():
    path = BASE / relative
    sources.append(fingerprint(path))
    for filename, data in bundle(path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        state = serialized(data)
        layouts = decoder.tree.trees(data)
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
                transforms[obj['id']] = value['common:374']['m_PathID'], value['m_Father']['m_PathID']
        by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        for obj in state['objects']:
            if obj['classid'] != 114 or obj['id'] not in selected:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            owner = struct.unpack_from('<q', raw, 4)[0]
            hierarchy, tid = [], by_owner.get(owner)
            while tid:
                go, parent = transforms[tid]
                hierarchy.append({'name': names[go], 'gameObjectPathId': str(go), 'transformPathId': str(tid)})
                tid = parent
            rawfile = f'{path.stem}-{obj["id"]}.bin'
            (OUT / rawfile).write_bytes(raw)
            rows.append({
                'bundle': relative, 'file': filename, 'pathId': str(obj['id']),
                'name': names.get(owner, ''), 'hierarchy': hierarchy,
                'rawFile': rawfile, 'sha256': __import__('hashlib').sha256(raw).hexdigest(),
                'value': decoder.decode(raw, layouts[obj['typeid']]),
            })
expected = sum(map(len, SELECT.values()))
if len(rows) != expected:
    raise RuntimeError(f'selected {len(rows)} components, expected {expected}')
result = {'provenance': {
    'collectedOn': '2026-11-14', 'scope': 'Selected attack/heal components and their registration roots, current installed type trees; static binding and configuration, no game or XLua execution.',
    'script': fingerprint(Path(__file__)),
    'tools': [fingerprint(DECODER), fingerprint(decoder.TREE), fingerprint(TOOLS / 'unity_assets.py')],
    'selection': SELECT, 'sources': sources,
}, 'result': rows}
(OUT / 'decoded.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'out': str(OUT), 'components': len(rows), 'summary': [
    {'bundle': row['bundle'], 'name': row['name'], 'flags': {key: value for key, value in row['value'].items() if 'face' in key.lower()}}
    for row in rows
]}, ensure_ascii=False))

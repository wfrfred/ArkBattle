#!/usr/bin/env python3
"""Decode life-related actual character and enemy hierarchies plus matching Buff templates."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('life_content_helper', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

CHARS = ('char_017_huang', 'char_350_surtr', 'char_263_skadi', 'char_369_bena',
         'char_4183_mortis', 'char_4217_makoto', 'char_4039_horn',
         'char_1044_hsgma2', 'char_1023_ghost2', 'char_4194_rmixer',
         'char_452_bstalk', 'char_427_vigil', 'char_1042_phatm2')
ENEMIES = ('enemy_1198_msfshu', 'enemy_1526_sfsui', 'enemy_15068_dqsui',
           'enemy_1505_frstar', 'enemy_1510_frstar2', 'enemy_1529_dsdevr',
           'enemy_1567_pope', 'enemy_1595_agbmes', 'enemy_1562_cjtaot',
           'enemy_1288_duskls', 'enemy_1365_spnwiz')

TOKENS = ('token_10014_bstalk_crab', 'token_10028_vigil_wolf',
          'token_10055_phatm2_mndclv', 'trap_246_bigbtle')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    sources, scripts, rows, scan = [], {}, [], []
    for relative in ('anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin',
                     'anon/88b3c3ecaaefa6003de730686dd5ac53.bin'):
        source = base / relative
        if not source.is_file():
            continue
        sources.append(fingerprint(source))
        for filename, data in bundle(source)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            for obj in serialized(data)['objects']:
                if obj['classid'] == 115:
                    scripts[(filename, obj['id'])] = script(obj, data)
    selected = [(base / 'charpack' / f'{key}.ab', (key,)) for key in CHARS]
    selected += [(base / 'battle/prefabs/[uc]equips.ab', ('skadi_equip_',))]
    selected += [(base / 'battle/prefabs/[uc]skills.ab', ('skchr_rmixer_2', 'skchr_phatm2_'))]
    for source in sorted((base / 'battle').glob('enm_pfb*.ab')):
        entries = bundle(source)[0]
        matches = [key for key in ENEMIES if any(key.encode() in data for _, data in entries)]
        scan.append({'bundle': str(source.relative_to(base)), 'matches': matches})
        if matches:
            selected.append((source, tuple(matches)))
    for source in sorted((base / 'pkgrps').glob('btl_pfb_tokens_*.ab')):
        entries = bundle(source)[0]
        matches = [key for key in TOKENS if any(key.encode() in data for _, data in entries)]
        scan.append({'bundle': str(source.relative_to(base)), 'matches': matches})
        if matches:
            selected.append((source, tuple(matches)))
    for source, prefixes in selected:
        if not source.is_file():
            scan.append({'bundle': str(source.relative_to(base)), 'missing': True})
            continue
        sources.append(fingerprint(source))
        for filename, data in bundle(source)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = serialized(data)
            layouts, externals = helper.helper.trees(data)
            names, transforms = {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = Reader(raw)
                    reader.read(reader.val('i') * 12)
                    reader.val('i')
                    names[obj['id']] = reader.string()
                elif obj['classid'] == 4:
                    value = helper.decode(raw, layouts[obj['typeid']])
                    transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
            by_owner = {go: tid for tid, (go, _) in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                owner_go = int.from_bytes(raw[4:12], 'little', signed=True)
                tid, hierarchy = by_owner.get(owner_go), []
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if not hierarchy or not any(hierarchy[0].startswith(prefix) for prefix in prefixes):
                    continue
                value = helper.decode(raw, layouts[obj['typeid']])
                ptr = value['common:490']
                script_file = filename if ptr['m_FileID'] == 0 else externals[ptr['m_FileID'] - 1]['path'].split('/')[-1]
                rows.append({'bundle': str(source.relative_to(base)), 'file': filename,
                             'pathId': str(obj['id']), 'gameObjectPathId': str(owner_go),
                             'hierarchy': hierarchy,
                             'objectSha256': hashlib.sha256(raw).hexdigest(),
                             'scriptPPtr': ptr, 'scriptFile': script_file,
                             'script': scripts.get((script_file, ptr['m_PathID'])),
                             'value': {k: v for k, v in value.items() if not k.startswith('common:')}})
    payload = {'provenance': {'checkedOn': '2026-11-14', 'script': fingerprint(Path(__file__)),
                'helper': fingerprint(HELPER), 'sources': sources,
                'scope': 'All MonoBehaviour components under the recorded character, Skadi equipment and enemy hierarchy roots; static content binding, not runtime observation.'},
               'result': {'selection': {'characters': CHARS, 'enemies': ENEMIES, 'tokens': TOKENS},
                          'enemyBundleScan': scan, 'components': rows}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'components': len(rows), 'sources': len(sources), 'out': str(args.out)}))


if __name__ == '__main__':
    main()

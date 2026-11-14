#!/usr/bin/env python3
"""Inventory serialized rebirth and HP-specialization policies in installed unit Prefabs."""
import argparse
import collections
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('life_policy_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
CLASSES = {'RebornTalent', 'ManualTriggerRebornTalent', 'RallyPointRebornTalent',
           'PropLikeEnemy', 'PropLikeTrap', 'PropLikeStaticBlockToken', 'TakeDamageMoveBackEnemy'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--extra-bundle', action='append', default=[], help='Additional path relative to Windows bundle root')
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    script_map, sources, rows, scanned, failures = {}, [], [], [], []
    for relative in ('anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin', 'anon/88b3c3ecaaefa6003de730686dd5ac53.bin'):
        source = base / relative
        if not source.is_file():
            continue
        sources.append(fingerprint(source))
        for filename, data in bundle(source)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            for obj in serialized(data)['objects']:
                if obj['classid'] == 115:
                    value = script(obj, data)
                    if value['cl'] in CLASSES:
                        script_map[(filename, obj['id'])] = value
    paths = sorted((base / 'charpack').glob('*.ab')) + sorted((base / 'battle').glob('enm_pfb*.ab')) + sorted((base / 'pkgrps').glob('btl_pfb_tokens_*.ab'))
    paths.extend(base / path for path in args.extra_bundle)
    for index, source in enumerate(paths):
        relative = str(source.relative_to(base))
        source_record = fingerprint(source)
        found = 0
        try:
            for filename, data in bundle(source)[0]:
                if filename.endswith(('.resS', '.resource')):
                    continue
                state = serialized(data)
                # Every selected MonoScript has a unique current path ID. Resolve
                # the serialized-file identity after the cheap raw pointer test.
                wanted_ids = {key[1] for key in script_map}
                candidates = []
                for obj in state['objects']:
                    if obj['classid'] != 114 or obj['size'] < 28:
                        continue
                    raw = data[obj['start']:obj['start'] + obj['size']]
                    script_id = struct.unpack_from('<q', raw, 20)[0]
                    if script_id in wanted_ids:
                        candidates.append((obj, raw))
                if not candidates:
                    continue
                layouts, externals = helper.helper.trees(data)
                names, transforms = {}, {}
                for obj in state['objects']:
                    raw = data[obj['start']:obj['start'] + obj['size']]
                    if obj['classid'] == 1:
                        reader = Reader(raw); reader.read(reader.val('i') * 12); reader.val('i')
                        names[obj['id']] = reader.string()
                    elif obj['classid'] == 4:
                        value = helper.decode(raw, layouts[obj['typeid']])
                        transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
                by_owner = {go: tid for tid, (go, _) in transforms.items()}
                for obj, raw in candidates:
                    value = helper.decode(raw, layouts[obj['typeid']]); ptr = value['common:490']
                    script_file = filename if ptr['m_FileID'] == 0 else externals[ptr['m_FileID'] - 1]['path'].split('/')[-1]
                    binding = script_map.get((script_file, ptr['m_PathID']))
                    if binding is None:
                        continue
                    owner = int.from_bytes(raw[4:12], 'little', signed=True)
                    tid, hierarchy = by_owner.get(owner), []
                    while tid:
                        go, tid = transforms[tid]; hierarchy.append(names[go])
                    rows.append({'bundle': relative, 'file': filename, 'pathId': str(obj['id']),
                                 'gameObjectPathId': str(owner), 'hierarchy': hierarchy[::-1],
                                 'objectSha256': hashlib.sha256(raw).hexdigest(),
                                 'scriptFile': script_file, 'scriptPPtr': ptr, 'script': binding,
                                 'value': {k: v for k, v in value.items() if not k.startswith('common:')}})
                    found += 1
        except Exception as exc:
            failures.append({'bundle': relative, 'error': type(exc).__name__, 'message': str(exc)})
        scanned.append({'bundle': relative, 'sha256': source_record['sha256'], 'bytes': source_record.get('bytes', source_record.get('size')), 'selectedComponents': found})
        if found:
            sources.append(source_record)
        if (index + 1) % 100 == 0:
            print(json.dumps({'scanned': index + 1, 'total': len(paths), 'components': len(rows), 'failures': len(failures)}), flush=True)
    payload = {'provenance': {'checkedOn': '2026-11-14', 'script': fingerprint(Path(__file__)),
                'helper': fingerprint(HELPER), 'sources': sources,
                'scope': 'Complete installed charpack/*.ab, battle/enm_pfb*.ab and pkgrps/btl_pfb_tokens_*.ab scan for the exact listed MonoScript classes. Does not scan every level-specific resource or observe runtime overrides.'},
               'result': {'selection': {'classes': sorted(CLASSES), 'extraBundles': args.extra_bundle}, 'complete': not failures,
                          'bundleCount': len(paths), 'scanned': scanned, 'failures': failures,
                          'components': rows,
                          'classCounts': dict(collections.Counter(r['script']['cl'] for r in rows))}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'bundles': len(paths), 'components': len(rows), 'failures': len(failures), 'out': str(args.out)}))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Locate serialized ignore-palsy policies across installed battle resource families."""
import argparse
import collections
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized
HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('anger_exclusion_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def matches(value, pointer=''):
    if isinstance(value, dict):
        for key, child in value.items():
            path = pointer + '/' + key.replace('~', '~0').replace('/', '~1')
            if 'palsy' in key.lower() and 'interrupt' in key.lower():
                yield {'pointer': path, 'value': child}
            yield from matches(child, path)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            yield from matches(child, pointer + '/' + str(i))
    elif isinstance(value, str) and value.lstrip().startswith(('{', '[')):
        try:
            nested = json.loads(value)
        except (ValueError, TypeError):
            return
        yield from matches(nested, pointer + '/$json')


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    base = a.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    patterns = ['charpack/*.ab', 'battle/enm_pfb*.ab', 'battle/prefabs/**/*.ab',
                'config/*.ab', 'pkgrps/btl_pfb_tokens_*.ab']
    paths = sorted({path for pattern in patterns for path in base.glob(pattern)})
    scan, hits, failures = [], [], []
    distribution = collections.Counter()
    for number, path in enumerate(paths):
        source = fingerprint(path)
        source['relative'] = str(path.relative_to(base))
        source['decodedComponents'] = 0
        try:
            for filename, data in bundle(path)[0]:
                if filename.endswith(('.resS', '.resource')):
                    continue
                state = serialized(data)
                layouts, externals = helper.helper.trees(data)
                relevant = {i for i, tree in enumerate(layouts)
                            if any(('palsy' in n['name'].lower() and 'interrupt' in n['name'].lower())
                                   or n['name'].lower() == 'serializedstate' for n in tree)}
                selected = []
                for obj in state['objects']:
                    if obj['classid'] != 114 or obj['typeid'] not in relevant:
                        continue
                    raw = data[obj['start']:obj['start'] + obj['size']]
                    value = helper.decode(raw, layouts[obj['typeid']])
                    fields = list(matches(value))
                    source['decodedComponents'] += 1
                    for field in fields:
                        distribution[(field['pointer'].split('/')[-1], str(field['value']))] += 1
                    if any(field['value'] is True or field['value'] == 1 for field in fields):
                        selected.append((obj, raw, value, fields))
                if not selected:
                    continue
                names, transforms = {}, {}
                for obj in state['objects']:
                    raw = data[obj['start']:obj['start'] + obj['size']]
                    if obj['classid'] == 1:
                        reader = Reader(raw)
                        reader.read(reader.val('i') * 12)
                        reader.val('i')
                        names[obj['id']] = reader.string()
                    elif obj['classid'] == 4:
                        v = helper.decode(raw, layouts[obj['typeid']])
                        transforms[obj['id']] = (v['common:374']['m_PathID'], v['m_Father']['m_PathID'])
                by_owner = {go: tid for tid, (go, _) in transforms.items()}
                for obj, raw, value, fields in selected:
                    owner = int.from_bytes(raw[4:12], 'little', signed=True)
                    hierarchy, tid = [], by_owner.get(owner)
                    while tid:
                        go, tid = transforms[tid]
                        hierarchy.append(names.get(go, ''))
                    ptr = value.get('common:490')
                    script_file = None if ptr is None else filename if ptr['m_FileID'] == 0 else externals[ptr['m_FileID'] - 1]['path'].split('/')[-1]
                    hits.append({'bundle': source['relative'], 'file': filename,
                                 'pathId': str(obj['id']), 'hierarchy': hierarchy[::-1],
                                 'objectSha256': hashlib.sha256(raw).hexdigest(),
                                 'scriptPPtr': ptr, 'scriptFile': script_file, 'fields': fields,
                                 'value': {k: v for k, v in value.items() if not k.startswith('common:')}})
        except Exception as exc:
            failures.append({'bundle': source['relative'], 'error': type(exc).__name__, 'message': str(exc)})
        scan.append(source)
        if (number + 1) % 100 == 0:
            print(json.dumps({'scanned': number + 1, 'total': len(paths), 'positives': len(hits), 'failures': len(failures)}), flush=True)
    result = {'selection': {'bundleGlobs': patterns, 'fields': 'case-insensitive keys containing palsy and interrupt; JSON strings included'},
              'complete': not failures, 'bundleCount': len(paths),
              'decodedComponents': sum(row['decodedComponents'] for row in scan),
              'distribution': [{'field': name, 'value': value, 'count': count}
                               for (name, value), count in sorted(distribution.items())],
              'scan': scan, 'failures': failures, 'positiveObjects': hits}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance': {'checkedOn': '2026-11-17', 'script': fingerprint(Path(__file__)), 'helper': fingerprint(HELPER),
        'scope': 'Complete listed installed resource families; decode every matching MonoBehaviour type-tree including SerializedState. Positive objects are locators, not proof of active content. Runtime-only fields, getter overrides and XLua require separate native evidence.'}, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'complete': result['complete'], 'bundles': len(paths), 'components': result['decodedComponents'], 'positives': len(hits)}))


if __name__ == '__main__':
    main()

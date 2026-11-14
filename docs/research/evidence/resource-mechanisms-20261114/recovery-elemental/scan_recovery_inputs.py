#!/usr/bin/env python3
"""Scan installed battle inputs for rare EP recovery attributes / max-HP EP heal.

Read type trees before numeric attribute matching. JSON strings (SerializedState)
are decoded too. A match is a locator, not an activation claim.
"""
import argparse
import collections
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized
HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('rare_recovery_reader', HELPER)
helper = importlib.util.module_from_spec(spec); spec.loader.exec_module(helper)
LAYOUT = re.compile(r'attribute|serializedstate|\bep\b|eprecovery|ep_recovery', re.I)


def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + key.replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(index))
    elif isinstance(value, str) and value.lstrip().startswith(('{', '[')):
        try: nested = json.loads(value)
        except (ValueError, TypeError): return
        yield from walk(nested, pointer + '/$json')


def relevant(value):
    found = []
    for pointer, node in walk(value):
        typ = node.get('$type', '')
        if isinstance(typ, str) and typ.endswith(('ElementHealViaMaxHpRatio', 'ElementHealViaMaxHpRatio, Assembly-CSharp')):
            found.append({'kind': 'NODE', 'pointer': pointer, 'value': node})
        for key, x in node.items():
            if key in ('attributeType', '_attributeType') and x in (29, 'EP_RECOVERY_PER_SEC'):
                found.append({'kind': 'ATTRIBUTE', 'pointer': pointer, 'value': node})
            if re.search(r'ep[_]?Recovery|ep_recovery', key, re.I):
                found.append({'kind': 'FIELD', 'pointer': pointer + '/' + key, 'value': x})
    return found


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    base = a.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    paths = sorted(set((base / 'charpack').glob('*.ab')) | set((base / 'battle').glob('enm_pfb*.ab')) | set((base / 'battle/prefabs').rglob('*.ab')) | set((base / 'config').glob('*.ab')) | set((base / 'pkgrps').glob('btl_pfb_tokens_*.ab')))
    scans, hits, failures = [], [], []
    for index, path in enumerate(paths):
        source = fingerprint(path); source['relative'] = str(path.relative_to(base))
        candidates = decoded = 0
        try:
            for filename, data in bundle(path)[0]:
                if filename.endswith(('.resS', '.resource')): continue
                state = serialized(data)
                layouts, _ = helper.helper.trees(data)
                candidate_types = {tid for tid, nodes in enumerate(layouts) if any(LAYOUT.search(n['name']) for n in nodes)}
                selected = []
                for obj in state['objects']:
                    if obj['classid'] != 114: continue
                    raw = data[obj['start']:obj['start']+obj['size']]
                    if obj['typeid'] in candidate_types or b'ElementHealViaMaxHpRatio' in raw:
                        candidates += 1
                        value = helper.decode(raw, layouts[obj['typeid']]); decoded += 1
                        matches = relevant(value)
                        if matches: selected.append((obj, raw, value, matches))
                if not selected: continue
                names, transforms = {}, {}
                for obj in state['objects']:
                    raw = data[obj['start']:obj['start']+obj['size']]
                    if obj['classid'] == 1:
                        r = Reader(raw); r.read(r.val('i') * 12); r.val('i'); names[obj['id']] = r.string()
                    elif obj['classid'] == 4:
                        v = helper.decode(raw, layouts[obj['typeid']]); transforms[obj['id']] = (v['common:374']['m_PathID'], v['m_Father']['m_PathID'])
                by_owner = {go: tid for tid, (go, _) in transforms.items()}
                for obj, raw, value, matches in selected:
                    owner = int.from_bytes(raw[4:12], 'little', signed=True); hierarchy, tid = [], by_owner.get(owner)
                    while tid:
                        go, tid = transforms[tid]; hierarchy.append(names[go])
                    hits.append({'bundle': source['relative'], 'file': filename, 'pathId': str(obj['id']), 'typeId': obj['typeid'], 'hierarchy': hierarchy[::-1], 'objectSha256': hashlib.sha256(raw).hexdigest(), 'matches': matches})
        except Exception as exc:
            failures.append({'bundle': source['relative'], 'error': type(exc).__name__, 'message': str(exc)})
        source['candidates'] = candidates; source['decoded'] = decoded; scans.append(source)
        if (index+1)%100 == 0: print(json.dumps({'scanned': index+1, 'total': len(paths), 'hitObjects': len(hits), 'failures': len(failures)}), flush=True)
    payload = {'provenance': {'checkedOn': '2026-11-14', 'script': fingerprint(Path(__file__)), 'helper': fingerprint(HELPER), 'scope': 'Complete listed installed bundle paths, all MonoBehaviours whose type trees contain attribute/SerializedState/EP recovery fields or raw named node; nested JSON decoded. Runtime-only and XLua programs are not inferred.'}, 'result': {'selection': {'bundleGlobs': ['charpack/*.ab','battle/enm_pfb*.ab','battle/prefabs/**/*.ab','config/*.ab','pkgrps/btl_pfb_tokens_*.ab'], 'layoutPattern': LAYOUT.pattern, 'attribute': {'name':'EP_RECOVERY_PER_SEC','enum':29}, 'node':'ElementHealViaMaxHpRatio'}, 'complete': not failures, 'bundleCount': len(paths), 'decodedComponents': sum(x['decoded'] for x in scans), 'scanned': scans, 'failures': failures, 'hits': hits, 'matchCounts': dict(collections.Counter(m['kind'] for h in hits for m in h['matches']))}}
    a.out.parent.mkdir(parents=True, exist_ok=True); a.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n'); print(json.dumps({'bundles': len(paths),'objects':len(hits),'failures':len(failures),'out':str(a.out)}))

if __name__ == '__main__': main()

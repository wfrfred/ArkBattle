#!/usr/bin/env python3
"""Extract selected acfnc parent programs and bound the installed prefab search."""
import argparse, datetime, hashlib, importlib.util, json, sys
from pathlib import Path
sys.dont_write_bytecode = True
root = Path.cwd()
tools = root / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(tools))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized
parser = argparse.ArgumentParser()
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
helper = root / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec = importlib.util.spec_from_file_location('reader', helper)
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
holder = base / 'config/buff_template_holder.ab'
wanted = {'acfnc_t1', 'acfnc[skill]', 'acfnc[insert-cp]'}
selected = []
parents = []
holder_count = None
for filename, data in bundle(holder)[0]:
    if filename.endswith(('.resS', '.resource')):
        continue
    state = serialized(data)
    for obj in state['objects']:
        if obj['id'] != 6070581171229484677:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        value = reader.decode(raw, reader.trees(data)[obj['typeid']])
        entries = value['_templates']['Array']
        holder_count = len(entries)
        for index, entry in enumerate(entries):
            text = json.dumps(entry, ensure_ascii=False)
            if entry['templateKey'] != 'acfnc[insert-cp]' and 'acfnc[insert-cp]' in text:
                parents.append({'index': index, 'templateKey': entry['templateKey']})
            if entry['templateKey'] not in wanted:
                continue
            item = dict(entry, templateIndex=index)
            item['events'] = [{'event': ev['key'], 'actions': json.loads(ev['value']['SerializedState'])}
                              for ev in entry['eventToActions']['_items']['Array']]
            selected.append({'file': filename, 'holderPathId': str(obj['id']),
                             'holderObjectSha256': hashlib.sha256(raw).hexdigest(), 'template': item})
assert {entry['template']['templateKey'] for entry in selected} == wanted
sources = []
counts = {'bundles': 0, 'serializedFiles': 0, 'monoBehaviours': 0, 'gameObjects': 0}
matches = []
for source in sorted((base / 'battle').glob('enm_pfb_*.ab')):
    sources.append(fingerprint(source))
    counts['bundles'] += 1
    for filename, data in bundle(source)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        state = serialized(data)
        counts['serializedFiles'] += 1
        for obj in state['objects']:
            if obj['classid'] not in (1, 114):
                continue
            counts['gameObjects' if obj['classid'] == 1 else 'monoBehaviours'] += 1
            raw = data[obj['start']:obj['start'] + obj['size']]
            if b'acfnc' in raw:
                matches.append({'bundle': str(source.relative_to(base)), 'file': filename,
                                'pathId': str(obj['id']), 'classId': obj['classid'],
                                'objectSha256': hashlib.sha256(raw).hexdigest()})
result = {'holderTemplateCount': holder_count, 'selectedTemplates': selected, 'literalParentReferences': parents,
          'parentReferenceScope': 'All entries of this one installed BuffTemplateHolder; excludes dynamic key construction, other resources and active XLua.',
          'prefabSearch': {'query': 'UTF-8 bytes acfnc in GameObject and MonoBehaviour raw objects',
                           'inputGlob': 'battle/enm_pfb_*.ab', 'counts': counts,
                           'sources': sources, 'matches': matches,
                           'scope': 'Bounded installed enemy logic bundles; zero results is not global nonexistence or a release-status assertion.'}}
output = {'provenance': {'collectedOn': datetime.date.today().isoformat(),
                         'script': fingerprint(Path(__file__)), 'reader': fingerprint(helper),
                         'tools': [fingerprint(tools / name) for name in ['unity_assets.py', 'native.py']],
                         'source': fingerprint(holder),
                         'scope': 'Static installed resource programs and bounded literal-reference search; no game execution.'},
          'result': result}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'templates': len(selected), 'parents': parents, 'prefabCounts': counts,
                  'prefabMatches': len(matches)}, ensure_ascii=False))

#!/usr/bin/env python3
"""Reuse exact, source-hash checked Case 33 selector components."""
import argparse
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--out', type=Path, required=True)
a = p.parse_args()
source = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/selected-prefabs.json'
data_source = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/selected-data.json'
prefabs = json.loads(source.read_text())
data = json.loads(data_source.read_text())
rows = [dict(sourcePointer=f'/result/{i}', component=v) for i,v in enumerate(prefabs['result'])
        if v['hierarchy'] and v['hierarchy'][0] == 'skchr_tocka_3'
        and '_professionMask' in v['value']]
assert len(rows) == 3
wanted = {'battle/prefabs/[uc]skills.ab', 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'}
verified = []
for old in prefabs['provenance']['sources']:
    if any(old['path'].endswith('/' + x) for x in wanted):
        now = fingerprint(Path(old['path']))
        assert now['sha256'] == old['sha256'], old['path']
        verified.append(now)
assert len(verified) == 2
character = data['result']['characters']['char_4244_tocka']
result = {
    'character': {'sourcePointer': '/result/characters/char_4244_tocka',
                  'id': 'char_4244_tocka', 'name': character['name'],
                  'skills': [dict(skillId=x['skillId'], overridePrefabKey=x.get('overridePrefabKey'))
                             for x in character['skills']]},
    'skill': {'sourcePointer': '/result/skills/skchr_tocka_3',
              'id': 'skchr_tocka_3',
              'name': data['result']['skills']['skchr_tocka_3']['levels'][-1]['name'],
              'prefabId': data['result']['skills']['skchr_tocka_3']['levels'][-1]['prefabId']},
    'selectors': rows,
}
a.out.parent.mkdir(parents=True, exist_ok=True)
a.out.write_text(json.dumps({'provenance': {
    'collectedOn': '2026-11-14', 'scope': 'Reused static component records; same current local bundle bytes verified. Not runtime observation.',
    'script': fingerprint(Path(__file__)), 'sources': [fingerprint(source), fingerprint(data_source)],
    'currentResourceVerification': verified,
    'originalPrefabProvenance': prefabs['provenance'], 'originalDataProvenance': data['provenance'],
}, 'result': result}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'out': str(a.out), 'selectors': len(rows)}))

#!/usr/bin/env python3
"""Archive bounded research results; larger discovery inventories remain in cache."""
import hashlib,json
from pathlib import Path
ROOT=Path.cwd()
CACHE=ROOT/'.cache/native-research/unit-classification-20261114/tags'
OUT=Path(__file__).resolve().parent
for name in ['field-owners.json','tag-bodies.json','tag-lifecycle-consumers.json','formula-tag-consumers.json','source-construction.json','database-folding.json','group-tag-preprocess.json','group-tag-callers.json','group-tag-timing.json']:
    (OUT/name).write_bytes((CACHE/name).read_bytes())
source=CACHE/'inventory.json'
d=json.loads(source.read_text())
x=d['result']
keep=['Torappu.Battle.Entity','Torappu.Battle.Enemy','Torappu.Battle.Character','Torappu.Battle.Unit']
def relevant(name):
    return ('tag' in name.lower() and not any(v in name.lower() for v in ['stage','trace','racertag','advantage','sandbox'])) or name.endswith('get_allApplyWay')
x['methods']=[m for m in x['methods'] if relevant(m['fullname'])]
x['fields']=[f for f in x['fields'] if relevant(f['name'])]
x['owners']=[{**o,'fields':[f for f in o['fields'] if not f['name'].startswith('__Hotfix')], 'methods':[m for m in o['methods'] if relevant(m['fullname'])]} for o in x['owners'] if o['fullname'] in keep]
d['provenance']['projection']={'script':str(Path(__file__).relative_to(ROOT)),'sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'description':'Remove unrelated stage/trace/racer/sandbox name hits and limit full owner records to Entity/Enemy/Character/Unit; selected original records are preserved.'}
(OUT/'metadata-inventory.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('archived',len(list(OUT.glob('*.json'))),'JSON files')

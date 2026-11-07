#!/usr/bin/env python3
"""Select parameter and field instructions from previously archived native evidence."""
import argparse
import hashlib
import json
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--out',type=Path,default=Path('.cache/native-research/always-check-point-20261108/runtime/parameter-evidence.json'))
args=parser.parse_args()
def fingerprint(p):
 return {'path':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
selections=[
 ('docs/research/evidence/route-creation-20261107/initialization/core-init-bodies.json','Torappu.Battle.Enemy.Init',[(0x180abcd19,0x180abcd9f)]),
 ('docs/research/evidence/route-creation-20261107/timing/temporary-cursor-clocks.json','Torappu.Battle.Enemy/FearController.UpdateFearCursor',[(0x180adf548,0x180adf586)]),
 ('docs/research/evidence/route-creation-20261107/timing/temporary-cursor-clocks.json','Torappu.Battle.Enemy/AttractController.UpdateAttractCursor',[(0x180ad5055,0x180ad509c)]),
 ('docs/research/evidence/route-operations-20261107/content/enemy-route-bodies.json','Torappu.Battle.Enemy.ChangePathMotionMode',[(0x180ab9e4a,0x180ab9ebd)]),
 ('docs/research/evidence/route-operations-20261107/cursor/state-bodies.json','Torappu.Battle.DirectionCursor..ctor',[(0x1808d4b3f,0x1808d4b58)]),
 ('docs/research/evidence/route-operations-20261107/cursor/state-bodies.json','Torappu.Battle.DirectionCursor.get_alwaysCheckCurrentPoint',[]),
 ('docs/research/evidence/route-operations-20261107/cursor/state-bodies.json','Torappu.Battle.BasicCursor.OnRouteChanged',[]),
 ('docs/research/evidence/route-operations-20261107/cursor/state-bodies.json','Torappu.Battle.DirectionCursor.Reset',[]),
 ('docs/research/evidence/route-operations-20261107/cursor/state-bodies.json','Torappu.Battle.BasicCursor.Reset',[]),
]
rows=[];inputs={}
for path,name,ranges in selections:
 p=Path(path);x=json.loads(p.read_text());inputs[path]=fingerprint(p)
 b=next(b for b in x['result']['bodies'] if b['method']['fullname']==name)
 ins=[i for f in b['fragments'] for i in f['instructions']]
 chosen=ins if not ranges else [i for i in ins if any(a<=int(i['address'],16)<z for a,z in ranges)]
 assert chosen,name
 rows.append({'source':path,'method':b['method'],'selection':'whole archived method including contiguous fragments' if not ranges else 'selected instruction ranges; complete body remains in source','ranges':[[hex(a),hex(z)] for a,z in ranges],'instructions':chosen})
args.out.parent.mkdir(parents=True,exist_ok=True)
args.out.write_text(json.dumps({'provenance':{'scope':'Selection from existing archived native evidence, not a fresh client extraction or game execution. Full bodies and client fingerprints remain at linked sources.','script':fingerprint(Path(__file__)),'inputs':list(inputs.values())},'result':rows},ensure_ascii=False,indent=2)+'\n')
print('selected methods',len(rows))

#!/usr/bin/env python3
"""Select this question's unchanged-client Trace bodies from the earlier archive."""
import hashlib,json
from pathlib import Path

def fingerprint(path):
 return {'path':str(path),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}

def main():
 source=Path('docs/research/evidence/route-operations-20261107/temporary/native.json')
 document=json.loads(source.read_text());result=document['result']
 exact={
 'Torappu.Battle.Enemy.get_moveCursor','Torappu.Battle.Enemy.get_usingTraceCursor','Torappu.Battle.Enemy.get_traceTargetCursor',
 'Torappu.Battle.Enemy.OnTick','Torappu.Battle.Enemy/States/MoveState.OnTick',
 }
 prefixes=('Torappu.Battle.Abilities.BaseTraceTargetAbility.','Torappu.Battle.Abilities.EnemyTraceTargetByPriorityAbility.')
 bodies=[body for body in result['bodies'] if body['method']['fullname'] in exact or (body['method']['fullname'].startswith(prefixes) and 'Proxy' not in body['method']['fullname'])]
 missing=exact-{b['method']['fullname'] for b in bodies}
 if missing:raise ValueError(sorted(missing))
 selected={'scope':'Selected full bodies from prior evidence with the same cf7956bf DLL and e58fb854 metadata; not a fresh client extraction or runtime observation.',
 'types':[t for t in result['types'] if t['fullname'] in ['Torappu.Battle.Abilities.BaseTraceTargetAbility','Torappu.Battle.Abilities.EnemyTraceTargetByPriorityAbility']],
 'methods':[b['method'] for b in bodies],'bodies':bodies}
 provenance={**document['provenance'],'selection':{'source':fingerprint(source),'script':fingerprint(Path(__file__))}}
 out=Path('docs/research/evidence/leithanien-summons-20261109/movement/trace-native.json')
 out.write_text(json.dumps({'provenance':provenance,'result':selected},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'bodies':len(bodies),'out':str(out)}))
if __name__=='__main__':main()

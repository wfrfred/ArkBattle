#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Record this case's Enemy movement/selection branches and exact metadata slots."""
import argparse,bisect,importlib.util,json
from pathlib import Path

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',required=True,type=Path);p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));a=p.parse_args()
 spec=importlib.util.spec_from_file_location('case_native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);n=m.Native(a.game)
 wanted={
  'Torappu.Battle.Enemy.TryGetCombatTargetBlockee','Torappu.Battle.Enemy._SearchAttackTarget','Torappu.Battle.Enemy._MoveByRoute',
  'Torappu.Battle.Enemy/States/CombatState.OnEnter','Torappu.Battle.Enemy/States/CombatState.OnTick','Torappu.Battle.Enemy/States/CombatState.OnExit',
  'Torappu.Battle.Enemy/States/AttackState.OnEnter','Torappu.Battle.Enemy/States/AttackState.OnTick','Torappu.Battle.Enemy/States/AttackState._AttackFinishCallback',
  'Torappu.Battle.BlockManager.TryGetCombatTarget',
  'Torappu.Battle.Enemy/CombatWrapper.GetTarget','Torappu.Battle.Enemy/CombatWrapper.PickCombatAbility','Torappu.Battle.Enemy/CombatWrapper.NextCombatOrExit',
  'Torappu.Battle.BlockedOrAdvancedSelector.DoFindTargets_DISPOSE','Torappu.Battle.BlockedOrAdvancedSelector.DoBaseFindTargets_DISPOSE','Torappu.Battle.BlockedOrAdvancedSelector.ValidateTarget',
  'Torappu.Battle.GroupSelector.DoFindTargets_DISPOSE','Torappu.Battle.GroupSelector.OnPostFilter',
  'Torappu.Battle.AdvancedSelector.OnPostFilter','Torappu.Battle.AdvancedSelectorWithEnemyOptions.OnPostFilter',
 }
 selected=[]
 for row in n.methods:
  name=n.typename(row['declaringType'])+'.'+n.string(row['nameIndex'])
  if name in wanted or (n.typename(row['declaringType'])=='Torappu.Battle.GridPositionRange' and 'Proxy' not in name):selected.append(n.method(row['index']))
 missing=wanted-{x['fullname'] for x in selected}
 if missing:raise ValueError(sorted(missing))
 bodies=[]
 for method in selected:
  start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];fragments=[];cursor=start
  while cursor<end:
   b=n.disassemble_at(cursor,end-cursor,method=method if cursor==start else None)
   for ins in b['instructions']:
    if len(ins.get('methods',[]))>100:
     ins['methodAliasCount']=len(ins.pop('methods'));ins['methodAliasesOmitted']=True
   fragments.append(b);following=int(b['end'],16)
   if following<=cursor:raise RuntimeError('fragment does not advance')
   cursor=following
  bodies.append({'method':method,'selector':{'fullname':method['fullname'],'token':method['token']},'boundary':'all consecutive pdata fragments up to next known method','logicalEnd':hex(end),'fragments':fragments})
 exact={'Torappu.Battle.GridPositionRange','Torappu.Battle.Entity','Torappu.Battle.FilterUtil/FilterType','Torappu.Battle.Enemy/CombatWrapper','Torappu.Battle.Enemy','Torappu.Battle.Enemy/States/State','Torappu.Battle.Enemy/States/CombatState','Torappu.Battle.Enemy/States/AttackState','Torappu.Battle.BlockManager','Torappu.Battle.TargetSelector','Torappu.Battle.AdvancedSelector','Torappu.Battle.AdvancedSelectorWithEnemyOptions','Torappu.Battle.BlockedOrAdvancedSelector','Torappu.Battle.GroupSelector','Torappu.Battle.TileSelector','Torappu.Battle.Abilities.BaseTraceTargetAbility','Torappu.Battle.Abilities.EnemyTraceTargetByPriorityAbility'}
 defaults={d['fieldIndex']:d for d in n.records(7,'<iii','fieldIndex typeIndex dataIndex')};data_base,_=n.table(8)
 types=[]
 for row in n.types:
  name=n.typename(row['index'])
  if name not in exact and not any(s in name for s in ['Torappu.Battle.AdvancedSelector/','Torappu.Battle.TileSelector/','Torappu.Battle.SideType','Torappu.MotionMode','Torappu.MotionMask']):continue
  fields=n.fields(row['index'])
  for f in fields:
   d=defaults.get(f['index'])
   if any(item['name']=='value__' for item in fields) and d and d['dataIndex']>=0:
    raw=n.metadata[data_base+d['dataIndex']]
    if raw<128:f['defaultEncodedByte']=raw;f['defaultIntValue']=(raw>>1)^-(raw&1)
  types.append(dict(row,fullname=name,fields=fields,methods=[n.method(i) for i in range(row['methodStart'],row['methodStart']+row['methodCount'])]))
 provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__))
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':provenance,'result':{'scope':'Normal native movement and selection used by the two updated Prefabs; runtime XLua is not executed.','types':types,'methods':selected,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'types':len(types),'bodies':len(bodies),'out':str(a.out)}))
if __name__=='__main__':main()

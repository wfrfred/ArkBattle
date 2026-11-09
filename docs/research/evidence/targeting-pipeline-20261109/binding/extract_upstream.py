#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Trace actual Character/Enemy target selection into ability input bindings."""
import argparse
import json
from pathlib import Path
import re
import sys
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,fingerprint

DEFAULTS=[
 'Torappu.Battle.Character._SearchAttackTarget',
 'Torappu.Battle.Character._CheckCanSwithToAttackState',
 'Torappu.Battle.Character/States/AttackState._GetTarget',
 'Torappu.Battle.Character/States/AttackState._StartAttack',
 'Torappu.Battle.Character/States/AttackState._NextAttackOrExit',
 'Torappu.Battle.Character/States/CombatState._GetTarget',
 'Torappu.Battle.Character/States/CombatState._StartAttack',
 'Torappu.Battle.Enemy._SearchAttackTarget',
 'Torappu.Battle.Enemy/States/AttackState.OnEnter',
 'Torappu.Battle.Enemy/States/MoveState.OnTick',
 'Torappu.Battle.Enemy/CombatWrapper.GetTarget',
 'Torappu.Battle.Enemy/CombatWrapper._DoCast',
 'Torappu.Battle.Enemy/CombatWrapper.StartCombat',
 'Torappu.Battle.Enemy/AttackWrapper.SearchTarget',
 'Torappu.Battle.Enemy/AttackWrapper.Cast',
 'Torappu.Battle.SelectorTrigger.Search',
 'Torappu.Battle.SelectorTrigger.Validator',
 'Torappu.Battle.SelectorTrigger._IsHiddenToOwner',
 'Torappu.Battle.SelectorTrigger.SetData',
 'Torappu.Battle.SelectorTrigger.Reset',
 'Torappu.Battle.RangedSelectorTrigger.Validator',
 'Torappu.Battle.SelectorOrAlwaysTrigger.Search',
 'Torappu.Battle.SelectorTrigger.Awake',
 'Torappu.Battle.RangedSelectorTrigger.Awake',
 'Torappu.Battle.Entity.get_isHidden',
 'Torappu.Battle.Entity.get_isHiddenToAlly',
]
def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--game',type=Path,required=True);p.add_argument('--out',type=Path,required=True)
 p.add_argument('--scout',action='store_true');p.add_argument('--method',action='append',default=[])
 a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True);n=Native(a.game)
 provenance={**n.provenance(),'collectedOn':'2026-11-09','extractionScript':fingerprint(Path(__file__))}
 def save(name,result):(a.out/name).write_text(json.dumps(dict(provenance=provenance,result=result),ensure_ascii=False,indent=2)+'\n')
 types=[]
 for t in n.types:
  name=n.typename(t['index'])
  if not (name in ['Torappu.Battle.Character','Torappu.Battle.Enemy','Torappu.Battle.Unit'] or (name.startswith(('Torappu.Battle.Character/','Torappu.Battle.Enemy/')) and any(s in name for s in ['AttackState','MoveState','CombatState','CombatWrapper','AttackWrapper'])) or ('Trigger' in name and 'Selector' in name)):continue
  methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if not n.string(n.methods[i]['nameIndex']).startswith(('__Hotfix','<>xLua'))]
  if name in ['Torappu.Battle.Character','Torappu.Battle.Enemy','Torappu.Battle.Unit']:methods=[m for m in methods if re.search('Target|Attack|Combat|Cast|Ability|Find|Atk|Trigger',m['fullname'].rsplit('.',1)[1],re.I)]
  types.append(dict(fullname=name,index=t['index'],fields=n.fields(t['index']),methods=methods))
 save('contracts.json',types)
 if a.scout:
  for t in types:print(t['fullname'],[(m['index'],m['fullname'].rsplit('.',1)[1]) for m in t['methods']],flush=True)
  return
 a.method=a.method or DEFAULTS
 results=[]
 for m in n.methods:
  name=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
  if name not in a.method:continue
  method=n.method(m['index']);address=method['address'];end=min(v for v in n.addresses if v>address);parts=[]
  while address<end:
   part=n.disassemble_at(address,max_bytes=end-address);parts.append(part);following=int(part['end'],16);assert following>address;address=following
  results.append(dict(method=method,followingMethodAddress=hex(end),parts=parts));print(method['index'],name,len(parts),flush=True)
 missing=set(a.method)-{r['method']['fullname'] for r in results}
 if missing:raise ValueError(sorted(missing))
 save('bodies.json',results)
if __name__=='__main__':main()

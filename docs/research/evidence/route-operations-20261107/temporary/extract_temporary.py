#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract temporary cursor ownership, switching, and content candidates."""
import argparse, bisect, importlib.util, json, struct
from pathlib import Path

p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args()
s=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m);n=m.Native(a.game)
types=['Torappu.Battle.Enemy/FearController','Torappu.Battle.Enemy/AttractController','Torappu.Battle.Enemy/States/MoveState','Torappu.Battle.EntityOnRouteTrigger','Torappu.Battle.Abilities.BaseTraceTargetAbility','Torappu.Battle.Abilities.EnemyTraceEnemyAbility','Torappu.Battle.Abilities.EnemyTraceTargetByPriorityAbility','Torappu.Battle.Abilities.TraceTargetAbility','Torappu.Battle.Abilities.ActiveTraceTileAbility','Torappu.Battle.Abilities.UpdateTraceTileAbility','Torappu.Battle.Abilities.SimpleTraceTargetAbility','Torappu.Battle.Action.Nodes/AddAttackRangeAsFearTargetTiles','Torappu.Battle.Action.Nodes/AddFearTargetTiles','Torappu.Battle.Action.Nodes/RemoveFearTargetTiles','Torappu.Battle.Action.Nodes/AddAttractToTargetNearestTileUseAbilitySelector','Torappu.Battle.Action.Nodes/AddAttractToTargetRootTile']
selected_types=[dict(t,fullname=n.typename(t['index']),fields=n.fields(t['index']),methods=[n.method(i) for i in range(max(0,t['methodStart']),max(0,t['methodStart'])+t['methodCount'])]) for t in n.types if n.typename(t['index']) in types]
base={'Torappu.Battle.Enemy.get_cursor','Torappu.Battle.Enemy.get_moveCursor','Torappu.Battle.Enemy.get_usingTraceCursor','Torappu.Battle.Enemy.get_traceTargetCursor','Torappu.Battle.Enemy._CursorNeedCheckReached','Torappu.Battle.Enemy.OnTick','Torappu.Battle.Enemy.Move','Torappu.Battle.Enemy.MoveInFear','Torappu.Battle.Enemy.MoveInAttract','Torappu.Battle.Enemy.OnFearChanged','Torappu.Battle.Enemy.OnAttractChanged','Torappu.Battle.Enemy._MoveInAttractArea','Torappu.Battle.Enemy._MoveInFearArea','Torappu.Battle.Entity.get_isFeared','Torappu.Battle.Entity.get_isAttracted'}
missing_types=sorted(set(types)-{t['fullname'] for t in selected_types})
if missing_types:raise ValueError(f'Missing requested types: {missing_types}')
methods=[n.method(x['index']) for x in n.methods if n.typename(x['declaringType'])+'.'+n.string(x['nameIndex']) in base or n.typename(x['declaringType']) in types]
bodies=[];omitted=[]
for mm in methods:
 if not mm.get('address') or '<>xLua' in mm['fullname']:
  omitted.append({'method':mm,'reason':'no direct body or generated XLua base proxy'});continue
 if len(n.address_methods.get(mm['address'],[]))>100:
  omitted.append({'method':mm,'reason':'more than 100 shared-body aliases; not assigned one semantic identity'});continue
 start=mm['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cursor=start;fr=[]
 while cursor<end:
  b=n.disassemble_at(cursor,end-cursor,method=mm if cursor==start else None)
  for ins in b['instructions']:
   if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'))
  fr.append(b);following=int(b['end'],16)
  if following<=cursor:raise RuntimeError('no progress')
  cursor=following
 bodies.append({'selector':{'fullname':mm['fullname'],'token':mm['token']},'method':mm,'logicalEnd':hex(end),'fragments':fr})
targets={x['address']:x for x in methods if x.get('address') and len(n.address_methods.get(x['address'],[]))<100};refs={hex(x):[] for x in targets}
for sec in n.pe.sections:
 if not sec['executable']:continue
 code=n.pe.data[sec['offset']:sec['offset']+sec['raw_size']]
 for op in (b'\xe8',b'\xe9'):
  pos=0
  while (pos:=code.find(op,pos))>=0:
   if pos+5<=len(code):
    va=sec['address']+pos;target=va+5+struct.unpack_from('<i',code,pos+1)[0]
    if target in targets:
     pre=bisect.bisect_right(n.addresses,va)-1
     refs[hex(target)].append({'address':hex(va),'opcode':op.hex(),'precedingMethodCandidates':[n.method(i) for i in n.address_methods[n.addresses[pre]]] if pre>=0 else []})
   pos+=1
result={'scope':'Complete methods of selected exact types; direct E8/E9 candidates are not all virtual or indirect consumers. Ordinary static branches, not runtime observations.','types':selected_types,'methods':methods,'bodiesOmitted':omitted,'bodies':bodies,'directCallCandidates':[{'target':hex(va),'method':mm,'candidates':refs[hex(va)]} for va,mm in targets.items()]}
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':dict(n.provenance(),queryScript=m.fingerprint(Path(__file__))),'result':result},ensure_ascii=False,indent=2)+'\n')

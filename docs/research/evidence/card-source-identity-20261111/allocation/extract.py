#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract selected Card identity allocation and Character identity assignment consumers."""
import argparse,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--game',type=Path,default=DEFAULT_GAME)
p.add_argument('--out',type=Path,required=True)
p.add_argument('--extra',action='append',default=[])
p.add_argument('--xref',action='append',default=[])
p.add_argument('--extra-index',action='append',type=int,default=[])
a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
n=Native(a.game)
provenance=n.provenance();provenance.update(collectedOn='2026-11-11',extractionScript=fingerprint(Path(__file__)))
provenance['location']['modules']={k:v for k,v in provenance['location']['modules'].items() if k in ('Assembly-CSharp.dll','mscorlib.dll')}
selected={
 'Torappu.Battle.Character.get_cardUid','Torappu.Battle.Character.set_cardUid',
 'Torappu.Battle.Deck/Card.get_uniqueId','Torappu.Battle.Deck/Card..ctor','Torappu.Battle.Deck/Card.Init',
 'Torappu.Battle.BattleCharacterData..ctor','Torappu.Battle.BattleCharacterData.Duplicate',
 'Torappu.Battle.BattleDataConverter._ConvertInternal','Torappu.Battle.BattleDataConverter._GetUniqueIdByPlayerId',
 'Torappu.Battle.BattleDataConverter.ConvertToCharacterData','Torappu.Battle.BattleDataConverter.TouchCharacterData',
 'Torappu.Battle.BattleDataConverter.ConvertToBattlePlayerData','Torappu.Battle.BattleDataConverter.Reset','Torappu.Battle.BattleDataConverter.GetCurUniqueId',
 'Torappu.Battle.BattleDataConverter.ShiftByPlayerSide',
}|set(a.extra)|{n.method(index)['fullname'] for index in a.extra_index}
metadata=[]
for t in n.types:
 name=n.typename(t['index'])
 if name in {'Torappu.Battle.Character','Torappu.Battle.Deck/Card','Torappu.Battle.BattleCharacterData','Torappu.Battle.BattleDataConverter','Torappu.CharacterInst','Torappu.CharacterInst/Metadata','Torappu.AdvancedCharacterInst'}:
  methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
  metadata.append({'fullname':name,'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['name'].startswith(('__Hotfix','_c__Hotfix'))], 'methods':[m for m in methods if m['fullname'] in selected]})
records=[];xref=[]
for item in n.methods:
 name=n.typename(item['declaringType'])+'.'+n.string(item['nameIndex'])
 if name not in selected and name not in a.xref:continue
 m=n.method(item['index'])
 if name in a.xref:xref.append({'method':m,'xrefs':n.xrefs(m['address'])})
 if name not in selected or not m.get('address'):continue
 start=m['address'];end=min(v for v in n.addresses if v>start);cursor=start;parts=[]
 while cursor<end:
  part=n.disassemble_at(cursor,max_bytes=end-cursor);parts.append(part);following=int(part['end'],16)
  if following<=cursor:raise ValueError('nonprogressing native range')
  cursor=following
 label=name.rsplit('.',1)[-1]+'-'+str(m['index'])
 (a.out/(label+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+' | '.join(i['methods'][:4]) if i.get('methods') else '') for part in parts for i in part['instructions'])+'\n')
 records.append({'method':m,'followingMethodAddress':hex(end),'parts':[{k:v for k,v in q.items() if k!='instructions'}|{'instructionCount':len(q['instructions'])} for q in parts]})
for name,result in [('metadata',metadata),('native',records),('xrefs',xref)]:
 (a.out/(name+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'methods':[(r['method']['index'],r['method']['fullname']) for r in records],'out':str(a.out)},ensure_ascii=False))

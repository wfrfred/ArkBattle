#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the ordinary Card deployment, exit, recovery and respawn identity chain."""
import argparse,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME,Native,fingerprint
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--game',type=Path,default=DEFAULT_GAME)
p.add_argument('--out',type=Path,required=True)
p.add_argument('--extra',action='append',default=[])
p.add_argument('--xref',action='append',default=[])
p.add_argument('--code-end',action='append',default=[])
a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
n=Native(a.game)
provenance=n.provenance();provenance.update(collectedOn='2026-11-11',extractionScript=fingerprint(Path(__file__)))
provenance['location']['modules']={k:v for k,v in provenance['location']['modules'].items() if k in ('Assembly-CSharp.dll','mscorlib.dll')}
code_ends={int(key,0):int(value,0) for key,value in (item.split(':') for item in a.code_end)}
selected={
'Torappu.Battle.BattleController.CreateCharacter',
'Torappu.Battle.Deck/Card.SpawnPrefab',
'Torappu.Battle.Deck/CharacterCard.SpawnInternal',
'Torappu.Battle.Deck.SpawnCharacterOrToken',
'Torappu.Battle.Deck.RecycleCard',
'Torappu.Battle.Deck/Card.OnRecycle',
'Torappu.Battle.Deck/Card.Draw',
'Torappu.Battle.Deck/CharacterCard.get_cardPolicy',
'Torappu.Battle.Deck/Card.OnTick',
'Torappu.Battle.BattleController.OnCharacterFinished',
'Torappu.Battle.BattleController.RecycleCard',
'Torappu.Battle.Character.BuildAt',
'Torappu.Battle.Character._BuildAtInternal',
'Torappu.Battle.Character.Withdraw',
'Torappu.Battle.Character.OnFinish',
'Torappu.Battle.Character.OnRecycle',
'Torappu.Battle.Character.FinishMe',
}|set(a.extra)
type_names={'Torappu.Battle.Deck','Torappu.Battle.Deck/Card','Torappu.Battle.Deck/CharacterCard','Torappu.Battle.Character','Torappu.Battle.Character/BuildParam'}
metadata=[]
for t in n.types:
 name=n.typename(t['index'])
 if name in type_names:
  metadata.append({'fullname':name,'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['name'].startswith(('__Hotfix','_c__Hotfix'))], 'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if n.method(i)['fullname'] in selected]})
bodies=[];xref_rows=[];found=set()
for m in n.methods:
 fullname=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
 if fullname in a.xref and m.get('address'):
  xref_rows.append({'method':n.method(m['index']),'calls':n.xrefs(m['address'])})
 if fullname not in selected:continue
 found.add(fullname)
 method=n.method(m['index'])
 if not method.get('address'):continue
 start=method['address'];following_method=min(x for x in n.addresses if x>start);end=min(following_method,code_ends.get(start,following_method));cursor=start;parts=[]
 while cursor<end:
  part=n.disassemble_at(cursor,max_bytes=end-cursor);parts.append(part);following=int(part['end'],16)
  if following<=cursor:raise ValueError('nonprogressing native range')
  cursor=following
 bodies.append({'method':method,'followingMethodAddress':hex(following_method),'selectedCodeEnd':hex(end),'parts':parts})
 label=fullname.rsplit('.',1)[-1]+'-'+str(method['index'])
 (a.out/(label+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+' | '.join(i['methods'][:4]) if i.get('methods') else '') for part in parts for i in part['instructions'])+'\n')
if selected-found:raise ValueError('missing selectors: '+str(selected-found))
for name,result in [('metadata',metadata),('native',[{**{k:v for k,v in b.items() if k!='parts'},'parts':[{k:v for k,v in q.items() if k!='instructions'}|{'instructionCount':len(q['instructions'])} for q in b['parts']]} for b in bodies])]:
 (a.out/(name+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},indent=2,ensure_ascii=False)+'\n')
if a.xref:
 (a.out/'xrefs.json').write_text(json.dumps({'provenance':provenance,'result':xref_rows},indent=2)+'\n')
print(json.dumps({'methods':[(b['method']['index'],b['method']['fullname']) for b in bodies],'out':str(a.out)},ensure_ascii=False))

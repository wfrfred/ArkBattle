#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract native Buff override identity construction and container consumers."""
import argparse,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME,Native,fingerprint
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--game',type=Path,default=DEFAULT_GAME)
p.add_argument('--out',type=Path,required=True)
p.add_argument('--extra',action='append',default=[])
p.add_argument('--expand',action='append',type=lambda s:int(s,0),default=[])
p.add_argument('--xrefs',action='append',type=lambda s:int(s,0),default=[])
a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
n=Native(a.game)
provenance=n.provenance();provenance.update(collectedOn='2026-11-11',extractionScript=fingerprint(Path(__file__)))
provenance['location']['modules']={k:v for k,v in provenance['location']['modules'].items() if k in ('Assembly-CSharp.dll','mscorlib.dll')}
selected={
'Torappu.Battle.Buff.Reset',
'Torappu.Battle.Buff._RunActions',
'Torappu.Battle.Buff._RunActionsCore',
'Torappu.Battle.Action.Nodes/CreateBuff.Execute',
'Torappu.BuffData.GetOverrideKey',
'Torappu.Battle.Character.get_cardUid',
'Torappu.Battle.Buff.OnRecycle',
'Torappu.Battle.Buff._UpdateOverrideMap',
'Torappu.Battle.Buff/BuffContainer.NewBuff',
'Torappu.Battle.Buff/BuffContainer.EnsureOverrideGroup',
'Torappu.Battle.Buff/BuffContainer.TryGetOverrideGroup',
'Torappu.Battle.Buff/BuffContainer.GetOverrideKeyCandidate',
'Torappu.Battle.Buff/BuffContainer.EnsureOverrideIndependentKey',
'Torappu.Battle.Buff/BuffContainer._FinishBuff',
'Torappu.Battle.Buff/BuffContainer._FinishAndRemoveBuff',
'Torappu.Battle.Buff/BuffContainer._CheckFinishedBuffs',
'Torappu.Battle.Buff/BuffContainer.ClearOnRecycle',
'Torappu.Battle.Buff/OverrideGroup.ResetWithBuff',
'Torappu.Battle.Buff/OverrideGroup.Remove',
'Torappu.Battle.Buff/OverrideGroup.Clear',
'Torappu.Battle.Buff/OverrideGroup.UpdateMe',
'Torappu.Battle.Entity.AddBuff',
}|set(a.extra)
type_names={'Torappu.Battle.Buff','Torappu.Battle.Buff/BuffContainer','Torappu.Battle.Buff/OverrideGroup','Torappu.BuffData','Torappu.Battle.BuffConfig','Torappu.Battle.Entity','Torappu.Battle.BObject','Torappu.Battle.Character','Torappu.Battle.Context','Torappu.Battle.Context/Snapshot','Torappu.Battle.Action.Nodes/CreateBuff'}
metadata=[]
for t in n.types:
 name=n.typename(t['index'])
 if name in type_names:
  metadata.append({'fullname':name,'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['name'].startswith(('__Hotfix','_c__Hotfix'))], 'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if n.method(i)['fullname'] in selected]})
bodies=[]
for m in n.methods:
 fullname=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
 if fullname not in selected:continue
 method=n.method(m['index'])
 if not method.get('address'):continue
 start=method['address'];end=min(x for x in n.addresses if x>start);cursor=start;parts=[]
 while cursor<end:
  part=n.disassemble_at(cursor,max_bytes=end-cursor);parts.append(part);following=int(part['end'],16)
  if following<=cursor:raise ValueError('nonprogressing native range')
  cursor=following
 body={'method':method,'followingMethodAddress':hex(end),'parts':parts};bodies.append(body)
 label=fullname.rsplit('.',1)[-1]+'-'+str(method['index'])
 (a.out/(label+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+' | '.join(i['methods'][:4]) if i.get('methods') else '') for part in parts for i in part['instructions'])+'\n')
for address in a.expand:
 part=n.disassemble_at(address);bodies.append({'expandedAddress':hex(address),'parts':[part]})
 (a.out/('helper-'+hex(address)+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+' | '.join(i['methods'][:4]) if i.get('methods') else '') for i in part['instructions'])+'\n')
for name,result in [('metadata',metadata),('native',[{**{k:v for k,v in b.items() if k!='parts'},'parts':[{k:v for k,v in q.items() if k!='instructions'}|{'instructionCount':len(q['instructions'])} for q in b['parts']]} for b in bodies])]:
 (a.out/(name+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},indent=2,ensure_ascii=False)+'\n')
if a.xrefs:
 (a.out/'xrefs.json').write_text(json.dumps({'provenance':provenance,'result':[n.xrefs(t) for t in a.xrefs]},indent=2)+'\n')
print(json.dumps({'methods':[(b['method']['index'],b['method']['fullname']) for b in bodies if b.get('method')],'out':str(a.out)},ensure_ascii=False))

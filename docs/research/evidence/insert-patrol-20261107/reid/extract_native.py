#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Trace the owner/source identities and ordinary Rush route trigger."""
import argparse,bisect,importlib.util,json
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args();s=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m);n=m.Native(a.game)
 names={'Torappu.Battle.AbilityStandard','Torappu.Battle.Abilities.AbstractAnimatedAbility','Torappu.Battle.Abilities.AnimatedActionToOwnerAbility','Torappu.Battle.EntityOnRouteTrigger','Torappu.Battle.Action.Nodes/InsertCheckPointInRuntimeRoute'};types=[];methods=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name not in names:continue
  ms=[n.method(i)for i in range(t['methodStart'],t['methodStart']+t['methodCount'])];types.append({'fullname':name,'parent':n.type_name(t['parentIndex'])if t['parentIndex']>=0 else None,'fields':n.fields(t['index']),'methods':ms})
  for x in ms:
   mn=n.string(x['nameIndex'])
   if mn.startswith('<>xLua')or not x['address']:continue
   if name in {'Torappu.Battle.EntityOnRouteTrigger','Torappu.Battle.Abilities.AnimatedActionToOwnerAbility'}or(name=='Torappu.Battle.Action.Nodes/InsertCheckPointInRuntimeRoute'and mn=='Execute')or(name in {'Torappu.Battle.AbilityStandard','Torappu.Battle.Abilities.AbstractAnimatedAbility'}and(any(z in mn for z in ['Buff','OnSpellStart','OnCastOnTarget','DoApplyActionsOnTarget','DoCastOnTargets']))):methods.append(x)
 bodies=[]
 for method in methods:
  start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cur=start;parts=[]
  while cur<end:
   b=n.disassemble_at(cur,end-cur,method=method if cur==start else None)
   for i in b['instructions']:
    if len(i.get('methods',[]))>100:i['methodAliasCount']=len(i.pop('methods'));i['methodAliasesOmitted']=True
   parts.append(b);nxt=int(b['end'],16)
   if nxt<=cur:raise RuntimeError('no progress')
   cur=nxt
  bodies.append({'selector':{'fullname':method['fullname'],'token':method['token']},'method':method,'logicalEnd':hex(end),'boundary':'all consecutive pdata fragments to next known method; entry reachability distinguishes adjacent shared code','fragments':parts})
 provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__));a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':provenance,'result':{'types':types,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'types':len(types),'bodies':len(bodies)}))
if __name__=='__main__':main()

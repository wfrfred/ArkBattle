#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Resolve Liskarm's bound damage-listener and the retained source-before-commit filters."""
import argparse,bisect,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
PREFIXES=('Torappu.Battle.Abilities.TriggerWhenTakenDamageAbility.', 'Torappu.Battle.Action.Nodes/IsDamage.', 'Torappu.Battle.Action.Nodes/FilterDamageModifer.', 'Torappu.Battle.Action.Nodes/NoSourceDamage.')
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args();n=Native(a.game);methods=[];bodies=[]
 for raw in n.methods:
  name=n.typename(raw['declaringType'])+'.'+n.string(raw['nameIndex'])
  if name.startswith(PREFIXES):methods.append(n.method(raw['index']))
 for m in methods:
  if not m['address']:continue
  cursor=m['address'];end=n.addresses[bisect.bisect_right(n.addresses,cursor)];parts=[]
  while cursor<end:
   part=n.disassemble_at(cursor,end-cursor,method=m if cursor==m['address']else None)
   for i in part['instructions']:
    if len(i.get('methods',[]))>100:i['methodAliasCount']=len(i.pop('methods'))
   parts.append(part);cursor=int(part['end'],16)
  bodies.append({'methodIndex':m['index'],'fragments':parts})
 prov=n.provenance();prov['caseTool']={'script':fingerprint(Path(__file__)),'lock':fingerprint(Path(str(__file__)+'.lock'))}
 a.out.write_text(json.dumps({'provenance':prov,'result':{'prefixes':PREFIXES,'methods':methods,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n');print({'methods':len(methods)})
if __name__=='__main__':main()

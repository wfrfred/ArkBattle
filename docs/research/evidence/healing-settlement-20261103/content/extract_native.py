#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Select the native heal action and additive-attachment binding, without HP/EP settlement duplication."""
import argparse,bisect,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,fingerprint
SELECTORS={
 'Torappu.Battle.Abilities.Heal.GetProjectileActions',
 'Torappu.Battle.Abilities.Heal.NewHealNode',
 'Torappu.Battle.Abilities.Heal.NewElementHealNode',
 'Torappu.Battle.Abilities.Heal.DoSetData',
 'Torappu.Battle.Abilities.Heal.ApplyHealScale',
 'Torappu.Battle.Abilities.RangedHeal.NewHealNode',
 'Torappu.Battle.Abilities.RangedHeal.GetProjectileActions',
 'Torappu.Battle.Abilities.RangedHeal.OnCastOnTarget',
 'Torappu.Battle.Abilities.PassiveAttachmentAbility.DoAttach',
 'Torappu.Battle.Abilities.PassiveAttachmentAbility.DoSetData',
}
EXPECTED={'dll':'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff','metadata':'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'}
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);p.add_argument('--selector',action='append',default=[]);a=p.parse_args()
 n=Native(a.game);prov=n.provenance()
 for key,digest in EXPECTED.items():
  assert prov['client'][key]['sha256']==digest
 prov['location']['modules']={'Assembly-CSharp.dll':n.modules['Assembly-CSharp.dll']};prov['caseTool']={'script':fingerprint(Path(__file__)),'lock':fingerprint(Path(str(Path(__file__))+'.lock'))}
 field_names={'_additiveActiveBuffs','_applyEPHeal','_elementHealScale','_epHealScale','_targetFamilyMask'};types=[]
 for t in n.types:
  if n.typename(t['index']) not in {'Torappu.Battle.Abilities.Heal','Torappu.Battle.Abilities.PassiveAttachmentAbility'}:continue
  types.append({'index':t['index'],'fullname':n.typename(t['index']),'type':t,'fields':n.fields(t['index']),'methods':[n.method(m['index']) for m in n.methods[t['methodStart']:t['methodStart']+t['methodCount']]]})
 selected=SELECTORS|set(a.selector)
 methods=[n.method(m['index']) for m in n.methods if n.typename(m['declaringType'])+'.'+n.string(m['nameIndex']) in selected]
 assert selected=={m['fullname'] for m in methods},selected-{m['fullname'] for m in methods}
 bodies=[]
 for m in methods:
  cursor=m['address'];end=n.addresses[bisect.bisect_right(n.addresses,cursor)];fs=[]
  while cursor<end:
   body=n.disassemble_at(cursor,end-cursor,method=m if cursor==m['address'] else None)
   for ins in body['instructions']:
    if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'))
   fs.append(body);cursor=int(body['end'],16)
  bodies.append({'methodIndex':m['index'],'logicalEnd':hex(end),'fragments':fs})
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':prov,'result':{'selectors':sorted(selected),'methods':methods,'bodies':bodies,'fieldOwners':types}},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'out':str(a.out),'methods':len(methods),'fieldOwners':[(t['index'],t['fullname']) for t in types]}))
if __name__=='__main__':main()

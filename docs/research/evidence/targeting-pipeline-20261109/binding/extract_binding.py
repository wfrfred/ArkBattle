#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract current AbilityStandard target-binding contracts by metadata names."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint

OWNERS = [
 'Torappu.Battle.AbilityStandard',
 'Torappu.Battle.AbilityStandard/SelectTargetSource',
 'Torappu.Battle.AbilityStandard/SelectTargetTiming',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility',
 'Torappu.Battle.Abilities.AbstractBasicAttack',
 'Torappu.Battle.Abilities.RangedAttack',
 'Torappu.Battle.Abilities.MeleeAttack',
 'Torappu.Battle.Abilities.EasyToStartAbility',
 'Torappu.Battle.Entity',
 'Torappu.Battle.VisualObject',
 'Torappu.Battle.BObject',
]
DEFAULTS = [
 'Torappu.Battle.AbilityStandard.CastToTarget',
 'Torappu.Battle.AbilityStandard.UpdateTargets',
 'Torappu.Battle.AbilityStandard.ExecuteSpell',
 'Torappu.Battle.AbilityStandard.OnSpellStart',
 'Torappu.Battle.AbilityStandard.DoCastOnTargets',
 'Torappu.Battle.AbilityStandard.CheckAtPreCastPhase',
 'Torappu.Battle.AbilityStandard.DoApplyActionsOnTarget',
 'Torappu.Battle.AbilityStandard.OnTick',
 'Torappu.Battle.Abilities.RangedAttack.UpdateTargets',
 'Torappu.Battle.Abilities.RangedAttack.DoCastOnTargets',
 'Torappu.Battle.Abilities.RangedAttack.GetTargetLocatable',
 'Torappu.Battle.Abilities.MeleeAttack.UpdateTargets',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility.get_selectTargetSource',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility.get_selectTargetTiming',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility.get_alwaysIncludeTarget',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility.get_canSelectCamouflageTarget',
 'Torappu.Battle.Abilities.EasyToStartAbility._CheckNotReceiveEventAndTargetAlive',
 'Torappu.Battle.Abilities.EasyToStartAbility._CheckNotReceiveEvent',
 'Torappu.Battle.Abilities.EasyToStartAbility.<OnWaitForPreDelay>b__16_0',
 'Torappu.Battle.Entity.CanDoAbilitySpellOn',
 'Torappu.Battle.Entity.get_alive',
]
def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--game',type=Path,required=True)
 p.add_argument('--out',type=Path,required=True)
 p.add_argument('--scout',action='store_true')
 p.add_argument('--method',action='append',default=[])
 p.add_argument('--helper',type=lambda value:int(value,0),action='append',default=[])
 args=p.parse_args();args.out.mkdir(parents=True,exist_ok=True)
 n=Native(args.game);provenance=n.provenance()
 provenance.update(collectedOn='2026-11-09',extractionScript=fingerprint(Path(__file__)))
 def save(name,result):
  (args.out/name).write_text(json.dumps(dict(provenance=provenance,result=result),ensure_ascii=False,indent=2)+'\n')
 field_defaults={r['fieldIndex']:r for r in n.records(7,'<iii','fieldIndex typeIndex dataIndex')}
 data,_=n.table(8)
 def compressed(offset):
  b=n.metadata[data+offset:];h=b[0]
  if h<0x80:u=h;used=1
  elif h<0xc0:u=((h&0x3f)<<8)|b[1];used=2
  elif h<0xe0:u=((h&0x1f)<<24)|(b[1]<<16)|(b[2]<<8)|b[3];used=4
  elif h==0xf0:u=int.from_bytes(b[1:5],'little');used=5
  elif h==0xfe:u=0xfffffffe;used=1
  elif h==0xff:u=0xffffffff;used=1
  else:raise ValueError(h)
  return ((u>>1) if not(u&1) else -(u>>1)-1),b[:used].hex()
 owners=[]
 for t in n.types:
  fullname=n.typename(t['index'])
  if fullname not in OWNERS and not fullname.startswith(('Torappu.Battle.Abilities.EasyToStartAbility/<OnWaitForPreDelay>', 'Torappu.Battle.Abilities.EasyToStartAbility/<WaitForNextEvent>', 'Torappu.Battle.AbilityStandard/<_DoCast>')):continue
  methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if not n.string(n.methods[i]['nameIndex']).startswith('__Hotfix')]
  if fullname in ['Torappu.Battle.Entity','Torappu.Battle.VisualObject','Torappu.Battle.BObject']:
   methods=[m for m in methods if m['slot'] in [40,136] or m['fullname'] in DEFAULTS]
  fields=n.fields(t['index']);constants=[]
  if '/SelectTarget' in fullname:
   for f in fields:
    d=field_defaults.get(f['index'])
    if d is not None and d['dataIndex']>=0:
     value,raw=compressed(d['dataIndex']);constants.append(dict(name=f['name'],value=value,fieldIndex=f['index'],dataIndex=d['dataIndex'],bytes=raw))
  owners.append(dict(fullname=fullname,index=t['index'],fields=fields,methods=methods,constants=constants))
 save('contracts.json',owners)
 if args.scout:
  for owner in owners:
   print(owner['fullname'],[(r['index'],r['fullname'].rsplit('.',1)[1]) for r in owner['methods']],flush=True)
  return
 methods=args.method or DEFAULTS+[n.typename(m['declaringType'])+'.'+n.string(m['nameIndex']) for m in n.methods if n.string(m['nameIndex'])=='MoveNext' and n.typename(m['declaringType']).startswith(('Torappu.Battle.Abilities.EasyToStartAbility/<OnWaitForPreDelay>', 'Torappu.Battle.Abilities.EasyToStartAbility/<WaitForNextEvent>', 'Torappu.Battle.AbilityStandard/<_DoCast>'))]
 selected=[]
 for m in n.methods:
  name=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
  if name not in methods:continue
  method=n.method(m['index']);address=method['address'];end=min(a for a in n.addresses if a>address)
  parts=[]
  while address<end:
   part=n.disassemble_at(address,max_bytes=end-address);parts.append(part)
   following=int(part['end'],16);assert following>address;address=following
  selected.append(dict(method=method,followingMethodAddress=hex(end),parts=parts))
  print(method['index'],name,len(parts),flush=True)
 missing=sorted(set(methods)-{r['method']['fullname'] for r in selected})
 if missing:raise ValueError({'missing':missing})
 save('bodies.json',selected)
 if args.helper:
  helpers=[]
  for address in args.helper:
   queue=[address];parts=[]
   while queue:
    point=queue.pop(0)
    if any(int(part['address'],16)<=point<int(part['end'],16) for part in parts):continue
    part=n.disassemble_at(point);parts.append(part)
    following=int(part['end'],16)
    if part['instructions'] and part['instructions'][-1]['mnemonic'] not in ['ret','jmp','int3','hlt'] and following<address+4096:
     queue.append(following)
    for instruction in part['instructions']:
     if instruction.get('targetOutsideRange') and not instruction.get('methods'):
      target=int(instruction['target'],16)
      if address<=target<address+4096:queue.append(target)
   helpers.append(dict(address=hex(address),parts=parts))
  save('helpers.json',helpers)
if __name__=='__main__':main()

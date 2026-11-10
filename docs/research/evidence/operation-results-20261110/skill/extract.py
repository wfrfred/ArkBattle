#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Trace selected Skill result consumers using current native bodies only."""
from pathlib import Path
import sys,json,bisect,hashlib,argparse
import capstone
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.agents/skills/arkbattle-native-research/scripts/native.py').exists())
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
parser=argparse.ArgumentParser();parser.add_argument('--game',type=Path,default=DEFAULT_GAME);parser.add_argument('--out',type=Path,required=True)
args=parser.parse_args();args.out.mkdir(parents=True,exist_ok=True)
n=Native(args.game)
NAMES=[
'Torappu.Battle.BasicSkill.Cast','Torappu.Battle.BasicSkill.DoStartSkill','Torappu.Battle.BasicSkill.IsAvailable',
'Torappu.Battle.BasicSkill.IsTriggerable','Torappu.Battle.BasicSkill.IsOpTriggerable','Torappu.Battle.BasicSkill.IsOpRetriggerable',
'Torappu.Battle.BasicSkill.OnCastFailedInSkillState','Torappu.Battle.BasicSkill/Behaviour.OnCastFailed',
'Torappu.Battle.CastSkill.DoCast','Torappu.Battle.CastSkill.UseSkill','Torappu.Battle.CastSkill.OnCastFailedInSkillState',
'Torappu.Battle.CastSkillWithCost.DoCast','Torappu.Battle.CastSkillWithCost.ReduceCost',
'Torappu.Battle.RetriggerableCastSkillWithCost.DoCast','Torappu.Battle.RetriggerableCastSkillWithCost.RetriggerSkill','Torappu.Battle.RetriggerableCastSkillWithCost._DoRetrigger',
'Torappu.Battle.Character.OpTrigSkill','Torappu.Battle.Character.RemoteTrigSkill','Torappu.Battle.Character.TriggerAutoSkill','Torappu.Battle.Character.OnBeforeSkill',
'Torappu.Battle.UI.UICharacterMenuPanel.OnSkillButtonClicked',
'Torappu.Battle.FeverBehaviour.OnCastFailed','Torappu.Battle.OxiFireRainSlotBehaviour.OnCastFailed',
]
byname={}
for raw in n.methods:
 name=n.typename(raw['declaringType'])+'.'+n.string(raw['nameIndex'])
 byname.setdefault(name,[]).append(raw['index'])
 if name.startswith('Torappu.Battle.Character/States/SkillState.') and '__' not in name: NAMES.append(name)
cs=capstone.Cs(capstone.CS_ARCH_X86,capstone.CS_MODE_64);cs.detail=True
bodies=[]
for name in NAMES:
 indices=byname.get(name,[])
 if len(indices)!=1:raise ValueError((name,indices))
 m=n.method(indices[0]);start=m['address']
 if not start:continue
 end=n.addresses[bisect.bisect_right(n.addresses,start)]
 raw=n.pe.read(start,end-start);instructions=[]
 for ins in cs.disasm(raw,start):
  row={'address':hex(ins.address),'bytes':ins.bytes.hex(),'mnemonic':ins.mnemonic,'operands':ins.op_str}
  if (ins.mnemonic=='call' or ins.group(capstone.CS_GRP_JUMP)) and ins.operands and ins.operands[0].type==capstone.x86.X86_OP_IMM:
   target=ins.operands[0].imm;row['target']=hex(target)
   aliases=[n.method(i)['fullname'] for i in n.address_methods.get(target,[])]
   if len(aliases)>20:
    row['aliasCount']=len(aliases);row['aliasesSha256']=hashlib.sha256(json.dumps(aliases).encode()).hexdigest()
    row['methods']=[name for name in aliases if name in NAMES]
   else:row['methods']=aliases
   row['targetOutsideRange']=not(start<=target<end)
  for op in ins.operands:
   if op.type==capstone.x86.X86_OP_MEM and op.mem.base==capstone.x86.X86_REG_RIP:row.setdefault('ripReferences',[]).append(hex(ins.address+ins.size+op.mem.disp))
  instructions.append(row)
 decoded=int(instructions[-1]['address'],16)+len(bytes.fromhex(instructions[-1]['bytes'])) if instructions else start
 bodies.append({'method':m,'address':hex(start),'end':hex(end),'boundary':'Next higher known native method address; includes padding and split pdata fall-through blocks; nonlocal targets and indirect calls require separate analysis.','fullyDecoded':decoded==end,'bytesSha256':hashlib.sha256(raw).hexdigest(),'instructions':instructions})
provenance=n.provenance();provenance['extractor']=fingerprint(Path(__file__))
types=[]
for name in ['Torappu.Battle.BasicSkill','Torappu.Battle.BasicSkill/Behaviour','Torappu.Battle.CastSkill','Torappu.Battle.CastSkillWithCost','Torappu.Battle.RetriggerableCastSkillWithCost','Torappu.Battle.Character/States/SkillState','Torappu.Battle.FeverBehaviour','Torappu.Battle.OxiFireRainSlotBehaviour']:
 t=next(t for t in n.types if n.typename(t['index'])==name)
 types.append({'fullname':name,'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['static']],'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if n.method(i)['slot']!=65535 or n.method(i)['fullname'] in NAMES]})
xrefs=[]
for name in ['Torappu.Battle.BasicSkill.Cast','Torappu.Battle.Character.OpTrigSkill','Torappu.Battle.BasicSkill.OnCastFailedInSkillState']:
 m=n.method(byname[name][0]);x=n.xrefs(m['address'])
 for c in x['candidates']:c['precedingMethods']=[n.method(i)['fullname'] for i in c['precedingMethodCandidates']]
 xrefs.append({'method':m,'xrefs':x})
(args.out/'native.json').write_text(json.dumps({'provenance':provenance,'selection':NAMES,'types':types,'methods':bodies,'xrefs':xrefs},ensure_ascii=False,indent=2)+'\n')
for b in bodies:
 m=b['method'];print(m['index'],m['fullname'],m['returnTypeName'],'complete',b['fullyDecoded'],'instructions',len(b['instructions']))

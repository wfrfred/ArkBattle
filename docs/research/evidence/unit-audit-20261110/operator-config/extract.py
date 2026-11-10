#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Select current operator attribute / favor / equipment preprocessing bodies."""
from pathlib import Path
import sys,json,argparse,bisect,hashlib,struct
import capstone
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.agents/skills/arkbattle-native-research/scripts/native.py').exists())
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
parser=argparse.ArgumentParser();parser.add_argument('--game',type=Path,default=DEFAULT_GAME);parser.add_argument('--out',type=Path,required=True)
args=parser.parse_args();args.out.mkdir(parents=True,exist_ok=True)
n=Native(args.game)
NAMES=[
 'Torappu.AttributesCalculator._TryGetRawData',
 'Torappu.AttributesCalculator.TryGetBasicData',
 'Torappu.AttributesCalculator.TryGetFinalData',
 'Torappu.AttributesCalculator.FetchUniEquipAttributesDelta',
 'Torappu.AttributesCalculator.FetchUniEquipAttributeAddition',
 'Torappu.FavorDB.GetFavorData',
 'Torappu.FavorDB.GetFavorBattlePhase',
 'Torappu.CharacterUtil.CalcCharacterFavorPercent',
 'Torappu.DataConvertUtil.LoadOverrideTalents',
 'Torappu.DataConvertUtil.TryGetValidTalentWithOverride',
 'Torappu.CharacterData/TalentDataBundle.DoGetTalent',
 'Torappu.CharacterData/AttributesKeyFrame.LerpData',
 'Torappu.CharacterData/AttributesDeltaKeyFrame.LerpData',
 'Torappu.AttributesData.Lerp',
 'Torappu.Battle.UniEquip.UniEquipUtil.TryGetUniEquipPackData',
 'Torappu.Battle.UniEquip.UniEquipUtil.AddEquipTalentData',
 'Torappu.Battle.UniEquip.UniEquipUtil.CheckFilter',
 'Torappu.AttributesCalculator/Input..ctor',
]
rows=[]
for raw in n.methods:
 name=n.typename(raw['declaringType'])+'.'+n.string(raw['nameIndex'])
 if name in NAMES or name=='Torappu.Battle.UniEquip.UniEquipUtil.TryGetOverrideTalentData' or (name=='Torappu.DataConvertUtil.AchieveCharAttributes' and raw['parameterCount']==8) or (name=='Torappu.AttributesData.WriteAttributesField' and n.method(raw['index'])['parameters'][2]['typeName']=='float'):
  m=n.method(raw['index']); end=n.addresses[bisect.bisect_right(n.addresses,m['address'])]
  code=n.pe.read(m['address'],end-m['address'])
  cs=capstone.Cs(capstone.CS_ARCH_X86,capstone.CS_MODE_64);cs.detail=True
  instructions=[]
  for ins in cs.disasm(code,m['address']):
   row={'address':hex(ins.address),'bytes':ins.bytes.hex(),'mnemonic':ins.mnemonic,'operands':ins.op_str}
   if (ins.mnemonic=='call' or ins.group(capstone.CS_GRP_JUMP)) and ins.operands and ins.operands[0].type==capstone.x86.X86_OP_IMM:
    target=ins.operands[0].imm; row['target']=hex(target)
    row['methods']=[n.method(i)['fullname'] for i in n.address_methods.get(target,[])]
    row['targetOutsideRange']=not(m['address']<=target<end)
   for op in ins.operands:
    if op.type==capstone.x86.X86_OP_MEM and op.mem.base==capstone.x86.X86_REG_RIP:row.setdefault('ripReferences',[]).append(hex(ins.address+ins.size+op.mem.disp))
   instructions.append(row)
  decoded=int(instructions[-1]['address'],16)+len(bytes.fromhex(instructions[-1]['bytes']))
  body={'method':m,'address':hex(m['address']),'end':hex(end),'instructions':instructions,'bytesSha256':hashlib.sha256(code).hexdigest(),'fullyDecoded':decoded==end,'boundary':'Next higher known method; includes contiguous split blocks / padding, nonlocal jumps and indirect calls require expansion.'}
  for row in body['instructions']:
   if len(row.get('methods',[]))>20: row['methodAliasCount']=len(row.pop('methods'))
  rows.append(body)
  print(m['index'],name,len(body['instructions']),body['fullyDecoded'])
missing=set(NAMES)-{b['method']['fullname'] for b in rows}
if missing: raise ValueError(('selectors missing',sorted(missing)))
types=[]
for name in ['Torappu.AttributesCalculator/Input','Torappu.AttributesData','Torappu.CharacterData/PhaseData','Torappu.FavorData','Torappu.TalentData','Torappu.BattleEquipPerLevelPack','Torappu.BattleUniEquipData','Torappu.EquipTalentData','Torappu.UniEquipTarget','Torappu.KeyFrames`2']:
 matches=[t for t in n.types if n.typename(t['index'])==name]
 for t in matches:
  fields=n.fields(t['index'])
  if name=='Torappu.UniEquipTarget':
   defaults={v['fieldIndex']:v for v in n.records(7,'<3i','fieldIndex typeIndex dataIndex')}
   data_start,_=n.table(8)
   for field in fields:
    d=defaults.get(field['index'])
    if d and d['dataIndex']>=0:
     # These seven v29 enum literals use one-byte compressed signed integers.
     encoded=n.metadata[data_start+d['dataIndex']]
     if encoded&0x80:raise ValueError('enum literal needs a wider compressed decoder')
     field['enumInt32Value']=encoded>>1 if encoded&1==0 else -(encoded>>1)-1
     field['enumDefault']={'dataIndex':d['dataIndex'],'rawHex':f'{encoded:02x}','encoding':'metadata v29 compressed signed integer, one-byte case'}
  types.append({'name':name,'index':t['index'],'fields':fields})
provenance=n.provenance();provenance['extractor']=fingerprint(Path(__file__))
blocks=[n.disassemble_at(0x184c6f600)]
(args.out/'native.json').write_text(json.dumps({'provenance':provenance,'result':{'selection':NAMES,'types':types,'methods':rows,'blocks':blocks}},ensure_ascii=False,indent=2)+'\n')

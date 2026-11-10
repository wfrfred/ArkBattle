#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Read the selected native Buff merge, override and descriptor consumers."""
import argparse
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
parser.add_argument('--extra', action='append', default=[])
parser.add_argument('--expand', action='append', type=lambda value: int(value,0), default=[])
parser.add_argument('--address', action='append', type=lambda value: int(value,0), default=[])
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
native=Native(args.game)
provenance={**native.provenance(),'collectedOn':'2026-11-10','extractionScript':fingerprint(Path(__file__))}
provenance['location']['modules'] = {key: value for key, value in provenance['location']['modules'].items()
                                    if key in {'Assembly-CSharp.dll', 'mscorlib.dll'}}
selected={
'Torappu.Battle.Buff.get_validStackCnt',
'Torappu.Battle.Buff.CompareTo',
'Torappu.Battle.Buff.TakeSnapshotToBuffAttribute',
'Torappu.Blackboard.TryGetFP',
'Torappu.Blackboard._TryGetNumber',
'Torappu.Battle.Buff.OnAllocate',
'Torappu.Battle.Buff.set_isEnabled',
'Torappu.Battle.Buff.get_isEnabled',
'Torappu.Battle.Buff._LoadAttributesModifier',
'Torappu.Battle.Buff._DoUpdateStack',
'Torappu.Battle.Buff._AddStack',
'Torappu.Battle.Buff._FillRemainingTimeWhenStackMax',
'Torappu.Battle.Buff._FillRemainingTime',
'Torappu.Battle.Buff._ExtendRemainingTime',
'Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished',
'Torappu.Battle.Buff/OverrideGroup.ResetWithBuff',
'Torappu.Battle.Buff/OverrideGroup.Add',
'Torappu.Battle.Buff/OverrideGroup.Remove',
'Torappu.Battle.Buff/OverrideGroup.UpdateMe',
'Torappu.Battle.Buff/OverrideGroup.RefreshPriority',
'Torappu.Battle.Buff/OverrideGroup._DoAddInternal',
'Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal',
'Torappu.SharedUtils.ProcessFinalScaler',
} | set(args.extra)
metadata=[]
for t in native.types:
 name=native.typename(t['index'])
 if name in {'Torappu.Battle.Buff','Torappu.Battle.Buff/OverrideGroup','Torappu.BuffData','Torappu.AttributeModifierData/AttributeModifier','Torappu.Battle.SharedUtils','Torappu.SharedUtils','Torappu.Blackboard','Torappu.BuffData/OverrideType','Torappu.AttributeModifierData/AttributeModifier/FormulaItemType'}:
  methods=[native.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
  fields=[field for field in native.fields(t['index'])
          if not field['name'].startswith(('__Hotfix', '_c__Hotfix'))]
  metadata.append({'fullname':name,'index':t['index'],'fields':fields,
   'methods':[m for m in methods if m['fullname'] in selected]})
bodies=[];discovered=[]
for m in native.methods:
 name=native.typename(m['declaringType'])+'.'+native.string(m['nameIndex'])
 if any(term in name for term in ['ProcessFinalScaler','_LoadAttributesModifier','GetBuffAttributeValue']):discovered.append(native.method(m['index']))
 if name not in selected:continue
 method=native.method(m['index'])
 if not method.get('address'):continue
 cursor=method['address'];end=min(a for a in native.addresses if a>cursor);parts=[]
 while cursor<end:
  part=native.disassemble_at(cursor,max_bytes=end-cursor)
  parts.append(part);following=int(part['end'],16)
  if following<=cursor:raise ValueError('nonprogressing range')
  cursor=following
 bodies.append({'method':method,'followingMethodAddress':hex(end),'parts':parts})
 label=name.rsplit('.',1)[-1]+'-'+str(method['index'])
 (args.out/(label+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+' '+i['operands']+(' ; '+(' | '.join(i.get('methods',[])) if len(i.get('methods',[])) <= 4 else 'shared native address; '+str(len(i['methods']))+' metadata aliases') if i.get('methods') else '') for p in parts for i in p['instructions'])+'\n')
for address in args.expand:
 part=native.disassemble_at(address)
 bodies.append({'method':None,'expandedAddress':hex(address),'parts':[part]})
 (args.out/('helper-'+hex(address)+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+' '+i['operands']+(' ; '+(' | '.join(i.get('methods',[])) if len(i.get('methods',[])) <= 4 else 'shared native address; '+str(len(i['methods']))+' metadata aliases') if i.get('methods') else '') for i in part['instructions'])+'\n')
constants={}
for a in args.address:
 constants[hex(a)]={'bytes':native.pe.read(a,16).hex()}
summaries=[]
for body in bodies:
 summaries.append({**{key:value for key,value in body.items() if key != 'parts'},
                   'parts':[{key:value for key,value in part.items() if key != 'instructions'} |
                            {'instructionCount':len(part['instructions'])} for part in body['parts']]})
for name,result in [('metadata',metadata),('native',summaries)]+([('constants',constants)] if constants else []):
 (args.out/(name+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'methods':[(b['method']['index'],b['method']['fullname']) if b['method'] else b['expandedAddress'] for b in bodies], 'discovered':[(m['index'],m['fullname']) for m in discovered], 'out':str(args.out)},ensure_ascii=False))

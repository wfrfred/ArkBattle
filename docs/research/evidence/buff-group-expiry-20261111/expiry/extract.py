#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract ordinary Buff expiry and stack removal consumers from the installed client."""
import argparse
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

SELECTED = {
    'Torappu.Battle.Buff.Reset',
    'Torappu.Battle.Buff.MarkFinish',
    'Torappu.Battle.Buff.DecStackCntOrMarkFinish',
    'Torappu.Battle.Buff.OnTick',
    'Torappu.Battle.Buff.OnLateTick',
    'Torappu.Battle.Buff.OnFinish',
    'Torappu.Battle.Buff.OnDisable',
    'Torappu.Battle.Buff.OnRecycle',
    'Torappu.Battle.Buff._DoUpdateStack',
    'Torappu.Battle.Buff._PreprocessDeltaTime',
    'Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished',
    'Torappu.Battle.Buff.SubtractRemainingTime',
    'Torappu.Battle.Buff/BuffContainer.Tick',
    'Torappu.Battle.Buff/BuffContainer._CheckFinishedBuffs',
    'Torappu.Battle.Buff/BuffContainer._FinishAndRemoveBuff',
    'Torappu.Battle.Buff/BuffContainer._FinishBuff',
    'Torappu.Battle.Buff/BuffContainer.ForceRefreshFinishedBuffs',
    'Torappu.Battle.BattleController.RecycleBuffNextFrame',
    'Torappu.Battle.BattleController._UpdateDelayToRecycleBuffContainer',
    'Torappu.Battle.BattleController._RecycleBuffContainerImmediatelly',
    'Torappu.Battle.Buff/DoubleBufferedBuffList.Remove',
    'Torappu.Battle.Buff/OverrideGroup.Remove',
    'Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal',
}
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game',type=Path,default=DEFAULT_GAME)
parser.add_argument('--out',type=Path,required=True)
parser.add_argument('--extra',action='append',default=[])
parser.add_argument('--extra-index',action='append',type=int,default=[])
parser.add_argument('--expand',action='append',type=lambda v:int(v,0),default=[])
parser.add_argument('--code-end',action='append',default=[],help='start:end bounds when a PE range also contains jump-table data')
parser.add_argument('--xref',action='append',default=[])
args=parser.parse_args()
args.out.mkdir(parents=True,exist_ok=True)
n=Native(args.game)
provenance={**n.provenance(),'collectedOn':'2026-11-11','extractionScript':fingerprint(Path(__file__))}
provenance['location']['modules']={key:value for key,value in provenance['location']['modules'].items() if key in {'Assembly-CSharp.dll','mscorlib.dll'}}
selected=SELECTED|set(args.extra)|{n.method(index)['fullname'] for index in args.extra_index}
methods={}
for item in n.methods:
    name=n.typename(item['declaringType'])+'.'+n.string(item['nameIndex'])
    if name in selected or name in args.xref:
        methods[name]=n.method(item['index'])
missing=selected-methods.keys()
if missing:raise ValueError(f'missing selectors: {missing}')
metadata=[]
for t in n.types:
    name=n.typename(t['index'])
    if name in {'Torappu.Battle.Buff','Torappu.BuffData','Torappu.Battle.Buff/OverrideGroup','Torappu.Battle.Buff/BuffContainer'}:
        metadata.append({'fullname':name,'index':t['index'],
          'fields':[f for f in n.fields(t['index']) if not f['name'].startswith(('__Hotfix','_c__Hotfix'))],
          'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount']) if n.method(i)['fullname'] in selected]})
records=[]
for name in sorted(selected):
    m=methods[name]
    start=m['address'];end=min(a for a in n.addresses if a>start);cursor=start;parts=[]
    while cursor<end:
        part=n.disassemble_at(cursor,max_bytes=end-cursor)
        parts.append(part)
        cursor=int(part['end'],16)
    label=name.rsplit('.',1)[-1]+'-'+str(m['index'])
    (args.out/(label+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+(' | '.join(i.get('methods',[])) if len(i.get('methods',[]))<=4 else f"{len(i['methods'])} metadata aliases") if i.get('methods') else '') for p in parts for i in p['instructions'])+'\n')
    records.append({'method':m,'followingMethodAddress':hex(end),'parts':[{k:v for k,v in p.items() if k!='instructions'}|{'instructionCount':len(p['instructions'])} for p in parts]})
code_ends={int(start,0):int(end,0) for start,end in (value.split(':') for value in args.code_end)}
for address in args.expand:
    end=code_ends.get(address)
    part=n.disassemble_at(address,max_bytes=None if end is None else end-address)
    (args.out/('helper-'+hex(address)+'.asm')).write_text('\n'.join(i['address']+': '+i['mnemonic']+(' '+i['operands'] if i['operands'] else '')+(' ; '+' | '.join(i.get('methods',[])) if i.get('methods') and len(i['methods'])<=4 else '') for i in part['instructions'])+'\n')
    records.append({'method':None,'expandedAddress':hex(address),'parts':[{k:v for k,v in part.items() if k!='instructions'}|{'instructionCount':len(part['instructions'])}]})
for label,result in [('metadata',metadata),('native',records)]:
    (args.out/(label+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
if args.xref:
    xrefs={name:n.xrefs(methods[name]['address']) for name in args.xref}
    (args.out/'xrefs.json').write_text(json.dumps({'provenance':provenance,'result':xrefs},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'methods':[(methods[name]['index'],name) for name in sorted(selected)],'out':str(args.out)},ensure_ascii=False))

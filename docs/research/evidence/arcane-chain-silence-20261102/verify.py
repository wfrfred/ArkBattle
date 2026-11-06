#!/usr/bin/env python3
"""Static consistency checks on the retained evidence; not a game experiment."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent
load=lambda name:json.loads((p/name).read_text())
n=load('native-evidence.json')['result'];assets=load('assets.json')['result'];template=load('templates.json')['result'][0];season=load('season-bindings.json')['result'];switch=load('target-switch.json')
for key in ['eff_acarm048','eff_acgarm048']:
 bb={x['key']:x for x in season['effectBuffInfoDataDict'][key][1]['blackboard']};assert bb['key']['valueStr']=='silence_attachment' and bb['silence']['value']==5
assert season['silence']['attributes']['abnormalFlags']==['SILENCED'];assert season['silence']['durationKey']=='silence'
assert template['key']=='silence_attachment';event=template['events'][0];assert event['event']==11
node=event['actions'][0];assert node['_buffOwner']=='MODIFIER_TARGET' and node['_buff']['buffKey']=='silence' and node['_buff']['loadFromDB']
assert switch['value']==4 and 'Torappu.Battle.Modifier.get_target' in switch['branchGetter']['methods']
bodies={b['method']['fullname']:b for b in n['bodies']}
flat=lambda b:[i for part in b['parts'] for i in part['instructions']]
assert any(i['operands']=='edx, 0xb' for i in flat(bodies['Torappu.Battle.Buff.OnOutputDamage']))
assert any('Torappu.Battle.Buff/BuffContainer.OnOutputDamage' in i.get('methods',[]) for i in flat(bodies['Torappu.Battle.Entity.ApplyModifier']))
assert bodies['Torappu.Battle.Projectiles.SelectorHitBehaviour.DealHitTarget']['method']['slot']==18
assert len(n['indirectDispatchHelpers'])==1
assert any(i['operands']=='ecx, 0x12' for i in flat(bodies['Torappu.Battle.Projectiles.ChainLightningHitBehaviour._HitTargets']))
t=next(t for t in n['types'] if t['name']=='Torappu.Battle.Action.Nodes/ApplyCacheAtkDamageFromProjectile');assert t['parentTypeName']=='Torappu.Battle.Action.Nodes/ApplyDamage';assert not any(m['fullname'].endswith('.Execute') for m in t['methods'])
assert {'projectile_leizi','projectile_leizi_s2'}<={x['value'].get('_projectileKey') for x in assets if x['bundle'].startswith('charpack/')}
for name,scale in [('projectile_leizi',0.85),('projectile_leizi_s2',1.0)]:
 x=next(x for x in assets if x['name']==name and '_useChainPrefix' in x['value']);assert abs(x['value']['_atkScale']-scale)<1e-6
x=next(x for x in assets if x['name']=='silence_attachment');assert x['value']['_buffs']['Array'][0]['templateKey']=='silence_attachment'
# GetActionTarget ends with its 12-entry jump table, not executable instructions.
for b in n['bodies']:
 for part in b['parts']:
  if part['fullyDecoded']:continue
  if b['method']['fullname'].endswith('GetActionTarget'):
   table=int(switch['jumpTable'],16);assert table<=int(part['decodedEnd'],16)<int(part['end'],16)==table+48
  else:
   assert b['method']['fullname']=='Torappu.Battle.Entity.ApplyModifier' and int(part['end'],16)-int(part['decodedEnd'],16)==1
   import sys
   sys.path.insert(0,str(p.parents[3]/'.agents/skills/arkbattle-native-research/scripts'))
   from native import PE
   pe=PE(Path(load('native-evidence.json')['provenance']['client']['dll']['path']))
   assert pe.read(int(part['decodedEnd'],16),1)==b'\0'
print('equipment bindings, template, event 11, target dispatch, chain targets and inherited damage execution: consistent')

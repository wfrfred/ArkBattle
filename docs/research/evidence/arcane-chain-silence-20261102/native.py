#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Re-locate the bounded Arcane Circle / Leizi native call chain by name."""
import argparse,bisect,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME
METHODS={
'Torappu.Battle.Projectiles.ChainLightningHitBehaviour._HitTargets',
'Torappu.Battle.Projectiles.ChainLightningHitBehaviour.OnProjectileReached',
'Torappu.Battle.Projectiles.SelectorHitBehaviour.DealHitTarget',
'Torappu.Battle.Abilities.RangedAttack.GetProjectileActions',
'Torappu.Battle.Abilities.RangedAttack.NewDamageNode',
'Torappu.Battle.Projectile.DealHitTarget',
'Torappu.Battle.Projectile.OnHitTarget',
'Torappu.Battle.Projectile/ActionController.OnHitTarget',
'Torappu.Battle.Projectile/ActionController._RunActions',
'Torappu.Battle.Action.Nodes/ApplyDamage.Execute',
'Torappu.Battle.Entity.ApplyModifier',
'Torappu.Battle.Buff/BuffContainer.OnOutputDamage',
'Torappu.Battle.Buff.OnOutputDamage',
'Torappu.Battle.Action.Nodes/CreateBuff.Execute',
'Torappu.Battle.Action.Nodes.GetActionTarget',
'Torappu.Battle.Modifier.get_target',
'Torappu.Battle.Runes.Internal.LGlobalBuffNewWithUnitVerify.OnPreprocessFinished',
}
TYPES={'Torappu.Battle.Action.Nodes/ApplyDamage','Torappu.Battle.Action.Nodes/ApplyCacheAtkDamageFromProjectile','Torappu.Battle.Abilities.RangedAttack','Torappu.Battle.Projectiles.ChainLightningHitBehaviour','Torappu.Battle.Projectiles.SelectorHitBehaviour','Torappu.Battle.Projectile','Torappu.Battle.Action.Nodes/CreateBuff','Torappu.Battle.Action.Nodes/ActionTargetType'}
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args();n=Native(a.game)
 bodies=[];found=set();types=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name in TYPES:types.append(dict(name=name,index=t['index'],parentTypeName=n.type_name(t['parentIndex']),fields=n.fields(t['index']),methods=[n.method(i) for i in range(max(0,t['methodStart']),max(0,t['methodStart'])+t['methodCount'])]))
  for i in range(max(0,t['methodStart']),max(0,t['methodStart'])+t['methodCount']):
   fullname=name+'.'+n.string(n.methods[i]['nameIndex'])
   if fullname not in METHODS:continue
   found.add(fullname);m=n.method(i);limit=n.addresses[bisect.bisect_right(n.addresses,m['address'])];cursor=m['address'];parts=[]
   while cursor<limit:
    body=n.disassemble_at(cursor);parts.append(body);end=int(body['end'],16)
    if end<=cursor:raise ValueError('non-progress')
    cursor=end
   for part in parts:
    for ins in part['instructions']:
     if 'methods' in ins:ins['methods']=[s for s in ins['methods'] if s.startswith(('Torappu.Battle.','Torappu.Blackboard.','Torappu.FP.','XLua.DelegateBridge.','UnityEngine.Object.'))]
   bodies.append(dict(method=m,followingMethodAddress=hex(limit),parts=parts))
 if found!=METHODS:raise ValueError(METHODS-found)
 helpers=[]
 for b in bodies:
  if not b['method']['fullname'].endswith('ChainLightningHitBehaviour._HitTargets'):continue
  instructions=[i for part in b['parts'] for i in part['instructions']]
  for j,ins in enumerate(instructions):
   if ins['mnemonic']=='call' and ins.get('target') and any(i['mnemonic']=='mov' and i['operands']=='ecx, 0x12' for i in instructions[max(0,j-6):j]):
    helpers.append(n.disassemble_at(int(ins['target'],16)))
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(dict(provenance=n.provenance(),result=dict(types=types,bodies=bodies,indirectDispatchHelpers=helpers)),ensure_ascii=False,indent=2)+'\n');print('methods',len(bodies))
if __name__=='__main__':main()

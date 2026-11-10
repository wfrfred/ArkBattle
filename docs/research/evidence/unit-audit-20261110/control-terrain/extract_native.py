#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract selected current native methods, including split pdata parts up to next registered entry."""
import argparse,bisect,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import DEFAULT_GAME,Native,fingerprint
NAMES=['Torappu.Battle.BlockManager.SearchBlockee', 'Torappu.Battle.Abilities.AbstractBasicAttack.CreateAndReplaceDamageNode', 'Torappu.Battle.Abilities.AbstractBasicAttack.DoSetData', 'Torappu.Battle.Abilities.AbstractBasicAttack.OnCastStart', 'Torappu.Battle.Abilities.MeleeAttack.GetEventActions', 'Torappu.Battle.AbilityStandard.DoApplyActionsOnTarget', 'Torappu.Battle.AbilityStandard.DoCastOnTargets', 'Torappu.Battle.AbilityStandard.OnCastOnTarget', 'Torappu.Battle.Action.Nodes/ApplyDamage.CreateDamageModifier', 'Torappu.Battle.Action.Nodes/ApplyDamage.Execute', 'Torappu.Battle.Action.Nodes/FilterByTargetMassLevel.Execute', 'Torappu.Battle.Action.Nodes/KillCharacterOnTileIfExists.Execute', 'Torappu.Battle.BasicSkill.get_ownerCanUseInAbnormalState', 'Torappu.Battle.BattleUtil.CalculateDamageBySource', 'Torappu.Battle.BlockManager.UpdateBlockees', 'Torappu.Battle.Buff.CompareTo', 'Torappu.Battle.Buff.OnTick', 'Torappu.Battle.Buff/OverrideGroup._DoAddInternal', 'Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal', 'Torappu.Battle.BuffTile.ApplyBuffs', 'Torappu.Battle.BuffTile.CheckTargetInBlackList', 'Torappu.Battle.BuffTile.ClearBuffs', 'Torappu.Battle.BuffTile.Init', 'Torappu.Battle.BuffTile.OnCharacterEnter', 'Torappu.Battle.BuffTile.OnCharacterLeave', 'Torappu.Battle.BuffTile.OnEnemyEnter', 'Torappu.Battle.BuffTile.OnEnemyLeave', 'Torappu.Battle.Character.EnsureSkillOnInAbnormalState', 'Torappu.Battle.Character._SearchBlockee', 'Torappu.Battle.Character/States/AttackState.OnExit', 'Torappu.Battle.Character/States/BasicState.ShouldSwitchToAbnormalState', 'Torappu.Battle.Character/States/StunState.OnEnter', 'Torappu.Battle.Character/States/StunState.OnTick', 'Torappu.Battle.Enemy.FallDown', 'Torappu.Battle.Enemy/States/AttackState.OnExit', 'Torappu.Battle.Enemy/States/StunState.OnEnter', 'Torappu.Battle.Entity.Suicide', 'Torappu.Battle.Entity.get_canMove', 'Torappu.Battle.Entity.get_canUseAbility', 'Torappu.Battle.Entity.get_canUseAtkOrCbt', 'Torappu.Battle.Entity.get_inAbnormalState', 'Torappu.Battle.HoleTile.OnEnemyEnter', 'Torappu.Battle.HoleTile.OnEnemyMotionModeChanged', 'Torappu.Battle.Tile.ClearCharacterIfExists']

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);p.add_argument('--names',type=Path);a=p.parse_args();n=Native(a.game);wanted=set(NAMES if not a.names else json.loads(a.names.read_text()));rows=[]
 for m in n.methods:
  name=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
  if name not in wanted:continue
  meta=n.method(m['index']);start=meta.get('address')
  if not start:continue
  limit=n.addresses[bisect.bisect_right(n.addresses,start)];parts=[];address=start
  while address<limit:
   part=n.disassemble_at(address,max_bytes=limit-address,method=meta if address==start else None);parts.append(part);end=int(part['end'],16)
   if end<=address:raise RuntimeError(name)
   address=end
  rows.append({'method':meta,'nextRegisteredEntry':hex(limit),'parts':[{k:v for k,v in part.items() if k not in {'method','aliases'}} for part in parts]})
 defaults={v['fieldIndex']:v for v in n.records(7,'<3i','fieldIndex typeIndex dataIndex')};constant_start,_=n.table(8)
 enum_names={'Torappu.Battle.Buff/Event','Torappu.Battle.Entity/Event','Torappu.AbnormalFlag','Torappu.Battle.SideType','Torappu.MotionMask','Torappu.MotionMode','Torappu.BuffData/OverrideType'};enums=[]
 for t in n.types:
  if n.typename(t['index']) not in enum_names:continue
  values=[]
  for f in n.fields(t['index']):
   d=defaults.get(f['index'])
   if not d or d['dataIndex']<0:continue
   raw=n.metadata[constant_start+d['dataIndex']:];head=raw[0]
   if head<0x80:u,used=head,1
   elif head<0xc0:u,used=((head&0x3f)<<8)|raw[1],2
   elif head<0xe0:u,used=((head&0x1f)<<24)|int.from_bytes(raw[1:4],'big'),4
   elif head==0xf0:u,used=int.from_bytes(raw[1:5],'little'),5
   elif head in (0xfe,0xff):u,used=(0xfffffffe if head==0xfe else 0xffffffff),1
   else:raise ValueError(n.typename(t['index'])+'.'+f['name'])
   values.append({'name':f['name'],'value':(u>>1)^-(u&1),'dataIndex':d['dataIndex'],'encoded':raw[:used].hex()})
  enums.append({'type':n.typename(t['index']),'index':t['index'],'values':values})
 types=sorted(set(m['method']['declaringType'] for m in rows));extra=['Torappu.Battle.Entity','Torappu.Battle.AbilityStandard','Torappu.Battle.Abilities.MeleeAttack','Torappu.Battle.Action.Nodes/ApplyDamage','Torappu.Battle.Entity/AbnormalFlag','Torappu.Battle.EntityEventType','Torappu.Battle.BuffEventType','Torappu.Battle.TargetSide','Torappu.Battle.MotionMode','Torappu.Battle.Character/State','Torappu.Battle.Enemy/State']
 fieldrows=[{'index':t['index'],'type':n.typename(t['index']),'fields':[f for f in n.fields(t['index']) if not f['static']]} for t in n.types if t['index'] in types or n.typename(t['index']) in extra]
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':n.provenance(),'selection':{'script':fingerprint(Path(__file__)),'names':sorted(wanted),'missing':sorted(wanted-set(r['method']['fullname'] for r in rows)),'boundary':'Each entry expanded through pdata partitions up to the next registered method address; no unrelated whole-image disassembly.'},'result':{'methods':rows,'fields':fieldrows,'enums':enums}},ensure_ascii=False,indent=2)+'\n');print('methods',len(rows),'missing',sorted(wanted-set(r['method']['fullname'] for r in rows)))
if __name__=='__main__':main()

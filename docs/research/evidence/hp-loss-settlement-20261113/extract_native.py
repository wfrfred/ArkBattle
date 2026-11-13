#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the HP loss formula, skipped reception and setter paths from the installed client."""
import argparse, bisect, json, sys
from pathlib import Path
sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint
PREFIXES = ('Torappu.Battle.Action.Nodes/FixedValueDamage.',
 'Torappu.Battle.Action.Nodes/BleedingDamagePerSec.',
 'Torappu.Battle.Action.Nodes/AdvancedApplyDamage.',
 'Torappu.Battle.Action.Nodes/DamageViaMaxHpRatio.',
 'Torappu.Battle.BattleFormula.CalculateDamage',
 'Torappu.Battle.BattleUtil.CalculateDamageBy',
 'Torappu.Battle.Modifier.',
 'Torappu.Battle.Entity.ApplyModifier',
 'Torappu.Battle.Entity.OnApplyingSkippedModifier',
 'Torappu.Battle.Entity.DoApplyModifier',
 'Torappu.Battle.Character.DoApplyModifier',
 'Torappu.Battle.Enemy.DoApplyModifier',
 'Torappu.Battle.Entity._OnApplyingModifier',
 'Torappu.Battle.Entity.OnTakeDamage',
 'Torappu.Battle.Entity.OnAppliedModifier',
 'Torappu.Battle.Entity.IsUnhurtableWithModifier',
 'Torappu.Battle.Entity.SetHp',
 'Torappu.Battle.Entity.set_hp',
 'Torappu.Battle.Entity.OnBeforeTargetApplyModifier',
 'Torappu.Battle.Buff.OnApplyingSkippedModifier',
 'Torappu.Battle.Buff.OnBeforeTargetApplyModifier',
 'Torappu.Battle.Entity.OnHpZero',
 'Torappu.Battle.Entity.OnFinish',
 'Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnFinalizeEntityDamage',
 'Torappu.Battle.Entity.FinishMe',
 'Torappu.Battle.Buff.OnHpLessThanZero',
 'Torappu.Battle.Buff/BuffContainer.OnApplyingSkippedModifier',
 'Torappu.Battle.Buff/BuffContainer.OnBeforeTargetApplyModifier')
OWNER_NAMES = {'Torappu.Battle.Action.Nodes/FixedValueDamage',
 'Torappu.Battle.Action.Nodes/BleedingDamagePerSec',
 'Torappu.Battle.Action.Nodes/AdvancedApplyDamage',
 'Torappu.Battle.Action.Nodes/DamageViaMaxHpRatio', 'Torappu.Battle.Modifier',
 'Torappu.Battle.Modifier/Damage', 'Torappu.Battle.Entity', 'Torappu.Battle.Buff'}
BODY_NAMES = {'Execute', 'GetValue', 'ApplyModifier', 'OnApplyingSkippedModifier',
 'DoApplyModifier', 'SetHpDirectly', 'SetHpInternal', 'SetHpInternalDirectly',
 'set_hp', 'OnBeforeTargetApplyModifier', 'OnHpZero', 'OnHpLessThanZero', 'OnFinish', 'FinishMe', 'OnFinalizeEntityDamage', 'CalculateDamage', 'PreprocessForProjectile',
 '_OnApplyingModifier', 'OnTakeDamage', 'OnAppliedModifier', 'IsUnhurtableWithModifier', 'NewDamageModifierAfterCalculate'}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
 n=Native(a.game);prov=n.provenance();prov['location']['modules']={'Assembly-CSharp.dll': n.modules['Assembly-CSharp.dll']};prov['caseTool']={'script':fingerprint(Path(__file__)), 'lock':fingerprint(Path(__file__).with_suffix('.py.lock'))}
 methods=[]
 for raw in n.methods:
  name=n.typename(raw['declaringType'])+'.'+n.string(raw['nameIndex'])
  if name.startswith(PREFIXES):methods.append(n.method(raw['index']))
 owners=[{'index':t['index'],'fullname':n.typename(t['index']),'fields':n.fields(t['index'])} for t in n.types if n.typename(t['index']) in OWNER_NAMES]
 bodies=[]
 for m in methods:
  short=m['fullname'].rsplit('.',1)[-1]
  if (short not in BODY_NAMES and not short.startswith('CalculateDamage')) or not m.get('address'):continue
  cursor=m['address'];end=n.addresses[bisect.bisect_right(n.addresses,cursor)];parts=[]
  while cursor<end:
   part=n.disassemble_at(cursor,end-cursor,method=m if cursor==m['address'] else None)
   for ins in part['instructions']:
    if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'))
   parts.append(part);new=int(part['end'],16)
   if new<=cursor:raise RuntimeError('non-progress')
   cursor=new
  bodies.append({'methodIndex':m['index'],'logicalEnd':hex(end),'fragments':parts})
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':prov,'result':{'prefixes':PREFIXES,'methods':methods,'fieldOwners':owners,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'methods':len(methods),'bodies':len(bodies),'fields':len(owners),'out':str(a.out)}))
if __name__=='__main__':main()

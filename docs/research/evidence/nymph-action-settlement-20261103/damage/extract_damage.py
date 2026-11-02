#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Current-input name-selected HP settlement evidence; no client execution."""
import argparse,bisect,importlib.util,json
from pathlib import Path
EXPECTED={'dll':'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff','metadata':'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'}
SELECTORS={
'Torappu.Battle.Entity.ApplyModifier','Torappu.Battle.Entity._OnApplyingModifier','Torappu.Battle.Entity.DoApplyModifier','Torappu.Battle.Entity.OnAppliedModifier',
'Torappu.Battle.Entity.set_hp','Torappu.Battle.Entity.SetHpInternal','Torappu.Battle.Entity.OnHpZero','Torappu.Battle.Unit.OnHpZero','Torappu.Battle.Enemy.OnHpZero','Torappu.Battle.Enemy.SwitchToDeadState','Torappu.Battle.Unit.OnTakeDamage','Torappu.Battle.Entity.OnTakeDamage',
'Torappu.Battle.Entity.OnCalculateDamage','Torappu.Battle.Entity.OnAfterCalculateDamage','Torappu.Battle.Entity.OnBeingCalculateDamage',
'Torappu.Battle.Buff.OnBeforeTargetApplyModifier','Torappu.Battle.Buff.OnAfterOutputDamage',
'Torappu.Battle.Action.Nodes/ApplyElementDamageBasedOnDamageValue.Execute',
'Torappu.Battle.Entity.get_alive','Torappu.Battle.Entity.get_unfinished','Torappu.Battle.Unit.CheckReborn',
'Torappu.Battle.BattleUtil.CalculateDamageBySource','Torappu.Battle.BattleUtil.CalculateDamageByAtkNoSource',
'Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.DestroyEntity',
'Torappu.Battle.Entity.OnFinish','Torappu.Battle.Unit.OnFinish','Torappu.Battle.Enemy.OnFinish',
'Torappu.Battle.Modifier.get_value','Torappu.Battle.Modifier.get_finalDelta',
'Torappu.Battle.BattleFormula.CalculateDamage','Torappu.Battle.Entity.IfReasonIsDeath',
'Torappu.Battle.Entity.RecycleSelfWithDelay','Torappu.Battle.BObject.DestroyMe','Torappu.Battle.BObject.OnRecycle',
'Torappu.Battle.Buff/BuffContainer.Clear','Torappu.Battle.Buff/BuffContainer.OnAppliedModifier',
'Torappu.Battle.Buff/BuffContainer._FinishBuff','Torappu.Battle.Buff.get_isFinishedOrDisabled',
'Torappu.Battle.BattleFormula.CalculateDamageNoEvent','Torappu.Battle.BattleFormula.CalculateDamageInternal','Torappu.Battle.BattleFormula/AttackInfo..ctor','Torappu.Battle.BattleFormula/AttackInfo.GetFinalAtk',
'Torappu.Battle.Modifier.NewDamageModifierAfterCalculate','Torappu.Battle.Buff.MarkFinish',
}
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args()
 tool=Path.cwd()/'.agents/skills/arkbattle-native-research/scripts/native.py';s=importlib.util.spec_from_file_location('ark_native',tool);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);n=m.Native(a.game);prov=n.provenance()
 for k,v in EXPECTED.items():
  if prov['client'][k]['sha256']!=v:raise ValueError('input mismatch '+k)
 slot_methods=[n.method(r['index']) for r in n.methods if n.typename(r['declaringType']) in ('Torappu.Battle.Entity','Torappu.Battle.Unit','Torappu.Battle.Enemy') and r['slot'] in (40,68,111,117,121,123,124,131)]
 for r in slot_methods:SELECTORS.add(r['fullname'])
 methods=[n.method(r['index']) for r in n.methods if n.typename(r['declaringType'])+'.'+n.string(r['nameIndex']) in SELECTORS]
 missing=SELECTORS-{r['fullname'] for r in methods}
 if missing:raise ValueError('missing '+str(missing))
 bodies=[]
 for method in methods:
  cursor=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,cursor)];frags=[]
  while cursor<end:
   b=n.disassemble_at(cursor,end-cursor,method=method if cursor==method['address'] else None)
   for i in b['instructions']:
    if len(i.get('methods',[]))>100:i['methodAliasCount']=len(i.pop('methods'))
   frags.append(b);nxt=int(b['end'],16)
   if nxt<=cursor:raise ValueError('no progress')
   cursor=nxt
  bodies.append({'methodIndex':method['index'],'logicalEnd':hex(end),'boundary':'consecutive pdata fragments up to next known native method','fragments':frags})
 reused=[]
 reuse_sources={
  'docs/research/evidence/attack-addon-order-20261102/hp/native-hp.json':{
   'Torappu.Battle.Entity.ApplyModifier','Torappu.Battle.Entity._OnApplyingModifier','Torappu.Battle.Entity.DoApplyModifier','Torappu.Battle.Entity.OnAppliedModifier','Torappu.Battle.Unit.OnTakeDamage','Torappu.Battle.Action.Nodes/ApplyElementDamageBasedOnDamageValue.Execute','Torappu.Battle.Modifier.get_value'},
  'docs/research/evidence/attack-addon-order-20261102/content/native/event-bodies.json':{'Torappu.Battle.Buff.OnBeforeTargetApplyModifier','Torappu.Battle.Buff.OnAfterOutputDamage'},
 }
 for path,names in reuse_sources.items():
  prior=json.loads(Path(path).read_text());old=prior['result'];validated=[]
  for name in sorted(names):
   current=[r for r in methods if r['fullname']==name]
   if len(current)!=1:raise ValueError('ambiguous current reuse selector '+name)
   method=current[0]
   if isinstance(old,dict):
    om=next(r for r in old['methods'] if r['fullname']==name)
    archived=next(r for r in old['bodies'] if r['methodIndex']==om['index'])['fragments']
   else:
    archived=[r for r in old if r['method']['fullname']==name]
    om=archived[0]['method']
   if method['token']!=om['token'] or method['address']!=om['address']:raise ValueError('reuse identity differs '+name)
   count=0
   for fragment in archived:
    for ins in fragment['instructions']:
     raw=bytes.fromhex(ins['bytes'])
     if n.pe.read(int(ins['address'],16),len(raw))!=raw:raise ValueError('archived instruction differs '+name)
     count+=len(raw)
   validated.append({'fullname':name,'currentMethodIndex':method['index'],'token':method['token'],'address':hex(method['address']),'verifiedInstructionBytes':count,'validation':'All retained archived instruction bytes reread identically from current native input; method identity selected from current metadata.'})
   bodies=[r for r in bodies if r['methodIndex']!=method['index']]
  reused.append({'file':path,'fingerprint':m.fingerprint(Path(path)),'methods':validated})
 prov['caseTool']={'script':m.fingerprint(Path(__file__)),'lock':m.fingerprint(Path(str(Path(__file__))+'.lock'))}
 types=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name in ('Torappu.Battle.Entity','Torappu.Battle.Unit','Torappu.Battle.Enemy','Torappu.Battle.Modifier','Torappu.Battle.BattleFormula/AttackInfo','Torappu.Battle.Buff/BuffContainer'):
   fields=[f for f in n.fields(t['index']) if not f['static'] and (any(k in f['name'].lower() for k in ('hp','finish','alive','state','dead','delay','recycle')) or f['name'] in ('m_value','realDelta')) or (not f['static'] and name in ('Torappu.Battle.Modifier','Torappu.Battle.BattleFormula/AttackInfo','Torappu.Battle.Buff/BuffContainer'))]
   types.append({'index':t['index'],'fullname':name,'parent':n.type_name(t['parentIndex']),'fields':fields})
 result={'selectors':sorted(SELECTORS),'methods':methods,'bodies':bodies,'selectedSlots':slot_methods,'selectedFields':types,'reusedEvidence':reused}
 a.out.parent.mkdir(parents=True,exist_ok=True)
 a.out.write_text(json.dumps({'provenance':prov,'result':result},indent=2)+'\n');print(json.dumps([{'index':r['index'],'fullname':r['fullname'],'address':hex(r['address'])} for r in methods]))
if __name__=='__main__':main()

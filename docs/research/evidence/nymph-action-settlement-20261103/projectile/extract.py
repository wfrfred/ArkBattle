#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Re-extract the selected ordinary Nymph S1 projectile chain from current inputs."""
import argparse, bisect, datetime, importlib.util, json, re, sys
from pathlib import Path
sys.dont_write_bytecode = True
TOOLS = Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0,str(TOOLS))
from native import Native, fingerprint
EXPECTED={'dll':'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff','metadata':'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'}
SELECTORS={
'Torappu.Battle.Projectile._InitInline',
'Torappu.Battle.Projectile.Init',
'Torappu.Battle.Projectile.get_source',
'Torappu.Battle.Projectile.get_traceTarget',
'Torappu.Battle.Projectile.OnTick',
'Torappu.Battle.Projectile.OnProjectileReached',
'Torappu.Battle.Projectile.DealProjectileReached',
'Torappu.Battle.Projectile.DealHitTarget',
'Torappu.Battle.Projectile.OnHitTarget',
'Torappu.Battle.Projectile.OnBehavioursHitTarget',
'Torappu.Battle.Projectile.OnProjectileStop',
'Torappu.Battle.Projectile.StopMe',
'Torappu.Battle.Projectile._DealHitTraceTarget',
'Torappu.Battle.Projectile/ActionController.Init',
'Torappu.Battle.Projectile/ActionController.OnHitTarget',
'Torappu.Battle.Projectile/ActionController._RunActions',
'Torappu.Battle.Projectile/ActionController._AttachBuffs',
'Torappu.Battle.Action.Nodes/ApplyDamage.PreprocessForProjectile',
'Torappu.Battle.Action.Nodes/ApplyDamage.CreateDamageModifier',
'Torappu.Battle.Action.Nodes/ApplyDamage.Execute',
'Torappu.Battle.Abilities.RangedAttack.GetProjectileActions',
'Torappu.Battle.Abilities.RangedAttack.NewDamageNode',
'Torappu.Battle.Abilities.RangedAttack.CreateProjectile',
'Torappu.Battle.BasicMovement.GetTraceTargetMapPosition',
 'Torappu.Battle.BasicMovement.DealReached',
'Torappu.Battle.BasicMovement.Init',
'Torappu.Battle.BasicMovement.OnInit',
'Torappu.Battle.BasicMovement.OnTick',
'Torappu.Battle.BasicMovement.DoCheckReachedInternal',
'Torappu.Battle.BasicMovement.CheckReached',
'Torappu.Battle.Projectile/Behaviour.Reached',
'Torappu.Battle.Projectile/Behaviour.Stop',
'Torappu.Battle.Projectiles.AdvancedMovement.Init',
'Torappu.Battle.Projectiles.AdvancedMovement.OnInit',
'Torappu.Battle.Projectiles.AdvancedMovement.OnTick',
'Torappu.Battle.Projectiles.AdvancedMovement.DoCheckReached',
'Torappu.Battle.Projectiles.AdvancedMovement.DoCheckReachedInternal',
'Torappu.Battle.Projectiles.AdvancedMovement._UpdateAfterReach',
'Torappu.Battle.SimpleProjectile.get_alwaysHitTraceTargetInTheEnd',
'Torappu.Battle.SimpleProjectile.get_alwaysHitTraceTargetWhenReached',
'Torappu.Battle.SimpleProjectile.get_stopAfterMaxHit',
'Torappu.Battle.Ability.PreprocessActionsForProjectile',
'Torappu.Battle.Ability.GetAbilityAttachments',
'Torappu.Battle.Entity.GetAbilityAttachments',
'Torappu.Battle.AbilityAttachment.Apply',
'Torappu.Battle.Projectile.SetTraceTarget',
'Torappu.Battle.BattleController.CreateProjectile',
'Torappu.Battle.Abilities.AbstractAnimatedAbility.NewDamageNode',
'Torappu.Battle.Projectile.CheckTargetAlreadyHitAndUpdate',
'Torappu.Battle.Projectile.UpdateAlreadyHit',
'Torappu.Battle.Projectile/ActionController.RegisterActions',
'Torappu.Battle.Ability.GetActiveBuffs',
'Torappu.Battle.Abilities.AbstractAnimatedAbility.GetActiveBuffs',

}
FIELD_OWNERS={
'Torappu.Battle.Projectile','Torappu.Battle.Projectile/ActionController','Torappu.Battle.SimpleProjectile',
'Torappu.Battle.BasicMovement','Torappu.Battle.Projectiles.AdvancedMovement','Torappu.Battle.Abilities.RangedAttack','Torappu.Battle.Action.Nodes/ApplyDamage',
}
REUSED_EVIDENCE={
 'Torappu.Battle.Projectile/ActionController.Init':'docs/research/evidence/attack-addon-order-20261102/content/native/projectile-active-buffs.json',
 'Torappu.Battle.Projectile/ActionController._AttachBuffs':'docs/research/evidence/attack-addon-order-20261102/content/native/projectile-active-buffs.json',
 'Torappu.Battle.Projectile/ActionController.OnHitTarget':'docs/research/evidence/attack-addon-order-20261102/hp/native-hp.json',
 'Torappu.Battle.Abilities.AbstractAnimatedAbility.GetActiveBuffs':'docs/research/evidence/attack-addon-order-20261102/content/native/ability-active-buffs.json',
}
# Extra callable entries are selected from this batch's direct call operands;
# names are deliberately not invented for generated generic helpers.
FOLLOW_ADDRESSES={
 0x1853ae540:'Projectile.get_source / get_traceTarget generated reference retrieval target',
 0x184683e30:'Projectile._DealHitTraceTarget generated reference validity predicate',
 0x1805f9010:'Ability.PreprocessActionsForProjectile generated node interface dispatch',
 0x180047460:'ApplyDamage.Execute generated virtual-slot-9 dispatch',
 0x1800cc640:'5-byte unconditional reference-validity thunk; immediate jump is entire stub',
 0x1853ae780:'Generated stored reference validity test reached through unconditional thunk',
}
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);p.add_argument('--extra',action='append',default=[]);a=p.parse_args()
 n=Native(a.game); prov=n.provenance()
 for k,v in EXPECTED.items():
  if prov['client'][k]['sha256']!=v:raise ValueError(f'{k} fingerprint mismatch')
 prov['location']['modules']={'Assembly-CSharp.dll':n.modules['Assembly-CSharp.dll']};prov['extraction']={'date':datetime.date.today().isoformat(),'script':fingerprint(Path(__file__)),'lock':fingerprint(Path(str(Path(__file__))+'.lock'))}
 selectors=SELECTORS|set(a.extra); methods=[]
 for r in n.methods:
  owner=n.typename(r['declaringType']); fullname=owner+'.'+n.string(r['nameIndex'])
  if fullname in selectors:methods.append(n.method(r['index']))
 missing=selectors-{m['fullname'] for m in methods}
 if missing:print('missing',sorted(missing),flush=True)
 bodies=[]
 for m in methods:
  if not m['address'] or m['fullname'] in REUSED_EVIDENCE:continue
  if m['fullname']=='Torappu.Battle.Projectile.Init' and m['parameters'][1]['name']!='start':continue
  cursor=m['address']; end=n.addresses[bisect.bisect_right(n.addresses,cursor)];parts=[]
  while cursor<end:
   body=n.disassemble_at(cursor,end-cursor,method=m if cursor==m['address'] else None)
   for row in body['instructions']:
    if len(row.get('methods',[]))>100:row['methodAliasCount']=len(row.pop('methods'))
   parts.append(body); nxt=int(body['end'],16)
   if nxt<=cursor:raise RuntimeError('no advance')
   cursor=nxt
  bodies.append({'methodIndex':m['index'],'logicalEnd':hex(end),'fragments':parts})
 fields=[]
 for t in n.types:
  if n.typename(t['index']) in FIELD_OWNERS:fields.append({'name':n.typename(t['index']),'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['static']]})
 a.out.mkdir(parents=True,exist_ok=True)
 for b in bodies:
  m=next(m for m in methods if m['index']==b['methodIndex'])
  asm='\n'.join(row['address']+' '+row['mnemonic']+' '+row['operands']+' ;'+','.join(row.get('methods',[])) for part in b['fragments'] for row in part['instructions'])
  (a.out/f"method-{m['index']}.asm").write_text(m['fullname']+'\n'+asm+'\n')
 extra_bodies=[]
 for address,origin in FOLLOW_ADDRESSES.items():
  b=n.disassemble_at(address,max_bytes=5 if address==0x1800cc640 else None)
  for row in b['instructions']:
   if len(row.get('methods',[]))>100:row['methodAliasCount']=len(row.pop('methods'))
  extra_bodies.append({'origin':origin,'fragment':b})
  asm='\n'.join(row['address']+' '+row['mnemonic']+' '+row['operands']+' ;'+','.join(row.get('methods',[])) for row in b['instructions'])
  (a.out/f'entry-{address:x}.asm').write_text(origin+'\n'+asm+'\n')
 tables=[]
 for b in bodies:
  m=next(m for m in methods if m['index']==b['methodIndex'])
  if m['fullname'] not in ['Torappu.Battle.Projectiles.AdvancedMovement.OnTick','Torappu.Battle.Projectiles.AdvancedMovement.OnInit']:continue
  for part in b['fragments']:
   for row in part['instructions']:
    match=re.fullmatch(r'(?:eax|ecx), dword ptr \[rdx \+ rax\*4 \+ (0x[0-9a-f]+)\]',row['operands'])
    if not match or any(t['method']==m['fullname'] for t in tables):continue
    address=n.pe.base+int(match[1],16);values=n.pe.unpack('<9i',address)
    tables.append({'method':m['fullname'],'loadInstruction':row,'address':hex(address),'format':'<9i','moveType1Target':hex(n.pe.base+values[0]),'values':list(values),'bytes':n.pe.read(address,36).hex()})
 reused={k:{'evidence':v,'file':fingerprint(Path(v))} for k,v in REUSED_EVIDENCE.items()}
 (a.out/'native.json').write_text(json.dumps({'provenance':prov,'result':{'selectors':sorted(selectors),'missing':sorted(missing),'methods':methods,'bodies':bodies,'fields':fields,'additionalBodies':extra_bodies,'jumpTables':tables,'reusedEvidence':reused}},indent=2)+'\n')
 for m in methods:print(m['index'],m['fullname'],hex(m['address']),flush=True)
if __name__=='__main__':main()

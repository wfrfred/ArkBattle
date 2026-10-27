import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native(); out=Path('/tmp/stronghold-blocking-timing-native-20261023/immediate')
queries=['Torappu.Battle.Projectile.','HarpoonProjectile','NetCatcherProjectile','PullHitTargetBehaviour','CharSearchBlockeeImmediate','Character._SearchBlockee','Character.OnBlockModeChanged','Character.OnAttributeDirty','Enemy.States.UnbalanceState.OnAfterPhysicSimulate','Torappu.Battle.BObject.OnFixedUpdate','Torappu.Battle.BObject.OnTick','Torappu.Battle.BObject.OnLateFixedUpdate']
res={q:[dict(m,fullname=n.fullname(m),parameters=n.parameters(m)) for m in n.method(q)] for q in queries}
(out/'methods.json').write_text(json.dumps(res,ensure_ascii=False,indent=2))
for idx in [71113,71246,86413,99962,75955,76016,75970,76035,76753,71078]:
 m=n.method(idx); (out/f'{idx}.asm').write_text(n.dis(m))
print('\n'.join(f"{q}\n"+'\n'.join(f"{m['index']} {m['fullname']} {m.get('address',0):#x} slot={m['slot']}" for m in ms) for q,ms in res.items()))

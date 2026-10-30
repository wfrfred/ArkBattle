import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();p=Path('/tmp/stronghold-blocking-timing-native-20261023/immediate')
for idx in [71344,71361,71373,71366,71422,71423,71399,71254,71248,71125,71269,71275,86411,86422]:
 m=n.method(idx);(p/f'{idx}.asm').write_text(n.dis(m))
for text in ['Torappu.Battle.Projectile','Torappu.Battle.BObject','Torappu.Battle.ObjectManager','Torappu.Battle.NetCatcherProjectile','Torappu.Battle.Projectiles.PullHitTargetBehaviour','Torappu.Battle.Action.Nodes.CharSearchBlockeeImmediate']:
 t=next(t for t in n.types if n.typename(t['index'])==text)
 (p/f"{t['name']}.fields.json").write_text(json.dumps(dict(type=t,fields=n.fields(t)),ensure_ascii=False,indent=2))

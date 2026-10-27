import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();p=Path('/tmp/stronghold-blocking-timing-native-20261023/immediate')
for idx in [64230,64743,76440,71178,77291,77301]:
 m=n.method(idx);(p/f'{idx}.asm').write_text(n.dis(m))
cs=n.method(64230)['type'];t=n.types[cs]
(p/'CoroutineSimulator.methods.json').write_text(json.dumps([dict(m,fullname=n.fullname(m),params=n.parameters(m)) for m in n.methods if m['type']==cs],ensure_ascii=False,indent=2))
print([(m['index'],n.fullname(m),hex(m.get('address',0))) for m in n.methods if m['type']==cs])

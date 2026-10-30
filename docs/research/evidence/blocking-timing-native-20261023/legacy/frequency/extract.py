import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();out=Path('/tmp/stronghold-blocking-timing-native-20261023/frequency')
ids=[25959,25960,25961,25962,25963,25964,77203,77205,75955,76016,76022,76531]
for i in ids:
 m=n.method(i);print(i,n.fullname(m),hex(m.get('address',0)),n.parameters(m))
 (out/f'{i}.asm').write_text(n.dis(i))
 (out/f'{i}.json').write_text(json.dumps(dict(m,fullname=n.fullname(m),parameters=n.parameters(m)),ensure_ascii=False,indent=2))
for tn in ('Torappu.PeriodicTicker','Torappu.Battle.BlockManager'):
 t=next(t for t in n.types if n.typename(t['index'])==tn)
 (out/f'{t["name"]}.json').write_text(json.dumps(dict(type=t,fields=n.fields(t),methods=[dict(m,fullname=n.fullname(m),address=hex(m.get('address',0))) for m in n.methods[t['methodStart']:t['methodStart']+t['methodCount']]]),ensure_ascii=False,indent=2))
for term in ['SearchBlockee','SearchBlock','BlockManager','PeriodicTicker']:
 print(term)
 for m in n.method(term):print(m['index'],n.fullname(m),hex(m.get('address',0)))

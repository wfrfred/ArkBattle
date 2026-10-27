import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();out=Path('/tmp/stronghold-blocking-timing-native-20261023/frequency')
for tn in ('Torappu.Battle.PropLikeStaticBlockToken','Torappu.Battle.IBlocker','Torappu.Battle.Character'):
 t=next(t for t in n.types if n.typename(t['index'])==tn)
 fields=n.fields(t)
 (out/f'{t["name"]}-metadata.json').write_text(json.dumps(dict(type=t,fields=fields,methods=[dict(m,fullname=n.fullname(m),parameters=n.parameters(m),address=hex(m.get('address',0))) for m in n.methods[t['methodStart']:t['methodStart']+t['methodCount']]]),ensure_ascii=False,indent=2))
 print(tn)
 for f in fields:
  if tn.endswith('PropLikeStaticBlockToken') or 'block' in f['name'].lower():print(f)

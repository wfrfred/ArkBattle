import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();p=Path('/tmp/stronghold-blocking-timing-native-20261023/immediate')
character=n.method(75955)['type'];hits=[]
for m in n.methods:
 if m['type']==character and m.get('address'):
  s=n.dis(m)
  if '+ 0x1000]' in s or 'SearchBlockee' in '\n'.join(s.splitlines()[1:]):
   (p/f"{m['index']}.asm").write_text(s);hits.append(dict(index=m['index'],fullname=n.fullname(m),addresses=[l for l in s.splitlines() if '+ 0x1000]' in l or 'SearchBlockee' in l]))
(p/'virtual-search-sites.json').write_text(json.dumps(hits,indent=2));print(json.dumps(hits,indent=2))
print([(m['index'],n.fullname(m),hex(m.get('address',0))) for m in n.method('_SearchBlockee')])

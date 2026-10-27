import sys,json,struct,bisect
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();out=Path('/tmp/stronghold-blocking-timing-native-20261023/frequency')
ids=[77190,77204,77291,77301,76559,71113,71246,86413,99962,77188,77202]
for i in ids:
 m=n.method(i);print(i,n.fullname(m),hex(m.get('address',0)))
 (out/f'{i}.asm').write_text(n.dis(i))
 (out/f'{i}.json').write_text(json.dumps(dict(m,fullname=n.fullname(m),parameters=n.parameters(m)),ensure_ascii=False,indent=2))
ids=[75955,76016,77190,77203,77204]
dest={n.method(i)['address']:i for i in ids};starts=sorted(n.addr_methods);found=[]
for sn,sv,ss,sr,sz in n.sections:
 if sn not in ['.text','il2cpp']:continue
 for op in [0xe8,0xe9]:
  p=sr
  while True:
   p=n.b.find(bytes([op]),p,sr+sz-4)
   if p<0:break
   va=n.va(p);dst=va+5+struct.unpack_from('<i',n.b,p+1)[0]
   if dst in dest:
    start=starts[bisect.bisect_right(starts,va)-1];ms=n.addr_methods[start]
    found.append(dict(at=hex(va),target=dest[dst],op='call' if op==0xe8 else 'jmp',owners=[dict(index=m['index'],name=n.fullname(m),start=hex(start),offset=hex(va-start)) for m in ms]))
   p+=1
(out/'xrefs.json').write_text(json.dumps(found,indent=2))
for x in found: print(x['at'],x['op'],x['target'],' | '.join(f"{m['index']} {m['name']} +{m['offset']}" for m in x['owners'][:2]))

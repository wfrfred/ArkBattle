exec(open('/tmp/stronghold-blocking-native-20261023/modes/research.py').read().split('queries=')[0])
import struct,bisect
ids=[75968,75969,75970,70632,76018,76430,70673,77168,77169]
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

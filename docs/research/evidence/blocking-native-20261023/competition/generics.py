import sys,struct
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();o=Path('/tmp/stronghold-blocking-native-20261023/competition')
def tp(p):
 data,bits=struct.unpack('<QI',n.read(p,12));kind=bits>>16&255
 if kind in (17,18):return n.typename(data)
 if kind==21:
  typ,inst,mi=struct.unpack('<QQQ',n.read(data,24));num=n.u32(inst);arr=n.u64(inst+8)
  return tp(typ)+'<'+', '.join(tp(n.u64(arr+j*8)) for j in range(num))+'>'
 return n.typeinfo(next((j for j in range(n.u64(n.metadata_registration+48)) if n.u64(n.type_ptrs+j*8)==p),0))['name'] if kind not in (30,19) else 'T'+str(data)
for idx in (27168,27170,22133):
 p=n.u64(n.type_ptrs+idx*8);print(idx,tp(p))
ms=n.u64(n.metadata_registration+72)
for j in (280704,280705,280707,280708,284585,293297,270124,280718,280719):
 a,b,c=struct.unpack('<iii',n.read(ms+j*12,12));m=n.method(a);print(j,a,n.fullname(m),b,c)
 #genericinst ptrs
 for v in (b,c):
  if v>=0:
   inst=n.u64(n.u64(n.metadata_registration+24)+v*8);num=n.u32(inst);arr=n.u64(inst+8);print('args',num,[tp(n.u64(arr+k*8)) for k in range(num)])
# raw custom generic funcs
for name,addr,size in [('weightqueue_clear',0x1851b0a00,0x100),('weightqueue_add',0x1851afeb0,0x180),('weightqueue_get',0x1851b36f0,0x120),('weightqueue_count',0x1848dd0d0,0x20),('generic_filter',0x184511e30,0x500)]:
 fake=dict(index=-1,address=addr,type=11149,name=name,token=0)
 (o/(name+'.asm')).write_text(n.dis(fake,size))

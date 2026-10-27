# Narrow evidence reader for installed UnityFS/SerializedFile v22 resources.
# LZ4AK token/offset conversion is adapted from tools/local-extract/aklz4.py.
# Its algorithm is BSD-3-Clause, Copyright (c) 2022 Harry Huang (isHarryh/Ark-Unpacker).
# See tools/local-extract/LICENSE-Ark-Unpacker.txt. Uses system liblz4 via ctypes.
import struct,ctypes,ctypes.util,lzma,json,pathlib,sys
lib=ctypes.CDLL(ctypes.util.find_library('lz4'));dec=lib.LZ4_decompress_safe;dec.argtypes=[ctypes.c_char_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_int];dec.restype=ctypes.c_int
class Reader:
 def __init__(self,b,endian='<',p=0):self.b=b;self.e=endian;self.p=p
 def read(self,n):b=self.b[self.p:self.p+n];self.p+=n;return b
 def val(self,f):s=struct.calcsize(f);v=struct.unpack(self.e+f,self.read(s));return v[0] if len(v)==1 else v
 def cs(self):z=self.b.index(0,self.p);v=self.b[self.p:z].decode(errors='replace');self.p=z+1;return v
 def align(self,a=4):self.p=(self.p+a-1)//a*a
 def string(self):s=self.read(self.val('i')).decode(errors='replace');self.align();return s

def decompress(d,size,typ):
 if typ==0:return d
 if typ==1:return lzma.decompress(d)
 if typ==4:
  d=bytearray(d);p=op=0
  while p<len(d):
   lit=d[p]&15;mat=d[p]>>4;d[p]=(lit<<4)|mat;p+=1
   if lit==15:
    while True:
     x=d[p];p+=1;lit+=x
     if x!=255:break
   p+=lit;op+=lit
   if op>=size:break
   d[p],d[p+1]=d[p+1],d[p];p+=2
   if mat==15:
    while True:
     x=d[p];p+=1;mat+=x
     if x!=255:break
   op+=mat+4
  d=bytes(d)
 dest=ctypes.create_string_buffer(size);out=dec(d,dest,len(d),size)
 if out!=size:raise ValueError(('decompress',typ,size,out))
 return dest.raw

def bundle(path):
 b=pathlib.Path(path).read_bytes();r=Reader(b,'>');assert r.cs()=='UnityFS';v=r.val('I');uv=r.cs();rev=r.cs();fs=r.val('Q');cs=r.val('I');us=r.val('I');fl=r.val('I')
 if v>=7:r.align(16)
 data_start=r.p
 if fl&128:r.p=len(b)-cs
 bi=Reader(decompress(r.read(cs),us,fl&63),'>');bi.read(16);blocks=[bi.val('IIH') for _ in range(bi.val('I'))];nodes=[(bi.val('QQI'),bi.cs()) for _ in range(bi.val('I'))]
 r.p=data_start if fl&128 else r.p
 if fl&512:r.align(16)
 raw=b''.join(decompress(r.read(c),u,f&63) for u,c,f in blocks)
 return [(name,raw[o:o+s]) for (o,s,f),name in nodes],uv

def serialized(b):
 r=Reader(b,'>');ms,fs,v,do=r.val('IIII');en=r.val('B');r.read(3)
 if v>=22:ms=r.val('I');fs,do,unk=r.val('QQQ')
 r.e='>' if en else '<';uv=r.cs();plat=r.val('i');trees=r.val('B');types=[]
 for j in range(r.val('i')):
  cl=r.val('i');strip=r.val('B') if v>=16 else 0;si=r.val('h') if v>=17 else -1
  scriptid=r.read(16) if (v<16 and cl<0 or v>=16 and cl==114) else None
  old=r.read(16)
  if trees:
   nn,ns=r.val('ii');r.read(nn*(32 if v>=19 else 24));r.read(ns)
  if v>=21:r.read(r.val('i')*4)
  types.append(dict(classid=cl,scriptTypeIndex=si,scriptid=scriptid.hex() if scriptid else None))
 if 7<=v<14:r.val('i')
 objects=[]
 for i in range(r.val('i')):
  r.align();pid=r.val('q');st=r.val('q') if v>=22 else r.val('I');sz=r.val('I');ti=r.val('i')
  if v<16:r.read(2)
  if v<11:r.read(2)
  elif v<17:r.read(2)
  if v in (15,16):r.read(1)
  objects.append(dict(id=pid,start=do+st,size=sz,typeid=ti,**types[ti]))
 return dict(version=v,uv=uv,types=types,objects=objects,data=b)

def script(obj,b):
 r=Reader(b,'<',obj['start']);name=r.string();order=r.val('i');props=r.read(16);cl=r.string();ns=r.string();asm=r.string();return dict(id=str(obj['id']),name=name,cl=cl,ns=ns,asm=asm)
if __name__=='__main__':
 p=sys.argv[1];files,uv=bundle(p);print(uv,[(n,len(d)) for n,d in files])
 for name,b in files:
  try:s=serialized(b)
  except Exception as e:print(name,e);continue
  print(name,s['version'],len(s['types']),len(s['objects']))
  for obj in s['objects']:
   if obj['classid']==115:
    t=script(obj,b)
    if 'MoveController' in t['cl']:print(t)

#!/usr/bin/env python3
"""Read selected metadata-only struct/interface declarations without PE scanning."""
import argparse,hashlib,json,struct
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--metadata',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'));p.add_argument('--out',type=Path,required=True);a=p.parse_args()
b=a.metadata.read_bytes();assert struct.unpack_from('<II',b)==(0xfab11baf,29)
def table(i):return struct.unpack_from('<II',b,8+i*8)
def rec(i,fmt,names):
 start,size=table(i);return [dict(zip(names.split(),r),index=j) for j,r in enumerate(struct.iter_unpack(fmt,b[start:start+size]))]
base,_=table(2)
def string(i):return b[base+i:b.index(0,base+i)].decode()
ts=rec(19,'<17i8H2I','name namespace byval declaring parent element generic flags fieldStart methodStart eventStart propertyStart nestedStart interfaceStart vtableStart interfaceOffsetsStart reserved methodCount propertyCount fieldCount eventCount nestedCount vtableCount interfacesCount interfaceOffsetsCount bitfield token')
byval={t['byval']:t for t in ts}
def name(t):return (name(byval[t['declaring']])+'/' if t['declaring']>=0 else (string(t['namespace'])+'.' if string(t['namespace']) else ''))+string(t['name'])
fs=rec(11,'<iiI','name typeIndex token');ms=rec(5,'<5iI4H','name declaringType returnType parameterStart generic token flags iflags slot parameterCount')
rows=[]
for t in ts:
 n=name(t)
 if n!='Torappu.CharacterData/PowerData' and not (n.startswith('Torappu.') and ('Undefinable' in n or 'IUndefinable' in n)):continue
 rows.append({'fullname':n,'index':t['index'],'fields':[{**f,'name':string(f['name'])} for f in fs[max(0,t['fieldStart']):max(0,t['fieldStart'])+t['fieldCount']]],'methods':[{**m,'name':string(m['name'])} for m in ms[max(0,t['methodStart']):max(0,t['methodStart'])+t['methodCount']]]})
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':{'metadata':{'path':str(a.metadata),'sha256':hashlib.sha256(b).hexdigest()},'script':{'path':str(Path(__file__)),'sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},'scope':'Metadata field order and accessor names only; no runtime field offsets inferred.'},'result':rows},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'owners':len(rows),'out':str(a.out)}))

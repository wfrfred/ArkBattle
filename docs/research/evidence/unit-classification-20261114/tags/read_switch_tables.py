#!/usr/bin/env python3
"""Read the two switch tables embedded after method #65762; no disassembly."""
import argparse,hashlib,json,struct
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--dll',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/GameAssembly.dll'));p.add_argument('--out',type=Path,required=True);a=p.parse_args()
b=a.dll.read_bytes();nt=struct.unpack_from('<I',b,0x3c)[0];num=struct.unpack_from('<H',b,nt+6)[0];sz=struct.unpack_from('<H',b,nt+20)[0]
sections=[]
for j in range(num):
 o=nt+24+sz+j*40;vsz,rva,rawsz,off=struct.unpack_from('<IIII',b,o+8);sections.append((rva,max(vsz,rawsz),off))
def read(rva,size):
 for start,span,off in sections:
  if start<=rva and rva+size<=start+span:return b[off+rva-start:off+rva-start+size]
 raise ValueError(hex(rva))
rows=[]
for rva,targets,maprva,load,branch in [(0x66c568,2,0x66c570,'0x18066c158/0x18066c161','0x18066c16c'),(0x66c58c,3,0x66c598,'0x18066c408/0x18066c411','0x18066c41c')]:
 raw=read(rva,targets*4+27)
 rows.append({'tableRva':hex(rva),'targetRvas':[hex(x) for x in struct.unpack_from('<'+'I'*targets,raw)],'mapRva':hex(maprva),'map27':list(read(maprva,27)),'rawHex':raw.hex(),'loads':load,'indirectBranch':branch})
a.out.write_text(json.dumps({'provenance':{'dll':{'path':str(a.dll),'sha256':hashlib.sha256(b).hexdigest()},'script':{'path':str(Path(__file__)),'sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},'scope':'Exact switch data referenced by decoded code in group-tag-timing.json method #65762.'},'result':rows},indent=2)+'\n')

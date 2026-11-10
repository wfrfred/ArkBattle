#!/usr/bin/env python3
"""Decode selected static IL2CPP string/type usages that form Buff override keys."""
import argparse,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import PE,DEFAULT_GAME,fingerprint
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--game',type=Path,default=DEFAULT_GAME)
p.add_argument('--native',type=Path,default=Path(__file__).parent/'native/metadata.json')
p.add_argument('--out',type=Path,required=True)
a=p.parse_args();pe=PE(a.game/'GameAssembly.dll');mp=a.game/'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat';metadata=mp.read_bytes()
prior=json.loads(a.native.read_text())['provenance']
for key,path in [('dll',pe.path),('metadata',mp)]:
 if fingerprint(path)['sha256']!=prior['client'][key]['sha256']:raise ValueError('input fingerprint changed')
records,size,data,data_size=struct.unpack_from('<4I',metadata,8)
strings,_=struct.unpack_from('<II',metadata,8+2*8)
types,type_size=struct.unpack_from('<II',metadata,8+19*8)
registration=int(prior['location']['metadataRegistration'],16)
type_count,type_pointers=pe.unpack('<QQ',registration+48)
def type_name(index):
 name,namespace,byval,declaring=struct.unpack_from('<4i',metadata,types+index*92)
 def string(at):
  start=strings+at
  return metadata[start:metadata.index(0,start)].decode('utf-8')
 return type_name(declaring)+'/'+string(name) if declaring>=0 else '.'.join(part for part in [string(namespace),string(name)] if part)
rows=[]
for instruction,va in [('0x1806d6adf',0x188c43208),('0x1806d6ae9',0x188bedf40),('0x1806d6b4f',0x188bedf40)]:
 encoded=pe.unpack('<Q',va)[0]
 if encoded>>29!=5 or not encoded&1:raise ValueError('expected string literal usage')
 index=(encoded&0x1fffffff)>>1
 if index*8>=size:raise ValueError('literal index outside table')
 length,offset=struct.unpack_from('<II',metadata,records+index*8)
 if offset+length>data_size:raise ValueError('literal outside data')
 text=metadata[data+offset:data+offset+length].decode('utf-8')
 rows.append({'instruction':instruction,'slot':hex(va),'encodedUsage':hex(encoded),'literalIndex':index,'value':text})
for instruction,va in [('0x1806d6a5b',0x188bd7620),('0x18237ae60',0x188bebdb8)]:
 encoded=pe.unpack('<Q',va)[0]
 if encoded>>29!=1 or not encoded&1:raise ValueError('expected TypeInfo usage')
 index=(encoded&0x1fffffff)>>1
 if index>=type_count:raise ValueError('type index outside registration')
 pointer=pe.unpack('<Q',type_pointers+8*index)[0]
 class_index,bits=pe.unpack('<QI',pointer)
 kind=bits>>16&255
 name='System.String' if kind==14 else type_name(class_index) if kind in (17,18) else f'unresolved kind={kind}'
 rows.append({'instruction':instruction,'slot':hex(va),'encodedUsage':hex(encoded),'typeIndex':index,'value':name})
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps({'provenance':{'script':fingerprint(Path(__file__)),'dll':fingerprint(pe.path),'metadata':fingerprint(mp),'registration':hex(registration),'scope':'Five selected RIP references in Buff.Reset/GetOverrideKey; static encoded kind-5 string and kind-1 TypeInfo usages, not runtime heap data.'},'result':rows},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(rows,ensure_ascii=False))

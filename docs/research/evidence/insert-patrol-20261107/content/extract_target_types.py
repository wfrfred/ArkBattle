#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the native type/enum contract used by the archived dyjsww global aura."""
import argparse
import importlib.util
import json
import struct
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("--game",type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
p.add_argument("--out",type=Path,required=True)
a=p.parse_args()
tool=Path('.agents/skills/arkbattle-native-research/scripts/native.py')
s=importlib.util.spec_from_file_location('native',tool);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
n=m.Native(a.game)
defs={r['fieldIndex']:r for r in n.records(7,'<iii','fieldIndex typeIndex dataIndex')}
data,size=n.table(8)
names={'Torappu.Battle.Abilities.GlobalAuraAbility','Torappu.Battle.TargetValidator'}
names.update(n.typename(t['index']) for t in n.types if t['name']=='TargetOptions')
rows=[]
def compressed_int(offset):
 b=n.metadata[data+offset:];h=b[0]
 if h<0x80:u=h;used=1
 elif h<0xc0:u=((h&0x3f)<<8)|b[1];used=2
 elif h<0xe0:u=((h&0x1f)<<24)|(b[1]<<16)|(b[2]<<8)|b[3];used=4
 elif h==0xf0:u=int.from_bytes(b[1:5],'little');used=5
 elif h==0xfe:u=0xfffffffe;used=1
 elif h==0xff:u=0xffffffff;used=1
 else:raise ValueError('invalid compressed integer')
 return ((u>>1) if not(u&1) else -(u>>1)-1),b[:used].hex()
for _ in range(3):
 for t in n.types:
  name=n.typename(t['index'])
  if name not in names or any(r['fullname']==name for r in rows):continue
  fields=n.fields(t['index'])
  for f in fields:
   if f['name'] in ['_selfOption','_targetOptions','targetSide','targetMotion','targetCategory']:
    names.add(f['typeName'])
  constants=[]
  for f in fields:
   d=defs.get(f['index'])
   if d is not None and d['dataIndex']>=0:
    value,raw=compressed_int(d['dataIndex'])
    constants.append({'field':f['name'],'fieldIndex':f['index'],'dataIndex':d['dataIndex'],'encodedBytes':raw,'int32':value,'encoding':'IL2CPP v29 compressed signed integer'})
  rows.append({'fullname':name,'index':t['index'],'fields':fields,'constants':constants,'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]})
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps({'provenance':{**n.provenance(),'queryScript':m.fingerprint(Path(__file__))},'result':rows},ensure_ascii=False,indent=2)+'\n')
for r in rows:
 print(r['fullname'],[(x['field'],x['int32']) for x in r['constants']])
 if r['fullname'].endswith('GlobalAuraAbility'):
  print('METHODS',[x['fullname'] for x in r['methods']])

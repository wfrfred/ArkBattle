import argparse,bisect,importlib.util,json,struct
from pathlib import Path
s=importlib.util.spec_from_file_location('native','.agents/skills/arkbattle-native-research/scripts/native.py')
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
parser=argparse.ArgumentParser(description='Find bounded RIP-relative references to the selected CheckpointData TypeInfo slot')
parser.add_argument('--game',type=Path,default=m.DEFAULT_GAME)
parser.add_argument('--out',type=Path,default=Path('.cache/native-research/checkpoint-nondefault-20261107/runtime/checkpoint-typeinfo-refs.json'))
args=parser.parse_args()
n=m.Native(args.game);target=0x188bbcc08;hits=[]
for sec in n.pe.sections:
 if not sec['executable']:continue
 data=n.pe.data[sec['offset']:sec['offset']+sec['raw_size']]
 for opcode in (b'\x48\x8b',b'\x48\x8d'):
  pos=0
  while (pos:=data.find(opcode,pos))>=0:
   p=pos;pos+=1
   if p+7>len(data) or data[p+2]&0xc7!=5:continue
   va=sec['address']+p
   if va+7+struct.unpack_from('<i',data,p+3)[0]!=target:continue
   k=bisect.bisect_right(n.addresses,va)-1
   nearest=n.addresses[k]
   aliases=[n.method(x) for x in n.address_methods.get(nearest,[])]
   hits.append({'address':hex(va),'bytes':data[p:p+7].hex(),'target':hex(target),'nearestKnownEntry':hex(nearest),'entryAliases':aliases,'status':'candidate byte/RIP match; owning method requires control-flow confirmation'})
p=args.out
p.parent.mkdir(parents=True,exist_ok=True)
provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__))
p.write_text(json.dumps({'provenance':provenance,'result':{'targetTypeInfoSlot':hex(target),'identityWitness':'AttractController._InitializeAttractRouteData allocation at 0x180ad5220 then CheckpointData.ctor at 0x180ad523c','scope':'48 8b/8d RIP-relative candidates in executable sections, not all possible loads','matches':hits}},ensure_ascii=False,indent=2)+'\n')
print('candidates',len(hits))

import sys,json,struct,importlib.util,hashlib,argparse
sys.dont_write_bytecode=True
from pathlib import Path
root=Path(__file__).resolve().parents[4];sys.path.insert(0,str(root/'.agents/skills/arkbattle-native-research/scripts'))
from unity_assets import Reader,bundle,serialized,script
spec=importlib.util.spec_from_file_location('tree',root/'docs/research/evidence/blocker-roles-20261031/extract.py');tree=importlib.util.module_from_spec(spec);spec.loader.exec_module(tree)
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args();base=a.game/'Arknights_Data/StreamingAssets/AB/Windows'
inputs=[]
rows=[]
for rel in ['charpack/char_306_leizi.ab','battle/prefabs/[uc]projectiles.ab','battle/prefabs/[uc]globalbuffs.ab']:
 path=base/rel;inputs.append(dict(path=str(path),bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
 for filename,data in bundle(path)[0]:
  if filename.endswith(('.resS','.resource')):continue
  state=serialized(data);trees=tree.trees(data);names={};scripts={o['id']:script(o,data) for o in state['objects'] if o['classid']==115}
  for o in state['objects']:
   if o['classid']!=1:continue
   r=Reader(data[o['start']:o['start']+o['size']]);r.read(r.val('i')*12);r.val('i');names[o['id']]=r.string()
  for o in state['objects']:
   if o['classid']!=114:continue
   raw=data[o['start']:o['start']+o['size']];r=Reader(raw);r.val('i');owner=r.val('q');name=names.get(owner,'');nodes=trees[o['typeid']]
   if 'leizi2' in name:continue
   if 'leizi' not in name and not rel.startswith('charpack') and name!='silence_attachment':continue
   def walk(i):
    n=nodes[i]
    if n['type']=='string':v=r.string()
    elif n['flags']&1:v=[walk(n['children'][1]) for _ in range(r.val('i'))]
    elif n['children']:v={nodes[c]['name']:walk(c) for c in n['children']}
    else:
     b=r.read(n['width']);typ=n['type'];fmt={'float':'<f','double':'<d','bool':'<?','int':'<i','unsigned int':'<I','SInt64':'<q','UInt64':'<Q','common:222':'<i','common:161':'<f','common:928':'<B','common:814':'<q'}.get(typ)
     v=struct.unpack(fmt,b)[0] if fmt and struct.calcsize(fmt)==len(b) else {'type':typ,'hex':b.hex()}
    if n['meta']&0x4000:r.align()
    return v
   r=Reader(raw);val=walk(0);assert r.p==len(raw),(name,r.p,len(raw))
   rows.append(dict(bundle=rel,file=filename,pathId=str(o['id']),typeid=o['typeid'],name=name,sha256=hashlib.sha256(raw).hexdigest(),value=val))
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps(dict(provenance=dict(inputs=inputs,treeReader=str(root/'docs/research/evidence/blocker-roles-20261031/extract.py')),result=rows),ensure_ascii=False,indent=2)+'\n')
print('components',len(rows))

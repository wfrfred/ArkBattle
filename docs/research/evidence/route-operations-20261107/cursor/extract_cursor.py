#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory Route/Cursor metadata and extract selected state-changing bodies/call candidates."""
import argparse,bisect,hashlib,importlib.util,json,struct
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/cursor-replay'));a=p.parse_args()
 spec=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);n=m.Native(a.game)
 names={'Torappu.Battle.Route','Torappu.Battle.BasicCursor','Torappu.Battle.DirectionCursor','Torappu.Battle.GridCursor','Torappu.Battle.TracePositionCursor','Torappu.Battle.Act6FunEmptyCursor','Torappu.Battle.DouququEmptyCursor','Torappu.Battle.MarblesCursor','Torappu.Battle.PreviewCursor'}
 inventory=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name in names or name.startswith('Torappu.Battle.BasicCursor/'):
   inventory.append(dict(fullname=name,index=t['index'],parentIndex=t['parentIndex'],parentType=n.type_name(t['parentIndex']) if t['parentIndex']>=0 else None,fields=n.fields(t['index']),methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]))
 wanted={'Torappu.Battle.BasicCursor':None,'Torappu.Battle.DirectionCursor':None,'Torappu.Battle.TracePositionCursor':None,'Torappu.Battle.GridCursor':None,'Torappu.Battle.Route':{'.ctor','ReconstructRoute','ReconstructNextMap','AddMapOffsetMoveCkReachOffset','_ReconstructNextMapInto'},'Torappu.Battle.BasicCursor/WaitForSecondsCheckpoint':{'.ctor','OnBegin','OnTick','Skip'},'Torappu.Battle.BasicCursor/MoveCheckpoint':{'.ctor','OnBegin'},'Torappu.Battle.BasicCursor/MapOffsetMoveCheckpoint':{'OnBegin','get_targetPos'}}
 bodies=[]
 for t in inventory:
  if t['fullname'] not in wanted:continue
  select=wanted[t['fullname']]
  for method in t['methods']:
   name=n.string(method['nameIndex'])
   if (select is not None and name not in select) or name.startswith('<>xLua') or not method['address']:continue
   start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cur=start;fragments=[]
   while cur<end:
    body=n.disassemble_at(cur,end-cur,method=method if cur==start else None)
    for ins in body['instructions']:
     if len(ins.get('methods',[]))>100:
      ins['methodAliasCount']=len(ins.pop('methods'));ins['methodAliasesOmitted']=True
    fragments.append(body);following=int(body['end'],16)
    if following<=cur:raise RuntimeError('no progress')
    cur=following
   bodies.append(dict(selector=dict(fullname=method['fullname'],token=method['token']),method=method,logicalEnd=hex(end),boundary='all consecutive pdata fragments to next known native method',fragments=fragments))
 target_names={'OnRouteChanged','Reset','AssignHostRouteProgress','SkipNextCheckPoint','SkipCheckPoint','IgnoreAllButMoveCp','TrySkipIfCurrentCheckpointIsWaitForSeconds','set_snapshot','MarkReached','ResetReachedOffset','ReconstructRoute','ReconstructNextMap','AddMapOffsetMoveCkReachOffset'}
 targets={b['method']['address']:b['method'] for b in bodies if n.string(b['method']['nameIndex']) in target_names};refs={x:[] for x in targets}
 for sec in n.pe.sections:
  if not sec['executable']:continue
  code=n.pe.data[sec['offset']:sec['offset']+sec['raw_size']]
  for opcode in (b'\xe8',b'\xe9'):
   off=0
   while (off:=code.find(opcode,off))>=0:
    if off+5<=len(code):
     address=sec['address']+off;target=address+5+struct.unpack_from('<i',code,off+1)[0]
     if target in targets:
      pos=bisect.bisect_right(n.addresses,address)-1;indices=n.address_methods[n.addresses[pos]] if pos>=0 else []
      refs[target].append(dict(address=hex(address),opcode=opcode.hex(),precedingMethodCandidates=[n.method(i) for i in indices]))
    off+=1
 provenance=n.provenance();provenance['script']={'path':str(Path(__file__)),'sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()};a.out.mkdir(parents=True,exist_ok=True)
 def write(name,result):(a.out/name).write_text(json.dumps(dict(provenance=provenance,result=result),ensure_ascii=False,indent=2)+'\n')
 write('inventory.json',inventory);write('state-bodies.json',dict(bodies=bodies));write('direct-callers.json',dict(scope='E8/E9 byte candidates; nearest method identity is provisional until caller body confirms instruction and arguments; indirect/virtual/delegate/hotfix not covered',targets=[dict(method=targets[t],candidates=refs[t]) for t in targets]))
 print(json.dumps({'types':len(inventory),'bodies':len(bodies),'targets':len(targets),'candidates':sum(map(len,refs.values()))}))
if __name__=='__main__':main()

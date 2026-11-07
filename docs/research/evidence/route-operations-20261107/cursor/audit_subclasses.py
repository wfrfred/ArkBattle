#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Audit inherited Enemy route-slot writes; preserve 18 reviewed movement/cursor overrides."""
import argparse,bisect,importlib.util,json
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--inventory',type=Path,default=Path('docs/research/evidence/route-operations-20261107/inventory.json'));p.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/subclass-replay'));a=p.parse_args()
 spec=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);n=m.Native(a.game)
 inventory=json.loads(a.inventory.read_text())['result']; types=[t for t in inventory['types'] if 'Enemy' in t['fullname'] and t['fullname']!='Torappu.Battle.Enemy']
 names=['Torappu.Battle.BObjectFollowerEnemy._MoveByRoute','Torappu.Battle.FollowerEnemy._MoveByRoute','Torappu.Battle.FixedDirectionEnemy._MoveByRoute','Torappu.Battle.MarblesLikeEnemy.Init','Torappu.Battle.MarblesLikeEnemy.get_cursor','Torappu.Battle.MarblesLikeEnemy.get_moveCursor','Torappu.Battle.ControllableEnemy.Init','Torappu.Battle.ControllableEnemy.get_cursor','Torappu.Battle.ControllableEnemy.get_moveCursor','Torappu.Battle.ControllableEnemy._MoveByRoute','Torappu.Battle.GameCityRouteEnemy.Init','Torappu.Battle.GameCityRouteEnemy._MoveByRoute','Torappu.Battle.GameCityRouteEnemy._TriggerEnemyMove','Torappu.Battle.TraceTargetEnemy._MoveByRoute','Torappu.Battle.TeamSideEnemy.get_emptyCursor','Torappu.Battle.TeamSideEnemy.get_moveCursor','Torappu.Battle.ArkDexEnemy.get_emptyCursor','Torappu.Battle.ArkDexEnemy.get_moveCursor']
 selected=set(names);coverage=[];hits=[];bodies=[]
 for t in types:
  for old in t['methods']:
   if not old['address'] or '.<>xLua' in old['fullname']:continue
   method=n.method(old['index'])
   if method['fullname']!=old['fullname'] or method['address']!=old['address']:raise ValueError('inventory does not match client; regenerate inventory first')
   start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cur=start;fragments=[];writes=[]
   while cur<end:
    f=n.disassemble_at(cur,end-cur,method=method if cur==start else None)
    for ins in f['instructions']:
     if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'));ins['methodAliasesOmitted']=True
     first=ins['operands'].split(',')[0]
     if '[' in first and any(z in first for z in ['+ 0x370]','+ 0x378]','+ 0x380]','+ 0x390]']):writes.append(ins)
    fragments.append(f);nxt=int(f['end'],16)
    if nxt<=cur:raise RuntimeError('disassembly did not advance')
    cur=nxt
   coverage.append(dict(method=method,logicalEnd=hex(end),fragments=[{k:f[k] for k in ['address','end','decodedEnd','fullyDecoded','bytesSha256']} for f in fragments]))
   if writes:hits.append(dict(method=method,writeCandidates=writes))
   if method['fullname'] in selected:bodies.append(dict(selector=dict(fullname=method['fullname'],token=method['token']),method=method,logicalEnd=hex(end),boundary='all consecutive pdata fragments to next known native method',fragments=fragments))
 if {b['method']['fullname'] for b in bodies}!=selected:raise ValueError('reviewed selector absent')
 provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__));provenance['inventoryInput']=m.fingerprint(a.inventory);a.out.mkdir(parents=True,exist_ok=True)
 def write(name,result):(a.out/name).write_text(json.dumps(dict(provenance=provenance,result=result),ensure_ascii=False,indent=2)+'\n')
 write('subclass-slot-audit.json',dict(selection=dict(types=[t['fullname'] for t in types],methodCount=len(coverage),excluded='Enemy base and XLua base proxies',slotDisplacements=['0x370 mainCursor','0x378 cachedRoute','0x380 cachedCursorIndex','0x390 traceTargetCursor']),limits='Only decoded destination-memory operands at exact listed displacements in declared descendant methods; aliases through computed addresses, overlapping wider stores, other base offsets, indirect and hotfix operations are not exhaustively excluded. Nearest native boundaries include padding/data; fullyDecoded flags retained.',coverage=coverage,candidates=hits))
 write('subclass-bodies.json',dict(bodies=bodies));print(json.dumps({'types':len(types),'methodsAudited':len(coverage),'slotCandidates':len(hits),'reviewedBodies':len(bodies)}))
if __name__=='__main__':main()

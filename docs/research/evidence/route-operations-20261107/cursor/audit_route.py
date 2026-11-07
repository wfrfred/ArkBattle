#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Read every declared Route method rather than classifying Get methods by name."""
import argparse,bisect,importlib.util,json
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/route-all-replay'));a=p.parse_args();spec=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);n=m.Native(a.game)
 t=next(x for x in n.types if n.typename(x['index'])=='Torappu.Battle.Route');methods=[n.method(i)for i in range(t['methodStart'],t['methodStart']+t['methodCount'])];bodies=[];skipped=[]
 for method in methods:
  if not method['address'] or '.<>xLua' in method['fullname']:skipped.append(method);continue
  start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cur=start;parts=[]
  while cur<end:
   b=n.disassemble_at(cur,end-cur,method=method if cur==start else None)
   for ins in b['instructions']:
    if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'));ins['methodAliasesOmitted']=True
   parts.append(b);nxt=int(b['end'],16)
   if nxt<=cur:raise RuntimeError('no progress')
   cur=nxt
  bodies.append({'selector':{'fullname':method['fullname'],'token':method['token']},'method':method,'logicalEnd':hex(end),'boundary':'all consecutive pdata fragments to next known method; shared pointer aliases do not establish other method identity','fragments':parts})
 provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__));a.out.mkdir(parents=True,exist_ok=True);(a.out/'route-all-bodies.json').write_text(json.dumps({'provenance':provenance,'result':{'type':{'fullname':n.typename(t['index']),'fields':n.fields(t['index']),'methods':methods},'bodies':bodies,'skipped':skipped}},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'declaredMethods':len(methods),'bodies':len(bodies),'skipped':len(skipped)}))
if __name__=='__main__':main()

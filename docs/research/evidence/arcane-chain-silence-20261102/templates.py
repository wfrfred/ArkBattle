#!/usr/bin/env python3
"""Extract the exact silence_attachment template, validating the holder layout."""
import argparse,hashlib,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from unity_assets import Reader,bundle,serialized
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args()
path=a.game/'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab';rows=[]
for filename,data in bundle(path)[0]:
 if filename.endswith(('.resS','.resource')):continue
 for o in serialized(data)['objects']:
  if o['classid']!=114:continue
  raw=data[o['start']:o['start']+o['size']];r=Reader(raw,p=28);name=r.string()
  for _ in range(r.val('i')):
   start=r.p;key,effect=r.string(),r.string();priority=r.val('i');events=[]
   for _ in range(r.val('i')):
    event=r.val('i');program=r.string();refs=[dict(file=r.val('i'),pathId=str(r.val('q'))) for _ in range(r.val('i'))];events.append(dict(event=event,actions=json.loads(program),refs=refs))
   if key=='silence_attachment':rows.append(dict(key=key,effect=effect,priority=priority,events=events,file=filename,pathId=str(o['id']),offset=start,serializedBytes=r.p-start,sha256=hashlib.sha256(raw[start:r.p]).hexdigest()))
  assert r.p==len(raw)
assert len(rows)==1
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(dict(provenance=dict(input=dict(path=str(path),bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest())),result=rows),ensure_ascii=False,indent=2)+'\n')

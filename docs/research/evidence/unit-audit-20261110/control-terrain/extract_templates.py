#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract exact terrain/platform Buff templates and recursively embedded Buff programs."""
import argparse,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized
HELPER=ROOT/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
def walk(value):
 yield value
 if isinstance(value,dict):
  for child in value.values():yield from walk(child)
 elif isinstance(value,list):
  for child in value:yield from walk(child)
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args();a.out.parent.mkdir(parents=True,exist_ok=True)
 spec=importlib.util.spec_from_file_location('tree',HELPER);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 source=a.game/'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab';allrows={};container=None
 for filename,data in bundle(source)[0]:
  if filename.endswith(('.resS','.resource')):continue
  state=serialized(data);obj=next((v for v in state['objects'] if v['id']==6070581171229484677),None)
  if obj is None:continue
  raw=data[obj['start']:obj['start']+obj['size']];value=h.decode(raw,h.trees(data)[obj['typeid']]);container={'file':filename,'pathId':str(obj['id']),'objectSha256':hashlib.sha256(raw).hexdigest()}
  for i,t in enumerate(value['_templates']['Array']):
   row={k:v for k,v in t.items() if k!='eventToActions'};row['templateIndex']=i;row['events']=[{'event':v['key'],'actions':json.loads(v['value']['SerializedState'])} for v in t['eventToActions']['_items']['Array']];allrows[t['templateKey']]=row
 keys={'buff_mire','buff_mire[log]','buff_mire[mark]','buff_mire[checker]','trap_1106_achplat_passive','periodic_damage','trap_sea_drown[enemy]'};selected={};external=[]
 pending=list(keys)
 while pending:
  key=pending.pop()
  if key in selected or key=='empty':continue
  if key not in allrows:external.append(key);continue
  row=allrows[key];selected[key]=row
  for node in walk(row['events']):
   if isinstance(node,dict) and isinstance(node.get('_buff'),dict):
    b=node['_buff']
    if b.get('loadFromDB'):external.append('BuffDB:'+b.get('buffKey',''))
    elif b.get('templateKey'):pending.append(b['templateKey'])
 a.out.write_text(json.dumps({'provenance':{'collectedOn':'2026-11-10','script':fingerprint(Path(__file__)),'reader':fingerprint(HELPER),'source':fingerprint(source),'scope':'Current installed holder entries. Explicit root keys selected from real terrain/skill/passive Prefabs; embedded non-DB Buff programs followed; no runtime/XLua execution.'},'result':{'container':container,'rootKeys':sorted(keys),'templates':list(selected.values()),'unresolvedOrBuffDB':sorted(set(external))}},ensure_ascii=False,indent=2)+'\n')
 print('templates',len(selected),'external',sorted(set(external)))
if __name__=='__main__':main()

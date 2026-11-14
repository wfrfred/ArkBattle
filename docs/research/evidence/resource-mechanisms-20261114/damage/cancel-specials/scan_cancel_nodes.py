#!/usr/bin/env python3
"""Read every installed Holder CancelModifier node and retain special-reason programs."""
from collections import Counter
import importlib.util, json, sys
from pathlib import Path
sys.dont_write_bytecode=True
root=Path.cwd()
sys.path.insert(0,str(root/'.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized
helper_path=root/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec=importlib.util.spec_from_file_location('decoder',helper_path);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
def walk(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,c in v.items():yield from walk(c,p+'/'+str(k).replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,c in enumerate(v):yield from walk(c,p+'/'+str(i))
source=DEFAULT_GAME/'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
rows=[];selected=[];count=0
for filename,data in bundle(source)[0]:
 if filename.endswith(('.resS','.resource')):continue
 st=serialized(data)
 for o in st['objects']:
  if o['id']!=6070581171229484677:continue
  raw=data[o['start']:o['start']+o['size']]
  value=h.decode(raw,h.trees(data)[o['typeid']])
  for index,t in enumerate(value['_templates']['Array']):
   count+=1;events=[{'event':e['key'],'actions':json.loads(e['value']['SerializedState'])} for e in t['eventToActions']['_items']['Array']]
   tr=[]
   for p,n in walk(events):
    if n.get('$type')=='Torappu.Battle.Action.Nodes+CancelModifier':tr.append({'template':t['templateKey'],'templateIndex':index,'pointer':'/events'+p,'node':n})
   rows.extend(tr)
   if any(r['node'].get('_reason') in ['INTERRUPT','MINUS_HEALTH'] for r in tr):
    selected.append({'templateKey':t['templateKey'],'templateIndex':index,'events':events})
out=Path(__file__).with_name('cancel-holder.json')
out.write_text(json.dumps({'provenance':{'script':fingerprint(Path(__file__)),'reader':fingerprint(helper_path),'source':fingerprint(source),'collectedOn':'2026-11-14','scope':'Complete current Holder CancelModifier scan; configured template presence is not proof of live content binding.'},'result':{'selection':{'nodeType':'Torappu.Battle.Action.Nodes+CancelModifier','selectedReasons':['INTERRUPT','MINUS_HEALTH']},'templateCount':count,'nodeCount':len(rows),'reasonCounts':dict(Counter(r['node'].get('_reason') for r in rows)),'nodes':rows,'selectedTemplates':selected}},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'templates':count,'nodes':len(rows),'reasons':dict(Counter(r['node'].get('_reason') for r in rows)),'selected':len(selected)}))

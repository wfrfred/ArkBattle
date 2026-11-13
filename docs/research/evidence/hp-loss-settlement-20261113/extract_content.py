#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Select live physical/magical skipped-damage nodes and the enemy Prefabs which bind them."""
import argparse, hashlib, importlib.util, json, struct, sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd(); TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader,bundle,serialized
HELPER=ROOT/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
TOKENS=['bmbmot','ltniak','mpprme','ltrock','lpeopl']
def walk(v,path=''):
 if isinstance(v,dict):
  yield path,v
  for k,c in v.items():yield from walk(c,path+'/'+k)
 elif isinstance(v,list):
  for i,c in enumerate(v):yield from walk(c,path+'/'+str(i))
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);p.add_argument('--selection',type=Path,default=Path(__file__).with_name('content-selection.json'));a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True);selection=json.loads(a.selection.read_text())
 spec=importlib.util.spec_from_file_location('reader',HELPER);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows'; holder=base/'config/buff_template_holder.ab'; sources=[fingerprint(holder)]; alltemplates=[];container=None
 for fn,data in bundle(holder)[0]:
  if fn.endswith(('.resS','.resource')):continue
  state=serialized(data);o=next((x for x in state['objects']if x['id']==6070581171229484677),None)
  if o is None:continue
  raw=data[o['start']:o['start']+o['size']];v=h.decode(raw,h.trees(data)[o['typeid']]);container={'file':fn,'pathId':str(o['id']),'objectSha256':hashlib.sha256(raw).hexdigest()}
  for i,t in enumerate(v['_templates']['Array']):
   row={k:x for k,x in t.items()if k!='eventToActions'};row['templateIndex']=i;row['events']=[{'event':e['key'],'actions':json.loads(e['value']['SerializedState'])}for e in t['eventToActions']['_items']['Array']];alltemplates.append(row)
 scan=[]
 for t in alltemplates:
  for path,n in walk(t['events']):
   if n.get('_skipModifierEvent') is True:
    scan.append({'template':t['templateKey'],'path':path,'type':n.get('$type'),'damageType':n.get('_damageType'),'triggerOnCalculateDamage':n.get('_triggerOnCalculateDamage'),'emitSourceOnCalculateDamage':n.get('_emitSourceOnCalculateDamage')})
 selected=[t for t in alltemplates if t['templateKey'] in selection['templates']]
 prefabs=[]; scanned=[]
 for source in sorted((base/'battle').glob('enm_pfb*.ab')):
  hit=False
  for fn,data in bundle(source)[0]:
   if fn.endswith(('.resS','.resource'))or not any(x.encode()in data for x in TOKENS):continue
   state=serialized(data);layouts=h.trees(data);names={};trans={}
   for o in state['objects']:
    raw=data[o['start']:o['start']+o['size']]
    if o['classid']==1:
     r=Reader(raw);r.read(r.val('i')*12);r.val('i');names[o['id']]=r.string()
    elif o['classid']==4:
     v=h.decode(raw,layouts[o['typeid']]);trans[o['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
   transby={go:tid for tid,(go,_)in trans.items()}
   for o in state['objects']:
    if o['classid']!=114 or str(o['id']) not in selection['components']:continue
    raw=data[o['start']:o['start']+o['size']];go=struct.unpack_from('<q',raw,4)[0];tid=transby.get(go);hier=[]
    while tid:
     owner,parent=trans[tid];hier.append({'name':names.get(owner,''),'gameObjectPathId':str(owner),'transformPathId':str(tid)});tid=parent
    if not any(any(k in row['name']for k in TOKENS)for row in hier):continue
    v=h.decode(raw,layouts[o['typeid']]);rawname=f'{source.stem}-{o["id"]}.bin';(a.out/rawname).write_bytes(raw)
    prefabs.append({'bundle':str(source.relative_to(base)),'file':fn,'pathId':str(o['id']),'hierarchy':hier,'objectSha256':hashlib.sha256(raw).hexdigest(),'rawFile':rawname,'classId':o['classid'],'typeIndex':o['typeid'],'value':v});hit=True
  scanned.append({'bundle':str(source.relative_to(base)),'selected':hit})
  if hit:sources.append(fingerprint(source));print('selected',source.name,flush=True)
 provenance={'collectedOn':'2026-11-13','script':fingerprint(Path(__file__)),'selection':fingerprint(a.selection),'reader':fingerprint(HELPER),'sources':sources,'scope':'Complete installed holder skip-node scan; only the explicit template and object selection is archived from five scouted enemy hierarchies. Static configuration binding, not in-game execution or XLua verification.'}
 (a.out/'content.json').write_text(json.dumps({'provenance':provenance,'result':{'holder':container,'templateCount':len(alltemplates),'skipNodes':scan,'selectedTemplates':selected,'prefabs':prefabs,'prefabBundleScan':scanned}},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'templates':len(alltemplates),'skipNodes':len(scan),'selectedTemplates':len(selected),'components':len(prefabs)}))
if __name__=='__main__':main()

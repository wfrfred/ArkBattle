#!/usr/bin/env python3
"""Resolve the Reid Rush ability binding and checkpoint insertion source identity."""
import argparse,datetime,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path('.agents/skills/arkbattle-native-research/scripts').resolve()))
from native import DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized,script

def load_module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,default=Path('.cache/native-research/insert-patrol-20261107/reid-replay'));a=p.parse_args()
 helper=Path('docs/research/evidence/attack-addon-order-20261102/content/decode_content.py');ext_helper=Path('docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py');d=load_module('content_reader',helper);e=load_module('external_reader',ext_helper)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows';prefab=base/'battle/enm_pfb_18.ab';scripts=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin';script_files=dict(bundle(scripts)[0])
 components=[];wanted={'Enemy','EnemySkill','UnitMode','AnimatedActionToOwnerAbility','EntityOnRouteTrigger','AdvancedSelector','CircleRange','BuffToOwner'}
 for fn,data in bundle(prefab)[0]:
  if b'enemy_1539_reid'not in data:continue
  state=serialized(data);trees=d.trees(data);names={};trans={};externals=e.trees(data)[1]
  for o in state['objects']:
   if o['classid']not in (1,4):continue
   v=d.decode(data[o['start']:o['start']+o['size']],trees[o['typeid']])
   if o['classid']==1:names[o['id']]=v.get('common:427',v.get('m_Name'))
   else:trans[o['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
  bygo={v[0]:k for k,v in trans.items()}
  for o in state['objects']:
   if o['classid']!=114:continue
   raw=data[o['start']:o['start']+o['size']];v=d.decode(raw,trees[o['typeid']]);tid=bygo.get(v['common:374']['m_PathID']);hier=[]
   while tid:
    go,parent=trans[tid];hier.append({'name':names.get(go),'gameObjectPathId':str(go),'transformPathId':str(tid)});tid=parent
   if not any(h['name']=='enemy_1539_reid'for h in hier):continue
   pp=v['common:490'];external=externals[pp['m_FileID']-1]if pp['m_FileID']else None;sfname=external['path'].split('/')[-1]if external else fn;sd=script_files.get(sfname)if external else data;so=next(x for x in serialized(sd)['objects']if x['id']==pp['m_PathID']);cl=script(so,sd)
   if cl['cl']not in wanted:continue
   if cl['cl']not in {'Enemy','UnitMode'}and 'Rush' not in [h['name']for h in hier]:continue
   components.append({'bundle':'battle/enm_pfb_18.ab','file':fn,'pathId':str(o['id']),'objectSha256':hashlib.sha256(raw).hexdigest(),'hierarchy':hier,'scriptBinding':{'externalReference':external,'file':sfname,'pathId':str(pp['m_PathID']),'value':cl},'value':v})

 provenance={'collectedOn':datetime.date.today().isoformat(),'script':fingerprint(Path(__file__)),'typeTreeReader':fingerprint(helper),'externalReader':fingerprint(ext_helper),'sources':[fingerprint(p)for p in [prefab,scripts]],'scope':'Selected nonvisual Rush / Enemy / UnitMode components of exactly enemy_1539_reid from enm_pfb_18.ab, with resolved external MonoScript pointers. Actor binding, not runtime cast observation; this does not associate it with another enemy in the same level.'}
 result={'components':components}
 a.out.mkdir(parents=True,exist_ok=True);(a.out/'bindings.json').write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'components':len(components)}))
if __name__=='__main__':main()

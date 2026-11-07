#!/usr/bin/env python3
"""Resolve the guide's global-mark producer, aura trigger, selector and level witness."""
import argparse,datetime,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path('.agents/skills/arkbattle-native-research/scripts').resolve()))
from native import DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized,script

def load_module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--levels',type=Path,default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels'));p.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/endpoint-replay'));a=p.parse_args()
 helper=Path('docs/research/evidence/attack-addon-order-20261102/content/decode_content.py');ext_helper=Path('docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py');d=load_module('content_reader',helper);e=load_module('external_reader',ext_helper)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows';holder=base/'config/buff_template_holder.ab';prefab=base/'battle/enm_pfb_35.ab';scripts=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin';script_files=dict(bundle(scripts)[0])
 assert fingerprint(holder)['sha256']=='8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79'
 templates=[]
 for fn,data in bundle(holder)[0]:
  if b'flgshp_tile_mark'not in data:continue
  state=serialized(data);trees=d.trees(data)
  for o in state['objects']:
   if o['id']!=6070581171229484677:continue
   v=d.decode(data[o['start']:o['start']+o['size']],trees[o['typeid']])
   for index,t in enumerate(v['_templates']['Array']):
    if 'flgshp_tile_mark'not in json.dumps(t):continue
    templates.append({'file':fn,'pathId':str(o['id']),'templateIndex':index,'template':t,'events':[{'event':x['key'],'actions':json.loads(x['value']['SerializedState'])}for x in t['eventToActions']['_items']['Array']]})
 components=[];wanted={'Enemy','EnemySkill','UnitMode','PassiveBuffAbility','SelfSelectorInCertainCondition','ActiveBuffAbility','BuffDuringCastingFixed','ExtraAbilities','AnimatedActionToOwnerAbility','TileSelector','GlobalRange','SelectorTrigger','ActiveAbilityWrapper','GlobalAuraAbility','TargetValidator','ThreePartChannelingAnimation'}
 for fn,data in bundle(prefab)[0]:
  if b'enemy_17002_flgshp'not in data:continue
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
   if not any(h['name']=='enemy_17002_flgshp'for h in hier):continue
   pp=v['common:490'];external=externals[pp['m_FileID']-1]if pp['m_FileID']else None;sfname=external['path'].split('/')[-1]if external else fn;sd=script_files.get(sfname)if external else data;so=next(x for x in serialized(sd)['objects']if x['id']==pp['m_PathID']);cl=script(so,sd)
   if cl['cl']not in wanted:continue
   if cl['cl']=='SelectorTrigger'and hier[1]['name']!='Focus':continue
   components.append({'bundle':'battle/enm_pfb_35.ab','file':fn,'pathId':str(o['id']),'objectSha256':hashlib.sha256(raw).hexdigest(),'hierarchy':hier,'scriptBinding':{'externalReference':external,'file':sfname,'pathId':str(pp['m_PathID']),'value':cl},'value':v})
 level_path=a.levels/'activities/act1dp/level_act1dp_sub-02.json';database_path=a.levels/'enemydata/enemy_database.json';assert fingerprint(level_path)['sha256']=='885be14f374e18b056c631662cc50a19c2e3048be480cc8a3b5072445f697122';assert fingerprint(database_path)['sha256']=='eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b';level=json.loads(level_path.read_text());db=json.loads(database_path.read_text());entry=next((i,x)for i,x in enumerate(db['enemies'])if x['Key']=='enemy_17002_flgshp');endtiles=[]
 for i,t in enumerate(level['mapData']['tiles']):
  if t['tileKey']=='tile_end':endtiles.append({'pointer':'/mapData/tiles/'+str(i),'definition':t,'occurrences':[{'jsonRowIndex':r,'jsonColIndex':c}for r,row in enumerate(level['mapData']['map'])for c,v in enumerate(row)if v==i]})
 spawn=level['waves'][0]['fragments'][0]['actions'][1];assert spawn['key']=='enemy_17002_flgshp';assert {x['template']['templateKey']for x in templates}=={'enemy_flgshp_allow[check]','enemy_flgshp[end_point]','enemy_flgshp_mark'}
 provenance={'collectedOn':datetime.date.today().isoformat(),'script':fingerprint(Path(__file__)),'typeTreeReader':fingerprint(helper),'externalReader':fingerprint(ext_helper),'sources':[fingerprint(p)for p in [holder,prefab,scripts]],'configurationSource':{'sourceUrl':'https://github.com/Kengxxiao/ArknightsGameData','revision':'63c7cec73c3858d0ae913f85cc89af3cef4d744f','inputs':[fingerprint(level_path),fingerprint(database_path)]},'scope':'Complete holder search for literal flgshp_tile_mark; selected nonvisual component classes of exactly enemy_17002_flgshp, resolved external MonoScript pointers; one actual SPAWN and end-tile map witness. Serialized executable bindings and static inference, not game execution.'}
 result={'templates':templates,'components':components,'level':{'file':'activities/act1dp/level_act1dp_sub-02.json','spawnPointer':'/waves/0/fragments/0/actions/1','spawn':spawn,'route':level['routes'][spawn['routeIndex']],'endTiles':endtiles,'enemyDbRef':next(x for x in level['enemyDbRefs']if x['id']=='enemy_17002_flgshp')},'enemyData':{'pointer':'/enemies/'+str(entry[0]),'entry':entry[1]}}
 a.out.mkdir(parents=True,exist_ok=True);(a.out/'endpoint-positive.json').write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'templates':len(templates),'components':len(components),'endTiles':len(endtiles)}))
if __name__=='__main__':main()

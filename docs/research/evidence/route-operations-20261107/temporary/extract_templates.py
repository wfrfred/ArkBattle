import argparse,datetime,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
root=Path.cwd();tools=root/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(tools))
from native import DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized
parser=argparse.ArgumentParser(description='Extract selected temporary route control templates')
parser.add_argument('--game',type=Path,default=DEFAULT_GAME)
parser.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/temporary-templates.json'))
args=parser.parse_args()
helper=root/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
s=importlib.util.spec_from_file_location('reader',helper);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
source=args.game/'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
assert fingerprint(source)['sha256']=='8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79'
keys={'nymph_s_2[trace_taregt]','fear_buff','token_phatm2_encdool_target','token_phatm2_encdool_trigger','enemy_bigstorm[traceStorm]','trap_stormcoord[summon_and_suicide]'}
results=[]
for filename,data in bundle(source)[0]:
 if filename.endswith(('.resS','.resource')):continue
 state=serialized(data)
 for o in state['objects']:
  if o['id']!=6070581171229484677:continue
  raw=data[o['start']:o['start']+o['size']];v=m.decode(raw,m.trees(data)[o['typeid']]);selected=[]
  for i,t in enumerate(v['_templates']['Array']):
   if t['templateKey'] not in keys:continue
   entry=dict(t);entry['templateIndex']=i
   entry['events']=[{'event':ev['key'],'actions':json.loads(ev['value']['SerializedState'])} for ev in t['eventToActions']['_items']['Array']]
   selected.append(entry)
  assert {t['templateKey'] for t in selected}==keys
  results.append({'bundle':'config/buff_template_holder.ab','file':filename,'pathId':str(o['id']),'objectSha256':hashlib.sha256(raw).hexdigest(),'templates':selected})
out=args.out
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({'provenance':{'collectedOn':datetime.date.today().isoformat(),'script':fingerprint(Path(__file__)),'typeTreeReader':fingerprint(helper),'tools':[fingerprint(tools/x) for x in ['assets.py','unity_assets.py']],'source':fingerprint(source),'scope':'Selected current installed holder entries, raw SerializedState and decoded action programs; prefab use is a separate evidence step'},'result':results},ensure_ascii=False,indent=2)+'\n')
print('selected',sum(len(x['templates']) for x in results))

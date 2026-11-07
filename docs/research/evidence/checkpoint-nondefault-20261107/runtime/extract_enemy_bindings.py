import argparse,datetime,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
root=Path.cwd();tools=root/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(tools))
from native import DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized
parser=argparse.ArgumentParser(description='Extract the selected Captain Mateo prefab binding and external MonoScripts')
parser.add_argument('--game',type=Path,default=DEFAULT_GAME)
parser.add_argument('--out',type=Path,default=Path('.cache/native-research/checkpoint-nondefault-20261107/runtime/enemy-prefab-bindings.json'))
args=parser.parse_args()
helper=root/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
s=importlib.util.spec_from_file_location('reader',helper);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
base=args.game/'Arknights_Data/StreamingAssets/AB/Windows';rows=[];sources=[]
for rel in ['battle/enm_pfb_18.ab']:
 source=base/rel;assert fingerprint(source)['sha256']=='7bc74aef8fbb3cbc7ce86d7e4b789e2c0daaadf076d47b0e9989e83e7ff4eb69';sources.append(fingerprint(source))
 for filename,data in bundle(source)[0]:
  if filename.endswith(('.resS','.resource')):continue
  state=serialized(data);trees=m.trees(data);names={};transforms={}
  for o in state['objects']:
   if o['classid'] not in (1,4):continue
   v=m.decode(data[o['start']:o['start']+o['size']],trees[o['typeid']])
   if o['classid']==1:names[o['id']]=v.get('common:427',v.get('m_Name'))
   else:transforms[o['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
  trbyowner={x[0]:k for k,x in transforms.items()}
  for o in state['objects']:
   if o['classid']!=114:continue
   raw=data[o['start']:o['start']+o['size']]
   v=m.decode(raw,trees[o['typeid']]);owner=v['common:374']['m_PathID'];tid=trbyowner.get(owner);hier=[]
   while tid:
    go,parent=transforms[tid];hier.append({'name':names.get(go),'gameObjectPathId':str(go),'transformPathId':str(tid)});tid=parent
   if o['id'] not in {5876789642265996286,9106343686940568574,1333684876975582206,-1903693957362766850,-2088189509676651522,2019250468254297086}:continue
   rows.append({'bundle':rel,'file':filename,'pathId':str(o['id']),'typeId':o['typeid'],'objectSha256':hashlib.sha256(raw).hexdigest(),'hierarchy':hier,'value':v})
# Resolve each script PPtr using the file's external table, then the known script bundle.
external_helper=root/'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
es=importlib.util.spec_from_file_location('external_reader',external_helper);em=importlib.util.module_from_spec(es);es.loader.exec_module(em)
from unity_assets import script
scripts_path=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
assert fingerprint(scripts_path)['sha256']=='10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99'
sources.append(fingerprint(scripts_path));scripts=dict(bundle(scripts_path)[0])
for r in rows:
 data=dict(bundle(base/r['bundle'])[0])[r['file']]
 external=em.trees(data)[1][r['value']['common:490']['m_FileID']-1]
 script_file=external['path'].split('/')[-1];sd=scripts[script_file]
 so=next(o for o in serialized(sd)['objects'] if o['id']==r['value']['common:490']['m_PathID'])
 assert so['classid']==115
 sr=sd[so['start']:so['start']+so['size']]
 r['scriptBinding']={'externalReference':external,'bundle':'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin','file':script_file,'pathId':str(so['id']),'objectSha256':hashlib.sha256(sr).hexdigest(),'value':script(so,sd)}
out=args.out
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({'provenance':{'collectedOn':datetime.date.today().isoformat(),'script':fingerprint(Path(__file__)),'typeTreeReader':fingerprint(helper),'externalReferenceReader':fingerprint(external_helper),'tools':[fingerprint(tools/x) for x in ['assets.py','unity_assets.py']],'sources':sources,'scope':'Current installed enemy prefab components below bolicp/cledub named GameObjects; hierarchy and typed data, not runtime observation'},'result':rows},ensure_ascii=False,indent=2)+'\n')
print('selected objects',len(rows))
for r in rows: print(r['pathId'],[h['name'] for h in r['hierarchy']],r['scriptBinding']['value']['cl'])

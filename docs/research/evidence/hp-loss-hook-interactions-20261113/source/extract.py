import sys,importlib.util,json,struct,hashlib,argparse
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader,bundle,serialized
spec=importlib.util.spec_from_file_location('reader',ROOT/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
base=DEFAULT_GAME/'Arknights_Data/StreamingAssets/AB/Windows'
parser=argparse.ArgumentParser();parser.add_argument('--out',type=Path,required=True);parser.add_argument('--character-table',type=Path,required=True);args=parser.parse_args();args.out.mkdir(parents=True,exist_ok=True)
rows=[];sources=[]
for name in ['char_225_haak']:
 p=base/'charpack'/(name+'.ab');sources.append(fingerprint(p))
 for fn,data in bundle(p)[0]:
  if fn.endswith(('.resS','.resource')):continue
  state=serialized(data);layouts=h.trees(data);names={};trans={}
  for o in state['objects']:
   raw=data[o['start']:o['start']+o['size']]
   if o['classid']==1:
    r=Reader(raw);r.read(r.val('i')*12);r.val('i');names[o['id']]=r.string()
   elif o['classid']==4:
    v=h.decode(raw,layouts[o['typeid']]);trans[o['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
  transby={go:tid for tid,(go,_)in trans.items()}
  for o in state['objects']:
   if o['classid']!=114 or o['id'] not in [3868378729437944045,3956923551127066861]:continue
   raw=data[o['start']:o['start']+o['size']];go=struct.unpack_from('<q',raw,4)[0];tid=transby.get(go);path=[]
   while tid:
    owner,parent=trans[tid];path.append(names.get(owner,''));tid=parent
   v=h.decode(raw,layouts[o['typeid']]);rawname=str(o['id'])+'.bin';(args.out/rawname).write_bytes(raw);rows.append({'bundle':str(p.relative_to(base)),'file':fn,'pathId':str(o['id']),'hierarchy':'/'.join(reversed(path)),'rawFile':rawname,'objectSha256':hashlib.sha256(raw).hexdigest(),'value':v})
 print(name,flush=True)

holder=base/'config/buff_template_holder.ab';sources.append(fingerprint(holder));alltemplates=[];holderObject=None
for fn,data in bundle(holder)[0]:
 if fn.endswith(('.resS','.resource')):continue
 state=serialized(data);o=next((o for o in state['objects']if o['id']==6070581171229484677),None)
 if o is None:continue
 raw=data[o['start']:o['start']+o['size']];v=h.decode(raw,h.trees(data)[o['typeid']]);holderObject={'file':fn,'pathId':str(o['id']),'sha256':hashlib.sha256(raw).hexdigest()}
 for index,t in enumerate(v['_templates']['Array']):
  alltemplates.append({'key':t['templateKey'],'index':index,'events':[{'event':e['key'],'actions':json.loads(e['value']['SerializedState'])}for e in t['eventToActions']['_items']['Array']]})
sourceHooks=[{'key':t['key'],'templateIndex':t['index'],'actions':[n.get('$type')for n in e['actions']]}for t in alltemplates for e in t['events']if e['event']==14]
keys=['haak_t_1','haak_t_atk','periodic_damage_by_hp_ratio[skip_modifier_fix][undeadable]']
character=json.loads(args.character_table.read_text())['char_225_haak'];sources.append(fingerprint(args.character_table))
provenance={'collectedOn':'2026-11-13','script':fingerprint(Path(__file__)),'reader':fingerprint(ROOT/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'),'sources':sources,'characterTableRevision':'17759cc8cdf37388414145d16262a3a06f3ab25e','scope':'Fresh selected Aak Prefab and holder decoding, complete source event-14 template index, selected static character configuration; no in-game observation or new native extraction.'}
result={'provenance':provenance,'result':{'holder':holderObject,'templateCount':len(alltemplates),'sourceEvent14':sourceHooks,'selectedTemplates':[t for t in alltemplates if t['key']in keys],'components':rows,'character':{'id':'char_225_haak','trait':character['trait'],'talents':character['talents']}}}
(args.out/'aak-loss-and-attack-scale.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'sourceEvent14':len(sourceHooks),'components':len(rows),'selectedTemplates':3}))

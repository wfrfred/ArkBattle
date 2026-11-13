#!/usr/bin/env python3
"""Trace selected Warfarin HP loss / Ulpian reception configurations."""
import argparse, hashlib, importlib.util, json, struct, sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import DEFAULT_GAME,fingerprint
from unity_assets import Reader,bundle,serialized,script
HELPER=ROOT/'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'

def walk(value,path=''):
 if isinstance(value,dict):
  yield path,value
  for k,v in value.items():yield from walk(v,path+'/'+str(k))
 elif isinstance(value,list):
  for i,v in enumerate(value):yield from walk(v,path+'/'+str(i))

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
 spec=importlib.util.spec_from_file_location('reader',HELPER);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows';sources=[];objects=[];templates=[]
 extpath=ROOT/'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
 spec=importlib.util.spec_from_file_location('externalreader',extpath);external=importlib.util.module_from_spec(spec);spec.loader.exec_module(external)
 script_source=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin';sources.append(fingerprint(script_source));lookup={}
 for fn,data in bundle(script_source)[0]:
  if fn.endswith(('.resS','.resource')):continue
  for obj in serialized(data)['objects']:
   if obj['classid']==115:lookup[(fn,obj['id'])]=script(obj,data)
 for rel in ['charpack/char_171_bldsk.ab','charpack/char_4145_ulpia.ab','charpack/char_107_liskam.ab','charpack/char_4183_mortis.ab','battle/prefabs/[uc]skills.ab']:
  source=base/rel;sources.append(fingerprint(source))
  for fn,data in bundle(source)[0]:
   if fn.endswith(('.resS','.resource')):continue
   state=serialized(data);layouts,externals=external.trees(data);names={};trans={}
   for o in state['objects']:
    raw=data[o['start']:o['start']+o['size']]
    if o['classid']==1:
     r=Reader(raw);r.read(r.val('i')*12);r.val('i');names[o['id']]=r.string()
    elif o['classid']==4:
     v=h.decode(raw,layouts[o['typeid']]);trans[o['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
   transby={go:tid for tid,(go,_)in trans.items()}
   for o in state['objects']:
    if o['classid']!=114:continue
    raw=data[o['start']:o['start']+o['size']];go=struct.unpack_from('<q',raw,4)[0];tid=transby.get(go);hier=[]
    while tid:
     owner,parent=trans[tid];hier.append({'name':names.get(owner,''),'gameObjectPathId':str(owner),'transformPathId':str(tid)});tid=parent
    if rel.endswith('[uc]skills.ab') and not any(r['name'] in {'skchr_bldsk_2','skchr_mortis_2'}for r in hier):continue
    v=h.decode(raw,layouts[o['typeid']]);
    if rel.startswith('charpack/') and str(o['id']) not in {'-8509029535651146911','-4043021218200161826','-320561100469243426','-3509970960733692657','-1825524403522757361','-4364614045179441341','4491222975411326787'}:continue
    buffs=[{'pointer':ptr,'value':n}for ptr,n in walk(v)if 'buffKey'in n and 'templateKey'in n]
    if rel.startswith('charpack/') and not (buffs or '_modes'in v or '_talents'in v or '_castSkill'in v or '_skill'in v):continue
    ref=v['common:490'];ext=externals[ref['m_FileID']-1];sf=ext['path'].split('/')[-1];binding={'external':ext,'value':lookup[(sf,ref['m_PathID'])]};rawname=f'{Path(rel).stem}-{o["id"]}.bin';(a.out/rawname).write_bytes(raw)
    objects.append({'bundle':rel,'file':fn,'pathId':str(o['id']),'hierarchy':hier,'rawFile':rawname,'sha256':hashlib.sha256(raw).hexdigest(),'value':v,'buffs':buffs,'scriptBinding':binding})
 holder=base/'config/buff_template_holder.ab';sources.append(fingerprint(holder));keys={'ulpia_t_2','mortis_s2[self_damage]','periodic_damage_by_hp_ratio[skip_modifier_fix]'}
 for o in objects:
  for b in o['buffs']:keys.add(b['value']['templateKey'])
 for fn,data in bundle(holder)[0]:
  if fn.endswith(('.resS','.resource')):continue
  for o in serialized(data)['objects']:
   if o['classid']!=114:continue
   raw=data[o['start']:o['start']+o['size']];r=Reader(raw,p=28);r.string()
   for _ in range(r.val('i')):
    start=r.p;key,effect,priority=r.string(),r.string(),r.val('i');events=[]
    for _ in range(r.val('i')):
     ev,program=r.val('i'),r.string();refs=[{'file':r.val('i'),'pathId':str(r.val('q'))}for _ in range(r.val('i'))];events.append({'event':ev,'actions':json.loads(program),'refs':refs})
    if key in keys:templates.append({'key':key,'events':events,'file':fn,'pathId':str(o['id']),'offset':start,'bytes':r.p-start,'sha256':hashlib.sha256(raw[start:r.p]).hexdigest()})
 prov={'date':'2026-11-13','script':fingerprint(Path(__file__)),'reader':fingerprint(HELPER),'scriptBindingReader':fingerprint(extpath),'sources':sources,'scope':'Selected actual Character/Skill bindings and current Buff programs; static paths, not runtime observation.'}
 (a.out/'bindings.json').write_text(json.dumps({'provenance':prov,'result':{'objects':objects,'templates':templates}},ensure_ascii=False,indent=2)+'\n');print({'objects':len(objects),'templates':len(templates)})
if __name__=='__main__':main()

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract selected control/terrain and real multi-melee components from installed type trees."""
import argparse,hashlib,importlib.util,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import fingerprint
from unity_assets import Reader,bundle,serialized,script
HELPER=ROOT/'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec=importlib.util.spec_from_file_location('archived_content',HELPER);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
SELECTION={
 'charpack/char_143_ghost.ab':['char_143_ghost'],
 'battle/prefabs/[uc]tiles.ab':['tile_infection','tile_smog','tile_hole','tile_deepsea','tile_mire'],
 'battle/prefabs/[uc]skills.ab':['sktok_mire','sktok_achplat','sktok_tidectrl_3'],
 'pkgrps/btl_pfb_tokens_4.ab':['trap_1106_achplat'],
 'pkgrps/btl_pfb_tokens_1.ab':['trap_098_mire'],
 'pkgrps/btl_pfb_tokens_0.ab':['trap_042_tidectrl'],
}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows';scripts={};sources=[]
 for relative in ['anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin','anon/88b3c3ecaaefa6003de730686dd5ac53.bin']:
  path=base/relative
  if not path.exists():continue
  sources.append(fingerprint(path))
  for filename,data in bundle(path)[0]:
   if filename.endswith(('.resS','.resource')):continue
   for obj in serialized(data)['objects']:
    if obj['classid']==115:scripts[filename,obj['id']]={'bundle':relative,'value':script(obj,data)}
 rows=[];found={}
 for relative,wanted in SELECTION.items():
  path=base/relative;sources.append(fingerprint(path));found[relative]=[]
  for filename,data in bundle(path)[0]:
   if filename.endswith(('.resS','.resource')):continue
   state=serialized(data);layouts,externals=h.helper.trees(data);names={};transforms={}
   for obj in state['objects']:
    raw=data[obj['start']:obj['start']+obj['size']]
    if obj['classid']==1:
     r=Reader(raw);r.read(r.val('i')*12);r.val('i');names[obj['id']]=r.string()
    elif obj['classid']==4:
     v=h.decode(raw,layouts[obj['typeid']]);transforms[obj['id']]=(v['common:374']['m_PathID'],v['m_Father']['m_PathID'])
   byowner={owner:tid for tid,(owner,_) in transforms.items()}
   for obj in state['objects']:
    if obj['classid']!=114:continue
    raw=data[obj['start']:obj['start']+obj['size']];owner=struct.unpack_from('<q',raw,4)[0];hier=[];tid=byowner.get(owner)
    while tid:
     go,tid=transforms[tid];hier.append(names[go])
    hier.reverse()
    if not hier or hier[0] not in wanted:continue
    value=h.decode(raw,layouts[obj['typeid']]);pointer=value.get('common:490',{})
    sf=filename if pointer.get('m_FileID')==0 else externals[pointer['m_FileID']-1]['path'].split('/')[-1]
    binding=scripts.get((sf,pointer.get('m_PathID')))
    rows.append({'bundle':relative,'file':filename,'pathId':str(obj['id']),'hierarchy':hier,'objectSha256':hashlib.sha256(raw).hexdigest(),'scriptPPtr':pointer,'scriptFile':sf,'script':binding,'value':value})
    if hier[0] not in found[relative]:found[relative].append(hier[0])
  print(relative,len(rows),found[relative],flush=True)
 result={'provenance':{'collectedOn':'2026-11-10','script':fingerprint(Path(__file__)),'helper':fingerprint(HELPER),'sources':sources,'selection':SELECTION,'scope':'Exact root hierarchies only; static current installed components with script bindings, not runtime XLua or an all-content survey.'},'result':rows,'found':found}
 (a.out/'components.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print('rows',len(rows),'unresolved scripts',sum(v['script'] is None for v in rows),flush=True)
if __name__=='__main__':main()

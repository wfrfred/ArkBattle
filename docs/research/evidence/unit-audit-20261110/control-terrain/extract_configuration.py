#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Select real level placements and controller parameters from the previously pinned data revision."""
import argparse,hashlib,json,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint
REV='63c7cec73c3858d0ae913f85cc89af3cef4d744f'
TOKENS={'trap_098_mire','trap_042_tidectrl','trap_1106_achplat'}
TILES={'tile_infection','tile_mire','tile_smog','tile_deepsea','tile_hole'}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--mirror',type=Path,default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror-current'));p.add_argument('--tables',type=Path,default=Path('.cache/native-research/route-operations-20261107/data'));p.add_argument('--out',type=Path,required=True);a=p.parse_args();rows=[];sources=[]
 assert subprocess.check_output(['git','-C',str(a.mirror),'rev-parse','HEAD'],text=True).strip()==REV
 for mode,num in [('act1autochess','02'),('act1autochess','04'),('act2autochess','02'),('act2autochess','03'),('act2autochess','04')]:
  relative=f'zh_CN/gamedata/levels/activities/{mode}/level_{mode}_m{num}.json';path=a.mirror/relative;raw=path.read_bytes();expected=subprocess.check_output(['git','-C',str(a.mirror),'rev-parse',f'{REV}:{relative}'],text=True).strip();actual=hashlib.sha1(f'blob {len(raw)}\0'.encode()+raw).hexdigest();assert actual==expected
  r=json.loads(raw);sources.append({**fingerprint(path),'sourcePath':relative,'gitBlob':actual})
  for i,t in enumerate(r['mapData']['tiles']):
   if t['tileKey'] not in TILES:continue
   coords=[{'row':ri,'col':ci} for ri,row in enumerate(r['mapData']['map']) for ci,v in enumerate(row) if v==i]
   rows.append({'sourcePath':relative,'pointer':f'/mapData/tiles/{i}','value':t,'usedAt':coords})
  for group in ['tokenInsts','tokenCards']:
   for i,t in enumerate(r.get('predefines',{}).get(group,[])):
    if t.get('inst',{}).get('characterKey') in TOKENS:rows.append({'sourcePath':relative,'pointer':f'/predefines/{group}/{i}','value':t})
 verify=json.loads((ROOT/'docs/research/evidence/route-operations-20261107/data-source-verification.json').read_text());tablehash={Path(v['sourcePath']).name:v for v in verify['result']['sources']}
 tables={}
 for table,keys in [('character_table.json',sorted(TOKENS|{'char_143_ghost'})),('skill_table.json',['sktok_mire','sktok_tidectrl_3','sktok_achplat'])]:
  path=a.tables/table;assert fingerprint(path)['sha256']==tablehash[table]['sha256'];sources.append({**fingerprint(path),'sourcePath':'zh_CN/gamedata/excel/'+table,'gitBlob':tablehash[table]['actualGitBlob']});r=json.loads(path.read_bytes())
  for key in keys:
   v=r[key]
   if table=='character_table.json':
    fields=['name','profession','subProfessionId','skills','trait','phases'];v={k:v[k] for k in fields if k in v}
   tables[table+'/'+key]=v
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':{'collectedOn':'2026-11-10','script':fingerprint(Path(__file__)),'source':'https://github.com/Kengxxiao/ArknightsGameData','revision':REV,'sources':sources,'scope':'Original JSON fields and exact placements from the pinned mirror. Config activation is separate from installed Prefab binding and native execution.'},'result':{'levelSelections':rows,'tableSelections':tables}},ensure_ascii=False,indent=2)+'\n');print('level selections',len(rows),'table entries',len(tables))
if __name__=='__main__':main()

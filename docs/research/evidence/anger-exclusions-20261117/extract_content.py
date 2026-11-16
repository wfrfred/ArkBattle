#!/usr/bin/env python3
"""Re-extract one serialized policy witness and one real empty fallback."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path
ROOT=Path.cwd();sys.dont_write_bytecode=True
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint
HELPER=ROOT/'docs/research/evidence/resource-mechanisms-20261114/recovery-elemental/extract_content.py'
SELECTION={'battle/enm_pfb_26.ab':['enemy_2104_dycast'],'battle/prefabs/[uc]skills.ab':['skchr_apionr_1']}
DATA=ROOT/'.cache/native-research/route-operations-20261107/data'

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);p.add_argument('--raw-out',type=Path,required=True);a=p.parse_args()
 spec=importlib.util.spec_from_file_location('anger_policy_content',HELPER);helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper);helper.SELECTION=SELECTION
 sys.argv=[str(HELPER),'--out',str(a.raw_out)];helper.main()
 raw=json.loads((a.raw_out/'content.json').read_text())
 enemy_path=DATA/'enemy_database.json';char_path=DATA/'character_table.json';skill_path=DATA/'skill_table.json'
 enemies=json.loads(enemy_path.read_text());chars=json.loads(char_path.read_text());skills=json.loads(skill_path.read_text())
 result=raw['result']|{'enemy':next(x for x in enemies['enemies'] if x['Key']=='enemy_2104_dycast'),'character':chars['char_513_apionr'],'skill':skills['skchr_apionr_1']}
 provenance=raw['provenance']|{'collectedOn':'2026-11-17','projectionTool':fingerprint(Path(__file__)),'configurationSource':'Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f','configurationInputs':[fingerprint(x)for x in (enemy_path,char_path,skill_path)],'configurationPointers':['/enemies/*[Key=enemy_2104_dycast]','/char_513_apionr','/skchr_apionr_1']}
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'components':len(result['components']),'out':str(a.out)}))
if __name__=='__main__':main()

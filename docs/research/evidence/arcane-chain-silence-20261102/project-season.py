#!/usr/bin/env python3
"""Project two equipment bindings and silence from the pinned mirror files."""
import argparse,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--activity',type=Path,required=True);p.add_argument('--buff',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
sha='86b6e749d3384dd0c7b825abbb795845dc6df933';inputs=[]
for path,suffix in [(a.activity,'excel/activity_table.json'),(a.buff,'buff_table.json')]:inputs.append(dict(url=f'https://github.com/Kengxxiao/ArknightsGameData/blob/{sha}/zh_CN/gamedata/'+suffix,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
act=json.loads(a.activity.read_text())['activity']['AUTOCHESS_SEASON']['act2autochess'];buff=json.loads(a.buff.read_text());keys=['eff_acarm048','eff_acgarm048']
result=dict(provenance=dict(source='Third-party extracted game-data mirror, pinned historical commit; not the installed bundle',commit=sha,inputs=inputs),result=dict(effectInfoDataDict={k:act['effectInfoDataDict'][k] for k in keys},effectBuffInfoDataDict={k:act['effectBuffInfoDataDict'][k] for k in keys},silence=buff['silence']))
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')

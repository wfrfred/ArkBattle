#!/usr/bin/env python3
"""Re-run the selected static/resource scans outside the evidence directory."""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

BATCH=Path(__file__).parent

def fp(path):
    raw=path.read_bytes();return {'path':str(path),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    if a.out.resolve().is_relative_to(BATCH.resolve()):p.error('fresh output must be outside evidence')
    a.out.mkdir(parents=True,exist_ok=True)
    commands=[
      [sys.executable,str(BATCH/'extract_static.py'),'--ep-table','.cache/native-research/resource-mechanisms-20261114/recovery-elemental/ep_breakbuff_table.json','--out',str(a.out/'static-inputs.json')],
      [sys.executable,str(BATCH/'extract_levels.py'),'--out',str(a.out/'level-examples.json')],
      [sys.executable,str(BATCH/'extract_content.py'),'--out',str(a.out/'content')],
      [sys.executable,str(BATCH/'scan_recovery_inputs.py'),'--out',str(a.out/'rare-inputs.json')],
    ]
    for c in commands:subprocess.run(c,check=True)
    pairs=[('static-inputs.json','static-inputs.json'),('level-examples.json','level-examples.json'),('content.json','content/content.json'),('templates.json','content/templates.json'),('holder-usage.json','content/holder-usage.json'),('rare-inputs.json','rare-inputs.json')]
    rows=[]
    for old,new in pairs:
        x,y=BATCH/old,a.out/new
        rows.append({'historical':fp(x),'fresh':fp(y),'resultEqual':json.loads(x.read_text())['result']==json.loads(y.read_text())['result']})
    payload={'provenance':{'checkedOn':'2026-11-14','script':fp(Path(__file__)),'commands':commands},'result':{'complete':all(r['resultEqual'] for r in rows),'comparisons':rows}}
    (a.out/'verification.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'complete':payload['result']['complete'],'outputs':len(rows)}))
    if not payload['result']['complete']:sys.exit(1)

if __name__=='__main__':main()

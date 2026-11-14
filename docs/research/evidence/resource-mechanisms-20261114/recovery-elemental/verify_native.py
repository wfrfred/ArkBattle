#!/usr/bin/env python3
"""Independently re-extract every archived recovery native body and compare it."""
import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
BATCH = Path(__file__).parent
FILES = ('core-operations.json','overflow-operations.json','attack-ep-source.json',
         'formula-operations.json','constants.json','maximum-ep.json','prezero-operations.json',
         'special-recovery.json','burst-controller.json','ep-regeneration-content.json','hp-synchronization.json')

def fp(path):
    b=path.read_bytes();return {'path':str(path),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
    originals={};inputs=[]
    for name in FILES:
        path=BATCH/name;inputs.append(fp(path))
        for body in json.loads(path.read_text())['result']['bodies']:
            old=originals.setdefault(body['methodIndex'],body)
            if old!=body:raise ValueError(('duplicate body differs',body['methodIndex']))
    a.out.mkdir(parents=True,exist_ok=True)
    fresh=a.out/'native-bodies.json'
    command=['uv','run','--offline','docs/research/evidence/facing-semantics-20261113/extract.py','--out',str(fresh)]
    for index in sorted(originals):command+=['--body-index',str(index)]
    env={**os.environ,'UV_CACHE_DIR':str(ROOT/'.cache/uv')}
    subprocess.run(command,check=True,env=env)
    replicas={b['methodIndex']:b for b in json.loads(fresh.read_text())['result']['bodies']}
    comparisons=[{'methodIndex':i,'fullname':v['fullname'],'equal':replicas.get(i)==v} for i,v in sorted(originals.items())]
    result={'provenance':{'checkedOn':'2026-11-14','script':fp(Path(__file__)),'inputs':inputs,'command':command,'freshOutput':fp(fresh)},'result':{'complete':all(c['equal'] for c in comparisons),'bodyCount':len(comparisons),'comparisons':comparisons}}
    (a.out/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'complete':result['result']['complete'],'bodies':len(comparisons)}))
    if not result['result']['complete']:sys.exit(1)

if __name__=='__main__':main()

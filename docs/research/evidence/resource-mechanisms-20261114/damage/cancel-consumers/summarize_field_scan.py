#!/usr/bin/env python3
"""Summarize bounded Modifier +0x70 accesses; vector copies are not reason consumers."""
import argparse
import hashlib
import json
import re
from pathlib import Path

def fingerprint(p):
    return {'path': str(p.resolve()), 'bytes':p.stat().st_size,
            'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input',type=Path,required=True)
    parser.add_argument('--out',type=Path,required=True)
    a=parser.parse_args()
    source=json.loads(a.input.read_text())
    hits=[]
    for body in source['result']['bodies']:
        for fragment in body['fragments']:
            for row in fragment['instructions']:
                if not re.search(r'\[(?!rsp|rbp)[^\]]*\+ 0x70\]',row['operands']):
                    continue
                hits.append({'methodIndex':body['methodIndex'],'fullname':body['fullname'],
                             'instruction':row,
                             'scalarDword':bool(re.search(r'(?<!m)\bdword ptr',row['operands']))})
    provenance=source['provenance'] | {'summaryScript':fingerprint(Path(__file__)),
                                      'input':fingerprint(a.input)}
    result={'selection':source['result']['selection'], 'methodCount':len(source['result']['bodies']),
            'unboxedReasonOffset':112,'accesses':hits,
            'scalarAccessCount':sum(x['scalarDword'] for x in hits),
            'scope':'Modifier methods only; offset locators do not prove arbitrary register provenance. Vector copies of a whole Modifier are not reason-specific consumers. Not a whole-module alias analysis.'}
    a.out.parent.mkdir(parents=True,exist_ok=True)
    a.out.write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'methods':result['methodCount'],'accesses':len(hits),'scalar':result['scalarAccessCount']}))
if __name__=='__main__':main()

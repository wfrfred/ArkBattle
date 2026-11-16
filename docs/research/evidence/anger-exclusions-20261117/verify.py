#!/usr/bin/env python3
"""Independently reread native bytes/enums and every positive serialized object."""
import argparse
import hashlib
import importlib.util
import json
import sys
from collections import defaultdict
from pathlib import Path
ROOT=Path.cwd();BATCH=Path(__file__).parent;sys.dont_write_bytecode=True
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
from unity_assets import bundle,serialized

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);a=p.parse_args();n=Native(DEFAULT_GAME)
 old=json.loads((BATCH/'policy-native.json').read_text());inv=json.loads((BATCH/'inventory.json').read_text());scan=json.loads((BATCH/'field-scan.json').read_text())
 identities=[];instructions=[]
 for body in old['result']['bodies']:
  method=n.method(body['methodIndex']);record=body['fragments'][0]['method'];identities.append(method==record)
  for part in body['fragments']:
   for ins in part['instructions']:
    raw=bytes.fromhex(ins['bytes']);instructions.append(n.pe.read(int(ins['address'],16),len(raw))==raw)
 base,_=n.table(8);enums=[]
 for enum in inv['result']['enums']:
  for value in enum['values']:
   raw=bytes.fromhex(value['encodedBytes']);start=base+value['default']['dataIndex'];enums.append(n.metadata[start:start+len(raw)]==raw)
 helper_path=ROOT/'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py';spec=importlib.util.spec_from_file_location('verify_policy_reader',helper_path);helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
 by_bundle=defaultdict(dict)
 for row in scan['result']['positiveObjects']:by_bundle[row['bundle']][(row['file'],int(row['pathId']))]=row
 positive=[];sources=[]
 for relative,rows in by_bundle.items():
  path=DEFAULT_GAME/'Arknights_Data/StreamingAssets/AB/Windows'/relative;sources.append(fingerprint(path))
  found=set()
  for filename,data in bundle(path)[0]:
   if filename.endswith(('.resS','.resource')):continue
   state=serialized(data);layouts,_=helper.helper.trees(data)
   for obj in state['objects']:
    key=(filename,obj['id'])
    if key not in rows:continue
    oldrow=rows[key];raw=data[obj['start']:obj['start']+obj['size']];value=helper.decode(raw,layouts[obj['typeid']]);value={k:v for k,v in value.items()if not k.startswith('common:')}
    positive.append(hashlib.sha256(raw).hexdigest()==oldrow['objectSha256'] and value==oldrow['value']);found.add(key)
  if found!=set(rows):raise ValueError(('positive object missing',relative,set(rows)-found))
 checks={'nativeClient':old['provenance']['client']==n.provenance()['client'],'methodIdentity':all(identities),'nativeInstructions':all(instructions),'enumBytes':all(enums),'allPositiveObjects':all(positive)}
 report={'provenance':{'checkedOn':'2026-11-17','script':fingerprint(Path(__file__)),'sources':sources,'scope':'Native instruction/enum bytes and identities re-read from current client; all 55 positive objects independently decoded. Does not repeat the full negative-field scan or prove runtime activation.'},'result':{'complete':all(checks.values()),'checks':checks,'methods':len(identities),'instructions':len(instructions),'enumConstants':len(enums),'positiveObjects':len(positive)}}
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report['result']))
 if not report['result']['complete']:raise SystemExit(1)
if __name__=='__main__':main()

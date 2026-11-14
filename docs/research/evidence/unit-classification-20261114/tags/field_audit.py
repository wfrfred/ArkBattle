#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory exact native tag storage owners across metadata; no game execution."""
import argparse,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
n=Native(a.game)
owners=[]
for t in n.types:
 name=n.typename(t['index'])
 if not name.startswith('Torappu.'):continue
 fields=n.fields(t['index'])
 if not any(f['name'] in ['enemyTags','race','extraGroupTags'] for f in fields):continue
 owners.append({'index':t['index'],'fullname':name,'fields':fields,'methods':[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]})
prov=n.provenance();prov['script']=fingerprint(Path(__file__))
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':prov,'result':owners},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'owners':len(owners),'out':str(a.out)}))

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Archive direct Cancel producers with complete decoded containing methods."""
import bisect, importlib.util, json, sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint
helper_path=Path(__file__).parents[1]/'trace_flags.py'
spec=importlib.util.spec_from_file_location('body_helper',helper_path)
helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
n=Native(DEFAULT_GAME)
target=n.method(72160)
x=n.xrefs(target['address'])
bodies={};calls=[]
for c in x['candidates']:
 ids=c.get('precedingMethodCandidates',[])
 if not ids:continue
 m=n.method(ids[0])
 if not m['fullname'].startswith('Torappu.Battle.'):continue
 if m['index'] not in bodies:bodies[m['index']]=helper.full_body(n,m)
 for f in bodies[m['index']]['fragments']:
  ins=f['instructions']
  for i,r in enumerate(ins):
   if r['address']==c['address'] and r.get('target')==hex(target['address']):
    calls.append({'callerIndex':m['index'],'caller':m['fullname'],'address':r['address'],'preceding':ins[max(0,i-18):i],'following':ins[i+1:i+10]})
p=n.provenance();p['script']=fingerprint(Path(__file__));p['bodyHelper']=fingerprint(helper_path);p['collectedOn']='2026-11-14'
out=Path(__file__).with_name('direct-cancel-producers.json')
out.write_text(json.dumps({'provenance':p,'result':{'target':target,'xrefs':x,'calls':calls,'bodies':list(bodies.values())}},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'calls':len(calls),'methods':len(bodies),'out':str(out)}))
for c in calls:
 print(c['callerIndex'],c['caller'],c['address'])
 print(' | '.join(r['mnemonic']+' '+r['operands'] for r in c['preceding'][-10:]))

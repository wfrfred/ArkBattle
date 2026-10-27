import sys,json
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native(); out=Path('/tmp/stronghold-blocking-native-20261023/modes')
queries=['blockMode','BlockMode','_CheckMotionModeBlockable','isMeleeBlockable','CheckBlockable','blockRadius','blockRadiusSqr','isBlockFree','isBlockable','canBlock','blockMode','blockType','BlockModeChanged','Unblock']
found={}
for q in queries:
 for m in n.method(q):found[m['index']]=m
(out/'methods.json').write_text(json.dumps([dict(m,fullname=n.fullname(m),address=hex(m.get('address',0)),parameters=n.parameters(m)) for m in found.values()],ensure_ascii=False,indent=2))
for i,m in found.items():print(i,hex(m.get('address',0)),n.fullname(m),[p['name'] for p in n.parameters(m)])
for tn in ['Torappu.Battle.Character','Torappu.Battle.Enemy','Torappu.Battle.Unit','Torappu.Battle.Entity','Torappu.Battle.Tile','Torappu.BlockMode','Torappu.Battle.BlockMode']:
 ts=[t for t in n.types if n.typename(t['index'])==tn]
 for t in ts:
  d={'name':tn,'type':t,'fields':n.fields(t),'methods':[dict(m,fullname=n.fullname(m),address=hex(m.get('address',0)),parameters=n.parameters(m)) for m in n.methods[t['methodStart']:t['methodStart']+t['methodCount']]]}
  try:d['enum']=n.enum_values(t['index'])
  except:pass
  (out/(tn.split('.')[-1]+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2))

exec(open('/tmp/stronghold-blocking-native-20261023/modes/research.py').read().split('queries=')[0])
ids=[75898,75899,75968,75969,75970,76549,76550,76430,70673,76428,76429,76914,75890,75892,75927,76551,76558,75885,76559,66511,77190,77194,77198,77169,77168,77294,77516,77103,74317,99959]
for i in ids:
 m=n.method(i);(out/(str(i)+'.asm')).write_text(n.dis(m)); print(i,n.fullname(m),hex(m['address']))
for t in n.types:
 if any(x in t['name'].lower() for x in ['blockmode','motionmode','motion','blockinfo']) and ('Torappu' in t['namespace'] or t['name'] in ['BlockMode','MotionMode']):
  print('TYPE',t['index'],n.typename(t['index']))
  d={'type':t,'fields':n.fields(t)}
  try:d['enum']=n.enum_values(t['index'])
  except:pass
  (out/(str(t['index'])+'-type.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2))

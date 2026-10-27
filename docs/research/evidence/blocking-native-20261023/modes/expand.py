exec(open('/tmp/stronghold-blocking-native-20261023/modes/research.py').read().split('queries=')[0])
ids=[70632,70670,75886,75887,76560,76561,76442,76018,75948,66374,66373,66372,66704]
for i in ids:
 m=n.method(i);(out/(str(i)+'.asm')).write_text(n.dis(m));print(i,n.fullname(m),hex(m['address']))
for m in n.methods:
 if m['slot'] in [33,142] and m['type'] in [10201,11346,11372]: print('SLOT',m['index'],n.fullname(m),m['slot'],hex(m.get('address',0)))
for addr in [0x180a64780,0x180a64910,0x180a64b90]:
 m={'index':0,'name':'raw-interface-wrapper','type':0,'token':0,'address':addr};(out/(hex(addr)+'.asm')).write_text(n.dis(m,0x190))

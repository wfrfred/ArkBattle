exec(open('/tmp/stronghold-blocking-native-20261023/modes/research.py').read().split('queries=')[0])
import struct,capstone
cs=capstone.Cs(capstone.CS_ARCH_X86,capstone.CS_MODE_64);cs.detail=True
for i in [77103,76551,75927,76558]:
 m=n.method(i)
 for ins in cs.disasm(n.read(m['address'],min(0x150,min(x for x in n.addr_methods if x>m['address'])-m['address'])),m['address']):
  if ins.mnemonic in ['movss','mulss','comiss']:
   for op in ins.operands:
    if op.type==capstone.x86.X86_OP_MEM and op.mem.base==capstone.x86.X86_REG_RIP:
     a=ins.address+ins.size+op.mem.disp; print('CONST',i,hex(ins.address),hex(a),struct.unpack('<f',n.read(a,4))[0])
for tn in ['Torappu.AbnormalFlag','Torappu.Battle.AbnormalFlag','Torappu.Battle.SideType']:
 for t in n.types:
  if n.typename(t['index'])==tn:
   print('TYPE',tn,t['index']);fs=n.fields(t)
   for f in fs:
    b=n.field_default_blob(f['index'],8)
    if not b:continue
    z=bytes.fromhex(b['bytes']);v=z[0]
    if v<128:
     v=(v>>1)^(-(v&1));
     if v in [3,20,33,41] or 'SideType' in tn:print('ENUM',f['name'],v)

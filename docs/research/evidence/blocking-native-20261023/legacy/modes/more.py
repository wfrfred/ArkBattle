exec(open('/tmp/stronghold-blocking-native-20261023/modes/research.py').read().split('queries=')[0])
import struct,capstone
ids=[76356,75849,75822,77197,70631,70629]
for q in ['blockSide','isBlockFree','TileDynamicPositionController','isMeleeBlockable','RevalidateBlockees','BlockModeChanged','CheckInBlockRange','SpecialBlockCondition.CheckBlockable','Unit.get_side','Unit.get_effectiveSide']:
 for m in n.method(q):
  if m['index'] not in ids and m['type']<38091: ids.append(m['index'])
for i in ids:
 m=n.method(i);(out/(str(i)+'.asm')).write_text(n.dis(m)); print(i,n.fullname(m),hex(m['address']))
 if m['type']==11393 and m['name']=='get_hasCombat': print(n.dis(m))
cs=capstone.Cs(capstone.CS_ARCH_X86,capstone.CS_MODE_64);cs.detail=True
constants=[]
for i in [75890,75892,77169,70632]:
 m=n.method(i)
 for ins in cs.disasm(n.read(m['address'],0x300),m['address']):
  if ins.mnemonic in ['movss','mulss','comiss']:
   for op in ins.operands:
    if op.type==capstone.x86.X86_OP_MEM and op.mem.base==capstone.x86.X86_REG_RIP:
     a=ins.address+ins.size+op.mem.disp; val=struct.unpack('<f',n.read(a,4))[0]; print('CONST',i,hex(ins.address),hex(a),val);constants.append({'method':i,'instruction':hex(ins.address),'address':hex(a),'float':val})
(out/'constants.json').write_text(json.dumps(constants,indent=2))
for enumname in ['Torappu.MotionMode','Torappu.Battle.SideType','Torappu.BuildableType','Torappu.TileData','Torappu.Battle.Tile.TileDynamicPositionController']:
 for t in n.types:
  if n.typename(t['index'])==enumname:
   fs=n.fields(t)
   vals=[]
   for f in fs:
    b=n.field_default_blob(f['index'],8)
    if b:
     z=bytes.fromhex(b['bytes']);v=z[0]
     if v<128: v=(v>>1)^(-(v&1)); vals.append({'name':f['name'],'value':v,'encodedByte':z[:1].hex()})
   data={'typename':enumname,'type':t,'fields':fs,'enumsCorrected':vals}
   (out/(str(t['index'])+'-type-correct.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2))

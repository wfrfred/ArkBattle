import sys,json,struct,bisect
from pathlib import Path
sys.path.insert(0,'/tmp/stronghold-navigation-native-20261018')
from native import Native
n=Native();p=Path('/tmp/stronghold-blocking-timing-native-20261023/immediate');starts=sorted(n.addr_methods)
targets={0x180005540,0x180a31400,0x180aa09e0,0x180a38200};out=[]
for sn,va,sz,rp,rs in n.sections:
 if sn not in ('.text','il2cpp'):continue
 end=rp+rs; off=rp
 while True:
  off=n.b.find(b'\xe8',off,end)
  if off<0 or off+5>end:break
  addr=n.base+va+off-rp;dst=addr+5+struct.unpack_from('<i',n.b,off+1)[0]
  if dst in targets:
   owner=starts[bisect.bisect_right(starts,addr)-1];ms=n.addr_methods[owner]
   if dst!=0x180005540 or b'\xb9\xec\x00\x00\x00' in n.b[max(rp,off-96):off]:
    out.append(dict(address=hex(addr),dst=hex(dst),method=ms[0]['index'],owner=n.fullname(ms[0])))
    if not (p/f"{ms[0]['index']}.asm").exists():(p/f"{ms[0]['index']}.asm").write_text(n.dis(ms[0]))
  off+=1
(p/'search-xrefs.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))

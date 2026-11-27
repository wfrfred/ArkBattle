import sys, pathlib, struct, importlib.util, collections, concurrent.futures
sys.dont_write_bytecode=True
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from unity_assets import *
from native import DEFAULT_GAME
spec=importlib.util.spec_from_file_location("tt", "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py")
tt=importlib.util.module_from_spec(spec);spec.loader.exec_module(tt)
base=DEFAULT_GAME/'Arknights_Data/StreamingAssets/AB/Windows'; upd=DEFAULT_GAME/'Arknights_Data/PersistentData/Bundles'
script_dict={}
for src in (base,upd):
 p=src/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
 if not p.exists():continue
 for n,d in bundle(p)[0]:
  if n.endswith(('.resS','.resource')):continue
  for o in serialized(d)['objects']:
   if o['classid']==115:
    s=script(o,d)
    if ('MoveController' in s['cl'] or s['cl'] in ('Character','Trap','Token','GiantTrap','Enemy')) and 'Battle' in s['ns']:script_dict[(n,int(s['id']))]=s['cl']
wanted={sid for n,sid in script_dict}
def scan(p):
 results=collections.Counter(); matches=[]
 try:
  for n,d in bundle(p)[0]:
   if n.endswith(('.resS','.resource')):continue
   os=serialized(d)['objects']; named={o['id']:o for o in os if o['classid']==1}
   objs=[(o,struct.unpack_from('<iq',d,o['start']+16)) for o in os if o['classid']==114 and o['size']>=28]
   objs=[(o,k) for o,k in objs if k[1] in wanted]
   if not objs:continue
   layouts,ext=tt.trees(d)
   for o,(fi,pi) in objs:
    sn=n if fi==0 else ext[fi-1]['path'].split('/')[-1]
    cls=script_dict.get((sn,pi))
    if cls is None: continue
    results[cls]+=1
    if 'MoveController' in cls or cls=='Enemy':
     owner=struct.unpack_from('<q',d,o['start']+4)[0]
     obj=named.get(owner); name=None
     if obj:
      r=Reader(d,p=obj['start']);r.read(r.val('i')*12);r.val('i');name=r.string()
     matches.append((cls,name,o['id'],d[o['start']+12]))
  return(p,results,matches,None)
 except Exception as e:return(p,results,matches,repr(e))
for src in (base,upd):
 for glob in ('charpack/*.ab','pkgrps/btl_pfb_tokens_*.ab','battle/prefabs/levelprefabs/**/*.ab'):
  paths=sorted(src.glob(glob))
  total=collections.Counter(); errs=[]; found=[]
  with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
   for p,rows,matches,err in ex.map(scan,paths):
    total.update(rows)
    if err:errs.append((str(p.relative_to(src)),err))
    if matches:found.append((str(p.relative_to(src)),matches))
  print(src.name,glob,len(paths),total,'errors',errs,'matches',found,flush=True)

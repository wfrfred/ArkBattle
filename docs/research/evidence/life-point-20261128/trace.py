import sys,json
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from native import Native
n=Native()
types={}
for t in n.types:
 if t['name'] in ['BattleController','Options','BattleOptions','Modifier','DefaultGameMode','RoguelikeBattleManager','StrongholdGameMode','ExtraInfo']:
  name=n.typename(t['index'])
  if name.startswith('Torappu.Battle.') or name=='Torappu.LevelData/Options':
   types[name]=[f for f in n.fields(t['index']) if any(x in f['name'].lower() for x in ['life','modifier','option'])]
m=[n.method(i['index']) for i in n.methods if any(s in n.string(i['nameIndex']) for s in ['ApplyGlobalModifier','OnPlayerLifeToZero','LifePoint','OnModifyLifePoint'])]
b=[n.disassemble(i['index']) for i in m if i['fullname'] in ['Torappu.Battle.BattleController._ApplyGlobalModifier','Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnPlayerLifeToZero']]
branches=[n.disassemble_at(a) for a in [0x180654dd9,0x180d94475]]
json.dump(dict(provenance=n.provenance(),result=dict(fields=types,methods=m,bodies=b,branches=branches)),open('.cache/native-research/life-point-20261128/trace.json','w'),indent=2)

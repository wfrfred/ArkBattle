import sys,json
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from native import Native
n=Native()
types={}
for t in n.types:
 name=n.typename(t['index'])
 if name in ['Torappu.PlayerSide','Torappu.Battle.GameMode.GameModeFactory/AutoChessGameMode','Torappu.Battle.Roguelike.RoguelikeBattleManager']:
  types[name]=dict(fields=n.fields(t['index']),methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])])
b=[n.disassemble(m['index']) for m in types['Torappu.Battle.GameMode.GameModeFactory/AutoChessGameMode']['methods'] if 'Life' in m['fullname'] or 'Exit' in m['fullname'] or 'Side' in m['fullname']]
json.dump(dict(provenance=n.provenance(),result=dict(types=types,bodies=b)),open('.cache/native-research/life-point-20261128/side.json','w'),indent=2)

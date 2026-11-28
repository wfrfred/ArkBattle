import sys,json
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from native import Native
n=Native()
t=next(t for t in n.types if n.typename(t['index'])=='Torappu.Battle.AutoChess.AutoChessGameManager')
ms=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
bs=[n.disassemble(m['index']) for m in ms if any(k in m['fullname'].lower() for k in ['life','onenemyreachexit','playerhp'])]
json.dump(dict(provenance=n.provenance(),result=dict(methods=ms,fields=n.fields(t['index']),bodies=bs)),open('.cache/native-research/life-point-20261128/mode.json','w'),indent=2)

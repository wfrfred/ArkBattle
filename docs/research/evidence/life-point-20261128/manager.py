import sys,json
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from native import Native
n=Native()
owners=['AutoChessBattleStatusDataModel','AutoChessDataBridgeLocalPlayer','AutoChessStepModeManager']
types={}
for t in n.types:
 if t['name'] in owners:
  types[n.typename(t['index'])]=dict(fields=n.fields(t['index']),methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])])
bs=[n.disassemble(m['index']) for t in types.values() for m in t['methods'] if any(k in m['fullname'].lower() for k in ['life','onselfbattleenemyreachexit','onhelpbattleenemyreachexit','onbossbattleenemyreachexit','onenemyreachexit','playerhp'])]
json.dump(dict(provenance=n.provenance(),result=dict(types=types,bodies=bs)),open('.cache/native-research/life-point-20261128/manager.json','w'),indent=2)

import sys,json
sys.path.insert(0,'.agents/skills/arkbattle-native-research/scripts')
from native import Native
n=Native()
bs=[n.disassemble_at(a) for a in [0x180c0a675,0x180c074ba,0x180c06ec1,0x180d94478]]
# Preserve special boss manager body too.
for m in n.methods:
 if n.string(m['nameIndex'])=='OnBossBattleEnemyReachExit' and n.typename(m['declaringType']).endswith('/MockBossBattleManager'):
  bs.append(n.disassemble(m['index']))
json.dump(dict(provenance=n.provenance(),result=bs),open('.cache/native-research/life-point-20261128/manager-branches.json','w'),indent=2)

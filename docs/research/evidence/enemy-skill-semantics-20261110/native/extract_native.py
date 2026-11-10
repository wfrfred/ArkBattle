#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Re-extract selected current native methods; no execution or hotfix claims."""
import argparse
import bisect
import importlib.util
import json
from pathlib import Path

def main():
    ROOT = Path.cwd()
    TOOL = ROOT / '.agents/skills/arkbattle-native-research/scripts/native.py'
    spec = importlib.util.spec_from_file_location('arkbattle_native', TOOL)
    native = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(native)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=native.DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    n = native.Native(args.game)
    OUT = args.out
    OUT.mkdir(parents=True, exist_ok=True)

    names = {
        'Torappu.Battle.EnemySkill.AssignData', 'Torappu.Battle.EnemySkill.Init',
        'Torappu.Battle.EnemySkill.Awake',
        'Torappu.Battle.EnemySkill.CastToTarget',
        'Torappu.Battle.EnemySkill.CheckAvailable',
        'Torappu.Battle.EnemySkill.Tick',

        'Torappu.Battle.EnemySkill.TryReduceSp', 'Torappu.Battle.EnemySkill._OnCastStart',
        'Torappu.Battle.EnemySkill._OnCastFinish', 'Torappu.Battle.EnemySkill._UpdateRegisterAsModifier',

        'Torappu.Battle.EnemySkill.get_recoverSpWhenAffecting',
        'Torappu.Battle.EnemySkill.get_isEnabled',
        'Torappu.Battle.Enemy._GenerateSpData', 'Torappu.Battle.Enemy.OnTick',
        'Torappu.Battle.Entity.get_sp',

        'Torappu.Battle.Ability.get_isCasting',

        'Torappu.Battle.BasicSkill.OnSkillStart', 'Torappu.Battle.BasicSkill.OnSkillEnd',
    }
    selected = []
    for m in n.methods:
        full = n.typename(m['declaringType']) + '.' + n.string(m['nameIndex'])
        if full in names:
            selected.append(n.method(m['index']))

    def blocks(m):
        start = m['address']
        if not start:
            return []
        p = bisect.bisect_right(n.addresses, start)
        limit = n.addresses[p]
        cursor = start
        result = []
        # Metadata successor is a conservative extraction bound, not a proof of all
        # code paths; call targets and non-contiguous funclets need separate evidence.
        while cursor < limit:
            body = n.disassemble_at(cursor, limit - cursor, method=m if cursor == start else None)
            result.append(body)
            next_cursor = int(body['decodedEnd'], 16)
            if next_cursor <= cursor:
                break
            cursor = next_cursor
        if m['fullname'] == 'Torappu.Battle.Enemy.OnTick':
            instructions = [i for c in result for i in c['instructions']]
            calls = [k for k, i in enumerate(instructions) if any('EnemySkill.get_isEnabled' in name or 'EnemySkill.Tick' in name for name in i.get('methods', []))]
            keep = {k for at in calls for k in range(max(0, at-16), min(len(instructions), at+12))}
            return dict(method=m, extractionLimit=hex(limit), selection={'calls':['EnemySkill.get_isEnabled','EnemySkill.Tick'], 'precedingInstructions':16, 'followingInstructions':11}, instructions=[i for k,i in enumerate(instructions) if k in keep])
        return dict(method=m, extractionLimit=hex(limit), chunks=result)

    result = {
        'scope': 'Linear chunks from entry to next known metadata method. Includes separate pdata continuation chunks; not a runtime or complete indirect-call proof.',
        'missing': sorted(names - {m['fullname'] for m in selected}),
        'methods': [blocks(m) for m in selected],
    }
    (OUT/'selected-bodies.json').write_text(json.dumps({'provenance':n.provenance(), 'result':result},ensure_ascii=False,indent=2)+'\n')
    queries = ['Torappu.Battle.EnemySkill', 'Torappu.Battle.Entity', 'Torappu.Battle.BasicSkill', 'Torappu.Battle.Ability', 'Torappu.PeriodicTimer', 'Torappu.LevelData/EnemyData/ESkillData']
    types=[]
    for name in queries:
        for t in n.types:
            if n.typename(t['index']) == name:
                fields = [f for f in n.fields(t['index']) if not f['static']]
                if name == 'Torappu.Battle.Entity':
                    fields = [f for f in fields if 'sp' in f['name'].lower()]
                methods = [n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
                methods = [m for m in methods if m['fullname'] in names or m['slot'] in (4,5,19,35,40) or m['fullname'].endswith(('get_isAffecting','get_priority','get_isUsedUp','Reset'))]
                types.append(dict(fullname=name, selection={'fields':'nonstatic; Entity limited to names containing sp', 'methods':'selected names and dispatch slots 4/5/19/35/40 plus queried facts'}, typeIndex=t['index'], parentIndex=t['parentIndex'], fields=fields, methods=methods))
    (OUT/'contracts.json').write_text(json.dumps({'provenance':n.provenance(),'result':types},ensure_ascii=False,indent=2)+'\n')
    print({'selectedMethods':len(selected),'missing':result['missing'],'types':len(types)})


if __name__ == '__main__':
    main()

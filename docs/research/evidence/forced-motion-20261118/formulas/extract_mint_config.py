#!/usr/bin/env python3
"""Collect the installed Mint S2 mode, attack and Buff template bindings."""
import argparse
import hashlib
import json
from pathlib import Path
import runpy
import sys
from tempfile import TemporaryDirectory

ROOT = Path.cwd()
SCRIPT = ROOT / 'docs/research/evidence/attack-way-20261118/extract_prefabs.py'
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint
from unity_assets import bundle, serialized, Reader

GAME = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data')
TEMPLATES = GAME / 'PersistentData/Bundles/config/buff_template_holder.ab'
TABLES = ROOT / '.cache/native-research/route-operations-20261107/data'
CHARACTER = 'char_388_mint'
SKILL = 'skchr_mint_2'


def prefab_components():
    main = runpy.run_path(str(SCRIPT))['main']
    main.__globals__.update(SELECTION={f'charpack/{CHARACTER}.ab': [CHARACTER], 'battle/prefabs/[uc]skills.ab': [SKILL]})
    with TemporaryDirectory(prefix='arkbattle-mint-') as temp_dir:
        path = Path(temp_dir) / 'decoded.json'
        args = sys.argv
        try:
            sys.argv = [str(SCRIPT), '--out', str(path)]
            main()
        finally:
            sys.argv = args
        return json.loads(path.read_text())


def template_records():
    selected = {'mint_s_2', 'mint_s_2[pull]'}
    results = {}
    for name, data in bundle(TEMPLATES)[0]:
        if name.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            if not all(key.encode() in raw for key in selected):
                continue
            reader = Reader(raw, p=28)
            holder = reader.string()
            for _ in range(reader.val('i')):
                start = reader.p
                key, effect, priority = reader.string(), reader.string(), reader.val('i')
                events = []
                for _ in range(reader.val('i')):
                    event, program = reader.val('i'), reader.string()
                    reference_count = reader.val('i')
                    reader.read(reference_count * 12)
                    if key in selected and event == 0:
                        events.append({'event': event, 'actions': json.loads(program), 'referenceCount': reference_count})
                if key in selected:
                    results[key] = {'holder': holder, 'file': name, 'pathId': str(obj['id']), 'offset': start, 'size': reader.p - start, 'recordSha256': hashlib.sha256(raw[start:reader.p]).hexdigest(), 'effect': effect, 'priority': priority, 'events': events}
            assert reader.p == len(raw)
    assert results.keys() == selected
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=Path(__file__).with_name('mint-config.json'))
    args = parser.parse_args()
    work = prefab_components()
    components = {row['pathId']: row for row in work['result']}
    character = components['485246306630486299']
    skill = components['5049859550413674908']
    active_buff = components['6042205285299607964']
    mode_index = skill['value']['_attackBlackboardModeIndex']
    assert mode_index == 2
    mode = components[str(character['value']['_modes']['Array'][mode_index]['m_PathID'])]
    attack = components[str(mode['value']['_attack']['m_PathID'])]
    assert attack['script']['cl'] == 'MeleeAttack'
    buff = active_buff['value']['_buffs']['Array'][0]
    assert buff['templateKey'] == 'mint_s_2'
    assert {'key': 'mode', 'value': float(mode_index), 'valueStr': ''} in buff['blackboard']['Array']
    assert attack['value']['_activeBuffs']['Array'][0]['templateKey'] == 'mint_s_2[pull]'
    templates = template_records()
    for key, typ in [('mint_s_2', 'SwitchMode'), ('mint_s_2[pull]', 'DragTowardSource')]:
        assert templates[key]['events'][0]['actions'][0]['$type'] == 'Torappu.Battle.Action.Nodes+' + typ
    character_table, skill_table = TABLES / 'character_table.json', TABLES / 'skill_table.json'
    character_data = json.loads(character_table.read_text())[CHARACTER]['skills'][1]
    skill_data = json.loads(skill_table.read_text())[SKILL]['levels']
    assert character_data['skillId'] == SKILL and character_data['overridePrefabKey'] is None
    selection = [(character, ['_modes']), (skill, ['_attackBlackboardModeIndex']), (active_buff, ['_buffs']), (mode, ['_attack']), (attack, ['_activeBuffs'])]
    provenance = {
        'caseScript': fingerprint(Path(__file__)),
        'prefabDecoder': work['provenance'],
        'templates': fingerprint(TEMPLATES),
        'mirrorTables': [fingerprint(character_table), fingerprint(skill_table)],
        'mirrorRevision': '63c7cec73c3858d0ae913f85cc89af3cef4d744f',
    }
    result = {
        'characterSkill': {key: character_data[key] for key in ('skillId', 'overridePrefabKey')},
        'skill': [
            {'prefabId': level['prefabId'],
             'attackForce': next(item['value'] for item in level['blackboard'] if item['key'] == 'attack@force')}
            for level in skill_data
        ],
        'components': [dict(row, value={field: row['value'][field] for field in fields})
                       for row, fields in selection],
        'templates': templates,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, indent=2,
                                   ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()

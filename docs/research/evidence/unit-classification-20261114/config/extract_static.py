#!/usr/bin/env python3
"""Inventory classification axes in two byte-verified, fixed Git mirror inputs."""
import collections
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / 'docs/research/evidence/unit-classification-20261114/config/static-inputs.json'
SOURCES = [
    dict(file='.cache/native-research/unit-audit-20261110/operator-config/character_table.json',
         revision='17759cc8cdf37388414145d16262a3a06f3ab25e',
         path='zh_CN/gamedata/excel/character_table.json',
         sha256='e523c7c83c36e2d76697121079e17d0282da1a94d59a55e1cc55616edf0b41c4',
         gitBlobSha1='f7284f66cfd87273a6805142b389aa314320968f'),
    dict(file='.cache/native-research/leithanien-enemydata-20261109/enemy_database.json',
         revision='63c7cec73c3858d0ae913f85cc89af3cef4d744f',
         path='zh_CN/gamedata/levels/enemydata/enemy_database.json',
         sha256='eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b',
         gitBlobSha1='62ab806926b9c8ca5c80524730caf0066f6c2c2f'),
    dict(file='.cache/native-research/unit-audit-20261110/operator-config/battle_equip_table.json',
         revision='17759cc8cdf37388414145d16262a3a06f3ab25e',
         path='zh_CN/gamedata/excel/battle_equip_table.json',
         sha256='991ce1a8cd76682704b7e95fb71de8c726fd9ff62038a2da31b8a3870dc48055',
         gitBlobSha1='7039d6565ad74eb77128d2ea137837ef62800ffe'),
]
CHARACTER_IDS = [
    'char_208_melan', 'char_311_mudrok', 'char_158_milu', 'char_102_texas',
    'char_263_skadi', 'token_10001_deepcl_tentac', 'token_10007_phatom_twin',
    'trap_001_crate', 'trap_007_ballis',
]
CHARACTER_FIELDS = ['name', 'profession', 'subProfessionId', 'position', 'tagList',
                    'nationId', 'groupId', 'teamId', 'mainPower', 'subPower',
                    'rarity', 'isNotObtainable']
ENEMY_IDS = [
    'enemy_1000_gopro', 'enemy_1002_nsabr', 'enemy_1003_ncbow', 'enemy_1005_yokai',
    'enemy_1007_slime', 'enemy_1010_demon', 'enemy_1043_zomsbr', 'enemy_1126_spslme',
    'enemy_1151_dslntc', 'enemy_1511_mdrock', 'enemy_1544_cledub', 'enemy_1570_ymgscm',
    'enemy_19064_akflwr',
]
ENEMY_FIELDS = ['name', 'prefabKey', 'enemyTags', 'applyWay', 'motion', 'levelType']


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def distribution(values):
    counter = collections.Counter(canonical(value) for value in values)
    return [dict(value=json.loads(value), count=count) for value, count in sorted(counter.items())]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=OUT)
    args = parser.parse_args()
    inputs, provenance = [], []
    for source in SOURCES:
        raw = (ROOT / source['file']).read_bytes()
        sha256 = hashlib.sha256(raw).hexdigest()
        blob = hashlib.sha1(f'blob {len(raw)}\0'.encode() + raw).hexdigest()
        assert sha256 == source['sha256'] and blob == source['gitBlobSha1'], source['file']
        provenance.append(dict(source, bytes=len(raw), url='https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/'
                               + source['revision'] + '/' + source['path']))
        inputs.append(json.loads(raw))
    characters, enemy_table, equipment = inputs
    enemies = enemy_table['enemies']
    axes = ['profession', 'subProfessionId', 'position', 'tagList', 'nationId', 'groupId', 'teamId', 'mainPower', 'subPower']
    character_summary = {field: distribution(character.get(field) for character in characters.values()) for field in axes}
    rows = [(index, enemy, level_index, level) for index, enemy in enumerate(enemies)
            for level_index, level in enumerate(enemy['Value'])]
    inventory = {}
    for field in ['enemyTags', 'applyWay', 'motion', 'levelType']:
        defined = [(index, enemy, level_index, level, level['enemyData'][field])
                   for index, enemy, level_index, level in rows if level['enemyData'][field]['m_defined']]
        overrides = []
        for index, enemy, level_index, level, raw_value in defined:
            if level['level'] == 0:
                continue
            baseline = enemy['Value'][0]['enemyData'][field]
            overrides.append(dict(pointer=f'/enemies/{index}/Value/{level_index}/enemyData/{field}',
                                  id=enemy['Key'], level=level['level'], raw=raw_value, baseline=baseline,
                                  valueDiffersFromFirstRow=raw_value['m_value'] != baseline['m_value']))
        inventory[field] = dict(totalLevelRows=len(rows),
                                definedRows=len(defined),
                                undefinedRows=sum(not level['enemyData'][field]['m_defined'] for _, _, _, level in rows),
                                definedValues=distribution(value['m_value'] for *_, value in defined),
                                undefinedStoredValues=distribution(level['enemyData'][field]['m_value']
                                                                  for _, _, _, level in rows if not level['enemyData'][field]['m_defined']),
                                nonzeroLevelDefinitions=overrides)
    selected_enemies = []
    for index, enemy in enumerate(enemies):
        if enemy['Key'] not in ENEMY_IDS:
            continue
        selected_enemies.append(dict(pointer=f'/enemies/{index}', id=enemy['Key'], levels=[
            dict(level=level['level'], pointer=f'/enemies/{index}/Value/{level_index}/enemyData',
                 enemyData={field: level['enemyData'][field] for field in ENEMY_FIELDS})
            for level_index, level in enumerate(enemy['Value'])]))
    multi_tags = [dict(id=enemy['Key'], level=level['level'],
                      pointer=f'/enemies/{index}/Value/{level_index}/enemyData/enemyTags',
                      raw=level['enemyData']['enemyTags'])
                  for index, enemy, level_index, level in rows
                  if level['enemyData']['enemyTags']['m_defined']
                  and len(level['enemyData']['enemyTags']['m_value'] or []) > 1]
    assert set(CHARACTER_IDS) <= characters.keys()
    assert {entry['id'] for entry in selected_enemies} == set(ENEMY_IDS)
    equipment_examples = []
    for equip_id in ['uniequip_003_siege2', 'uniequip_003_rosmon']:
        for phase_index, phase in enumerate(equipment[equip_id]['phases']):
            for part_index, part in enumerate(phase['parts']):
                for field in ['overrideTraitDataBundle', 'addOrOverrideTalentDataBundle']:
                    candidates = part[field]['candidates'] or []
                    for candidate_index, candidate in enumerate(candidates):
                        equipment_examples.append(dict(
                            pointer=f'/{equip_id}/phases/{phase_index}/parts/{part_index}/{field}/candidates/{candidate_index}',
                            equipId=equip_id, equipLevel=phase['equipLevel'], resKey=part['resKey'],
                            target=part['target'], isToken=part['isToken'],
                            candidate={key: candidate[key] for key in ['prefabKey', 'blackboard', 'rangeId'] if key in candidate}))
    result = dict(
        provenance=dict(collectedOn='2026-11-14', sources=provenance,
                        script=dict(path=str(Path(__file__).resolve()), sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()),
                        scope='Full table inventory; selected original fields. Raw m_defined/m_value preserved, no assumed effective inheritance.'),
        result=dict(characterCount=len(characters), characterTopLevelFields=list(next(iter(characters.values()))),
                    characterDistributions=character_summary,
                    characterExamples=[dict(pointer='/' + key, id=key,
                                            fields={field: characters[key].get(field) for field in CHARACTER_FIELDS})
                                       for key in CHARACTER_IDS],
                    talentBindings=[dict(pointer=f'/{key}/talents/{talent_index}/candidates/{len(talent["candidates"])-1}',
                                         id=key, candidate={field: talent['candidates'][-1].get(field)
                                                          for field in ['prefabKey', 'blackboard', 'rangeId', 'tokenKey']})
                                    for key in ['char_158_milu', 'char_311_mudrok']
                                    for talent_index, talent in enumerate(characters[key]['talents'])],
                    equipmentExamples=equipment_examples,
                    enemyCount=len(enemies), enemyLevelRowCount=len(rows), enemyFields=ENEMY_FIELDS,
                    enemyDistributions=inventory, enemyExamples=selected_enemies,
                    multiTagRows=multi_tags,
                    limits=['Mirror inventory includes modes outside ArkBattle support; distributions are not scope claims.',
                            'No multi-tag row was found in this fixed mirror. This does not establish a native single-tag invariant.',
                            'Classification value changes were not found among nonzero-level explicit definitions in this snapshot.',
                            'm_defined=false stored values are not treated as configured overrides.',
                            'Character race/profile text and enemy handbook table are not inputs to this extraction.']))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), characters=len(characters), enemies=len(enemies), enemyLevelRows=len(rows))))


if __name__ == '__main__':
    main()

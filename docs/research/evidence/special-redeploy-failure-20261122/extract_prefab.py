# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract the Kalts2 special-deployment bindings and their selected Buff programs."""

import argparse
from hashlib import sha256
import json
from pathlib import Path
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, script, serialized

DECODER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
sys.path.insert(0, str(DECODER.parent))
from decode_projectile import decode, trees


SKILL = "battle/prefabs/[uc]skills.ab"
CHARACTER = "charpack/char_1052_kalts2.ab"
DYNAMIC_ABILITIES = "battle/prefabs/[uc]dynamicabilities.ab"
SCRIPTS = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
HOLDER = "config/buff_template_holder.ab"
GAME_DATA_REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
EXPECTED = {
    SKILL: "0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3",
    CHARACTER: "97d58abead488de8af1aa40aa1eee8f3ddfa55e5d459140451f28ce05e142713",
    DYNAMIC_ABILITIES: "107f69348d7515321c77d3553f1d963b1e3a0dd1643fc36efcec0d9e73d8251c",
    SCRIPTS: "10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99",
    HOLDER: "8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79",
}


def unpack_bundle(path, name):
    return next(data for file, data in bundle(path)[0] if file == name)


def read_bindings(path, file_name, selected, scripts):
    data = unpack_bundle(path, file_name)
    objects = {row['id']: row for row in serialized(data)['objects']}
    layouts, externals = trees(data)

    def raw(path_id):
        row = objects[path_id]
        return data[row['start']:row['start'] + row['size']]

    def game_object(path_id):
        assert objects[path_id]['classid'] == 1
        reader = Reader(raw(path_id))
        components = [(reader.val('i'), reader.val('q')) for _ in range(reader.val('i'))]
        reader.val('i')
        return dict(pathId=str(path_id), name=reader.string(),
                    localComponents=[str(component) for source, component in components if source == 0])

    result = {}
    for name, path_id, fields in selected:
        row = objects[path_id]
        assert row['classid'] == 114, row
        decoded = decode(raw(path_id), layouts[row['typeid']])
        script_ref = decoded['common:490']
        owner = decoded['common:374']
        assert owner['m_FileID'] == 0, owner
        script_file = externals[script_ref['m_FileID'] - 1]['path'].split('/')[-1] if script_ref['m_FileID'] else file_name
        script_row = scripts[(script_file, script_ref['m_PathID'])]
        assert script_row['name'] == name, script_row
        game = game_object(owner['m_PathID'])
        assert str(path_id) in game['localComponents'], game
        result[name] = dict(pathId=str(path_id), script=script_row, gameObject=game,
                            enabled=decoded['common:349'], fields={field: decoded[field] for field in fields})
    return dict(serializedFile=file_name, components=result)


def read_holder(path, selection):
    templates = {}
    for file, data in bundle(path)[0]:
        if file.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['classid'] != 114:
                continue
            reader = Reader(data[obj['start']:obj['start'] + obj['size']], p=28)
            reader.string()
            for _ in range(reader.val('i')):
                key = reader.string()
                reader.string()
                reader.val('i')
                events = []
                for _ in range(reader.val('i')):
                    event, program = reader.val('i'), reader.string()
                    reader.read(reader.val('i') * 12)
                    if key in selection:
                        events.append(dict(event=event, program=json.loads(program)))
                if key in selection:
                    templates[key] = dict(serializedFile=file, pathId=str(obj['id']), events=events)
    assert templates.keys() == selection, templates.keys()
    return templates


def extract(assets):
    scripts = {(file, row['id']): script(row, data) for file, data in bundle(assets / SCRIPTS)[0]
               if not file.endswith(('.resS', '.resource')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    skill = read_bindings(assets / SKILL, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
        ('SkillProgressHooker', -2859062326968680928, (
            '_inherateProgressFromSharedBlackboardBBKey', '_skillProgressBBKey', '_skillDurationBBKey',
            '_respawnBBKey', '_restoreSkillBuff', '_endSkillBuff',
        )),
        ('Kalts2StatesRecorder', 188519180379717152, ('_cardBuffKeyList', '_deckEffectBuffKey', '_cardBuildableCheckerBuffKey',
                                                    '_inherateProgressFromSharedBlackboardBBKey', '_affectedCardCntKey',
                                                    '_affectedCardUIDKey_1', '_affectedCardUIDKey_2')),
    ], scripts)
    character = read_bindings(assets / CHARACTER, 'CAB-9f91da3a576bbe3aad2aece933113030', [
        ('Character', 1384548417202445919, ('_commonAbilities',)),
        ('EmptyAnimatedAbility', 7538721606666968671, ('_animKey', '_waitForAttackEvent', '_allowNoTarget')),
        ('BuffDuringCastingFixed', -4404402526677148065, ('_buffs',)),
        ('PassiveBuffAbility', 3745648292404878943, ('_buffs',)),
        ('ProjectileToTileWithExtraActionsAbility', -6288204701876396449, ('_projectileKey', '_extraActionEvent', '_extraActions')),
    ], scripts)
    progress = skill['components']['SkillProgressHooker']
    host, ability, buff = (character['components'][name] for name in (
        'Character', 'EmptyAnimatedAbility', 'BuffDuringCastingFixed',
    ))
    assert progress['gameObject']['name'] == 'skchr_kalts2_3'
    assert progress['fields']['_restoreSkillBuff']['buffKey'] == 'kalts2_s_3[restore]'
    assert ability['enabled'] and ability['gameObject']['name'] == 'RespawnBorn'
    assert ability['gameObject'] == buff['gameObject']
    common = {str(reference['m_PathID']) for reference in host['fields']['_commonAbilities']['Array']
              if reference['m_FileID'] == 0}
    restore = character['components']['PassiveBuffAbility']
    assert restore['enabled'] and restore['gameObject']['name'] == 'TryRestoreSkill'
    assert {ability['pathId'], restore['pathId']} <= common
    projectile = character['components']['ProjectileToTileWithExtraActionsAbility']['fields']
    assert projectile['_projectileKey'] == 'projectile_chr_kalts2_s3_2'
    projectile['_extraActions'] = json.loads(projectile['_extraActions']['SerializedState'])
    assert projectile['_extraActions'][1]['$type'].endswith('+Kalts2S3CheckAbleToLand')
    born_damage = read_bindings(assets / DYNAMIC_ABILITIES, 'CAB-6e944a56f5e293093b39d8279f31aded', [
        ('AbilityParallelGroup', 917955117762087795, ('_abilities',)),
        ('EmptyAnimatedAbility', 7483162558775888755, ('_metadata', '_activeBuffs', '_selector')),
        ('PassiveBuffAbility', 2292401635086109555, ('_buffs',)),
    ], scripts)
    group = born_damage['components']['AbilityParallelGroup']
    assert group['gameObject']['name'] == 'rogue_1_random_damage_on_born'
    assert [ref['m_PathID'] for ref in group['fields']['_abilities']['Array']] == [7483162558775888755, 2292401635086109555]
    templates = read_holder(assets / HOLDER, {
        'kalts2_s_3_interrupt', 'kalts2_try_restore_skill', 'kalts2_s_3[restore]', 'rogue_1_trigger_ability[on_born]',
        'rogue_1_random_attack', 'rogue_6_char_loss_hp',
    })
    return {SKILL: skill, CHARACTER: character, DYNAMIC_ABILITIES: born_damage, HOLDER: templates}


def read_relics():
    path = 'zh_CN/gamedata/excel/roguelike_topic_table.json'
    raw = check_output([
        'git', '-C', ROOT / 'assets/arknights-game-data', 'show', f'{GAME_DATA_REVISION}:{path}',
    ])
    details = json.loads(raw)['details']
    selections = (
        ('rogue_2', 'rogue_2_relic_fight_108'), ('rogue_3', 'rogue_3_relic_legacy_157'),
        ('rogue_6', 'rogue_6_relic_fight_11'),
    )
    rows = {f'/details/{topic}/relics/{key}': details[topic]['relics'][key] for topic, key in selections}
    return {'revision': GAME_DATA_REVISION, 'path': path, 'bytes': len(raw), 'sha256': sha256(raw).hexdigest(),
            'records': rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    packages = {name: fingerprint(assets / name) for name in EXPECTED}
    assert {name: package['sha256'] for name, package in packages.items()} == EXPECTED, packages
    provenance = dict(bundles=packages, tool=fingerprint(Path(__file__)), typeTreeDecoder=fingerprint(DECODER))
    result = dict(provenance=provenance, result={**extract(assets), 'relics': read_relics()})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

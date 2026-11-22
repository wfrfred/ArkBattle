# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the SideStory Wirebug skill bindings and external redeployment branches."""

import argparse
import json
from pathlib import Path
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
EVIDENCE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(EVIDENCE / 'special-redeploy-failure-20261122'))

from extract_prefab import DEFAULT_GAME, EXPECTED, GAME_DATA_REVISION, HOLDER, ROOT, SKILL, SCRIPTS
from extract_prefab import bundle, fingerprint, read_bindings, read_holder, script, serialized
from native import Native


SKILLS = {
    'trap_274_pyctrn': ('sktok_pyctrn', -8646635087775556265, 'trap_pyctrn_s'),
    'trap_275_pycfly': ('sktok_pycfly', 368894290933508497, 'trap_pycfly_s'),
}
SELECTED_METHODS = {
    77286: (0x180aa18a1, 0x180aa1902),
    65741: (0x180658f8d, 0x180658fb9),
}


def respawn_nodes(value):
    if isinstance(value, dict):
        if value.get('$type', '').split(',')[0].endswith('+RespawnCharacter'):
            yield value
        for child in value.values():
            yield from respawn_nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from respawn_nodes(child)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()

    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    inputs = {name: fingerprint(assets / name) for name in (SKILL, SCRIPTS, HOLDER)}
    assert all(info['sha256'] == EXPECTED[name] for name, info in inputs.items()), inputs
    scripts = {(file, row['id']): script(row, data) for file, data in bundle(assets / SCRIPTS)[0]
               if not file.endswith(('.resS', '.resource')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    holders = read_holder(assets / HOLDER, {template for _, _, template in SKILLS.values()})
    mirror = ROOT / 'assets/arknights-game-data'
    chars = json.loads(check_output([
        'git', '-C', mirror, 'show', f'{GAME_DATA_REVISION}:zh_CN/gamedata/excel/character_table.json',
    ]))
    bindings = {}
    for character_id, (skill_id, object_id, template) in SKILLS.items():
        assert any(row['skillId'] == skill_id for row in chars[character_id]['skills'])
        selected = read_bindings(assets / SKILL, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
            ('AnimatedActionToTargetAbility', object_id, ('_activeBuffs',)),
        ], scripts)
        ability = selected['components']['AnimatedActionToTargetAbility']
        assert ability['enabled'] and ability['gameObject']['name'] == skill_id, ability
        assert any(buff['templateKey'] == template for buff in ability['fields']['_activeBuffs']['Array'])
        holder = holders[template]
        nodes = list(respawn_nodes(holder['events']))
        assert nodes and all(node['_useExternalRespawn'] for node in nodes), nodes
        bindings[character_id] = dict(name=chars[character_id]['name'], skill=selected, template=template,
                                      serializedFile=holder['serializedFile'], pathId=holder['pathId'],
                                      respawn=nodes)

    native = Native(args.game)
    provenance = native.provenance()
    actual = provenance['client']
    assert actual['dll']['sha256'] == 'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff'
    assert actual['metadata']['sha256'] == 'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'
    provenance.update(bundles=inputs, gameDataRevision=GAME_DATA_REVISION)
    methods = []
    for index, (start, end) in SELECTED_METHODS.items():
        method = native.disassemble(index)
        instructions = [row for row in method['instructions'] if start <= int(row['address'], 16) < end]
        assert instructions
        methods.append(dict(method=method['method'], instructions=instructions))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    result = dict(provenance=provenance, result=dict(bindings=bindings, methods=methods))
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

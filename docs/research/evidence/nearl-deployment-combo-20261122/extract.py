# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Capture the installed Nearl combo assets and their native Draw consumers."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import bundle, serialized, script

PREFAB_READER = ROOT / 'docs/research/evidence/special-redeploy-failure-20261122/extract_prefab.py'
CHARACTER = 'charpack/char_1014_nearl2.ab'
SWORD = 'pkgrps/btl_pfb_tokens_0.ab'
SKILLS = 'battle/prefabs/[uc]skills.ab'
EQUIPS = 'battle/prefabs/[uc]equips.ab'
HOLDER = 'config/buff_template_holder.ab'
SCRIPTS = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
TALENT_FIELDS = ('_cardBuffKey', '_manageType', '_excludeTokenAndTrap', '_selector', '_lifeType')
SELECTION = {
    66755: ((0x1806fd35f, 0x1806fd366), (0x1806fd3fd, 0x1806fd425), (0x1806fd5e2, 0x1806fd612)),
    66792: ((0x1806ff69f, 0x1806ff6a6),),
    66861: ((0x1806eb9dc, 0x1806eba33), (0x1806ebaba, 0x1806ebb18)),
    66911: ((0x1806eb901, 0x1806eb91f),),
    67123: ((0x18070cc08, 0x18070cc24), (0x18070ccaa, 0x18070cd0e)),
    67124: ((0x18070c9bd, 0x18070c9da),),
    67125: ((0x18070c7c4, 0x18070c7e2), (0x18070c825, 0x18070c87c)),
    67127: ((0x1807113a0, 0x180711410),),
    67130: ((0x180711530, 0x18071159e), (0x1807115a3, 0x180711662), (0x180711662, 0x18071167b)),
    67131: ((0x1807116b0, 0x18071174a),),
    67162: ((0x18070d88f, 0x18070d90a),),
    74635: ((0x1809c39f4, 0x1809c39fb), (0x1809c3a51, 0x1809c3aac)),
    79597: ((0x180b40670, 0x180b406f0),),
    98730: ((0x1810c6751, 0x1810c6770), (0x1810c681f, 0x1810c683b)),
    104760: ((0x1812c90c6, 0x1812c912d),),
}
FIELDS = {
    'Torappu.Battle.Deck/DeckManagedCardBuffController': {'m_allTimeCardBuffs', 'm_comboDrawCardBuffs'},
    'Torappu.Battle.Deck/DeckManagedCardBuffController/ManagedComboDrawCardBuff': {'selector', 'excludeTokenAndTrap', 'm_isActive'},
    'Torappu.Battle.Deck/DeckManagedCardBuffController/ManagedCardBuff': {'owner', 'cardBuff'},
    'Torappu.Battle.DeckSelector': {'filterTag', 'categoryMask', 'excludeMe'},
    'Torappu.Battle.Deck/Card': {'<comboState>k__BackingField', 'm_cardBuffs'},
}
EXPECTED_CLIENT = (
    'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
    'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5',
)


def extract_assets(assets, cache):
    readers = runpy.run_path(str(PREFAB_READER))
    scripts = {(name, row['id']): script(row, data) for name, data in bundle(assets / SCRIPTS)[0]
               if not name.endswith(('.resource', '.resS')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    groups = (
        ('operator', CHARACTER, 'CAB-1967e1a2417bf4affbcdb0ab8594ef70', [
            ('DeckManagedCardBuffTalent', -5770778439147031165, TALENT_FIELDS),
            ('PassiveBuffAbility', -8334569484248517245, ('_buffs',)),
            ('MeleeAttack', -4516670402379287165, ('_activeBuffs',)),
        ]),
        ('skill2', SKILLS, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
            ('PassiveBuffAbility', -4621350421976157959, ('_metadata', '_buffs')),
        ]),
        ('skill3Visual', SKILLS, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
            ('PassiveBuffAbility', -4206364425512437186, ('_metadata', '_buffs')),
        ]),
        ('sword', SWORD, 'CAB-f68700761ef4b9b267b0af89309727d6', [
            ('Token', -6441875690030589171, ('_modes', '_commonAbilities')),
            ('DeckManagedCardBuffTalent', -8241836201348457715, TALENT_FIELDS),
            ('PassiveBuffAbility', 3472860911299042061, ('_buffs',)),
        ]),
        ('swordAttack', SKILLS, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
            ('MeleeAttack', 1149999816210528705, ('_activeBuffs',)),
        ]),
        ('module', EQUIPS, 'CAB-7e3af38637f0d056d61e3e709179a7d1', [
            ('MeleeAttack', 5615665115770057395, ('_metadata', '_activeBuffs')),
        ]),
    )
    prefabs = {name: readers['read_bindings'](assets / path, serialized_file, parts, scripts)
               for name, path, serialized_file, parts in groups}
    template_keys = {
        'nearl2_t_1[mark]', 'nearl2_t_1[combo]', 'nearl2_s_2[end]',
        'nearl2_s_2[withdraw]', 'nearl2_s_3[effect]', 'nearl2_sword_t_1[combo]',
    }
    templates = readers['read_holder'](assets / HOLDER, template_keys)
    cached = {}
    for name, path, serialized_file, parts in groups:
        package = cache / path
        if package.is_file():
            selected = readers['read_bindings'](package, serialized_file, parts, scripts)
            cached[name] = dict(package=fingerprint(package), matchesBase=selected == prefabs[name])
    if (cache / HOLDER).is_file():
        selected = readers['read_holder'](cache / HOLDER, template_keys)
        cached['templates'] = dict(package=fingerprint(cache / HOLDER), matchesBase=selected == templates)
    return prefabs, templates, cached


def extract_native(native):
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    result = {}
    for index, spans in SELECTION.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= low < high <= end for low, high in spans), (index, hex(end))
        instructions = []
        for inst in cs.disasm(native.pe.read(start, end - start), start):
            if not any(low <= inst.address < high for low, high in spans):
                continue
            item = dict(address=hex(inst.address), bytes=inst.bytes.hex(), mnemonic=inst.mnemonic, operands=inst.op_str)
            if inst.mnemonic in ('call', 'jmp') and inst.operands[0].type == capstone.x86.X86_OP_IMM:
                item['callees'] = [native.method(i)['fullname'] for i in native.address_methods.get(inst.operands[0].imm, [])[:3]]
            instructions.append(item)
        assert instructions, index
        result[index] = dict(method=method, instructions=instructions)
    fields = {name: [field for field in native.fields(row['index']) if field['name'] in FIELDS[name]]
              for row in native.types if (name := native.typename(row['index'])) in FIELDS}
    assert {name: {f['name'] for f in selected} for name, selected in fields.items()} == FIELDS
    return result, fields


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    client = dict(dll=fingerprint(native.pe.path), metadata=fingerprint(native.metadata_path))
    assert tuple(row['sha256'] for row in client.values()) == EXPECTED_CLIENT
    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    cache = args.game / 'Arknights_Data/PersistentData/Bundles'
    prefabs, templates, cached = extract_assets(assets, cache)
    methods, fields = extract_native(native)
    packages = {name: fingerprint(assets / name) for name in (CHARACTER, SWORD, SKILLS, EQUIPS, HOLDER, SCRIPTS)}
    provenance = dict(collectedOn='2026-11-22', client=client, metadataVersion=native.version,
                      packages=packages, tool=fingerprint(Path(__file__)), prefabReader=fingerprint(PREFAB_READER),
                      scope='Installed base resources, available cached resource comparisons, and static native method excerpts. No live game execution or XLua verification.')
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=dict(prefabs=prefabs, templates=templates,
                                                                        cached=cached, methods=methods, fields=fields)),
                                  ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

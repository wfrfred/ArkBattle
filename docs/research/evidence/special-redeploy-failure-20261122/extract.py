# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract named special-redeployment and skill-resume branches."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


SELECTION = {
    "Torappu.Battle.BattleController.CreateCharacter": ((0x18064bb26, 0x18064bb3b), (0x18064bd8e, 0x18064bdc2)),
    "Torappu.Battle.BattleController.OnCharacterFinished": ((0x180658f49, 0x180658fb9),),
    "Torappu.Battle.Deck.SpawnCharacterOrToken": ((0x1806fd21e, 0x1806fd311), (0x1806fd341, 0x1806fd365), (0x1806fd567, 0x1806fd612)),
    "Torappu.Battle.Deck/Card.SpawnPrefab": ((0x1806eeb31, 0x1806eeb5b), (0x1806eecf5, 0x1806eed31)),
    "Torappu.Battle.Deck/CharacterCard.SpawnInternal": ((0x1807078ad, 0x1807078d0),),
    "Torappu.Battle.BObject.Born": ((0x1806af81d, 0x1806af834),),
    "Torappu.Battle.Buff.OnOwnerBorn": ((0x1806d3dea, 0x1806d3dfd),),
    "Torappu.Battle.Buff.OnOwnerPostBorn": ((0x1806d448a, 0x1806d449d),),
    "Torappu.Battle.Buff/BuffContainer.OnOwnerBorn": ((0x1806c37d5, 0x1806c37e7),),
    "Torappu.Battle.Buff/BuffContainer.OnOwnerPostBorn": ((0x1806c46b0, 0x1806c46c2),),
    "Torappu.Battle.Entity.OnBorn": ((0x1807292b7, 0x1807292c7),),
    "Torappu.Battle.Tile.LocateCharacter": ((0x1808f501b, 0x1808f5044),),
    "Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnCharacterRespawnFailed": ((0x180c9dcc2, 0x180c9dd08),),
    "Torappu.Battle.Kalts2StatesRecorder.OnInit": ((0x1809b6043, 0x1809b60f0),),
    "Torappu.Battle.Kalts2StatesRecorder.OnOwnerFinish": ((0x1809b6230, 0x1809b623f), (0x1809b6276, 0x1809b62d7), (0x1809b6317, 0x1809b6358)),
    "Torappu.Battle.Kalts2StatesRecorder.Kalts2S3ClearExtraBuildableChecker": ((0x1809b5ccc, 0x1809b5d32),),
    "Torappu.Battle.Kalts2StatesRecorder.Kalts2S3RegisterExtraBuildableChecker": ((0x1809b5eb0, 0x1809b5ed7), (0x1809b5f24, 0x1809b5f3d)),
    "Torappu.Battle.Kalts2StatesRecorder.RecordCardInfoToSharedBlackboard": ((0x1809b6473, 0x1809b64dd),),
    "Torappu.Battle.Kalts2StatesRecorder._DoApplyPunishCardBuff": ((0x1809b67d0, 0x1809b6841),),
    "Torappu.Battle.SkillProgressHooker.RestoreSkillProgress": ((0x1809bcc8b, 0x1809bcd87), (0x1809bce28, 0x1809bce74)),
    "Torappu.Battle.SkillProgressHooker.OnTick": ((0x1809bcaea, 0x1809bcb42),),
    "Torappu.Battle.SkillProgressHooker._InterruptOrNot": ((0x1809bd39b, 0x1809bd3ae), (0x1809bd45a, 0x1809bd490)),
    "Torappu.Battle.UlpiaS3CastSkill._RespawnToLocatedPos": ((0x1809d4354, 0x1809d4409), (0x1809d44ac, 0x1809d4551)),
    "Torappu.Battle.Character.MoveLikeRespawnSelf": ((0x180aa1bfe, 0x180aa1c63),),
    "Torappu.Battle.Character._MoveLikeRespawn": ((0x180aac45e, 0x180aac4a7), (0x180aac507, 0x180aac57b)),
    "Torappu.Battle.Character.BuildAt": ((0x180a9d451, 0x180a9d473), (0x180a9d584, 0x180a9d5a4)),
    "Torappu.Battle.Character._BuildAtInternal": ((0x180aaae3e, 0x180aaae57), (0x180aaafc1, 0x180aaafdd)),
    "Torappu.Battle.Character._AssignData": ((0x180aa99d0, 0x180aa99e0),),
    "Torappu.Battle.Character.get_sharedData": ((0x180ab1e48, 0x180ab1e60),),
    "Torappu.Battle.Character.Born": ((0x180a9ce27, 0x180a9ce3c),),
    "Torappu.Battle.Character.LocateOnTile": ((0x180aa10c7, 0x180aa110e),),
    "Torappu.Battle.Character.OnBorn": ((0x180aa2dd2, 0x180aa2de1),),
    "Torappu.Battle.Character.OnFinish": ((0x180aa3351, 0x180aa336c),),
    "Torappu.Battle.Unit.OnBorn": ((0x180b18989, 0x180b189ba), (0x180b18a18, 0x180b18a95), (0x180b18bd7, 0x180b18bec), (0x180b18c11, 0x180b18c27)),
    "Torappu.Battle.Abilities.UlpiaS3Ability.OnProjectileReached": ((0x180fffe0f, 0x180fffe6e), (0x180ffff7b, 0x180ffffdc)),
    "Torappu.Battle.Action.Nodes/Kalts2S3CheckAbleToLand.Execute": ((0x1812121df, 0x181212285), (0x1812122cc, 0x18121236b)),
    "Torappu.Battle.Action.Nodes/Kalts2S3ApplyPunishBuff.Execute": ((0x1811fead0, 0x1811feae5),),
    "Torappu.Battle.Action.Nodes/Kalts2S3CancelExtraBuildableChecker.Execute": ((0x181211d60, 0x181211d75),),
    "Torappu.Battle.Action.Nodes/Kalts2S3ResetCardRecord.Execute": ((0x181212860, 0x181212875),),
    "Torappu.Battle.Action.Nodes/RestoreCharacterSkillStates.Execute": ((0x18122d700, 0x18122d715),),
    "Torappu.Battle.Action.Nodes/RespawnCharacter.Execute": ((0x181218ac9, 0x181218adf), (0x181218cd2, 0x181218cde), (0x181218ea7, 0x181218f3d)),
    "Torappu.Battle.Action.Nodes/FilterCharacterLastDeathReason.Execute": ((0x1811ee20a, 0x1811ee225),),
}

FIELD_SELECTION = {
    "Torappu.Battle.BattleCharacterData": {"shared"},
    "Torappu.Battle.BattleCharacterData/SharedData": {"lastFinishReason", "blackboard"},
    "Torappu.Battle.Character": {"m_spawnMannually", "m_freelySpawnedFromDeck"},
}

EXPECTED = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}


def extract(native):
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    captured = {}
    for row in native.methods:
        name = native.typename(row['declaringType']) + '.' + native.string(row['nameIndex'])
        if name not in SELECTION:
            continue
        start = row['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        selected = SELECTION[name]
        if not all(start <= low < high <= end for low, high in selected):
            continue
        assert name not in captured, (name, row['index'])
        excerpts = []
        for inst in cs.disasm(native.pe.read(start, end - start), start):
            if not any(low <= inst.address < high for low, high in selected):
                continue
            item = dict(address=hex(inst.address), bytes=inst.bytes.hex(),
                        mnemonic=inst.mnemonic, operands=inst.op_str)
            if inst.mnemonic in ('call', 'jmp') and inst.operands[0].type == capstone.x86.X86_OP_IMM:
                item['callees'] = [native.method(index)['fullname'] for index in
                                   native.address_methods.get(inst.operands[0].imm, [])[:3]]
            excerpts.append(item)
        assert excerpts, name
        captured[name] = dict(method=native.method(row['index']), boundaryEnd=hex(end),
                              selected=[[hex(low), hex(high)] for low, high in selected],
                              instructions=excerpts)
    assert captured.keys() == SELECTION.keys(), set(SELECTION) - captured.keys()
    return captured


def ability_hierarchy(native):
    leaf = 'Torappu.Battle.Abilities.EmptyAnimatedAbility'
    root = 'Torappu.Battle.AbilityStandard'
    types = {native.typename(index): (index, row) for index, row in enumerate(native.types)
             if row['namespace'].startswith('Torappu.Battle')}
    result = {}
    name = leaf
    while name not in result:
        index, row = types[name]
        parent = native.type_name(row['parentIndex'])
        result[name] = dict(
            typeIndex=index,
            parent=parent,
            declaredMethods=[
                native.string(method['nameIndex'])
                for method in native.methods[row['methodStart']:row['methodStart'] + row['methodCount']]
            ],
        )
        if name == root:
            return result
        name = parent
    raise ValueError(f"cyclic ability hierarchy: {name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    client = dict(dll=fingerprint(native.pe.path), metadata=fingerprint(native.metadata_path))
    assert {key: data['sha256'] for key, data in client.items()} == EXPECTED, client
    metadata = dict(client=client, metadataVersion=native.version, imageBase=hex(native.pe.base),
                    tool=fingerprint(Path(__file__)), capstone=capstone.__version__,
                    scope='Fixed-client static branch excerpts selected by method and address. No game execution or live XLua verification.')
    fields = {name: [field for field in native.fields(row['index']) if field['name'] in FIELD_SELECTION[name]]
              for row in native.types if (name := native.typename(row['index'])) in FIELD_SELECTION}
    assert {name: {f['name'] for f in selection} for name, selection in fields.items()} == FIELD_SELECTION
    result = dict(provenance=metadata, result=extract(native), abilityHierarchy=ability_hierarchy(native), fields=fields)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Project the installed split-damage buffs and the pinned main-stage input."""

import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, script, serialized

GAME_DATA = ROOT / "assets/arknights-game-data/zh_CN/gamedata"
REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
PREFAB = "battle/enm_pfb_18.ab"
SCRIPTS = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
SERIALIZED_FILE = "CAB-0df5f4c8c8dade07e2ee475a972da576"
TEMPLATE = "enemy_wdslm[splitDamage]"
COMPONENTS = {
    -2043665165734528192: ("enemy_1542_wdslm", "splitDamage"),
    238617005377944023: ("enemy_1542_wdslm_2", "splitDamage"),
    -3648310526488036544: ("enemy_1542_wdslm", "standRegisterList"),
    2772085753718274519: ("enemy_1542_wdslm_2", "standRegisterList"),
}


def read_prefabs(game):
    decoder = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("wdslm_hp_decoder", decoder)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    data_root = game / "Arknights_Data/StreamingAssets/AB/Windows"
    scripts = {}
    for name, data in bundle(data_root / SCRIPTS)[0]:
        if name.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["classid"] == 115:
                scripts[name, obj["id"]] = script(obj, data)

    data = dict(bundle(data_root / PREFAB)[0])[SERIALIZED_FILE]
    layouts, externals = reader.trees(data)
    objects = {obj["id"]: obj for obj in serialized(data)["objects"]}

    def raw(obj):
        return data[obj["start"]:obj["start"] + obj["size"]]

    def decode(obj):
        return reader.decode(raw(obj), layouts[obj["typeid"]])

    transforms = {}
    for obj in objects.values():
        if obj["classid"] == 4:
            transform = decode(obj)
            transforms[transform["common:374"]["m_PathID"]] = transform["m_Father"]["m_PathID"]

    def game_object_name(object_id):
        value = Reader(raw(objects[object_id]))
        value.read(value.val("i") * 12)
        value.val("i")
        return value.string()

    records = []
    for path_id, (enemy, talent) in COMPONENTS.items():
        obj = objects[path_id]
        value = decode(obj)
        owner_id = value["common:374"]["m_PathID"]
        owner = owner_id
        hierarchy = []
        while owner:
            hierarchy.append(game_object_name(owner))
            parent = transforms[owner]
            owner = decode(objects[parent])["common:374"]["m_PathID"] if parent else 0
        hierarchy.reverse()
        assert hierarchy == [enemy, "Talents", talent], hierarchy

        pointer = value["common:490"]
        script_file = (
            externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            if pointer["m_FileID"] else SERIALIZED_FILE
        )
        script_ref = scripts[script_file, pointer["m_PathID"]]
        fields = {"_metadata": value["_metadata"]}
        if talent == "splitDamage":
            fields["_buffs"] = [
                {key: buff[key] for key in ("buffKey", "templateKey", "loadFromDB")}
                for buff in value["_buffs"]["Array"]
            ]
            assert script_ref["cl"] == "PassiveBuffAbility"
            assert fields["_buffs"][0]["templateKey"] == TEMPLATE
        else:
            assert script_ref["cl"] == "WdslmsStandAbility"
            assert fields["_metadata"]["namedAsAlias"] == talent
        records.append({
            "bundle": PREFAB,
            "file": SERIALIZED_FILE,
            "pathId": str(path_id),
            "gameObjectPathId": str(owner_id),
            "hierarchy": hierarchy,
            "script": script_ref,
            "fields": fields,
        })

    sources = [fingerprint(data_root / name) for name in (PREFAB, SCRIPTS)]
    return records, sources


def read_battle_data():
    stage_file = GAME_DATA / "levels/obt/main/level_main_12-18.json"
    template_file = GAME_DATA / "battle/buff_template_data.json"
    stage = json.loads(stage_file.read_bytes())
    templates = json.loads(template_file.read_bytes())
    host = stage["waves"][0]["fragments"][0]["actions"][0]
    fragment = stage["branches"]["branch_2"]["phases"][0]["actions"][0]
    assert host["key"] == "enemy_1542_wdslm" and fragment["key"] == "enemy_1542_wdslm_2"
    return {
        "stage": [
            {"pointer": "/waves/0/fragments/0/actions/0", "value": host},
            {"pointer": "/branches/branch_2/phases/0/actions/0", "value": fragment},
        ],
        "template": {TEMPLATE: templates[TEMPLATE]},
    }, [fingerprint(stage_file), fingerprint(template_file)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    components, assets = read_prefabs(args.game)
    data, tables = read_battle_data()
    result = {
        "provenance": {"collectedOn": "2026-11-22", "fixedDataRevision": REVISION, "sources": [*assets, *tables]},
        "result": {"components": components, **data},
    }
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

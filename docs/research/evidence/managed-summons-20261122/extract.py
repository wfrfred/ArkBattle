#!/usr/bin/env python3
"""Extract fixed-stage records and the native Prefab references for managed summons."""

import argparse
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

TEMPLATES = ("enemy_rescar_skill[summon]", "enemy_wdslm[p1SummonTrigger]", "enemy_wdslm[p1SummonHLevel]")
SUBMODULE = "17759cc8cdf37388414145d16262a3a06f3ab25e"
GAME_DATA = ROOT / "assets/arknights-game-data/zh_CN/gamedata"
TARGETS = {
    "battle/enm_pfb_9.ab": ("CAB-d5c3740664210131f56a568859981fef", "enemy_1217_rescar"),
    "battle/enm_pfb_18.ab": ("CAB-0df5f4c8c8dade07e2ee475a972da576", "enemy_1542_wdslm"),
}
STRUCTURE_IDS = {-3312300244513874879, 5624699378828557120, 309747327906134848}
NATIVE_RANGES = (
    (100952, 0x1811A6E3F, 0x1811A6EA9),
    (100953, 0x1811A70C9, 0x1811A710E),
    (100959, 0x1811A8104, 0x1811A815D),
    (100959, 0x1811A8218, 0x1811A825C),
    (100959, 0x1811A8674, 0x1811A86B9),
    (100959, 0x1811A87A0, 0x1811A87D1),
    (73301, 0x180981343, 0x1809813A1),
    (73460, 0x180989EC1, 0x180989F82),
    (73460, 0x18098A198, 0x18098A1B9),
    (73460, 0x18098A2F1, 0x18098A34C),
)
NATIVE_TYPES = (
    "Torappu.Battle.Action.Nodes/SummonEnemiesFollowBranchRoute",
    "Torappu.Battle.Action.Nodes/SummonEnemiesFollowMyRoute",
    "Torappu.Battle.Scheduler/SpawnSummonedEnemyTrackedInGameModeParams",
    "Torappu.Battle.Scheduler/<SpawnSummonedEnemyTrackedInGameMode>d__131",
)


def battle_data():
    files = {
        "levels/activities/act16side/level_act16side_06.json": "enemy_1217_rescar",
        "levels/activities/act15mini/level_act15mini_08.json": "enemy_1217_rescar",
        "levels/obt/main/level_main_12-18.json": "enemy_1542_wdslm",
    }
    inputs, stages = [], []
    for name, key in files.items():
        path = GAME_DATA / name
        data = json.loads(path.read_text())
        inputs.append({"file": name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
        spawns = []
        for wi, wave in enumerate(data["waves"]):
            for fi, frag in enumerate(wave["fragments"]):
                for ai, action in enumerate(frag["actions"]):
                    if action["actionType"] == "SPAWN" and action["key"] == key and action["count"] > 0:
                        spawns.append({"pointer": f"/waves/{wi}/fragments/{fi}/actions/{ai}", "value": action})
        assert spawns, files
        stage = {
            "file": name,
            "enemy": key,
            "waves": len(data["waves"]),
            "maxWaitByWave": [wave["maxTimeWaitingForNextWave"] for wave in data["waves"]],
            "spawns": spawns,
            "enemyDbRefs": [
                {"pointer": f"/enemyDbRefs/{index}", "value": ref}
                for index, ref in enumerate(data["enemyDbRefs"])
                if ref["id"] == key
            ],
        }
        if key == "enemy_1542_wdslm":
            stage["branches"] = data["branches"]
        stages.append(stage)
    name = "battle/buff_template_data.json"
    path = GAME_DATA / name
    data = json.loads(path.read_text())
    inputs.append({"file": name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    templates = {key: data[key]["eventToActions"] for key in TEMPLATES}
    name = "levels/enemydata/enemy_database.json"
    path = GAME_DATA / name
    data = json.loads(path.read_text())
    inputs.append({"file": name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    enemy_data = {}
    for key in files.values():
        value = next(row["Value"][0]["enemyData"] for row in data["enemies"] if row["Key"] == key)
        enemy_data[key] = {
            "skills": value["skills"],
            "spData": value["spData"],
            "talentBlackboard": value["talentBlackboard"],
        }
    return inputs, stages, templates, enemy_data


def read_components(game):
    decoder_path = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("managed_summon_decoder", decoder_path)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    data_root = game / "Arknights_Data/StreamingAssets/AB/Windows"
    sources, scripts, matches = [], {}, []
    relative = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    path = data_root / relative
    sources.append({"bundle": relative, **fingerprint(path)})
    for filename, data in bundle(path)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["classid"] == 115:
                scripts[filename, obj["id"]] = script(obj, data)

    for relative, (wanted_file, enemy) in TARGETS.items():
        path = data_root / relative
        sources.append({"bundle": relative, **fingerprint(path)})
        data = dict(bundle(path)[0])[wanted_file]
        layouts, externals = reader.trees(data)
        objects = serialized(data)["objects"]
        names, transforms = {}, {}
        for obj in objects:
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if obj["classid"] == 1:
                value = Reader(raw)
                value.read(value.val("i") * 12)
                value.val("i")
                names[obj["id"]] = value.string()
            elif obj["classid"] == 4:
                value = reader.decode(raw, layouts[obj["typeid"]])
                transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
        owners = {owner: transform for transform, (owner, _) in transforms.items()}
        relevant = {
            owner for owner, name in names.items()
            if name in {"BornCar", "P1", "P1SummonHLevel", "P1SummonStand"}
        }
        for obj in objects:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            found = [key for key in TEMPLATES if key.encode() in raw]
            wanted_structure = obj["id"] in STRUCTURE_IDS
            if not found and not wanted_structure and not any(
                owner.to_bytes(8, "little", signed=True) in raw for owner in relevant
            ):
                continue
            value = reader.decode(raw, layouts[obj["typeid"]])
            owner_id = value["common:374"]["m_PathID"]
            if not found and not wanted_structure and owner_id not in relevant:
                continue
            hierarchy, transform = [], owners.get(value["common:374"]["m_PathID"], 0)
            while transform:
                owner, parent = transforms[transform]
                hierarchy.append(names[owner])
                transform = parent
            if not hierarchy or hierarchy[-1] != enemy:
                continue
            pointer = value["common:490"]
            script_file = wanted_file if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            identity = scripts[script_file, pointer["m_PathID"]]
            if not found and identity["cl"] not in (
                "Enemy", "UnitMode", "EnemySkill", "CharacterSkill", "BuffToOwner", "PassiveBuffAbility"
            ):
                continue
            matches.append({
                "bundle": relative,
                "serializedFile": wanted_file,
                "pathId": str(obj["id"]),
                "sha256": hashlib.sha256(raw).hexdigest(),
                "hierarchy": hierarchy[::-1],
                "script": identity,
                "matchingTemplates": found,
                "fields": {k: v for k, v in value.items() if k.startswith("_")},
            })
    return sources, matches


def string_literal(native, slot):
    usage, = native.pe.unpack("<Q", int(slot, 16))
    if usage >> 29 != 5 or not usage & 1:
        return None
    entry_index = (usage & 0x1FFFFFFE) >> 1
    table, table_size = struct.unpack_from("<II", native.metadata, 8)
    data, data_size = struct.unpack_from("<II", native.metadata, 16)
    if (entry_index + 1) * 8 > table_size:
        return None
    length, offset = struct.unpack_from("<II", native.metadata, table + entry_index * 8)
    if offset + length > data_size:
        return None
    return native.metadata[data + offset:data + offset + length].decode("utf-8")


def extract_native(game):
    native = Native(game)
    spans, literals, types = [], [], []
    for index, start, end in NATIVE_RANGES:
        method = native.method(index)
        cursor, fragments = start, []
        while cursor < end:
            body = native.disassemble_at(cursor, end - cursor)
            fragments.append(body)
            for instruction in body["instructions"]:
                for reference in instruction.get("ripReferences", []):
                    try:
                        value = string_literal(native, reference)
                    except (StopIteration, ValueError):
                        continue
                    if value is not None:
                        literals.append({"address": instruction["address"], "slot": reference, "value": value})
            cursor = int(body["end"], 16)
        spans.append({"method": method, "fragments": fragments})
    for name in NATIVE_TYPES:
        record = next(row for row in native.types if native.typename(row["index"]) == name)
        types.append({"fullname": name, "fields": native.fields(record["index"])})
    return {
        "provenance": native.provenance(),
        "result": {"bodies": spans, "literals": literals, "types": types},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--native-out", type=Path)
    args = parser.parse_args()
    inputs, stages, templates, enemy_data = battle_data()
    sources, matches = read_components(args.game)
    result = {
        "provenance": {
            "collectedOn": "2026-11-22",
            "submodule": SUBMODULE,
            "inputs": inputs,
            "clientBundles": sources,
        },
        "result": {"stages": stages, "templates": templates, "enemyData": enemy_data, "components": matches},
    }
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    if args.native_out is not None:
        args.native_out.write_text(json.dumps(extract_native(args.game), ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

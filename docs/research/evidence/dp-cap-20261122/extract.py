# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the DP cap and card price ceiling witnesses."""

import argparse
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(root / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
DLL_SHA256 = "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
METADATA_SHA256 = "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
MIRROR = root / "assets/arknights-game-data/zh_CN/gamedata"
ENEMY = "enemy_1313_wdfmr"
RUNTIME_ENEMY = "enemy_1341_bthtms"
RUNTIME_TEMPLATE = "bthtms_t_1[max_cost]"
RUNTIME_LEVEL = "levels/activities/act26side/level_act26side_07.json"
MEMORY_LEVEL = "levels/obt/memory/level_memory_excu2_1.json"


def selected_config():
    files = ["excel/enemy_handbook_table.json",
             "excel/stage_table.json",
             "excel/handbook_info_table.json",
             "levels/enemydata/enemy_database.json",
             "levels/obt/training/level_training_22.json",
             "levels/obt/main/level_main_12-13.json",
             RUNTIME_LEVEL,
             MEMORY_LEVEL,
             "battle/buff_template_data.json"]
    result = []
    for file in files:
        raw = (MIRROR / file).read_bytes()
        data = json.loads(raw)
        if file == "excel/enemy_handbook_table.json":
            handbook = data["enemyData"][ENEMY]
            rows = [{"pointer": f"/enemyData/{ENEMY}/abilityList", "value": handbook["abilityList"]}]
            rows.extend({"pointer": f"/enemyData/{RUNTIME_ENEMY}/{key}",
                         "value": data["enemyData"][RUNTIME_ENEMY][key]}
                        for key in ("name", "abilityList"))
        elif file == "excel/stage_table.json":
            rows = [{"pointer": f"/stages/act26side_07/{key}",
                     "value": data["stages"]["act26side_07"][key]}
                    for key in ("levelId", "code", "name", "difficulty")]
        elif file == "excel/handbook_info_table.json":
            rows = [{"pointer": f"/handbookStageData/char_1032_excu2/{key}",
                     "value": data["handbookStageData"]["char_1032_excu2"][key]}
                    for key in ("levelId", "stageId", "name")]
        elif file.startswith("levels/enemydata/"):
            index, enemy = next((index, entry) for index, entry in enumerate(data["enemies"])
                                if entry["Key"] == RUNTIME_ENEMY)
            record = enemy["Value"][0]
            rows = [
                {"pointer": f"/enemies/{index}/Value/0/level", "value": record["level"]},
                *({"pointer": f"/enemies/{index}/Value/0/enemyData/{key}",
                   "value": record["enemyData"][key]}
                  for key in ("prefabKey", "talentBlackboard")),
            ]
        elif file.startswith("battle/"):
            rows = [{"pointer": f"/{RUNTIME_TEMPLATE}", "value": data[RUNTIME_TEMPLATE]}]
        else:
            rows = [{"pointer": "/options/maxCost", "value": data["options"]["maxCost"]}]
            if file in (RUNTIME_LEVEL, MEMORY_LEVEL):
                rows.extend({"pointer": f"/{key}", "value": data[key]}
                            for key in ("runes", "globalBuffs"))
            rows.extend({"pointer": f"/runes/{i}", "value": rune}
                        for i, rune in enumerate(data["runes"] or [])
                        if rune["key"] == "cbuff_max_cost")
            rows.extend({"pointer": f"/enemyDbRefs/{i}", "value": enemy}
                        for i, enemy in enumerate(data["enemyDbRefs"])
                        if enemy["id"] in (ENEMY, RUNTIME_ENEMY))
            rows.extend(
                {"pointer": f"/waves/{w}/fragments/{f}/actions/{a}",
                 "value": action}
                for w, wave in enumerate(data["waves"])
                for f, fragment in enumerate(wave["fragments"])
                for a, action in enumerate(fragment["actions"])
                if action["actionType"] == "SPAWN"
                and action["key"] in (ENEMY, RUNTIME_ENEMY))
        result.append({"path": f"zh_CN/gamedata/{file}",
                       "sha256": hashlib.sha256(raw).hexdigest(), "selected": rows})
    return {"revision": REVISION, "source": "https://github.com/Kengxxiao/ArknightsGameData",
            "result": result}


def selected_assets(game):
    from unity_assets import bundle, script, serialized

    helper = root / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("typetree", helper)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)

    installed = game / "Arknights_Data"
    base = installed / "StreamingAssets/AB/Windows"
    update = installed / "PersistentData/Bundles"
    prefab_path = base / "battle/enm_pfb_14.ab"
    script_path = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    holder_path = update / "config/buff_template_holder.ab"

    def asset(file, name):
        data = dict(bundle(file)[0])[name]
        objects = {obj["id"]: obj for obj in serialized(data)["objects"]}
        layouts, externals = reader.trees(data)

        def decode(path_id):
            obj = objects[path_id]
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            return reader.decode(raw, layouts[obj["typeid"]]), hashlib.sha256(raw).hexdigest()

        return data, objects, externals, decode

    prefab_file = "CAB-418be99595adfa1a3c8b4012fe22cb83"
    component_id = -7741289169105458064
    _, objects, externals, decode = asset(prefab_path, prefab_file)
    component, digest = decode(component_id)
    script_ref = component["common:490"]
    script_file = Path(externals[script_ref["m_FileID"] - 1]["path"]).name
    script_data = dict(bundle(script_path)[0])[script_file]
    script_obj = next(obj for obj in serialized(script_data)["objects"]
                      if obj["id"] == script_ref["m_PathID"])
    script_identity = script(script_obj, script_data)
    transforms = {}
    for path_id, obj in objects.items():
        if obj["classid"] == 4:
            value, _ = decode(path_id)
            transforms[value["common:374"]["m_PathID"]] = path_id
    hierarchy = []
    node = transforms[component["common:374"]["m_PathID"]]
    while node:
        transform, _ = decode(node)
        path_id = transform["common:374"]["m_PathID"]
        game_object, _ = decode(path_id)
        hierarchy.append({"pathId": str(path_id),
                          "name": game_object.get("common:427", game_object.get("m_Name")),
                          "active": game_object["m_IsActive"]["hex"] == "01"})
        node = transform["m_Father"]["m_PathID"]
    hierarchy.reverse()
    assert [obj["name"] for obj in hierarchy] == [RUNTIME_ENEMY, "Talents", "ReduceCost"]
    buff, = component["_buffs"]["Array"]
    assert component["common:349"] and buff["templateKey"] == RUNTIME_TEMPLATE

    holder_file = "CAB-7983df61b3ae63c96fb4e076fc3d80af"
    holder_id = 6070581171229484677
    _, _, _, decode = asset(holder_path, holder_file)
    holder, holder_digest = decode(holder_id)
    index, template = next((index, item) for index, item in enumerate(holder["_templates"]["Array"])
                           if item["templateKey"] == RUNTIME_TEMPLATE)
    events = [{"event": item["key"], "actions": json.loads(item["value"]["SerializedState"])}
              for item in template["eventToActions"]["_items"]["Array"]]
    return {
        "provenance": {
            "assets": [fingerprint(file) for file in (prefab_path, script_path, holder_path)],
            "reader": fingerprint(helper),
        },
        "result": {
            "component": {"file": prefab_file, "pathId": str(component_id), "objectSha256": digest,
                          "hierarchy": hierarchy, "enabled": component["common:349"],
                          "scriptFile": script_file, "script": script_identity,
                          "buff": {key: buff[key] for key in ("buffKey", "templateKey", "blackboard")}},
            "holder": {"file": holder_file, "pathId": str(holder_id), "objectSha256": holder_digest,
                       "index": index, "key": template["templateKey"], "events": events},
        },
    }


def selected_native(game):
    native = Native(game)
    provenance = native.provenance()
    client = provenance["client"]
    if client["dll"]["sha256"] != DLL_SHA256 or client["metadata"]["sha256"] != METADATA_SHA256:
        raise ValueError("expected the recorded Windows client fingerprints")
    names = [
        "Torappu.Battle.BattleOptions..cctor",
        "Torappu.Battle.BattleOptions.ModifyMaxCost",
        "Torappu.Battle.BattleController.SetMaxCost",
        "Torappu.Battle.BattleController.ModifyMaxCost",
        "Torappu.Battle.BattleCostManager.SetMaxCost",
        "Torappu.Battle.Runes.Internal.LMaxCostSet.PreprocessLevelOptions",
        "Torappu.Battle.Action.Nodes/ModifyMaxCost.Execute",
    ]
    methods = {}
    for entry in native.methods:
        owner = native.typename(entry["declaringType"])
        name = owner + "." + native.string(entry["nameIndex"])
        if name in names:
            if name in methods:
                raise ValueError(f"ambiguous method: {name}")
            methods[name] = native.method(entry["index"])
    bodies = []
    for name in names:
        method = methods[name]
        start = method["address"]
        end = min(item for item in native.addresses if item > start)
        parts = [native.disassemble(method["index"], end - start)]
        start = int(parts[-1]["end"], 16)
        while start < end:
            parts.append(native.disassemble_at(start, end - start))
            start = int(parts[-1]["end"], 16)
        bodies.append({"method": method, "parts": parts})
    options = next(t for t in native.types if native.typename(t["index"]) == "Torappu.Battle.BattleOptions")
    field_names = {"MAX_COST", "MAX_COST_CEIL", "MIN_COST", "SYNC_MAXCOST_CEIL_WITH_MAXCOST"}
    fields = [field for field in native.fields(options["index"]) if field["name"] in field_names]
    rune = next(body for body in bodies
                if body["method"]["fullname"].endswith("LMaxCostSet.PreprocessLevelOptions"))
    literals = []
    records, size, data, data_size = struct.unpack_from("<4I", native.metadata, 8)
    for address in ("0x180d7b2c4", "0x180d7b2f6"):
        row = next(row for part in rune["parts"] for row in part["instructions"]
                   if row["address"] == address)
        slot = int(row["ripReferences"][0], 16)
        encoded, = native.pe.unpack("<Q", slot)
        index = (encoded & 0x1fffffff) >> 1
        if encoded >> 29 != 5 or not encoded & 1 or index * 8 >= size:
            raise ValueError("expected a string literal usage")
        length, offset = struct.unpack_from("<II", native.metadata, records + index * 8)
        if offset + length > data_size:
            raise ValueError("literal outside data")
        literals.append({"instruction": address, "slot": hex(slot), "encodedUsage": hex(encoded),
                         "value": native.metadata[data + offset:data + offset + length].decode()})
    level_options = next(t for t in native.types
                         if native.typename(t["index"]) == "Torappu.LevelData/Options")
    level_fields = [field for field in native.fields(level_options["index"])
                    if field["name"].lower() == "maxcost"]
    runtime_branches = []
    for index, start, stop in (
        (63902, 0x1806076B8, 0x180607724),
        (65795, 0x180663EA2, 0x180663EF9),
        (84129, 0x180C9DA40, 0x180C9DA9F),
        (65794, 0x180665BA4, 0x180665C14),
    ):
        method = native.method(index)
        span = native.disassemble_at(start, stop - start)
        if int(span["decodedEnd"], 16) != stop:
            raise ValueError(f"incomplete instruction span for {method['fullname']}")
        runtime_branches.append({"method": method, "span": span})
    return {"provenance": provenance,
            "result": {"fields": fields, "levelOptionFields": level_fields,
                       "runeKeys": literals, "bodies": bodies,
                       "runtimeBranches": runtime_branches}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    config = selected_config()
    native = selected_native(args.game)
    assets = selected_assets(args.game)
    args.out.mkdir(parents=True, exist_ok=True)
    for name, record in [("config", config), ("native", native), ("assets", assets)]:
        (args.out / f"{name}.json").write_text(
            json.dumps(record, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

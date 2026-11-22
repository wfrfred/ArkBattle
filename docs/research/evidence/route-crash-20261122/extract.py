#!/usr/bin/env python3
"""Archive the 5-2 MOVE seed and two installed enemy crash bindings."""

import argparse
import hashlib
import json
from pathlib import Path
import runpy
import subprocess
import sys
from tempfile import TemporaryDirectory


sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized


REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
MIRROR = ROOT / "assets/arknights-game-data"
ASSET_TOOLS = ROOT / "docs/research/evidence/attack-way-20261118"
PREFABS = {
    "battle/enm_pfb_4.ab": ["enemy_1039_breakr"],
    "battle/enm_pfb_8.ab": ["enemy_1163_hvymot"],
    "battle/enm_pfb_13.ab": ["enemy_1309_mhboar"],
}
CRASH_KEYS = {"enemy_hvymot_crash", "enemy_mhboar_crash", "enemy_mhboar_t_atk"}
REQUIRED_COMPONENTS = {
    "2786865473703596349", "4413762135033598269",
    "-8917971584930744734", "766096568602719842",
    "1914439892652258914", "2770566951621228130",
    "-3438368919426224867", "-5346787934817604323",
    "-8687035367429690083", "8329613437254511901",
}


def read_mirror(relative):
    raw = subprocess.check_output(["git", "-C", str(MIRROR), "show", f"{REVISION}:{relative}"])
    return json.loads(raw), {"path": relative, "sha256": hashlib.sha256(raw).hexdigest()}


def project_level():
    level, source = read_mirror("zh_CN/gamedata/levels/obt/main/level_main_05-02.json")
    action = level["waves"][0]["fragments"][4]["actions"][5]
    assert action["key"] == "enemy_1039_breakr" and action["routeIndex"] == 29
    route = level["routes"][29]
    data = level["mapData"]
    tiles = {
        f"{row},{col}": data["tiles"][data["map"][-1-row][col]]
        for row, col in ((1, 3), (1, 4), (2, 3), (2, 4))
    }
    assert route["motionMode"] == "WALK" and route["allowDiagonalMove"]
    assert route["spawnOffset"] == route["spawnRandomRange"] == {"x": 0.0, "y": 0.0}
    assert not route["visitEveryTileCenter"] and not route["visitEveryNodeCenter"]
    assert data["blockEdges"] is None
    assert not any(tile["blackboard"] for tile in tiles.values())
    return {"source": source, "spawnPointer": "/waves/0/fragments/4/actions/5", "spawn": action,
            "routePointer": "/routes/29", "route": route, "blockEdges": data["blockEdges"],
            "localTiles": tiles, "options": level["options"]}


def crash_spawns():
    results = []
    for file, key in (
        ("activities/act12side/level_act12side_07.json", "enemy_1163_hvymot"),
        ("obt/roguelike/ro5/level_rogue5_2-2.json", "enemy_1309_mhboar"),
    ):
        data, source = read_mirror(f"zh_CN/gamedata/levels/{file}")
        matches = [{"pointer": f"/waves/{w}/fragments/{f}/actions/{a}", "value": action}
                   for w, wave in enumerate(data["waves"])
                   for f, fragment in enumerate(wave["fragments"])
                   for a, action in enumerate(fragment["actions"])
                   if action["actionType"] == "SPAWN" and action["key"] == key and action["count"] > 0]
        assert matches
        results.append({"source": source, "spawns": matches})
    return results


def run_tool(name, output, **changed):
    entry = runpy.run_path(str(ASSET_TOOLS / name))["main"]
    entry.__globals__.update(changed)
    argv = sys.argv
    try:
        sys.argv = [name, "--out", str(output)]
        entry()
    finally:
        sys.argv = argv
    return json.loads(output.read_text())


def select_prefabs(game, output):
    data = game / "Arknights_Data"
    base = data / "StreamingAssets/AB/Windows"
    hot = data / "PersistentData/Bundles"
    assert not any((hot / name).exists() for name in PREFABS), "a newer candidate Prefab needs review"
    prefabs = run_tool("extract_aak_fuze_prefabs.py", output, BASE=base, SELECTION=PREFABS)
    keep = {"_buffs", "_additiveActiveBuffs", "_onlyAddBuffOnceForEachTarget",
            "_removeBuffWhenTargetLeave", "_removeBuffWhenAbilityDetached", "_targetValidator",
            "_targetOptions", "_tileOptions", "_alwaysCheckCurrentPoint", "_steeringFactor",
            "_maxSteeringForce", "_halfBodyWidth", "_selector", "_selfOption"}
    select = [row | {"value": {field: value for field, value in row["value"].items() if field in keep}}
              for row in prefabs["result"] if row["pathId"] in REQUIRED_COMPONENTS]
    assert {r["pathId"] for r in select} == REQUIRED_COMPONENTS
    assert all(r["script"] for r in select)
    add_activation(base, select)
    holder = [read_holder(base), read_holder(hot)]
    return {"provenance": prefabs["provenance"] | {"resourceManifests": [
        fingerprint(path) | {"versionId": json.loads(path.read_text())["versionId"]}
        for path in (base / "hot_update_list.json", hot / "hot_update_list.json")
    ]}, "components": select, "holders": holder}


def add_activation(base, components):
    reader = runpy.run_path(str(ASSET_TOOLS / "extract_aak_fuze_prefabs.py"))["helper"]
    for relative in PREFABS:
        for filename, data in bundle(base / relative)[0]:
            rows = [row for row in components if row["bundle"] == relative and row["file"] == filename]
            if not rows:
                continue
            layouts, _ = reader.helper.trees(data)
            objects = {obj["id"]: obj for obj in serialized(data)["objects"]}

            def object_value(path_id):
                obj = objects[path_id]
                return reader.decode(data[obj["start"]:obj["start"] + obj["size"]], layouts[obj["typeid"]])

            for row in rows:
                component = object_value(int(row["pathId"]))
                owner_id = component["common:374"]["m_PathID"]
                owner = object_value(owner_id)
                row["enabled"] = component["common:349"]
                row["owner"] = {"pathId": str(owner_id), "active": owner["m_IsActive"]}
    assert all("enabled" in row and "owner" in row for row in components)


def read_holder(folder):
    entry = runpy.run_path(str(ASSET_TOOLS / "extract_templates.py"))
    helper = entry["helper"]
    source = folder / "config/buff_template_holder.ab"
    for file, data in entry["bundle"](source)[0]:
        if file.endswith((".resS", ".resource")):
            continue
        for obj in entry["serialized"](data)["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = helper.decode(raw, helper.trees(data)[obj["typeid"]])
            templates = {item["templateKey"]: {"index": index, "events": [
                {"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                for event in item["eventToActions"]["_items"]["Array"]
            ]} for index, item in enumerate(value["_templates"]["Array"]) if item["templateKey"] in CRASH_KEYS}
            assert set(templates) == CRASH_KEYS
            return {"source": fingerprint(source), "file": file, "pathId": str(obj["id"]),
                    "objectSha256": hashlib.sha256(raw).hexdigest(), "templates": templates}
    raise ValueError(f"no selected BuffTemplateHolder in {source}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    with TemporaryDirectory(prefix="arkbattle-crash-") as temp:
        prefabs = select_prefabs(args.game, Path(temp) / "prefabs.json")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    output = {"provenance": {"revision": REVISION, "scope": "Pinned level JSON and selected installed Prefab/Holder assets, without runtime XLua capture."},
              "result": {"route": project_level(), "crashSpawns": crash_spawns(), "prefabs": prefabs}}
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

"""Locate GiantTrap components and their configured base capacity and mode references."""

import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, script, serialized

HELPER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
SCRIPT_PATH = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
PACKAGE_GLOBS = ("battle/enm_pfb_*.ab", "pkgrps/btl_pfb_tokens_*.ab", "battle/prefabs/levelprefabs/**/*.ab")


def script_definition(path):
    for name, data in bundle(path)[0]:
        if name.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["classid"] != 115:
                continue
            value = script(obj, data)
            if value["ns"] == "Torappu.Battle" and value["cl"] == "GiantTrap":
                return name, value
    raise ValueError("GiantTrap MonoScript missing")


def scan_bundle(reader, script_file, script_id, path):
    pattern = struct.pack("<q", script_id)
    rows = []
    for name, data in bundle(path)[0]:
        if name.endswith((".resS", ".resource")) or pattern not in data:
            continue
        objects = serialized(data)["objects"]
        layouts, externals = reader.trees(data)
        named = {obj["id"]: obj for obj in objects if obj["classid"] == 1}
        for obj in objects:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if raw[20:28] != pattern:
                continue
            value = reader.decode(raw, layouts[obj["typeid"]])
            pointer = value["common:490"]
            external = externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            if pointer["m_PathID"] != script_id or external != script_file:
                continue
            owner_id = value["common:374"]["m_PathID"]
            owner = Reader(data, p=named[owner_id]["start"])
            owner.read(owner.val("i") * 12)
            owner.val("i")
            rows.append({
                "prefab": owner.string(), "file": name, "componentPathId": str(obj["id"]),
                "gameObjectPathId": str(owner_id), "objectSha256": hashlib.sha256(raw).hexdigest(),
                "enabled": value["common:349"], "scriptPointer": {"file": external, "pathId": str(script_id)},
                "fields": {key: value[key] for key in ("_blockMode", "_alwaysBlockFreeOptimize", "_minBlockDistToTarget")},
            })
    return rows


def find_reference(data, wanted, pointer=""):
    if isinstance(data, dict):
        for key, value in data.items():
            escaped = key.replace("~", "~0").replace("/", "~1")
            if key == wanted:
                return f"{pointer}/{escaped}"
            result = find_reference(value, wanted, f"{pointer}/{escaped}")
            if result is not None:
                return result
    elif isinstance(data, list):
        for index, value in enumerate(data):
            result = find_reference(value, wanted, f"{pointer}/{index}")
            if result is not None:
                return result
    elif data == wanted:
        return pointer
    return None


def input_modes(ids, excel):
    characters = json.loads((excel / "character_table.json").read_text())
    sandbox = json.loads((excel / "sandbox_perm_table.json").read_text())
    activity = json.loads((excel / "activity_table.json").read_text())
    halfidle = "/activity/HALFIDLE_VERIFY1/act1vhalfidle"
    entries = activity["activity"]["HALFIDLE_VERIFY1"]["act1vhalfidle"]["trapMetaDict"]
    rows = []
    for prefab in sorted(ids):
        entry = characters.get(prefab)
        capacities = None if entry is None else sorted({
            frame["data"]["blockCnt"] for phase in entry["phases"] for frame in phase["attributesKeyFrames"]
        })
        sandbox_source = find_reference(sandbox, prefab)
        rows.append({
            "prefab": prefab, "name": None if entry is None else entry["name"], "blockCnt": capacities,
            "sandboxPointer": sandbox_source, "halfIdlePointer": f"{halfidle}/trapMetaDict/{prefab}" if prefab in entries else None,
        })
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    game = args.game / "Arknights_Data"
    base = game / "StreamingAssets/AB/Windows"
    update = game / "PersistentData/Bundles"
    scripts = update / SCRIPT_PATH if (update / SCRIPT_PATH).is_file() else base / SCRIPT_PATH
    script_file, component = script_definition(scripts)
    spec = importlib.util.spec_from_file_location("typetree", HELPER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    scans = []
    for source in (base, update):
        paths = sorted({path for pattern in PACKAGE_GLOBS for path in source.glob(pattern)})
        with ThreadPoolExecutor(max_workers=6) as pool:
            results = list(pool.map(lambda path: scan_bundle(reader, script_file, int(component["id"]), path), paths))
        scans.append({
            "source": str(source.relative_to(game)), "scanned": len(paths),
            "bundles": [
                {**fingerprint(path), "relativePath": path.relative_to(source).as_posix(), "components": rows}
                for path, rows in zip(paths, results, strict=True)
            ],
        })
    ids = {row["prefab"] for scan in scans for package in scan["bundles"] for row in package["components"]}
    assert ids
    submodule = ROOT / "assets/arknights-game-data"
    excel = submodule / "zh_CN/gamedata/excel"
    manifest = update / "hot_update_list.json"
    provenance = {
        "collectedOn": "2026-11-22", "versionId": json.loads(manifest.read_text())["versionId"],
        "reader": fingerprint(HELPER), "assets": [fingerprint(scripts), fingerprint(manifest)],
        "inputGlobs": PACKAGE_GLOBS,
        "revision": check_output(["git", "-C", submodule, "rev-parse", "HEAD"], text=True).strip(),
        "config": [fingerprint(excel / f"{name}.json") for name in ("character_table", "sandbox_perm_table", "activity_table")],
    }
    result = {"scriptFile": script_file, "script": component, "scans": scans, "config": input_modes(ids, excel)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

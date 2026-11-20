#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract the prefab references and blackboard values for Logos S3 projectile control."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized, script

DECODER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
spec = importlib.util.spec_from_file_location("archived_decoder", DECODER)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)

REVISION = "63c7cec73c3858d0ae913f85cc89af3cef4d744f"
SKILL_TABLE_URL = f"https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{REVISION}/zh_CN/gamedata/excel/skill_table.json"
SKILL_TABLE_SHA256 = "492900f6b957233296c9736c86bb4e5f3ab4b4d7f5055a0f973c5acec3d174b1"

SCRIPT_BUNDLES = (
    "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin",
    "anon/88b3c3ecaaefa6003de730686dd5ac53.bin",
)
PREFABS = {
    "battle/prefabs/[uc]skills.ab": {
        -3086533397681928386: ("CastSkill", "_extraAbilities", "_attackBlackboardModeIndex", "_extraAttackBlackboardModeIndices"),
        -6646596549590448322: ("ActiveAbilityWrapper", "_metadata", "_wrappedAbilities"),
        4938691717097981758: ("ProjectileAuraAbility", "_projectileValidator"),
        -5586643412165654722: ("ProjectileMoveScaleBehaviour", "_moveScale"),
        -2382881213094754498: ("AutoLoadBoxRange", "_useBlackboardRangeId"),
        7167625259498604350: ("ProjectileValidator", "_targetSide", "_verifyProjectileType", "_onlySourceIsMe"),
    },
    "charpack/char_4133_logos.ab": {
        -8180575500434369077: ("UnitMode", "_attack"),
        8587170977828672971: ("EliminateProjectileAbility", "_selector", "_animKey"),
        -7800239368906435125: ("AdvancedProjectileSelector", "_targetSide"),
        -2395166296745536053: ("AutoLoadBoxRange", "_useBlackboardRangeId"),
    },
}


def serialized_files(path):
    for name, data in bundle(path)[0]:
        if not name.endswith((".resS", ".resource")):
            yield name, data, serialized(data)["objects"]


def get_scripts(path):
    return {
        (file_name, obj["id"]): script(obj, data)
        for file_name, data, objects in serialized_files(path)
        for obj in objects if obj["classid"] == 115
    }


def select_prefab(base, relative, selection, scripts):
    rows = []
    for file_name, data, objects in serialized_files(base / relative):
        layouts, externals = decoder.helper.trees(data)
        for obj in objects:
            path_id = obj["id"]
            if obj["classid"] != 114 or path_id not in selection:
                continue
            class_name, *fields = selection[path_id]
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = decoder.decode(raw, layouts[obj["typeid"]])
            script_ptr = value["common:490"]
            file_index = script_ptr["m_FileID"]
            script_file = file_name if file_index == 0 else externals[file_index - 1]["path"].split("/")[-1]
            script_record = scripts[(script_file, script_ptr["m_PathID"])]
            if script_record["name"] != class_name:
                raise ValueError(f"unexpected script for {relative}#{path_id}")
            rows.append({
                "bundle": relative,
                "file": file_name,
                "pathId": str(path_id),
                "objectSha256": hashlib.sha256(raw).hexdigest(),
                "gameObjectPathId": str(int.from_bytes(raw[4:12], "little", signed=True)),
                "scriptFile": script_file,
                "scriptPPtr": script_ptr,
                "script": script_record,
                "value": {key: value[key] for key in fields},
            })
    if sorted(int(row["pathId"]) for row in rows) != sorted(selection):
        raise ValueError(f"missing or ambiguous components in {relative}")
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--skill-table", type=Path, required=True, help=SKILL_TABLE_URL)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    skill_table = fingerprint(args.skill_table)
    if skill_table["sha256"] != SKILL_TABLE_SHA256:
        parser.error("skill table does not match the pinned mirror revision")
    levels = json.loads(args.skill_table.read_text())["skchr_logos_3"]["levels"]
    blackboards = [
        {"pointer": f"/skchr_logos_3/levels/{index}/blackboard/{offset}", "value": value}
        for index, level in enumerate(levels)
        for offset, value in enumerate(level["blackboard"])
        if value["key"] == "projectile_move_scale"
    ]
    if len(blackboards) != len(levels):
        raise ValueError("expected one projectile_move_scale per skill level")

    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    script_paths = [base / name for name in SCRIPT_BUNDLES if (base / name).is_file()]
    scripts = {}
    for path in script_paths:
        scripts.update(get_scripts(path))
    components = [
        row
        for relative, selection in PREFABS.items()
        for row in select_prefab(base, relative, selection, scripts)
    ]
    payload = {
        "provenance": {
            "collectedOn": "2026-11-20",
            "scope": "Selected static prefab references and a versioned skill-table extract.",
            "script": fingerprint(Path(__file__)),
            "helpers": [fingerprint(DECODER), fingerprint(decoder.HELPER), fingerprint(TOOLS / "unity_assets.py")],
            "sources": [fingerprint(path) for path in [*script_paths, *(base / name for name in PREFABS)]],
            "skillTable": {"url": SKILL_TABLE_URL, "revision": REVISION, **skill_table},
        },
        "result": {"components": components, "blackboards": blackboards},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

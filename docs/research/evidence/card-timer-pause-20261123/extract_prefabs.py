#!/usr/bin/env python3
"""Read the two deploy-timer pause target validators from installed Unity assets."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True

ROOT = Path.cwd()
DEFAULT_GAME = Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game")
RELATIVE_BUNDLE = Path("battle/enm_pfb_20.ab")
SERIALIZED_FILE = "CAB-d6fd4ca05b8201d765eb078efa151e40"
CASES = [
    ("enemy_2083_skzhg", -4808716054052809844, "M0Aura", "skzhg_m0_t[aura]"),
    ("enemy_2090_skzjbc", 3765033937093603416, "swallowOperators", "skzjbc_t[swallow_mark]"),
]

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()

helper_path = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
spec = importlib.util.spec_from_file_location("archived_targeting_extract", helper_path)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

bundle_path = args.game / "Arknights_Data/StreamingAssets/AB/Windows" / RELATIVE_BUNDLE
files, unity = helper.bundle(bundle_path)
data = dict(files)[SERIALIZED_FILE]
objects = {obj["id"]: obj for obj in helper.serialized(data)["objects"]}
layouts, _ = helper.helper.trees(data)

def read(path_id):
    obj = objects[path_id]
    raw = data[obj["start"]:obj["start"] + obj["size"]]
    return raw, helper.decode(raw, layouts[obj["typeid"]])

def mono_evidence(path_id, raw):
    return {
        "pathId": str(path_id),
        "classId": objects[path_id]["classid"],
        "scriptId": objects[path_id]["scriptid"],
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
    }

rows = []
for enemy_key, aura_id, expected_name, buff_key in CASES:
    aura_raw, aura = read(aura_id)
    buff = next(item for item in aura["_buffs"]["Array"] if item["buffKey"] == buff_key)
    game_object_id = aura["common:374"]["m_PathID"]
    reader = helper.Reader(data, p=objects[game_object_id]["start"])
    reader.read(reader.val("i") * 12)
    reader.val("i")
    game_object_name = reader.string()
    assert game_object_name == expected_name
    validator = aura["_targetValidator"]
    assert validator["m_FileID"] == 0
    validator_id = validator["m_PathID"]
    validator_raw, decoded = read(validator_id)
    assert decoded["common:374"] == aura["common:374"]
    rows.append({
        "enemyKey": enemy_key,
        "gameObject": {"pathId": str(game_object_id), "name": game_object_name},
        "aura": {
            **mono_evidence(aura_id, aura_raw),
            "buffKey": buff["buffKey"],
            "templateKey": buff["templateKey"],
            "loadFromDB": buff["loadFromDB"],
            "selector": {"m_FileID": aura["_selector"]["m_FileID"], "m_PathID": str(aura["_selector"]["m_PathID"])},
            "targetValidator": {"m_FileID": validator["m_FileID"], "m_PathID": str(validator_id)},
        },
        "validator": {
            **mono_evidence(validator_id, validator_raw),
            "targetOptions": decoded["_targetOptions"],
        },
    })

raw_bundle = bundle_path.read_bytes()
result = {
    "bundle": {
        "path": str(RELATIVE_BUNDLE),
        "bytes": len(raw_bundle),
        "sha256": hashlib.sha256(raw_bundle).hexdigest(),
        "unityVersion": unity,
        "serializedFile": SERIALIZED_FILE,
    },
    "scope": "Installed Windows Unity assets with whole MonoBehaviour TypeTree decoding.",
    "cases": rows,
}
args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")

"""Read the installed Yan bond summon templates and their fixed level and season inputs."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
SKILL = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(SKILL))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized


REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
READER = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
TEMPLATE = "act1autochess_bond_eff_yan"


def templates(source):
    spec = importlib.util.spec_from_file_location("holder_reader", READER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            holder = reader.decode(raw, reader.trees(data)[obj["typeid"]])
            programs = []
            for index, template in enumerate(holder["_templates"]["Array"]):
                name = template["templateKey"]
                if not name.startswith(TEMPLATE):
                    continue
                programs.append({
                    "index": index,
                    "key": name,
                    "events": [
                        {"event": entry["key"], "actions": json.loads(entry["value"]["SerializedState"])}
                        for entry in template["eventToActions"]["_items"]["Array"]
                    ],
                })
            return {
                "serializedFile": filename,
                "pathId": str(obj["id"]),
                "objectSha256": hashlib.sha256(raw).hexdigest(),
                "templates": programs,
            }
    raise ValueError("expected matching BuffTemplate Holder")


def fixed_inputs(gamedata):
    activity = gamedata / "excel/activity_table.json"
    seasons = json.loads(activity.read_text())["activity"]["AUTOCHESS_SEASON"]
    result = []
    for season, level in (
        ("act1autochess", "level_act1autochess_h07_02.json"),
        ("act2autochess", "level_act2autochess_h07_05.json"),
    ):
        path = gamedata / "levels/activities" / season / level
        level_document = json.loads(path.read_text())
        result.append({
            "season": season,
            "bondPointer": f"/activity/AUTOCHESS_SEASON/{season}/effectBuffInfoDataDict/bondeffect_yan",
            "bond": seasons[season]["effectBuffInfoDataDict"]["bondeffect_yan"],
            "level": fingerprint(path),
            "branchPointer": "/branches/dragon",
            "branch": level_document["branches"]["dragon"],
        })
    return {"activity": fingerprint(activity), "seasons": result}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
    gamedata = ROOT / "assets/arknights-game-data/zh_CN/gamedata"
    record = {
        "provenance": {"source": fingerprint(source), "reader": fingerprint(READER), "revision": REVISION},
        "result": {"holder": templates(source), "config": fixed_inputs(gamedata)},
    }
    args.out.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n")

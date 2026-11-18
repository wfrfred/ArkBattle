#!/usr/bin/env python3
"""Re-extract the two Buff templates in the KillCjbtow chain."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized

LIFE = ROOT / "docs/research/evidence/resource-mechanisms-20261114/life"
spec = importlib.util.spec_from_file_location("life_templates", LIFE / "extract_templates.py")
life = importlib.util.module_from_spec(spec)
spec.loader.exec_module(life)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
source_fingerprint = fingerprint(source)
if source_fingerprint["sha256"] != "8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79":
    raise ValueError("Buff holder does not match the archived input")

keys = {"enemy_cjtaot_kill_cjbtow", "instant_kill"}
selected = {}
for file, data in bundle(source)[0]:
    if file.endswith((".resS", ".resource")):
        continue
    for obj in serialized(data)["objects"]:
        if obj["id"] != 6070581171229484677:
            continue
        raw = data[obj["start"]:obj["start"] + obj["size"]]
        holder = life.helper.decode(raw, life.helper.trees(data)[obj["typeid"]])
        for index, template in enumerate(holder["_templates"]["Array"]):
            key = template["templateKey"]
            if key not in keys:
                continue
            events = [
                {"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                for event in template["eventToActions"]["_items"]["Array"]
            ]
            selected[key] = dict(file=file, pathId=str(obj["id"]), templateIndex=index, events=events)

if set(selected) != keys:
    raise ValueError("Could not find both consumer templates")
payload = {
    "provenance": {"checkedOn": "2026-11-18", "source": source_fingerprint, "decoder": fingerprint(life.HELPER)},
    "result": selected,
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")

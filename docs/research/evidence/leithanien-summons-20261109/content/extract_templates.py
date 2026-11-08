#!/usr/bin/env python3
"""Read the live updated holder for the Leithanien summoning chain."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    helper = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
    spec = importlib.util.spec_from_file_location("reader", helper)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    source = args.game / "Arknights_Data/PersistentData/Bundles/config/buff_template_holder.ab"
    manifest = args.game / "Arknights_Data/PersistentData/Bundles/hot_update_list.json"
    rows = []
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        layouts = reader.trees(data)
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if b"act3autochess_bond_eff_lethania[summoner]" not in raw:
                continue
            holder = reader.decode(raw, layouts[obj["typeid"]])
            for index, template in enumerate(holder["_templates"]["Array"]):
                key = template["templateKey"]
                if not key.startswith("act3autochess_bond_eff_lethania") and key not in ["aclt[bleeding]", "acltm[atk-spd]"]:
                    continue
                events = [{"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                          for event in template["eventToActions"]["_items"]["Array"]]
                rows.append({"file": filename, "pathId": str(obj["id"]), "objectSha256": hashlib.sha256(raw).hexdigest(),
                             "templateIndex": index, "template": template, "events": events})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "provenance": {"collectedOn": datetime.date.today().isoformat(), "script": fingerprint(Path(__file__)),
                       "reader": fingerprint(helper), "sources": [fingerprint(source), fingerprint(manifest)],
                       "scope": "Selected complete programs from the current persistent holder; static programs, not proof of runtime activation."},
        "result": {"templates": rows},
    }, ensure_ascii=False, indent=2) + "\n")
    print("templates", len(rows))


if __name__ == "__main__":
    main()

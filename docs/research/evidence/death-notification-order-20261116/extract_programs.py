#!/usr/bin/env python3
"""Read the four selected programs from the installed Buff Template Holder."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized

KEYS = {"flameb_t_1", "judge_t_1", "kill_to_add_cost", "enemy_duchns_boom"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    helper = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
    spec = importlib.util.spec_from_file_location("death_order_holder", helper)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    source = DEFAULT_GAME / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
    selected = []
    count = 0
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            holder = decoder.decode(raw, decoder.trees(data)[obj["typeid"]])
            for index, template in enumerate(holder["_templates"]["Array"]):
                count += 1
                if template["templateKey"] in KEYS:
                    selected.append({
                        "templateIndex": index,
                        "templateKey": template["templateKey"],
                        "events": [{"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                                   for event in template["eventToActions"]["_items"]["Array"]],
                    })
    assert {item["templateKey"] for item in selected} == KEYS
    payload = {
        "provenance": {"source": fingerprint(source), "decoder": fingerprint(helper), "script": fingerprint(Path(__file__))},
        "result": {"templateCount": count, "selected": selected},
    }
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

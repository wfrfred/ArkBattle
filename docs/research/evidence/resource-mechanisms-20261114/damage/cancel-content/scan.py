#!/usr/bin/env python3
"""Locate cancellation-reason consumers in the complete installed Buff Holder."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized

HELPER = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"


def walk(value, pointer=""):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + "/" + key.replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("cancel_holder_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
    filters, permissions, blockers, programs = [], [], [], []
    count, holder = 0, None
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        for obj in state["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            holder = {"file": filename, "pathId": str(obj["id"]), "objectSha256": hashlib.sha256(raw).hexdigest()}
            value = helper.decode(raw, helper.trees(data)[obj["typeid"]])
            for index, template in enumerate(value["_templates"]["Array"]):
                count += 1
                events = [{"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                          for event in template["eventToActions"]["_items"]["Array"]]
                include = template["templateKey"] == "switch_mode_restart_fsm"
                for pointer, node in walk(events):
                    node_type = node.get("$type", "")
                    row = {"template": template["templateKey"], "templateIndex": index,
                           "pointer": "/events" + pointer, "node": node}
                    if node_type.endswith(("+FilterModifierCancelReason", "+FilterDamageCancellation")):
                        filters.append(row)
                        include = True
                    nondefault = {key: item for key, item in node.items()
                                  if "ignorecancelreason" in key.lower()
                                  and item not in ("NONE", "", 0, None)}
                    if nondefault:
                        permissions.append({**row, "nondefault": nondefault})
                        include = True
                    if node_type.endswith("+BlockDamage"):
                        blockers.append(row)
                        if node.get("_showDamageNumber"):
                            include = True
                if include:
                    programs.append({"templateIndex": index, "templateKey": template["templateKey"],
                                     "effectKey": template.get("effectKey"), "events": events})
    payload = {"provenance": {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
               "reader": fingerprint(HELPER), "source": fingerprint(source),
               "scope": "Complete installed Holder; templates alone do not prove Content binding or live execution."},
               "result": {"templateCount": count, "holder": holder,
               "reasonFilters": filters, "nondefaultPermissions": permissions,
               "blockDamageNodes": blockers, "selectedTemplates": programs}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"templates": count, "filters": len(filters), "permissions": len(permissions),
                      "blockers": len(blockers), "selected": len(programs), "out": str(args.out)}))


if __name__ == "__main__":
    main()

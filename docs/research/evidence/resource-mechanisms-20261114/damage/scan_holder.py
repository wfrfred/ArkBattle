#!/usr/bin/env python3
"""Inventory damage classification/permission programs in the installed Buff holder."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
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
            yield from walk(child, pointer + "/" + str(key).replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--select", action="append", default=[])
    parser.add_argument("--node-type", action="append", default=[])
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("holder_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
    type_pattern = re.compile(r"SetSharedFlag|RemoveSharedFlag|CheckSharedFlag|SetIgnore|DamageSplit|ModifyAttackType|AttackType|IsChangeable|IsNotChangeable" + "".join("|" + re.escape(q) for q in args.node_type))
    field_pattern = re.compile(r"sharedFlag|ignoreCancel|ignoreMiss|allowCancel|allowModify|attackType|applyWay|skipModifier|triggerOnCalculate|emitSourceOnCalculate|cacheAtk|damageWithoutModify|isNotChangeableValue|instantKillLikeDamage|isEnvDamage|isEnvElementDamage|isUndeadable", re.I)
    matches, selected, count, holder = [], [], 0, None
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
                for pointer, node in walk(events):
                    fields = {k: v for k, v in node.items() if field_pattern.search(k)}
                    node_type = node.get("$type", "")
                    if fields or type_pattern.search(node_type):
                        matches.append({"template": template["templateKey"], "templateIndex": index,
                                        "pointer": "/events" + pointer, "nodeType": node_type,
                                        "fields": fields,
                                        "node": node if type_pattern.search(node_type) else None})
                if template["templateKey"] in args.select:
                    selected.append({"templateIndex": index, "templateKey": template["templateKey"],
                                     "effectKey": template.get("effectKey"), "events": events})
    provenance = {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
                  "reader": fingerprint(HELPER), "source": fingerprint(source),
                  "scope": "Complete installed Holder program scan for recorded field/type patterns; locating a template is not proof any supported Content selects it."}
    payload = {"provenance": provenance, "result": {"selection": {"typePattern": type_pattern.pattern,
               "fieldPattern": field_pattern.pattern, "selectedKeys": args.select, "extraNodeTypes": args.node_type}, "holder": holder,
               "templateCount": count, "matches": matches, "selectedTemplates": selected}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"templates": count, "matches": len(matches), "selected": len(selected), "out": str(args.out)}))


if __name__ == "__main__":
    main()

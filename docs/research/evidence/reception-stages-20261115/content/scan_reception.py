#!/usr/bin/env python3
"""Inventory every installed Holder template and preserve complete reception programs."""
import argparse
from collections import Counter, defaultdict
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

READER = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
EVENTS = (5, 6, 10)


def walk(value, pointer=""):
    if isinstance(value, dict):
        if "$type" in value:
            yield pointer, value
        for key, child in value.items():
            escaped = str(key).replace("~", "~0").replace("/", "~1")
            yield from walk(child, pointer + "/" + escaped)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("reception_holder_reader", READER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
    templates, programs, nodes, failures = [], [], [], []
    holder = None
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        for obj in state["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            holder = {"file": filename, "pathId": str(obj["id"]),
                      "objectSha256": hashlib.sha256(raw).hexdigest()}
            value = reader.decode(raw, reader.trees(data)[obj["typeid"]])
            for index, template in enumerate(value["_templates"]["Array"]):
                key = template["templateKey"]
                events = []
                for event in template["eventToActions"]["_items"]["Array"]:
                    number = event["key"]
                    events.append(number)
                    if number not in EVENTS:
                        continue
                    try:
                        actions = json.loads(event["value"]["SerializedState"])
                    except Exception as error:
                        failures.append({"template": key, "event": number,
                                         "error": type(error).__name__ + ": " + str(error)})
                        continue
                    programs.append({"template": key, "templateIndex": index, "event": number,
                                     "priority": template["onEventPriority"], "actions": actions})
                    for pointer, node in walk(actions):
                        nodes.append({"template": key, "templateIndex": index, "event": number,
                                      "pointer": pointer, "nodeType": node["$type"]})
                templates.append({"index": index, "template": key,
                                  "effectKey": template.get("effectKey"),
                                  "priority": template["onEventPriority"], "events": events})
    if holder is None:
        raise RuntimeError("Holder object was not found")
    counts = Counter(program["event"] for program in programs)
    grouped = defaultdict(Counter)
    for node in nodes:
        grouped[node["event"]][node["nodeType"]] += 1
    provenance = {
        "checkedOn": "2026-11-15", "script": fingerprint(Path(__file__)),
        "reader": fingerprint(READER), "source": fingerprint(source), "holder": holder,
        "scope": "All installed Holder templates; complete actions for event numbers 5, 6, 10, including nested branches. Event labels and execution gates are verified independently in native evidence. Template existence does not prove binding or activation.",
    }
    args.out.mkdir(parents=True, exist_ok=True)
    inventory = {"provenance": provenance, "result": {
        "complete": not failures, "templateCount": len(templates), "events": list(EVENTS),
        "programCounts": dict(sorted(counts.items())), "nodeCount": len(nodes),
        "nodeTypesByEvent": {str(event): dict(sorted(entries.items()))
                             for event, entries in sorted(grouped.items())},
        "templates": templates, "nodes": nodes, "failures": failures,
    }}
    full = {"provenance": provenance, "result": {"programs": programs}}
    for name, payload in [("inventory.json", inventory), ("programs.json", full)]:
        (args.out / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"templates": len(templates), "programs": len(programs),
                      "counts": dict(counts), "nodes": len(nodes), "failures": len(failures)}))


if __name__ == "__main__":
    main()

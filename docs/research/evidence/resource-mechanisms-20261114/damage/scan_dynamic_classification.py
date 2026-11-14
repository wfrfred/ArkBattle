#!/usr/bin/env python3
"""Decode dynamic attack classification fields across installed content resource families."""
import argparse
import collections
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"


def walk(value, pointer=""):
    if isinstance(value, dict):
        for key, item in value.items():
            path = pointer + "/" + key.replace("~", "~0").replace("/", "~1")
            if "dynamicattacktype" in key.lower():
                yield path, item
            yield from walk(item, path)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk(item, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("dynamic_classification_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    patterns = ["charpack/*.ab", "battle/enm_pfb*.ab", "battle/prefabs/*.ab", "config/*.ab"]
    files = sorted({p for pattern in patterns for p in base.glob(pattern) if p.name != "buff_template_holder.ab"})
    scan, objects, hits, errors = [], [], [], []
    distribution = collections.Counter()
    for path in files:
        row = {"bundle": str(path.relative_to(base)), "fileSha256": hashlib.sha256(path.read_bytes()).hexdigest(), "typedObjectsDecoded": 0}
        try:
            for filename, data in bundle(path)[0]:
                if filename.endswith((".resS", ".resource")) or b"DynamicAttackType" not in data:
                    continue
                state = serialized(data)
                layouts, _ = helper.helper.trees(data)
                relevant = {i for i, nodes in enumerate(layouts) if any("dynamicattacktype" in n["name"].lower() for n in nodes)}
                if not relevant:
                    continue
                names, transforms = {}, {}
                for obj in state["objects"]:
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    if obj["classid"] == 1:
                        reader = Reader(raw)
                        reader.read(reader.val("i") * 12)
                        reader.val("i")
                        names[obj["id"]] = reader.string()
                    elif obj["classid"] == 4:
                        value = helper.decode(raw, layouts[obj["typeid"]])
                        transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
                by_owner = {go: tid for tid, (go, _) in transforms.items()}
                for obj in state["objects"]:
                    if obj["classid"] != 114 or obj["typeid"] not in relevant:
                        continue
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    value = helper.decode(raw, layouts[obj["typeid"]])
                    values = [{"pointer": pointer, "value": item} for pointer, item in walk(value)]
                    row["typedObjectsDecoded"] += 1
                    for field in values:
                        distribution[(field["pointer"].split("/")[-1], str(field["value"]))] += 1
                    hierarchy = []
                    tid = by_owner.get(struct.unpack_from("<q", raw, 4)[0])
                    while tid:
                        go, tid = transforms[tid]
                        hierarchy.append(names.get(go, ""))
                    hierarchy.reverse()
                    record = {"bundle": row["bundle"], "file": filename, "pathId": str(obj["id"]),
                              "hierarchy": hierarchy, "objectSha256": hashlib.sha256(raw).hexdigest(), "fields": values}
                    objects.append(record)
                    if any(field["value"] is True or field["value"] == 1 for field in values):
                        hits.append(record | {"value": value})
        except Exception as error:
            errors.append({"bundle": row["bundle"], "error": type(error).__name__ + ": " + str(error)})
        scan.append(row)
    provenance = {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)), "helper": fingerprint(HELPER),
                  "scope": "Complete listed resource families except Holder; every MonoBehaviour with a matching serialized type-tree field is decoded. Holder JSON fields are independently covered by holder-scan.json. No-hit is bounded evidence, not proof the native branch is dead."}
    result = {"selection": {"patterns": patterns, "fieldSubstring": "dynamicAttackType"}, "complete": not errors,
              "scan": scan, "distribution": [{"field": key[0], "value": key[1], "count": count} for key, count in sorted(distribution.items())],
              "objects": objects, "trueObjects": hits, "errors": errors}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"files": len(scan), "objects": len(objects), "trueObjects": len(hits), "errors": len(errors), "out": str(args.out)}))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate direct Buff.m_isDamageMissable accesses in all current Buff methods."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

HELPER = ROOT / "docs/research/evidence/resource-mechanisms-20261114/damage/trace_flags.py"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("damage_full_body", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    native = Native(args.game)
    owner = next(t for t in native.types if native.typename(t["index"]) == "Torappu.Battle.Buff")
    field = next(f for f in native.fields(owner["index"]) if f["name"] == "m_isDamageMissable")
    needle = "+ " + hex(field["offset"]) + "]"
    checked, hits, bodies = [], [], []
    for raw in native.methods:
        if raw["declaringType"] != owner["index"]:
            continue
        method = native.method(raw["index"])
        if not method.get("address"):
            continue
        body = helper.full_body(native, method)
        checked.append({"index": method["index"], "fullname": method["fullname"]})
        found = [i for p in body["fragments"] for i in p["instructions"] if needle in i["operands"]]
        if found:
            hits.append({"methodIndex": method["index"], "fullname": method["fullname"], "instructions": found})
            bodies.append(body)
    provenance = native.provenance()
    provenance["caseTool"] = {"script": fingerprint(Path(__file__)), "bodyReader": fingerprint(HELPER)}
    result = {"scope": "Every file-backed method declared by Buff; operand-offset candidates are verified using complete caller body and metadata field offset. Not a whole-module pointer-alias proof.",
              "field": field, "methodsChecked": checked, "hits": hits, "bodies": bodies}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"checked": len(checked), "hits": len(hits), "out": str(args.out)}))


if __name__ == "__main__":
    main()

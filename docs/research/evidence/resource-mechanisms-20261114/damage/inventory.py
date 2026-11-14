#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate damage classifications, permissions and construction/consumption entry points."""
import argparse
import importlib.util
import json
import re
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    axes = re.compile(r"(?:^Torappu\.Battle\.Modifier(?:/.*)?$|^Torappu\.Battle\.DamageType(?:Mask)?$|^Torappu\.SourceApplyWay$|DamageInfo$|DamageOptions$|DamageParam|DamageCalculation|IgnoreCancel|IgnoreMiss|DamageSplit)")
    methods_pattern = re.compile(r"CheckIgnoreCancel|CheckIgnoreMiss|SetIgnore|DamageSplit|CanModify|ModifyAllowed|(?<!Motion)ChangeAllowed|NewDamageModifier|Calculate(?:Cached|DamageBy|DamageNoEvent)|DamageScale\.Execute|SetModifier.*Flag|ModifyModifier|Filter.*(?:ApplyWay|AttackType)|Check.*(?:ApplyWay|AttackType)|SharedFlag|ModifyAttackType|AttackTypeMask")
    owners, methods = [], []
    selected_owners = set()
    for t in native.types:
        fullname = native.typename(t["index"])
        if fullname.startswith("Torappu.") and axes.search(fullname):
            selected_owners.add(t["index"])
            owners.append({"index": t["index"], "fullname": fullname,
                           "fields": native.fields(t["index"])})
    exact_owners = {"Torappu.Battle.Modifier", "Torappu.Battle.Action.Nodes/Evade", "Torappu.Battle.Action.Nodes/BlockDamage",
                    "Torappu.Battle.Action.Nodes/AdvancedApplyDamage", "Torappu.Battle.Action.Nodes/DamageScale",
                    "Torappu.Battle.Action.Nodes/SetIgnoreMissFlag", "Torappu.Battle.Action.Nodes/SetModifierFlag"}
    for raw in native.methods:
        owner = native.typename(raw["declaringType"])
        name = native.string(raw["nameIndex"])
        if name.startswith(("__Hotfix", "<>xLua")):
            continue
        fullname = owner + "." + name
        if owner.startswith("Torappu.Battle.") and (owner in exact_owners or methods_pattern.search(fullname)):
            methods.append(native.method(raw["index"]))
    decoder_path = ROOT / "docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py"
    spec = importlib.util.spec_from_file_location("enum_decoder", decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    defaults = {x["fieldIndex"]: x for x in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    base, _ = native.table(8)
    enums = []
    for owner in owners:
        values = []
        for field in owner["fields"]:
            row = defaults.get(field["index"])
            if row is None or row["dataIndex"] < 0:
                continue
            constant_type = native.type_name(row["typeIndex"])
            offset = base + row["dataIndex"]
            if constant_type in {"short", "ushort", "byte", "sbyte"}:
                fmt = {"short": "<h", "ushort": "<H", "byte": "<B", "sbyte": "<b"}[constant_type]
                decoded = struct.unpack_from(fmt, native.metadata, offset)[0]
            else:
                encoded, _ = decoder.cu32(native.metadata, offset)
                decoded = encoded if constant_type == "uint" else (encoded >> 1) ^ -(encoded & 1)
            values.append({"name": field["name"], "fieldIndex": field["index"],
                           "value": decoded, "constantType": constant_type, "default": row})
        if values:
            enums.append({"fullname": owner["fullname"], "index": owner["index"], "values": values})
    prov = native.provenance()
    prov["caseTool"] = {"script": fingerprint(Path(__file__)), "enumDecoder": fingerprint(decoder_path)}
    prov["collectedOn"] = "2026-11-14"
    prov["scope"] = "Complete metadata-name scan within the recorded patterns; signatures and fields only, not proof of actual Content activation or all runtime writes."
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": prov, "result": {
        "selection": {"axisPattern": axes.pattern, "methodPattern": methods_pattern.pattern, "exactOwners": sorted(exact_owners)},
        "owners": owners, "methods": methods, "enums": enums}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"owners": len(owners), "methods": len(methods), "enums": len(enums), "out": str(args.out)}))


if __name__ == "__main__":
    main()

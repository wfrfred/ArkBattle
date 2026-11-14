#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate resource, death attribution and attribute entry points in this client."""
import argparse
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--xref-record", type=Path)
    args = parser.parse_args()
    native = Native(args.game)
    type_pattern = re.compile(
        r"BattleContext|Torappu\.Battle\.Context|Death|Kill|Finish|Die|HpZero|"
        r"AttributeType|AttributeModifier|AttributeRange|AttributesData|Buff/Attribute|"
        r"Abnormal|DamageType|AttackType|SourceApplyWay|SharedFlag|Modifier/", re.I)
    method_pattern = re.compile(
        r"BattleContext|Torappu\.Battle\.Context|OnTargetKilled|OnKilled|KillTarget|ForceKill|ForceDead|ForceDeath|"
        r"FinishMe|OnFinish|OnHpZero|SetHp|set_hp|CheckReborn|"
        r"set_maxHp|set_defense|set_magicResistance|AttributeRange|AttributeLimit|"
        r"ChangeSource|PushSource|PopSource|GetTopSource|ChangeMaxHp|UpdateMaxHp", re.I)
    field_pattern = re.compile(
        r"source|originalSource|kill|dead|alive|hp|life|range|limit|defense|resistance", re.I)
    owners = {"Torappu.Battle.Entity", "Torappu.Battle.Unit", "Torappu.Battle.Character",
              "Torappu.Battle.Enemy", "Torappu.Battle.Modifier", "Torappu.Battle.Context",
              "Torappu.AttributesData", "Torappu.Battle.Buff/AttributeModifier"}
    types = []
    for row in native.types:
        name = native.typename(row["index"])
        if not name.startswith("Torappu.Battle.") and name not in owners:
            continue
        if name in owners or type_pattern.search(name):
            fields = native.fields(row["index"])
            if name in owners:
                fields = [f for f in fields if field_pattern.search(f["name"])
                          and not f["name"].startswith("__Hotfix")]
            types.append({"fullname": name, "index": row["index"],
                          "parent": native.type_name(row["parentIndex"])
                          if row["parentIndex"] >= 0 else None, "fields": fields})
    methods = []
    for row in native.methods:
        owner = native.typename(row["declaringType"])
        name = owner + "." + native.string(row["nameIndex"])
        if owner.startswith("Torappu.Battle.") and "__Hotfix" not in name and "<>xLua" not in name:
            if method_pattern.search(name):
                methods.append(native.method(row["index"]))
    provenance = native.provenance()
    provenance["location"]["modules"] = {
        "Assembly-CSharp.dll": native.modules["Assembly-CSharp.dll"]}
    provenance["collectedOn"] = "2026-11-14"
    provenance["extractionScript"] = fingerprint(Path(__file__))
    provenance["scope"] = ("Metadata locator across Battle and the explicit shared owners. Excluded modes are retained "
                           "as candidate locations, not treated as supported gameplay requirements.")
    caller_groups = []
    if args.xref_record:
        source = json.loads(args.xref_record.read_text())
        provenance["xrefInput"] = fingerprint(args.xref_record)
        for group in source["result"]["xrefs"]:
            candidates = group["directCandidates"]["candidates"]
            indices = sorted({index for candidate in candidates
                              for index in candidate.get("precedingMethodCandidates", [])})
            caller_groups.append({"target": group["targetMethod"],
                                  "candidates": candidates,
                                  "methodIdentities": [native.method(index) for index in indices]})
    result = {"selection": {"typePattern": type_pattern.pattern,
                            "methodPattern": method_pattern.pattern,
                            "fieldPatternForOwners": field_pattern.pattern,
                            "owners": sorted(owners)}, "types": types, "methods": methods,
              "callerGroups": caller_groups}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result},
                                   ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"types": len(types), "methods": len(methods)}))


if __name__ == "__main__":
    main()

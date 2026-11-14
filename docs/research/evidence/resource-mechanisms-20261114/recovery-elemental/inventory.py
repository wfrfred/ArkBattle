#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate HP/EP recovery and elemental operations without inferring their semantics."""
import argparse
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--game", type=Path, default=DEFAULT_GAME)
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    n = Native(a.game)
    pattern = re.compile(r"Element|(?:^|[._/])EP(?:[A-Z_]|$)|Ep(?:Recovery|Recover|Break|Heal|Damage|Resistance)|Heal|HpRecovery|OverHeal|Overflow", re.I)
    entity_methods = re.compile(r"[HE]p|Heal|Element|Recovery|OnTick|OnAttributeDirty|DoApplyModifier|ApplyModifier|OnInit|\.Init$", re.I)
    owners = {"Torappu.Battle.Entity", "Torappu.Battle.Modifier", "Torappu.Battle.Attributes",
              "Torappu.Battle.BattleFormula", "Torappu.EPBreakBuffData", "Torappu.LevelData/EnemyData"}
    method_pattern = re.compile(r"(?:Heal|Ep|EP|Element|HpRecovery|HpFull|Overflow|OverHeal)")
    types, methods, matches = [], [], []
    for t in n.types:
        name = n.typename(t["index"])
        if not (name.startswith("Torappu.Battle.") or name in owners or name == "Torappu.EPBreakBuffDB"):
            continue
        if name in owners or pattern.search(name):
            fields = n.fields(t["index"])
            row = {"index": t["index"], "fullname": name,
                   "parentName": n.type_name(t["parentIndex"]) if t["parentIndex"] >= 0 else None,
                   "fields": fields}
            ordinary = []
            for i in range(t["methodStart"], t["methodStart"] + t["methodCount"]):
                m = n.method(i)
                short = m["fullname"].rsplit(".", 1)[-1]
                if short.startswith(("__Hotfix", "<>xLua")):
                    continue
                if name in owners and name != "Torappu.EPBreakBuffData" and not entity_methods.search(m["fullname"]):
                    continue
                ordinary.append(m)
            row["methods"] = ordinary
            types.append(row)
            methods.extend(ordinary)
    for raw in n.methods:
        owner = n.typename(raw["declaringType"])
        name = n.string(raw["nameIndex"])
        if owner.startswith("Torappu.Battle.") and method_pattern.search(name) and not name.startswith(("__Hotfix", "<>xLua")):
            matches.append(n.method(raw["index"]))
    provenance = n.provenance()
    provenance["collectedOn"] = "2026-11-14"
    provenance["caseTool"] = {"script": fingerprint(Path(__file__))}
    out = {"provenance": provenance, "result": {"selection": {
        "typePattern": pattern.pattern, "methodNamePattern": method_pattern.pattern, "selectedOwners": sorted(owners),
        "selectedOwnerMethodPattern": entity_methods.pattern,
        "scope": "Metadata locator only; all ordinary methods on matching types, filtered methods on large shared owners. No runtime or content activation claim."},
        "types": types, "methodNameMatches": matches}}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"types": len(types), "methods": len(methods), "out": str(a.out)}))


if __name__ == "__main__":
    main()

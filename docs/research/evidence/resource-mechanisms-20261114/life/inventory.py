#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory native HP resources, lethal intervention and rebirth operations."""
import argparse
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    n = Native(args.game)
    names = re.compile(
        r"TrySetHp|SetHp|DoApplyModifier|[._]HpZero|OnHpZero|OnHpLessThanZero|NegativeHp|NegativeHP|"
        r"negativeHp|MinusHp|ExtraHp|ExtraHP|Overheal|GeneralShield|Undead|Immortal|"
        r"Reborn|Rebirth|Revive|HpNoLess|HpLoss|FixedHp|HpFixed|HpSet|"
        r"get_hp|set_hp|get_es|set_es|SetEs|OnEsOverZero|Muso|Makoto|Bena",
        re.I,
    )
    exact_owners = {
        "Torappu.Battle.Entity", "Torappu.Battle.Unit", "Torappu.Battle.Character",
        "Torappu.Battle.Enemy", "Torappu.Battle.Modifier", "Torappu.Battle.Buff",
        "Torappu.Battle.Buff/BuffContainer", "Torappu.Battle.Entity/Properties",
        "Torappu.Battle.PropLikeEnemy", "Torappu.Battle.EnemyGiantBoss",
        "Torappu.Battle.TeamSideEnemyGiantBoss",
    }
    methods = []
    selected_types = set()
    for row in n.methods:
        owner = n.typename(row["declaringType"])
        if not owner.startswith("Torappu.Battle."):
            continue
        short = n.string(row["nameIndex"])
        if short.startswith(("__Hotfix", "<>xLua")):
            continue
        if names.search(owner + "." + short):
            methods.append(n.method(row["index"]))
            selected_types.add(row["declaringType"])
    owners = []
    for owner in n.types:
        name = n.typename(owner["index"])
        if not name.startswith("Torappu.Battle."):
            continue
        if name not in exact_owners and not names.search(name) and owner["index"] not in selected_types:
            continue
        fields = n.fields(owner["index"])
        # Preserve full ordinary layouts, excluding the large set of bridge statics.
        fields = [f for f in fields if not f["name"].startswith("__Hotfix")]
        declarations = [n.method(m["index"]) for m in n.methods
                        if m["declaringType"] == owner["index"]
                        and not n.string(m["nameIndex"]).startswith(("__Hotfix", "<>xLua"))]
        owners.append({"index": owner["index"], "fullname": name,
                       "parentName": n.type_name(owner["parentIndex"])
                       if owner["parentIndex"] >= 0 else None,
                       "fields": fields, "methods": declarations})
    provenance = n.provenance()
    provenance["caseTool"] = {"script": fingerprint(Path(__file__))}
    payload = {"provenance": provenance, "result": {
        "selection": {"pattern": names.pattern, "namespace": "Torappu.Battle.",
                      "exactOwners": sorted(exact_owners),
                      "scope": "Metadata inventory, not proof of live content or all indirect writes"},
        "methods": methods, "types": owners,
    }}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"methods": len(methods), "types": len(owners), "out": str(args.out)}))


if __name__ == "__main__":
    main()

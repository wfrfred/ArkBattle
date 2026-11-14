#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate battle classification axes without interpreting them as one tag set."""
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
    native = Native(args.game)
    axis = re.compile(
        r"EntityCategory|EntityType|UnitType|EnemyTag|EnemyType|EnemyLevel|LevelType|"
        r"Profession|SubProfession|AttackMethod|ApplyWay|SideType|PlayerSide|(?<!t)Race",
        re.I,
    )
    method_axis = re.compile(
        r"EnemyTag|EnemyType|EnemyLevel|LevelType|Profession|SubProfession|"
        r"AttackMethod|ApplyWay|EntityCategory|EntityType|UnitType|"
        r"ChangeSide|SetSide|set_side|get_side|get_isBoss|get_isElite|(?<!t)Race",
        re.I,
    )
    owners = {
        "Torappu.Battle.Entity", "Torappu.Battle.Unit", "Torappu.Battle.Character",
        "Torappu.Battle.Enemy", "Torappu.Battle.Token", "Torappu.Battle.Trap",
        "Torappu.Battle.BattleCharacterData", "Torappu.BattleCharacterData",
        "Torappu.CharacterData", "Torappu.EnemyData", "Torappu.EnemyDatabase",
        "Torappu.EnemyCatalogData", "Torappu.EnemyData/EnemyLevelType",
    }
    shared_types = {
        "Torappu.UnitType", "Torappu.UnitTypeMask", "Torappu.ProfessionID",
        "Torappu.ProfessionCategory", "Torappu.ProfessionCategories",
        "Torappu.SubProfessionData", "Torappu.SubProfessionAttackType",
        "Torappu.SourceApplyWay", "Torappu.EnemyLevelType", "Torappu.EnemyLevelMask",
        "Torappu.EnemyLevelMasks", "Torappu.EnemyHandbookRaceData",
        "Torappu.PlayerSide", "Torappu.PlayerSideMask", "Torappu.PlayerSideCategories",
    }
    excluded = (".Sandbox", "/Sandbox", ".Legion", "/Legion")
    types, selected_owners = [], []
    for owner in native.types:
        name = native.typename(owner["index"])
        if not name.startswith("Torappu."):
            continue
        if (axis.search(name) and (name.startswith("Torappu.Battle.") or name in shared_types)
                and not any(part in name for part in excluded)):
            types.append({"index": owner["index"], "fullname": name,
                          "parent": native.type_name(owner["parentIndex"])
                          if owner["parentIndex"] >= 0 else None,
                          "fields": native.fields(owner["index"])})
        if name in owners:
            selected_owners.append({
                "index": owner["index"], "fullname": name,
                "parent": native.type_name(owner["parentIndex"])
                if owner["parentIndex"] >= 0 else None,
                "fields": [field for field in native.fields(owner["index"])
                           if axis.search(field["name"]) or axis.search(field["typeName"])],
            })
    methods = []
    for row in native.methods:
        owner = native.typename(row["declaringType"])
        if not owner.startswith("Torappu.Battle."):
            continue
        if any(part in owner for part in excluded):
            continue
        name = native.string(row["nameIndex"])
        if name.startswith(("__Hotfix", "<>xLua")):
            continue
        if method_axis.search(owner + "." + name):
            methods.append(native.method(row["index"]))
    provenance = native.provenance()
    provenance["location"]["modules"] = {
        "Assembly-CSharp.dll": native.modules["Assembly-CSharp.dll"]
    }
    provenance["collectedOn"] = "2026-11-14"
    provenance["extractionScript"] = fingerprint(Path(__file__))
    provenance["scope"] = (
        "Complete metadata-name scan within the recorded patterns and Battle namespace; "
        "signatures/fields only, not proof of all runtime writes or selected content."
    )
    payload = {"provenance": provenance, "result": {
        "selection": {"typePattern": axis.pattern, "methodPattern": method_axis.pattern,
                      "methodNamespace": "Torappu.Battle.", "fieldOwners": sorted(owners),
                      "sharedTypes": sorted(shared_types), "excludedNameParts": excluded},
        "types": types, "fieldOwners": selected_owners, "methods": methods,
    }}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"types": len(types), "owners": len(selected_owners),
                      "methods": len(methods), "out": str(args.out)}))


if __name__ == "__main__":
    main()

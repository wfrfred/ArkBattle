#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract only the native scheduling and EP modifier chain for this case."""
import argparse
import bisect
import importlib.util
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--method", action="append")
    parser.add_argument("--helper", action="append", type=lambda value: int(value, 0), default=[])
    args = parser.parse_args()
    root = Path.cwd()
    tool = root / ".agents/skills/arkbattle-native-research/scripts/native.py"
    spec = importlib.util.spec_from_file_location("arkbattle_native", tool)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    wanted = set(args.method) if args.method else {
        "Torappu.Battle.BattleController.OnTick",
        "Torappu.Battle.ObjectManager.OnFixedUpdate",
        "Torappu.Battle.Entity.OnTick",
        "Torappu.Battle.Entity.SetEpInternal",
        "Torappu.Battle.Entity.get_maxEp",
        "Torappu.Battle.Entity.DoApplyModifier",
        "Torappu.Battle.Entity._DoApplyEPModifierInternal",
        "Torappu.Battle.Entity._UpdateEpRecovery",
        "Torappu.Battle.Buff/BuffContainer.Tick",
        "Torappu.Battle.Unit.OnTick",
        "Torappu.Battle.Character.OnTick",
        "Torappu.Battle.Enemy.OnTick",
        "Torappu.Battle.Buff.OnTick",
        "Torappu.Battle.Buff.OnTrigger",
        "Torappu.Battle.Buff._RunActions",
        "Torappu.Battle.Buff._RunActionsCore",
        "Torappu.Battle.Entity.ApplyModifier",
        "Torappu.Battle.Action.Nodes/ApplyElementDamage.Execute",
        "Torappu.Battle.Action.Nodes/ApplyFixedElementDamage.Execute",
    }
    methods = []
    related = []
    for row in native.methods:
        fullname = native.typename(row["declaringType"]) + "." + native.string(row["nameIndex"])
        if fullname in wanted:
            methods.append(native.method(row["index"]))
        if any(word in fullname.casefold() for word in ["epdamage", "epmodifier", "elementdamage"]):
            related.append(native.method(row["index"]))
    missing = wanted - {method["fullname"] for method in methods}
    if missing:
        raise ValueError(f"methods absent from this metadata: {sorted(missing)}")
    bodies = []
    for method in methods:
        start = method["address"]
        logical_end = native.addresses[bisect.bisect_right(native.addresses, start)]
        fragments = []
        cursor = start
        while cursor < logical_end:
            body = native.disassemble_at(cursor, logical_end - cursor, method=method if cursor == start else None)
            for ins in body["instructions"]:
                aliases = ins.get("methods", [])
                if len(aliases) > 100:
                    ins["methodAliasCount"] = len(aliases)
                    ins["methodAliasesOmitted"] = True
                    del ins["methods"]
            fragments.append(body)
            following = int(body["end"], 16)
            if following <= cursor:
                raise RuntimeError("native fragment did not advance")
            cursor = following
        bodies.append({"selector": {"fullname": method["fullname"], "token": method["token"]}, "method": method,
                       "logicalEnd": hex(logical_end), "boundary": "all consecutive pdata fragments up to next known native method, including padding", "fragments": fragments})
    helpers = [native.disassemble_at(address) for address in args.helper]
    result = {"methods": methods, "bodies": bodies, "relatedMethods": related, "helpers": helpers,
              "aliasNote": "Instruction method alias lists over 100 entries are omitted with count; call bytes and address remain intact. These shared addresses are not assigned one method identity."}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": native.provenance(), "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

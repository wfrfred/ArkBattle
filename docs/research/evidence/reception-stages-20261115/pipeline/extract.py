#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Read the bounded generic modifier reception pipeline; never execute the client."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

ENTITY = {
    "get_alive", "get_disappear", "get_isEPFreeAll", "get_isUnhurtable", "IsUnhurtableWithModifier",
    "ApplyModifier", "_OnBeforeApplyingModifier", "_OnApplyingModifier", "OnApplyingSkippedModifer",
    "OnAppliedModifier", "_OnOutputDamage", "OnOutputModifier", "OnBeforeTargetApplyModifier",
    "DoApplyModifier", "_DoApplyEPModifierInternal", "_VerifyAbilityDamageMiss", "OnTakeDamage",
    "OnTakeHeal", "OnTakeEPDamage",
    "set_sp", "SetSpInternal", "DoSetSpInternal",
}
BUFF = {
    "OnBeforeApplyingModifier", "OnApplyingModifier", "OnApplyingSkippedModifier", "OnAppliedModifier",
    "OnOutputModifier", "OnOutputDamage", "OnBeforeTargetApplyModifier", "OnTakeDamage", "OnTakeEPDamage",
    "OnAfterOutputDamage", "OnAfterOutputHeal", "OnAfterOutputElementDamage", "_CheckBuffsActionValid",
    "_IsActionValid", "_RunActions", "_RunActionsCore", "_OnEventReentryBlocked",
}
MODIFIER = {
    ".ctor", "get_isCancelled", "get_isDamage", "get_isHeal", "get_isElementDamage", "get_isElementHeal",
    "get_finalDelta", "get_value", "set_value", "Cancel", "CheckIgnoreCancel", "_CheckIgnoreMiss",
    "NewDamageModifierAfterCalculate", "NewElementDamageModifierAfterCalculate", "NewHeal",
    "NewElementHeal", "NewHp", "SetSourceInfo", "CheckSharedFlag", "SetSharedFlag",
}
SELECTION = {
    "Torappu.Battle.Entity": sorted(ENTITY),
    "Torappu.Battle.Buff": sorted(BUFF),
    "Torappu.Battle.Buff/BuffContainer": sorted(BUFF),
    "Torappu.Battle.Modifier": sorted(MODIFIER),
    "Torappu.Battle.Unit": ["OnTakeDamage"],
    "Torappu.Battle.Entity/SpController": ["OnTakeDamage", "_RecoverMp"],
    "Torappu.Battle.BattleUtil": ["CheckElementModifierValid"],
    "Torappu.Battle.VisualObject": [],
    "Torappu.Battle.BObject": [],
    "Torappu.Battle.Action.Nodes/BlockElementDamage": ["Execute"],
    "Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode": ["OnEntityApplyModifier", "OnFinalizeEntityDamage"],
}


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    body_path = ROOT / "docs/research/evidence/resource-mechanisms-20261114/damage/trace_flags.py"
    enum_path = ROOT / "docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py"
    reader = module("reception_body_reader", body_path)
    decoder = module("reception_enum_decoder", enum_path)
    methods = []
    virtual_reception = []
    virtual_sp = []
    for raw in native.methods:
        owner = native.typename(raw["declaringType"])
        name = native.string(raw["nameIndex"])
        reception_override = raw["slot"] in (131, 132, 133) and name in ("OnTakeDamage", "OnTakeHeal", "OnTakeEPDamage")
        sp_override = raw["slot"] == 113 and name == "SetSpInternal"
        if name in SELECTION.get(owner, []) or reception_override or sp_override:
            method = native.method(raw["index"])
            methods.append(method)
            if reception_override:
                virtual_reception.append(method)
            if sp_override:
                virtual_sp.append(method)
    bodies = [reader.full_body(native, method) for method in methods if method.get("address")]
    field_owners = []
    enums = []
    defaults = {row["fieldIndex"]: row for row in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    base, _ = native.table(8)
    for owner in native.types:
        name = native.typename(owner["index"])
        if name in SELECTION or name == "Torappu.Battle.Context/Snapshot":
            field_owners.append({"fullname": name, "index": owner["index"], "fields": native.fields(owner["index"])})
        if name != "Torappu.Battle.Buff/Event":
            continue
        values = []
        for field in native.fields(owner["index"]):
            default = defaults.get(field["index"])
            if default is None or default["dataIndex"] < 0:
                continue
            start = base + default["dataIndex"]
            raw, end = decoder.cu32(native.metadata, start)
            values.append({"name": field["name"], "value": (raw >> 1) ^ -(raw & 1),
                           "encodedBytes": native.metadata[start:end].hex(), "default": default})
        enums.append({"fullname": name, "index": owner["index"], "values": values})
    provenance = native.provenance()
    provenance["collectedOn"] = "2026-11-15"
    provenance["caseTool"] = {"script": fingerprint(Path(__file__)), "bodyReader": fingerprint(body_path),
                              "enumReader": fingerprint(enum_path)}
    payload = {"provenance": provenance, "result": {"selection": SELECTION, "methods": methods,
               "virtualReceptionOverrides": virtual_reception,
               "virtualSpOverrides": virtual_sp,
               "bodies": bodies, "fieldOwners": field_owners, "enums": enums}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"methods": len(methods), "bodies": len(bodies), "out": str(args.out)}))


if __name__ == "__main__":
    main()

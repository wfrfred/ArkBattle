#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Trace ordinary HP regeneration and the HP setters without running the client."""
import argparse
import bisect
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, fingerprint

SELECTORS = {
    "Torappu.Battle.Entity._UpdateHpRecovery",
    "Torappu.Battle.Entity.get_sumUpHpRecoveryPerSec",
    "Torappu.Battle.Entity.get_canRecoverHp",
    "Torappu.Battle.Entity.OnTick",
    "Torappu.Battle.Entity.OnAttributeDirty",
    "Torappu.Battle.Entity.Init",
    "Torappu.Battle.Entity..ctor",
    "Torappu.Battle.Entity.set_hp",
    "Torappu.Battle.Entity.SetHpDirectly",
    "Torappu.Battle.Entity.SetHpInternal",
    "Torappu.Battle.Entity.SetHpInternalDirectly",
    "Torappu.PrecisePeriodicTimer..ctor",
    "Torappu.PrecisePeriodicTimer.Update",
    "Torappu.PrecisePeriodicTimer.Next",
    "Torappu.PrecisePeriodicTimer.get_isReady",
    "Torappu.PeriodicTimer.Reset",
    "Torappu.Battle.Entity.get_isAlive",
    "Torappu.Battle.Entity.OnHpZero",
    "Torappu.Battle.Buff/BuffContainer.OnOwnerHpFull",
    "Torappu.Battle.Attributes.GetValue",
    "Torappu.Battle.Attributes._CalculateAttributeValue",
    "Torappu.PeriodicTimer.ResetButKeepPastTime",
    "Torappu.PeriodicTimer.MarkInvalid",
    "Torappu.PeriodicTimer.get_isReady",
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--selector", action="append", default=[])
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    provenance["caseTool"] = {"script": fingerprint(Path(__file__))}
    lock = Path(str(Path(__file__)) + ".lock")
    if lock.exists():
        provenance["caseTool"]["lock"] = fingerprint(lock)
    selectors = SELECTORS | set(args.selector)
    methods = []
    scout = []
    owners = []
    for raw in native.methods:
        name = native.typename(raw["declaringType"]) + "." + native.string(raw["nameIndex"])
        if name in selectors or (name.startswith("Torappu.Battle.Entity.") and raw["slot"] in {36, 40, 111, 121}):
            methods.append(native.method(raw["index"]))
        if name.startswith("Torappu.Battle.Entity.") and any(token in name for token in ("Hp", "hp", "Tick", "Dirty")):
            scout.append(native.method(raw["index"]))
        elif name.startswith(("Torappu.PeriodicTimer.", "Torappu.PrecisePeriodicTimer.")):
            scout.append(native.method(raw["index"]))
    for raw in native.types:
        name = native.typename(raw["index"])
        if name in {"Torappu.Battle.Entity", "Torappu.AttributeType", "Torappu.Battle.AttributeType", "Torappu.AttributesData", "Torappu.PeriodicTimer", "Torappu.PrecisePeriodicTimer"}:
            owners.append({"name": name, "type": raw, "fields": native.fields(raw["index"])})
    bodies = []
    for method in methods:
        cursor = method["address"]
        end = native.addresses[bisect.bisect_right(native.addresses, cursor)]
        fragments = []
        while cursor < end:
            fragment = native.disassemble_at(cursor, end - cursor, method=method if cursor == method["address"] else None)
            for instruction in fragment["instructions"]:
                if len(instruction.get("methods", [])) > 100:
                    instruction["methodAliasCount"] = len(instruction.pop("methods"))
            fragments.append(fragment)
            next_cursor = int(fragment["end"], 16)
            if next_cursor <= cursor:
                raise RuntimeError("disassembly made no progress")
            cursor = next_cursor
        bodies.append({"methodIndex": method["index"], "logicalEnd": hex(end), "fragments": fragments})
    # Field metadata is decoded using the existing, same-client numeric audit decoder.
    import importlib.util
    decoder_path = Path("docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py")
    spec = importlib.util.spec_from_file_location("numeric_audit", decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    provenance["caseTool"]["attributeMetadataDecoder"] = fingerprint(decoder_path)
    ranges = native.records(25, "<II", "token startOffset")
    data_start, _ = native.table(24)
    image = next(i for i in native.images if native.string(i["nameIndex"]) == "Assembly-CSharp.dll")
    begin = image["customAttributeStart"]
    selected_ranges = ranges[begin:begin + image["customAttributeCount"]]
    metadata = []
    owner = next(o for o in owners if o["name"] == "Torappu.AttributesData")
    for field in owner["fields"]:
        if field["name"] not in {"hpRecoveryPerSec", "hpRecoveryPerSecByMaxHpRatio"}:
            continue
        index = next(i for i, row in enumerate(selected_ranges) if row["token"] == field["token"])
        start = selected_ranges[index]["startOffset"]
        end = selected_ranges[index + 1]["startOffset"]
        blob = native.metadata[data_start + start:data_start + end].hex()
        metadata.append({"field": field, "rawCustomAttributesHex": blob, "decoded": decoder.decode_meta(native, blob)})
    enum_owner = next(o for o in owners if o["name"] == "Torappu.AttributeType")
    defaults = native.records(7, "<iii", "fieldIndex typeIndex dataIndex")
    default_start, _ = native.table(8)
    enum_values = []
    for field in enum_owner["fields"]:
        row = next((d for d in defaults if d["fieldIndex"] == field["index"]), None)
        if row is not None:
            offset = default_start + row["dataIndex"]
            # IL2CPP v29 stores integer enum defaults as compressed signed integers.
            encoded, _ = decoder.cu32(native.metadata, offset)
            enum_values.append({"name": field["name"], "value": (encoded >> 1) ^ -(encoded & 1), "default": row})
    virtuals = [native.method(m["index"]) for m in native.methods if native.typename(m["declaringType"]) in {"Torappu.Battle.Entity", "Torappu.Battle.Character", "Torappu.Battle.Enemy"} and m["slot"] in {36, 40, 111, 121}]
    literals = [{"address": hex(va), "bytes": native.pe.read(va, 4).hex(), "float": native.pe.unpack("<f", va)[0]} for va in [0x1870adbe0]]
    result = {"virtualMethodSlots": virtuals, "attributeMetadata": metadata, "attributeEnum": enum_values, "scalarLiterals": literals, "selectors": sorted(selectors), "missingSelectors": sorted(selectors - {m["fullname"] for m in methods}), "methods": methods, "bodies": bodies, "fieldOwners": owners, "scout": scout}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"out": str(args.out), "methods": len(methods), "missing": result["missingSelectors"]}))


if __name__ == "__main__":
    main()

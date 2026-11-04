#!/usr/bin/env python3
"""Read the native Buff lifecycle used by zero-budget elemental breaks."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("--address", action="append", default=[], type=lambda v: int(v, 0))
args = parser.parse_args()
expected = {
    "GameAssembly.dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat":
        "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
for relative, digest in expected.items():
    if fingerprint(args.game / relative)["sha256"] != digest:
        raise ValueError(f"client fingerprint changed: {relative}")

native = Native(args.game)
type_names = {
    "Torappu.Battle.Buff", "Torappu.Battle.Buff/BuffContainer",
    "Torappu.BuffData", "Torappu.Battle.BuffData", "Torappu.BuffOverride",
    "Torappu.Battle.BuffOverride", "Torappu.EPBreakBuffData", "Torappu.LifeType",
}
terminal_names = {
    "AddBuffById", "AddBuff", "NewBuff", "Reset", "OnStart", "OnTick",
    "Tick", "OnEnable", "OnDisable", "OnFinish", "MarkFinish",
    "get_isFinished", "get_isEnabled", "set_isEnabled", "get_isValid",
    "_UpdateIsEnabledIfNotFinished", "_RunActions", "_RunActionsCore",
    "_CheckFinishedBuffs", "_FinishAndRemoveBuff", "_FinishBuff",
    "_UpdateValidState", "_LoadBasicData", "_LoadDuration",
    "_DoAddInternal", "_UpdateRemainingTime", "SubtractRemainingTime",
    "_ModifyLifeTimeFinally", "_ResetTriggerTimer", "_IsActionValid",
    "get_isFinishedOrDisabled", "_PreprocessDeltaTime", "OnTrigger",
    "AddDerivedBuffSafe", "ClearDerivedBuffsIfNot", "Execute",
}
metadata = {}
selected = {}
def extract_method(index):
    body = native.disassemble(index)
    limit = min(a for a in native.addresses if a > int(body["address"], 16))
    cursor = int(body["end"], 16)
    body["followingMethodAddress"] = hex(limit)
    body["continuations"] = []
    while cursor < limit:
        part = native.disassemble_at(cursor, max_bytes=limit - cursor)
        body["continuations"].append(part)
        following = int(part["end"], 16)
        if following <= cursor:
            raise ValueError("nonprogressing native range")
        cursor = following
    return body
for t in native.types:
    full = native.typename(t["index"])
    if full in type_names or full.endswith("/CreateBuff") or full.endswith("/CreateBuffStacked"):
        methods = [native.method(i) for i in range(max(0, t["methodStart"]),
                    max(0, t["methodStart"]) + t["methodCount"])]
        metadata[full] = {"type": t, "fields": native.fields(t["index"]), "methods": methods}
        if full == "Torappu.LifeType":
            defaults_offset, defaults_length = native.table(7)
            data_offset, _ = native.table(8)
            defaults = {f: (kind, pos) for f, kind, pos in struct.iter_unpack("<iii",
                native.metadata[defaults_offset:defaults_offset + defaults_length])}
            for field in metadata[full]["fields"]:
                if field["index"] in defaults:
                    kind, pos = defaults[field["index"]]
                    field["defaultData"] = {"typeIndex": kind, "dataIndex": pos,
                        "bytes": native.metadata[data_offset + pos:data_offset + pos + 1].hex(),
                        "value": native.metadata[data_offset + pos]}
        for m in methods:
            terminal = native.string(m["nameIndex"])
            if terminal in terminal_names and m.get("address"):
                selected[str(m["index"])] = extract_method(m["index"])
    elif full == "Torappu.Battle.Entity":
        for i in range(max(0, t["methodStart"]), max(0, t["methodStart"]) + t["methodCount"]):
            if native.string(native.methods[i]["nameIndex"]) in ("AddBuffById", "AddBuff"):
                selected[str(i)] = extract_method(i)

expanded = {hex(a): native.disassemble_at(a, max_bytes=0x14 if a == 0x184741640 else None)
    for a in args.address}
args.out.mkdir(parents=True, exist_ok=True)
provenance = native.provenance()
provenance["extractionScript"] = fingerprint(Path(__file__))
provenance["collectedOn"] = "2026-11-05"
for name, result in [("metadata", metadata), ("native", selected), ("expanded", expanded)]:
    (args.out / (name + ".json")).write_text(json.dumps({"provenance": provenance,
        "result": result}, ensure_ascii=False, indent=2) + "\n")
for key, body in {**selected, **expanded}.items():
    m = body.get("method")
    label = m["fullname"].rsplit(".", 1)[1] if m else "expanded"
    lines = [f"{i['address']}: {i['mnemonic']:8} {i['operands']}" +
        (" ; " + " | ".join(i.get("methods", [])[:5]) if i.get("methods") else "")
        for part in [body, *body.get("continuations", [])] for i in part["instructions"]]
    (args.out / (label + "-" + key + ".asm")).write_text("\n".join(lines) + "\n")
print(json.dumps({"out": str(args.out), "types": list(metadata),
    "methods": [{"index": key, "name": body["method"]["fullname"],
        "address": body["address"], "fullyDecoded": body["fullyDecoded"]}
        for key, body in selected.items()], "expanded": list(expanded)}, ensure_ascii=False))

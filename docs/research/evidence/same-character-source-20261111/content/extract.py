#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the AutoChess local training purchase/copy instance allocation path."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
native = Native(args.game)
owner = "Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer"
names = {
    owner + ".ReqBuyChess",
    owner + "._CopyChess",
    owner + "._AddOwnedChess",
    owner + "..ctor",
}
provenance = native.provenance()
provenance.update(
    collectedOn="2026-11-11",
    extractionScript=fingerprint(Path(__file__)),
)
provenance["location"]["modules"] = {
    name: module for name, module in provenance["location"]["modules"].items()
    if name in ("Assembly-CSharp.dll", "mscorlib.dll")
}
metadata = []
records = []
for definition in native.types:
    name = native.typename(definition["index"])
    if name not in (owner, "Torappu.Battle.AutoChess.CharChess"):
        continue
    methods = [
        native.method(index)
        for index in range(
            definition["methodStart"],
            definition["methodStart"] + definition["methodCount"],
        )
    ]
    metadata.append({
        "fullname": name,
        "index": definition["index"],
        "fields": [
            field for field in native.fields(definition["index"])
            if not field["name"].startswith(("__Hotfix", "_c__Hotfix"))
        ],
        "methods": [method for method in methods if method["fullname"] in names],
    })
    for method in methods:
        if method["fullname"] not in names:
            continue
        start = method["address"]
        end = min(address for address in native.addresses if address > start)
        cursor = start
        parts = []
        while cursor < end:
            part = native.disassemble_at(cursor, max_bytes=end - cursor)
            parts.append(part)
            following = int(part["end"], 16)
            if following <= cursor:
                raise ValueError("Nonprogressing native range")
            cursor = following
        label = method["fullname"].rsplit(".", 1)[-1] + "-" + str(method["index"])
        (args.out / (label + ".asm")).write_text("\n".join(
            instruction["address"] + ": " + instruction["mnemonic"]
            + (" " + instruction["operands"] if instruction["operands"] else "")
            + (" ; " + " | ".join(instruction["methods"][:4]) if instruction.get("methods") else "")
            for part in parts for instruction in part["instructions"]
        ) + "\n")
        records.append({
            "method": method,
            "followingMethodAddress": hex(end),
            "parts": [
                {key: value for key, value in part.items() if key != "instructions"}
                | {"instructionCount": len(part["instructions"])}
                for part in parts
            ],
        })
for name, result in (("metadata", metadata), ("native", records)):
    (args.out / (name + ".json")).write_text(json.dumps(
        {"provenance": provenance, "result": result},
        ensure_ascii=False, indent=2,
    ) + "\n")
print(json.dumps({"out": str(args.out), "methods": len(records)}))

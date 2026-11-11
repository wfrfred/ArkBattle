#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract AutoChess character-source identity construction and consumers."""
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
provenance = native.provenance()
provenance.update(collectedOn="2026-11-11", extractionScript=fingerprint(Path(__file__)))
provenance["location"]["modules"] = {
    key: value for key, value in provenance["location"]["modules"].items()
    if key in ("Assembly-CSharp.dll", "mscorlib.dll")
}
selected = {
    "Torappu.Battle.AutoChess.AutoChessSquadModel._GetChessSquadConfig",
    "Torappu.Battle.AutoChess.AutoChessSquadModel._PostProcessDB",
    "Torappu.Battle.AutoChess.ChessInst.get_charInst",
    "Torappu.Battle.AutoChess.AutoChessBattleDataModel._LoadInstsBattlePlayerData",
    "Torappu.Battle.AutoChess.AutoChessBattleDataModel._LoadBattlePlayerData",
    "Torappu.Battle.AutoChess.AutoChessBattleUtil.ApplyInstDataToSharedData",
}
selected_types = {
    "Torappu.CharacterInst", "Torappu.CharacterInst/Metadata",
    "Torappu.AdvancedCharacterInst", "Torappu.Battle.BattleCharacterData",
    "Torappu.Battle.AutoChess.ChessInst", "Torappu.Battle.AutoChess.ChessSquad",
    "Torappu.Battle.AutoChess.AutoChessBattleDataModel",
    "Torappu.Battle.AutoChess.AutoChessSquadModel",
}
metadata = []
for item in native.types:
    name = native.typename(item["index"])
    if name not in selected_types:
        continue
    metadata.append({
        "fullname": name,
        "index": item["index"],
        "fields": [field for field in native.fields(item["index"])
                   if not field["name"].startswith(("__Hotfix", "_c__Hotfix"))],
    })
records = []
for item in native.methods:
    name = native.typename(item["declaringType"]) + "." + native.string(item["nameIndex"])
    if name not in selected:
        continue
    method = native.method(item["index"])
    start = method["address"]
    end = min(address for address in native.addresses if address > start)
    cursor = start
    parts = []
    while cursor < end:
        part = native.disassemble_at(cursor, max_bytes=end - cursor)
        parts.append(part)
        following = int(part["end"], 16)
        if following <= cursor:
            raise ValueError("nonprogressing native range")
        cursor = following
    label = name.rsplit(".", 1)[-1] + "-" + str(method["index"])
    lines = []
    for part in parts:
        for instruction in part["instructions"]:
            line = instruction["address"] + ": " + instruction["mnemonic"]
            if instruction["operands"]:
                line += " " + instruction["operands"]
            if instruction.get("methods"):
                line += " ; " + " | ".join(instruction["methods"][:4])
            lines.append(line)
    (args.out / (label + ".asm")).write_text("\n".join(lines) + "\n")
    records.append({
        "method": method,
        "followingMethodAddress": hex(end),
        "parts": [{key: value for key, value in part.items() if key != "instructions"}
                  | {"instructionCount": len(part["instructions"])} for part in parts],
    })
for name, result in [("metadata", metadata), ("native", records)]:
    (args.out / (name + ".json")).write_text(
        json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n"
    )
print(json.dumps({"methods": [(row["method"]["index"], row["method"]["fullname"])
                              for row in records]}, ensure_ascii=False))

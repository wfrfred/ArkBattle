#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the standard PassiveBuffAbility source assignment used by Nymph."""
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
provenance.update(collectedOn="2026-11-12", extractionScript=fingerprint(Path(__file__)))
provenance["location"]["modules"] = {
    name: value for name, value in provenance["location"]["modules"].items()
    if name in ("Assembly-CSharp.dll", "mscorlib.dll")
}
selected = {
    "Torappu.Battle.Ability.DoAttach",
    "Torappu.Battle.Ability.AddPassiveBuffs",
    "Torappu.Battle.Ability.ClearPassiveBuffs",
    "Torappu.Battle.Ability.get_owner",
    "Torappu.Battle.Abilities.PassiveBuffAbility.GetPassiveBuffs",
}
methods = []
for row in native.methods:
    name = native.typename(row["declaringType"]) + "." + native.string(row["nameIndex"])
    if name not in selected:
        continue
    method = native.method(row["index"])
    start = method["address"]
    end = min(address for address in native.addresses if address > start)
    cursor, parts = start, []
    while cursor < end:
        part = native.disassemble_at(cursor, max_bytes=end - cursor)
        parts.append(part)
        following = int(part["end"], 16)
        if following <= cursor:
            raise ValueError("nonprogressing selected native range")
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
    methods.append({
        "method": method,
        "followingMethodAddress": hex(end),
        "parts": [{key: value for key, value in part.items() if key != "instructions"}
                  | {"instructionCount": len(part["instructions"])} for part in parts],
    })
metadata = []
for row in native.types:
    name = native.typename(row["index"])
    wanted = {
        "Torappu.Battle.Ability": {"m_owner", "m_passiveBuffUids"},
        "Torappu.Battle.AbilityStandard": set(),
        "Torappu.Battle.Abilities.PassiveBuffAbility": {"_buffs"},
    }.get(name)
    if wanted is None:
        continue
    metadata.append({
        "fullname": name,
        "index": row["index"],
        "parentName": native.type_name(row["parentIndex"]),
        "fields": [field for field in native.fields(row["index"]) if field["name"] in wanted],
        "relevantVirtuals": [native.method(index)
                             for index in range(row["methodStart"], row["methodStart"] + row["methodCount"])
                             if native.methods[index]["slot"] in (46, 66, 67)],
        "methods": [native.method(index)
                    for index in range(row["methodStart"], row["methodStart"] + row["methodCount"])
                    if native.typename(row["index"]) + "." + native.string(native.methods[index]["nameIndex"]) in selected],
    })
# The AddBuff overload signature proves the meaning of the source register.
metadata.append({"method": native.method(67544)})
for name, result in [("native", methods), ("metadata", metadata)]:
    (args.out / (name + ".json")).write_text(json.dumps(
        {"provenance": provenance, "result": result}, ensure_ascii=False, indent=2,
    ) + "\n")
print(json.dumps({"methods": [(row["method"]["index"], row["method"]["fullname"])
                              for row in methods]}, ensure_ascii=False))

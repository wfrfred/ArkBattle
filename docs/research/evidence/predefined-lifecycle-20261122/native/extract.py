#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Capture hard Predefine composition and the ordinary alias commands."""
import argparse
import bisect
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", default=DEFAULT_GAME, type=Path)
parser.add_argument("--out", required=True, type=Path)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
native = Native(args.game)
provenance = native.provenance()
provenance.update(collectedOn="2026-11-22", extractionScript=fingerprint(Path(__file__)))
method_indices = (34313, 65640, 65656, 65660, 65761, 73514, 73336, 32208, 65627, 65860)
hidden_card_deck_methods = (
    *native.address_methods[0x1806f86c0],
    *native.address_methods[0x1806f84d0],
)
type_names = {
    "Torappu.AdvancedCharacterInst",
    "Torappu.CharacterInst",
    "Torappu.LevelData",
    "Torappu.LevelData/Options",
    "Torappu.LevelData/PredefinedData",
    "Torappu.LevelData/PredefinedData/PredefinedInst",
    "Torappu.LevelData/PredefinedData/PredefinedCharacter",
    "Torappu.LevelData/PredefinedData/PredefinedCard",
    "Torappu.LevelData/PredefinedData/PredefinedTokenCard",
}
records = []
for index in (*method_indices, *hidden_card_deck_methods):
    method = native.method(index)
    address = method["address"]
    end = native.addresses[bisect.bisect_right(native.addresses, address)]
    name = method["fullname"]
    lines = [f"; {name} metadata={index} VA={address:#x}"]
    ranges = []

    while address < end:
        body = native.disassemble_at(address, max_bytes=end - address)
        ranges.append({key: value for key, value in body.items() if key != "instructions"}
                      | {"instructionCount": len(body["instructions"])})
        for instruction in body["instructions"]:
            line = f'{instruction["address"]}: {instruction["mnemonic"]} {instruction["operands"]}'.rstrip()
            if instruction.get("methods"):
                line += " ; " + " | ".join(instruction["methods"][:4])
            lines.append(line)
        following = int(body["end"], 16)
        if following <= address:
            raise ValueError(f"nonprogressing range in {name} at {address:#x}")
        address = following

    label = re.sub(r"[^A-Za-z0-9_-]", "_", name.rsplit(".", 1)[-1]) + "-" + str(index)
    (args.out / (label + ".asm")).write_text("\n".join(lines) + "\n")
    records.append({"method": method, "ranges": ranges, "nextKnownMethod": hex(end)})

types = [
    {
        "fullname": name,
        "index": item["index"],
        "parent": native.type_name(item["parentIndex"]),
        "fields": [field for field in native.fields(item["index"]) if not field["static"]],
    }
    for item in native.types
    if (name := native.typename(item["index"])) in type_names
]
(args.out / "native.json").write_text(json.dumps(
    {"provenance": provenance, "result": {"methods": records, "types": types}},
    ensure_ascii=False, indent=2,
) + "\n")
print(json.dumps({
    "methods": [(row["method"]["index"], row["method"]["fullname"]) for row in records],
    "types": [row["fullname"] for row in types],
}))

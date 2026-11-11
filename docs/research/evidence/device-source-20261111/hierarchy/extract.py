#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the Character, Token, Trap and Enemy inheritance boundaries."""
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
selected = {
    "Torappu.Battle.Character",
    "Torappu.Battle.Token",
    "Torappu.Battle.Trap",
    "Torappu.Battle.Enemy",
    "Torappu.Battle.Unit",
}
types = []
character = None
for definition in native.types:
    name = native.typename(definition["index"])
    if name not in selected:
        continue
    types.append({
        "fullname": name,
        "index": definition["index"],
        "parentIndex": definition["parentIndex"],
        "parentName": native.type_name(definition["parentIndex"])
        if definition["parentIndex"] >= 0 else None,
    })
    if name == "Torappu.Battle.Character":
        character = definition
assert len(types) == len(selected)
assert character is not None
method_names = {
    "Torappu.Battle.Character.get_cardUid",
    "Torappu.Battle.Character.set_cardUid",
    "Torappu.Battle.Character.BuildAsPredefined",
    "Torappu.Battle.Character.BuildAsRuntimeInst",
}
methods = []
for index in range(character["methodStart"], character["methodStart"] + character["methodCount"]):
    method = native.method(index)
    if method["fullname"] in method_names:
        methods.append(method)
assert len(methods) == len(method_names)
fields = [field for field in native.fields(character["index"])
          if field["name"] == "<cardUid>k__BackingField"]
assert len(fields) == 1
provenance = native.provenance()
provenance["scope"] = "Metadata inheritance, field layout and signatures only; no selected method body was read or executed."
provenance["collectedOn"] = "2026-11-11"
provenance["extractionScript"] = fingerprint(Path(__file__))
provenance["location"]["modules"] = {
    name: module for name, module in provenance["location"]["modules"].items()
    if name in ("Assembly-CSharp.dll", "mscorlib.dll")
}
result = {
    "types": types,
    "character": {"fields": fields, "methods": methods},
}
(args.out / "metadata.json").write_text(json.dumps(
    {"provenance": provenance, "result": result}, ensure_ascii=False, indent=2,
) + "\n")
print(json.dumps({"types": types, "methodSignatures": len(methods)}, ensure_ascii=False))

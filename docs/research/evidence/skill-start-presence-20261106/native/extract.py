#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Current-client Skill start and disappearance; static inspection only."""
import argparse
import bisect
import hashlib
import json
import sys
from pathlib import Path

ROOT = next(parent for parent in Path(__file__).resolve().parents
    if (parent / ".agents/skills/arkbattle-native-research/scripts/native.py").is_file())
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

METHODS = [
    "Torappu.Battle.BObject.SetDisappeared",
    "Torappu.Battle.Entity.OnBeforeDisappearChanged",
    "Torappu.Battle.Entity.OnDisappearChanged",
    "Torappu.Battle.Character.OnDisappearChanged",
    "Torappu.Battle.Character/States.ConstructStateMachine",
    "Torappu.Battle.Character/States/SkillState.OnExit",
    "Torappu.Battle.Character/States/DisappearState.OnTick",
    "Torappu.Battle.BasicSkill.InterruptStartIfNot",
    "Torappu.Battle.BasicSkill.InterruptIfNot",
    "Torappu.Battle.CastSkill.InterruptIfNot",
    "Torappu.Battle.BasicSkill.OnCastFinish",
    "Torappu.Battle.BasicSkill.get_isAffecting",
    "Torappu.Battle.Ability.InterruptIfNot",
    "Torappu.Battle.AbilityStandard.StopAffect",
    "Torappu.Battle.BasicSkill.AssignData",
    "Torappu.Battle.BasicSkill.OnSkillStart",
    "Torappu.Battle.Character.OnSkillStart",
    "Torappu.Battle.Ability.StartCastingInternal",
    "Torappu.Battle.Ability.OnCastStart",
    "Torappu.Battle.Ability.get_isAffecting",
    "Torappu.Battle.AbilityStandard.OnCastStart",
    "Torappu.Battle.AbilityStandard.CastDirectly",
    "Torappu.Battle.Character.OnTick",
    "Torappu.Battle.BasicSkill.Tick",
    "Torappu.Battle.BasicSkill.OnTick",
    "Torappu.Battle.Character.get_alive",
    "Torappu.Battle.Entity.get_alive"
]
TYPES = [
    "Torappu.Battle.BObject",
    "Torappu.Battle.Entity",
    "Torappu.Battle.Character",
    "Torappu.Battle.BasicSkill",
    "Torappu.Battle.CastSkill",
    "Torappu.Battle.BasicSkill/Behaviour",
    "Torappu.Battle.Ability",
    "Torappu.Battle.AbilityStandard"
]
RELATED_METHODS = {
    "OnSkillStart", "OnTick", "get_alive", "get_isAffecting", "InterruptIfNot",
    "StopAffect", "OnSkillEnd", "OnCastStart", "get_isInDyingState", "UpdateSpRecovery",
}
parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, default=ROOT / ".cache/native-research/skill-start-presence-replay")
parser.add_argument("--method", action="append")
parser.add_argument("--tag", default="native")
args = parser.parse_args()
work = args.out.resolve()
work.mkdir(parents=True, exist_ok=True)
n = Native(args.game)
provenance = n.provenance()
for kind, sha in {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}.items():
    if provenance["client"][kind]["sha256"] != sha:
        raise ValueError("unexpected client fingerprint")
provenance["extractor"] = fingerprint(Path(__file__))
by_name = {}
for raw in n.methods:
    name = n.typename(raw["declaringType"]) + "." + n.string(raw["nameIndex"])
    by_name.setdefault(name, []).append(raw["index"])
bodies = []
for name in args.method or METHODS:
    indices = by_name.get(name, [])
    if len(indices) != 1:
        raise ValueError(f"method selection must be unique: {name}: {indices}")
    method = n.method(indices[0])
    start = method["address"]
    if not start:
        raise ValueError(f"no direct body: {name}")
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    fragments = []
    cursor = start
    while cursor < end:
        fragment = n.disassemble_at(cursor, end - cursor, method=method if cursor == start else None)
        for instruction in fragment["instructions"]:
            aliases = instruction.get("methods", [])
            if len(aliases) > 64:
                instruction["methodAliasSelection"] = {
                    "total": len(aliases),
                    "allAliasesSha256": hashlib.sha256(json.dumps(aliases).encode()).hexdigest(),
                    "scope": "selected types and Character states; shared address remains ambiguous",
                }
                instruction["methods"] = [alias for alias in aliases if
                    any(alias.startswith(type_ + ".") for type_ in TYPES)
                    or alias.startswith("Torappu.Battle.Character/States/")]
        fragments.append(fragment)
        next_cursor = int(fragment["decodedEnd"], 16)
        if next_cursor <= cursor:
            raise ValueError(f"decoding stopped at {hex(cursor)}")
        cursor = next_cursor
    bodies.append({"method": method, "logicalEnd": hex(end), "fragments": fragments})
    print(method["index"], name, hex(start), len(fragments), flush=True)
types = []
for name in TYPES:
    raw = next(t for t in n.types if n.typename(t["index"]) == name)
    types.append(dict(raw, fullname=name, parent=n.type_name(raw["parentIndex"]),
        fields=[field for field in n.fields(raw["index"]) if not field["static"]],
        methods=[n.method(i) for i in range(raw["methodStart"], raw["methodStart"]+raw["methodCount"])
            if n.string(n.methods[i]["nameIndex"]) in RELATED_METHODS
            or n.typename(n.methods[i]["declaringType"]) + "." + n.string(n.methods[i]["nameIndex"]) in METHODS]))
method_usages = []
for body in bodies:
    for fragment in body["fragments"]:
        for instruction in fragment["instructions"]:
            for reference in instruction.get("ripReferences", []):
                address = int(reference, 16)
                try:
                    encoded = n.pe.unpack("<Q", address)[0]
                except (ValueError, StopIteration):
                    continue
                kind = (encoded >> 29) & 7
                index = (encoded & 0x1ffffffe) >> 1
                if encoded < 2**32 and encoded & 1 and kind == 3 and index < len(n.methods):
                    method_usages.append({"instruction": instruction, "global": reference,
                        "rawBytes": n.pe.read(address, 8).hex(), "encoded": hex(encoded),
                        "decode": "little-endian uint64; tagged odd value; kind=(encoded>>29)&7; MethodDef kind=3; methodIndex=(encoded&0x1ffffffe)>>1",
                        "kind": kind, "methodIndex": index,
                        "method": n.method(index)})
result = {"bodies": bodies, "types": types, "selection": args.method or METHODS,
    "methodUsages": method_usages}
(work / (args.tag + ".json")).write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2)+"\n")
print("saved", len(bodies), "methods", len(types), "types", flush=True)

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory direct route-operation callers and Enemy route-field write candidates."""
import argparse
import bisect
import importlib.util
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
tool = Path(".agents/skills/arkbattle-native-research/scripts/native.py")
spec = importlib.util.spec_from_file_location("route_native", tool)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
n = module.Native(args.game)
selected = {
    "RestoreCachedRoute", "TryReassignRouteAndCacheOrigin", "ReassignRoute",
    "ReassignRouteEndPointOnly", "ReconstructRoute", "ReconstructRouteWithTargetGridMove",
    "ChangePathMotionMode", "get_originRoute", "get_originCursorIndex",
}
enemy = next(t for t in n.types if n.typename(t["index"]) == "Torappu.Battle.Enemy")
enemy_methods = [n.method(i) for i in range(enemy["methodStart"], enemy["methodStart"] + enemy["methodCount"])]
selected_methods = [m for m in enemy_methods if m["fullname"].rsplit(".", 1)[1] in selected]
extra_fullnames = {"Torappu.Battle.Enemy.TransportInternal", "Torappu.Battle.Abilities.DurbusAbility.ReleaseAllPassengers", "Torappu.Battle.Abilities.DurbusAbility._DoReleasePassengers"}
selected_methods.extend(n.method(m["index"]) for m in n.methods if n.typename(m["declaringType"])+"."+n.string(m["nameIndex"]) in extra_fullnames)
resolved = {}
def instructions_at(start):
    if start in resolved:
        return resolved[start]
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    rows = []
    p = start
    while p < end:
        f = n.disassemble_at(p, end-p)
        rows.extend(f["instructions"])
        q = int(f["end"], 16)
        if q <= p:
            raise ValueError("non-advancing disassembly")
        p = q
    resolved[start] = rows
    return rows
callers = []
for m in selected_methods:
    x = n.xrefs(m["address"])
    for c in x["candidates"]:
        indices = c["precedingMethodCandidates"]
        c["precedingMethods"] = [n.method(i) for i in indices]
        start = n.methods[indices[0]]["address"] if indices else 0
        instruction = next((i for i in instructions_at(start) if i["address"] == c["address"]), None) if start else None
        c["verifiedInstructionBoundary"] = instruction is not None
        c["instruction"] = instruction
    callers.append({"method": m, **x})
field_candidates = []
for m in enemy_methods:
    if not m["address"]:
        continue
    for ins in instructions_at(m["address"]):
        # Candidate-only: a displacement alone does not identify the base object.
        operands = ins.get("operands", "")
        destination = operands.split(",", 1)[0]
        if ins["mnemonic"] in {"mov", "movups", "movaps", "movdqu", "movss", "xor", "and"} and "[" in destination and any(x in destination for x in ("0x370", "0x378", "0x380", "0x390")):
            field_candidates.append({"method": m, "instruction": ins})
result = {"enemyType": {**enemy, "fields": n.fields(enemy["index"]), "methods": enemy_methods}, "directCallers": callers,
          "routeFieldWriteCandidates": field_candidates,
          "limitations": "Direct E8/E9 calls only. Boundary verification uses all fragments to the next known method; shared bodies preserve aliases. Field displacement candidates require base-register verification; arbitrary registers may address unrelated objects. No runtime XLua/virtual/delegate coverage asserted."}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({"provenance": {**n.provenance(), "queryScript": module.fingerprint(Path(__file__))}, "result": result}, ensure_ascii=False, indent=2)+"\n")
print("enemy methods", len(enemy_methods), "direct candidates", sum(len(x["candidates"]) for x in callers), "field candidates", len(field_candidates))

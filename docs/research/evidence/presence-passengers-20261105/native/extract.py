#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import bisect
import argparse
import json
import sys
from pathlib import Path

ROOT = next(parent for parent in Path(__file__).resolve().parents
    if (parent / ".agents/skills/arkbattle-native-research/scripts/native.py").is_file())
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path,
    default=ROOT / ".cache/native-research/presence-passengers-replay/native")
args = parser.parse_args()
WORK = args.out.resolve()
WORK.mkdir(parents=True, exist_ok=True)
n = Native(args.game)
provenance = n.provenance()
expected = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
for kind, sha256 in expected.items():
    if provenance["client"][kind]["sha256"] != sha256:
        raise ValueError("client changed since method selection")
provenance["extractor"] = fingerprint(Path(__file__))

names = [
    "Torappu.Battle.UnitMode._InitTalents",
    "Torappu.Battle.BasicTalent.DoAttach",
    "Torappu.Battle.Ability.Attach",
    "Torappu.Battle.Abilities.DurbusAbility.DoAttach",
    "Torappu.Battle.Abilities.DurbusAbility.OnTick",
    "Torappu.Battle.Abilities.DurbusAbility._SearchPassengers",
    "Torappu.Battle.Abilities.DurbusAbility.OnDetached",
    "Torappu.Battle.Abilities.DurbusAbility.ReleaseAllPassengers",
    "Torappu.Battle.Abilities.DurbusAbility._DoReleasePassengers",
    "Torappu.Battle.Abilities.DurbusAbility._ReleasePassenger",
    "Torappu.Battle.Abilities.DurbusAbility/<>c__DisplayClass70_0.<_ReleasePassenger>b__0",
    "Torappu.Battle.BObject.SetDisappeared",
]
for method in n.methods:
    typename = n.typename(method["declaringType"])
    method_name = n.string(method["nameIndex"])
    if typename == "Torappu.Battle.BasicTalent" and "awake" in method_name.casefold():
        names.append(typename + "." + method_name)
selected = {}
for method in n.methods:
    name = n.typename(method["declaringType"]) + "." + n.string(method["nameIndex"])
    if name in names:
        selected[name] = n.method(method["index"])
if set(selected) != set(names):
    raise ValueError(f"missing method names: {set(names) - set(selected)}")
bodies = []
for name in names:
    method = selected[name]
    index = method["index"]
    start = method["address"]
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    fragments = []
    cursor = start
    while cursor < end:
        fragment = n.disassemble_at(cursor, end - cursor, method=method if cursor == start else None)
        fragments.append(fragment)
        advanced = int(fragment["decodedEnd"], 16)
        if advanced <= cursor:
            raise ValueError(f"decoding stopped at {hex(cursor)}")
        cursor = advanced
    bodies.append({"methodIndex": index, "logicalEnd": hex(end), "fragments": fragments})
    print(index, name, hex(start), hex(end), len(fragments))

selected_types = []
for name in ["Torappu.Battle.Abilities.DurbusAbility", "Torappu.Battle.BasicTalent", "Torappu.Battle.UnitMode", "Torappu.Battle.BObject"]:
    type_index = next(t["index"] for t in n.types if n.typename(t["index"]) == name)
    t = n.types[type_index]
    selected_types.append(dict(t, fullname=name, parent=n.type_name(t["parentIndex"]), fields=n.fields(type_index),
        methods=[n.method(i) for i in range(t["methodStart"], t["methodStart"] + t["methodCount"])]))
(WORK / "native.json").write_text(json.dumps({"provenance": provenance,
    "result": {"bodies": bodies, "types": selected_types}}, ensure_ascii=False, indent=2) + "\n")

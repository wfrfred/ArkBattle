#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Question-specific current-client extraction; no client execution."""
import argparse
import bisect
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
    default=ROOT / ".cache/native-research/ammo-cancel-native-20261105/replay")
parser.add_argument("--method", action="append", default=[])
parser.add_argument("--type", action="append", default=[])
parser.add_argument("--query", action="append", default=[])
parser.add_argument("--tag", default="native")
parser.add_argument("--address", action="append", default=[])
args = parser.parse_args()
if not args.method and not args.query and not args.type and not args.address:
    args.method = [
        "Torappu.Battle.Ability.InterruptIfNot",
        "Torappu.Battle.Ability.FinishIfNot",
        "Torappu.Battle.AbilityStandard.ExecuteSpell",
        "Torappu.Battle.AbilityStandard.OnEvent",
        "Torappu.Battle.AbilityStandard.OnCastEnd",
        "Torappu.Battle.AbilityStandard.CheckFinished",
        "Torappu.Battle.Abilities.RangedAttack.OnCastEnd",
        "Torappu.Battle.Abilities.EasyToStartAbility.OnCastEnd",
        "Torappu.Battle.AbilityStandard/Behaviour.OnCastFinish",
        "Torappu.Battle.Abilities.AbilityEventCounter.OnEvent",
        "Torappu.Battle.Abilities.AbilityEventCounter.OnCountEvent",
        "Torappu.Battle.Abilities.AbilityEventCounter.DealCountEvent",
        "Torappu.Battle.Abilities.AbilityEventCounter.OnEventCountConsumed",
        "Torappu.Battle.Abilities.AbilityEventCounter.GetExpendCount",
        "Torappu.Battle.Abilities.AbilityEventCounter.ResetCount",
        "Torappu.Battle.Abilities.AbilityEventCounter.DoResetCount",
        "Torappu.Battle.CastSkillWithLimitTimes.OnTick",
        "Torappu.Battle.CastSkillWithLimitTimes._FetchCounterSource",
        "Torappu.Battle.CastSkillWithLimitTimes.get_ownerIsInBulletMode",
    ]
    args.type = [
        "Torappu.Battle.AbilityStandard/Event",
        "Torappu.Battle.Ability/FinishReason",
        "Torappu.Battle.Abilities.AbilityEventCounter",
        "Torappu.Battle.CastSkillWithLimitTimes",
        "Torappu.Battle.AbilityStandard/Behaviour",
        "Torappu.Battle.AbilityStandard",
        "Torappu.Battle.Ability",
    ]
    args.query = [".get_attack"]
    args.address = ["0x180005610:0x50"]
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
metadata = []
methods = []
all_by_name = {}
for raw in n.methods:
    name = n.typename(raw["declaringType"]) + "." + n.string(raw["nameIndex"])
    all_by_name[name] = raw["index"]
    if any(query.casefold() in name.casefold() for query in args.query):
        metadata.append(n.method(raw["index"]))
    if name in args.method:
        methods.append(n.method(raw["index"]))
missing = set(args.method) - {method["fullname"] for method in methods}
if missing:
    raise ValueError(f"missing methods: {missing}")
bodies = []
for method in methods:
    start = method["address"]
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    fragments = []
    cursor = start
    while cursor < end:
        fragment = n.disassemble_at(cursor, end - cursor,
            method=method if cursor == start else None)
        fragments.append(fragment)
        advanced = int(fragment["decodedEnd"], 16)
        if advanced <= cursor:
            raise ValueError(f"decoding stopped at {hex(cursor)}")
        cursor = advanced
    bodies.append({"method": method, "logicalEnd": hex(end), "fragments": fragments})
    for fragment in fragments:
        for instruction in fragment["instructions"]:
            if instruction["mnemonic"] not in ("call", "jmp"):
                continue
            called = [name for name in instruction.get("methods", []) if name.endswith(".OnCastEnd")]
            if len(called) > 1:
                raise ValueError("ambiguous shared OnCastEnd call; inspect manually")
            if called and called[0] not in {current["fullname"] for current in methods}:
                methods.append(n.method(all_by_name[called[0]]))
    print(method["index"], method["fullname"], hex(start), hex(end), len(fragments))
types = []
field_defaults = {row["fieldIndex"]: row for row in n.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
default_data, _ = n.table(8)
for name in args.type:
    raw = next(t for t in n.types if n.typename(t["index"]) == name)
    fields = n.fields(raw["index"])
    if n.type_name(raw["parentIndex"]) == "System.Enum":
        for field in fields:
            record = field_defaults.get(field["index"])
            if record is not None and record["dataIndex"] >= 0:
                encoded = n.metadata[default_data + record["dataIndex"]]
                if encoded >= 128:
                    raise ValueError("this question only uses observed one-byte enum constants")
                field["constantDefaultRecord"] = record
                field["constantEncodedByte"] = encoded
                field["constantInt32"] = (encoded >> 1) ^ -(encoded & 1)
                field["constantEncoding"] = "IL2CPP compressed signed integer; observed one-byte record"
    types.append(dict(raw, fullname=name, parent=n.type_name(raw["parentIndex"]),
        fields=fields,
        methods=[n.method(i) for i in range(raw["methodStart"], raw["methodStart"]+raw["methodCount"])]))
addresses = [n.disassemble_at(int(value.split(":")[0], 0), int(value.split(":")[1], 0)) for value in args.address]
parents = []
for index in sorted({method["declaringType"] for method in methods}):
    raw = n.types[index]
    parents.append({"typeIndex": index, "fullname": n.typename(index), "parentTypeIndex": raw["parentIndex"],
        "parent": n.type_name(raw["parentIndex"])})
result = {"selection": vars(args) | {"game": str(args.game), "out": str(args.out)}, "queries": args.query,
    "metadata": metadata, "typeParents": parents, "types": types, "bodies": bodies, "addresses": addresses}
(work / (args.tag + ".json")).write_text(json.dumps({"provenance": provenance,
    "result": result}, ensure_ascii=False, indent=2) + "\n")
for method in metadata:
    print(method["index"], method["fullname"], hex(method["address"]), "slot", method["slot"])

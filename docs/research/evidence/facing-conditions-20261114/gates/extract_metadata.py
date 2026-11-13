#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract metadata needed to interpret the common facing admission gate."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--calls-from", type=Path)
    args = parser.parse_args()
    native = Native(args.game)
    owners = {"Torappu.Battle.Entity", "Torappu.Battle.Character", "Torappu.Battle.Enemy"}
    methods = [native.method(m["index"]) for m in native.methods
               if native.typename(m["declaringType"]) in owners]
    enums = []
    defaults = {row["fieldIndex"]: row for row in
                native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    base, _ = native.table(8)
    decoder_path = Path("docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py")
    spec = importlib.util.spec_from_file_location("attribute_decoder", decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    for owner in native.types:
        name = native.typename(owner["index"])
        if "Abnormal" not in name or owner["fieldCount"] == 0:
            continue
        values = []
        for field in native.fields(owner["index"]):
            row = defaults.get(field["index"])
            if row is None or row["dataIndex"] < 0:
                continue
            encoded, _ = decoder.cu32(native.metadata, base + row["dataIndex"])
            values.append({"name": field["name"], "value": (encoded >> 1) ^ -(encoded & 1),
                           "fieldIndex": field["index"], "default": row})
        if values:
            enums.append({"fullname": name, "index": owner["index"], "values": values})
    provenance = native.provenance()
    provenance["caseTool"] = {"script": fingerprint(Path(__file__)),
                              "integerDecoder": fingerprint(decoder_path)}
    callers = []
    if args.calls_from is not None:
        source = json.loads(args.calls_from.read_text())
        indices = {index for target in source["result"]["xrefs"]
                   for call in target["directCandidates"]["candidates"]
                   for index in call.get("precedingMethodCandidates", [])}
        callers = [native.method(index) for index in sorted(indices)]
        provenance["caseTool"]["callCandidateInput"] = fingerprint(args.calls_from)
    literal_slot = 0x188b3bb38
    encoded = native.pe.unpack("<Q", literal_slot)[0]
    assert encoded >> 29 == 5 and encoded & 1, "expected an encoded string literal usage"
    literal_index = (encoded & 0x1ffffffe) >> 1
    literal = native.records(0, "<II", "length dataIndex")[literal_index]
    literal_base, _ = native.table(1)
    begin = literal_base + literal["dataIndex"]
    idle_animation = {"slot": hex(literal_slot), "encodedUsage": hex(encoded),
                      "literalIndex": literal_index,
                      "value": native.metadata[begin:begin + literal["length"]].decode("utf-8")}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance,
                                   "result": {"selection": {"owners": sorted(owners),
                                                            "enumNameContains": "Abnormal",
                                                            "callsFrom": str(args.calls_from) if args.calls_from else None},
                                              "methods": methods, "enums": enums,
                                              "idleAnimationLiteral": idle_animation,
                                              "directCallerCandidates": callers}},
                                  ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"methods": len(methods), "enums": [e["fullname"] for e in enums]}))


if __name__ == "__main__":
    main()

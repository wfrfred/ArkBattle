#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate exact metadata string literals and verify their RIP-relative native consumers."""
import argparse
import bisect
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint
BODY_HELPER = Path(__file__).with_name("trace_flags.py")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--literal", action="append", required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    spec = importlib.util.spec_from_file_location("damage_full_body", BODY_HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    literal_base, _ = native.table(1)
    literals, refs, methods, bodies = [], [], {}, {}
    for row in native.records(0, "<II", "length dataIndex"):
        begin = literal_base + row["dataIndex"]
        value = native.metadata[begin:begin + row["length"]].decode("utf-8", errors="replace")
        if value not in args.literal:
            continue
        usage = (5 << 29) | (row["index"] << 1) | 1
        slots = [native.pe.address(pos) for pos in native.pe.find(struct.pack("<Q", usage))]
        literals.append({"index": row["index"], "value": value, "record": row,
                         "encodedUsage": hex(usage), "slots": [hex(x) for x in slots]})
        for section in native.pe.sections:
            if not section["executable"]:
                continue
            code = native.pe.data[section["offset"]:section["offset"] + section["raw_size"]]
            for rex in (0x48, 0x4c):
                for op in (0x8b, 0x8d):
                    for register in range(8):
                        needle = bytes((rex, op, 0x05 | (register << 3)))
                        start = 0
                        while (start := code.find(needle, start)) >= 0:
                            address = section["address"] + start
                            target = address + 7 + struct.unpack_from("<i", code, start + 3)[0]
                            start += 1
                            if target not in slots:
                                continue
                            preceding = bisect.bisect_right(native.addresses, address) - 1
                            indices = native.address_methods[native.addresses[preceding]] if preceding >= 0 else []
                            if not indices:
                                continue
                            method = native.method(indices[0])
                            if not method["fullname"].startswith("Torappu.Battle."):
                                continue
                            methods[method["index"]] = method
                            if method["index"] not in bodies:
                                bodies[method["index"]] = helper.full_body(native, method)
                            for fragment in bodies[method["index"]]["fragments"]:
                                for ins in fragment["instructions"]:
                                    if ins["address"] == hex(address):
                                        refs.append({"literal": value, "slot": hex(target), "callerIndex": method["index"],
                                                     "caller": method["fullname"], "instruction": ins,
                                                     "scope": "RIP-relative instruction boundary verified; initialization and actual read are both retained."})
    prov = native.provenance()
    prov["collectedOn"] = "2026-11-14"
    prov["script"] = fingerprint(Path(__file__))
    prov["bodyHelper"] = fingerprint(BODY_HELPER)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": prov, "result": {"selection": args.literal, "literals": literals,
                         "references": refs, "methods": list(methods.values()), "bodies": list(bodies.values())}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"literals": len(literals), "methods": len(methods), "references": len(refs), "out": str(args.out)}))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Verify direct flag-helper callers and preserve their complete logical method bodies."""
import argparse
import bisect
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

TARGETS = [72167, 72168, 72170, 72171, 72172, 72173, 72175, 72176, 72148]


def full_body(native, method):
    cursor = method["address"]
    end = native.addresses[bisect.bisect_right(native.addresses, cursor)]
    parts = []
    while cursor < end:
        part = native.disassemble_at(cursor, end - cursor, method=method if cursor == method["address"] else None)
        for ins in part["instructions"]:
            if len(ins.get("methods", [])) > 100:
                ins["methodAliasCount"] = len(ins.pop("methods"))
        parts.append(part)
        next_cursor = int(part["end"], 16)
        if next_cursor <= cursor:
            raise RuntimeError("non-progress")
        cursor = next_cursor
    return {"methodIndex": method["index"], "fullname": method["fullname"], "logicalEnd": hex(end), "fragments": parts}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    targets, methods, bodies, calls = [], {}, {}, []
    for index in TARGETS:
        target = native.method(index)
        xrefs = native.xrefs(target["address"])
        targets.append({"method": target, "directCandidates": xrefs})
        for candidate in xrefs["candidates"]:
            indices = candidate.get("precedingMethodCandidates", [])
            if not indices:
                continue
            method = native.method(indices[0])
            if not method["fullname"].startswith("Torappu.Battle."):
                continue
            methods[method["index"]] = method
            body = bodies.setdefault(method["index"], full_body(native, method)) if method["index"] not in bodies else bodies[method["index"]]
            for fragment in body["fragments"]:
                ins = fragment["instructions"]
                for pos, row in enumerate(ins):
                    if row["address"] != candidate["address"] or row.get("target") != hex(target["address"]):
                        continue
                    preceding = ins[max(0, pos - 14):pos]
                    # Only a locator. Control flow can bypass or overwrite these loads.
                    hints = [p for p in preceding if p["mnemonic"] == "mov" and re.match(r"(?:edx|rdx), (?:0x[0-9a-f]+|[0-9]+)$", p["operands"])]
                    calls.append({"helperIndex": index, "callerIndex": method["index"], "caller": method["fullname"],
                                  "address": row["address"], "preceding": preceding,
                                  "immediateArgumentHints": hints,
                                  "scope": "Instruction-boundary verified direct call; argument hints require control-flow review."})
    provenance = native.provenance()
    provenance["collectedOn"] = "2026-11-14"
    provenance["script"] = fingerprint(Path(__file__))
    provenance["scope"] = "All direct E8/E9 candidates for the selected helpers inside Battle; verified in decoded caller instructions. Indirect/virtual, reflection and XLua are not exhaustive."
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": {"selection": {"helperIndices": TARGETS},
                         "targets": targets, "methods": list(methods.values()), "bodies": list(bodies.values()), "calls": calls}},
                                  ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"methods": len(methods), "calls": len(calls), "out": str(args.out)}))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Re-extract the selected fixed-wait timeout bodies; never execute client code."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path[:0] = [str(ROOT / ".agents/skills/arkbattle-native-research/scripts")]
from native import DEFAULT_GAME, Native, fingerprint
from capstone import Cs, CS_ARCH_X86, CS_MODE_64

DLL = "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
METADATA = "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if args.out.resolve().is_relative_to(Path(__file__).resolve().parent):
        parser.error("--out must be outside the archived batch")
    n = Native(args.game)
    provenance = n.provenance()
    if (provenance["client"]["dll"]["sha256"],
            provenance["client"]["metadata"]["sha256"]) != (DLL, METADATA):
        parser.error("client fingerprint differs; relocate methods before applying these selectors")
    provenance["tool"]["entrypoint"] = fingerprint(Path(__file__))
    provenance["scope"] = (
        "Static selected WaitWhileForFixedSeconds bodies and rounding helpers. "
        "Full MoveNext ranges include split PDATA blocks, ending at the following Reset method. "
        "No client execution, live coroutine frame observation, or runtime XLua verification."
    )
    cs = Cs(CS_ARCH_X86, CS_MODE_64)
    bodies = []
    selectors = [
        (65122, 0x1806906A0, 65124, 0x1806907C0),
        (65152, 0x180690810, 65154, 0x1806909A0),
    ]
    for index, start, next_index, end in selectors:
        method, following = n.method(index), n.method(next_index)
        if method["address"] != start or following["address"] != end:
            parser.error("method boundary differs from the selected client")
        raw = n.pe.read(start, end - start)
        instructions = []
        for ins in cs.disasm(raw, start):
            row = dict(address=hex(ins.address), bytes=ins.bytes.hex(),
                       mnemonic=ins.mnemonic, operands=ins.op_str)
            if ins.mnemonic == "call" and ins.op_str.startswith("0x"):
                row["methods"] = [n.method(i)["fullname"] for i in
                                  n.address_methods.get(int(ins.op_str, 16), [])]
            instructions.append(row)
        bodies.append(dict(method=method, address=hex(start), end=hex(end),
                           boundary="next recorded metadata method", followingMethod=following,
                           bytesSha256=hashlib.sha256(raw).hexdigest(), instructions=instructions))
    helpers = [n.disassemble(226062), n.disassemble(226189)]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance,
        result=dict(methods=bodies, helpers=helpers)), ensure_ascii=False, indent=2) + "\n")
    print(args.out)


if __name__ == "__main__":
    main()

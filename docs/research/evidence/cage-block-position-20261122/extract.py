# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the cage's native blocking displacement and distance threshold."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import sys

import capstone

ROOT = Path(__file__).resolve().parents[4]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native

METHODS = {
    77745: ((0x180AC2479, 0x180AC2487), (0x180AC26BD, 0x180AC26ED)),
    78605: ((0x180AFDEA0, 0x180AFDED7),),
    78606: ((0x180AFCEAD, 0x180AFD022), (0x180AFD10A, 0x180AFD14D)),
    78610: ((0x180AFDF4C, 0x180AFDF86),),
}

DISPATCH_RANGES = ((0x180AEE0EB, 0x180AEE11F), (0x180AEDA70, 0x180AEDB0E))


def format_instruction(instruction):
    return f"{instruction.address:#x} {instruction.mnemonic} {instruction.op_str}".rstrip()


def extract(native, decoder, index, ranges):
    method = native.method(index)
    start = method["address"]
    end = native.addresses[bisect_right(native.addresses, start)]
    instructions = []
    for instruction in decoder.disasm(native.pe.read(start, end - start), start):
        if instruction.mnemonic == "int3":
            break
        if not any(low <= instruction.address < high for low, high in ranges):
            continue
        instructions.append(format_instruction(instruction))
    assert instructions, method
    return {"method": method, "instructions": instructions}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    assert provenance["client"]["dll"]["sha256"] == "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
    assert provenance["client"]["metadata"]["sha256"] == "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
    constant = 0x1870AFDC8
    threshold, = native.pe.unpack("<d", constant)
    assert threshold == 0.2
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    result = {
        "constant": {"address": hex(constant), "format": "<d", "value": threshold},
        "methods": [extract(native, decoder, index, ranges) for index, ranges in METHODS.items()],
        "dispatch": [
            {
                "address": hex(low),
                "end": hex(high),
                "instructions": [
                    format_instruction(instruction)
                    for instruction in decoder.disasm(native.pe.read(low, high - low), low)
                ],
            }
            for low, high in DISPATCH_RANGES
        ],
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": {**provenance, "collectedOn": "2026-11-22"}, "result": result}, indent=2) + "\n")


if __name__ == "__main__":
    main()

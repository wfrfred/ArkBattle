# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the deployment counters, their readers, and the ordinary exit chain."""

import argparse
from bisect import bisect_right
import hashlib
import json
from pathlib import Path
import sys

import capstone

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native


METHODS = [
    35254, 35320,
    65094, 65116, 65219, 65222, 65228,
    65525, 65649, 65677, 65739, 65741, 66012, 66013, 66015,
    66748, 66752, 66753, 66755, 66833, 66837, 66838, 66839, 66859, 66860, 66861, 66867,
    67055, 67062, 67066, 67072, 67073, 67076, 67093, 67094,
    67625, 67633, 67634, 67635, 67650, 67658, 67713, 72800,
    77177, 77180, 77209, 77278, 77336, 77337, 77340, 77400,
    79015, 79024, 79030, 79121, 79122, 79124, 79125, 81082, 84133, 84139, 84162, 102421, 105924,
]

POOL_METHOD_ADDRESSES = (0x182AB82E0, 0x182AB8D30, 0x182ABF070, 0x182AC0360, 0x182AC3650)
RECYCLE_MESSAGE_SLOT = 0x182AB8DF7 + 0x60F0631

FIELDS = {
    "Torappu.Battle.UnitManager": {"<characters>k__BackingField", "m_activePlayerCharacterCnt"},
    "Torappu.Battle.BattleController": {"m_characterLimitDict"},
    "Torappu.Battle.Deck/Card": {"m_dontOccupyMaxDeployCnt", "<state>k__BackingField"},
    "Torappu.Battle.Deck/TokenCard": {"m_spawnedCnt", "<maxDeployCnt>k__BackingField"},
    "Torappu.Battle.Character": {
        "m_delayToRecycle", "_occupiedRemainingCharacterCnt", "m_isBuiltPredefined",
        "m_dontOccupyDeployCnt", "m_originRemainingChrCntVolume",
    },
}


def body(native, decoder, index):
    method = native.method(index)
    start = method["address"]
    end = native.addresses[bisect_right(native.addresses, start)]
    code = native.pe.read(start, end - start)
    instructions = []
    for ins in decoder.disasm(code, start):
        if ins.mnemonic == "int3":
            continue
        line = f"{ins.address:#x}: {ins.mnemonic} {ins.op_str}".rstrip()
        if (
            (ins.mnemonic == "call" or ins.group(capstone.CS_GRP_JUMP))
            and ins.operands
            and ins.operands[0].type == capstone.x86.X86_OP_IMM
        ):
            aliases = native.address_methods.get(ins.operands[0].imm, [])
            if aliases:
                line += " ; " + ", ".join(native.method(i)["fullname"] for i in aliases[:3])
        instructions.append(line)
    return {
        "method": method,
        "address": hex(start),
        "end": hex(end),
        "bytesSha256": hashlib.sha256(code).hexdigest(),
        "instructions": instructions,
    }


def recycle_message(native):
    encoded, = native.pe.unpack("<Q", RECYCLE_MESSAGE_SLOT)
    index = (encoded & 0x1FFFFFFF) >> 1
    rows = native.records(0, "<II", "length dataIndex")
    if encoded >> 29 != 5 or not encoded & 1 or index >= len(rows):
        raise ValueError("expected GameObject recycle callback string")
    row = rows[index]
    start = native.table(1)[0] + row["dataIndex"]
    text = native.metadata[start : start + row["length"]].decode()
    return {"slot": hex(RECYCLE_MESSAGE_SLOT), "index": index, "text": text}


def character_pool_allocation(native):
    slot = 0x188AFA370
    encoded, = native.pe.unpack("<Q", slot)
    if encoded >> 29 != 6 or not encoded & 1:
        raise ValueError("expected the Character allocation method reference")
    index = (encoded & 0x1FFFFFFF) >> 1
    _, specs = native.pe.unpack("<2Q", native.registration + 64)
    _, instantiations = native.pe.unpack("<2Q", native.registration + 16)
    method, _, instantiation = native.pe.unpack("<iii", specs + 12 * index)
    arguments, = native.pe.unpack("<Q", instantiations + 8 * instantiation)
    count, types = native.pe.unpack("<2Q", arguments)
    return {
        "slot": hex(slot), "encodedUsage": hex(encoded), "methodSpec": index,
        "method": native.method(method),
        "typeArguments": [
            native.type_name(pointer=native.pe.unpack("<Q", types + 8 * offset)[0])
            for offset in range(count)
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    expected = (
        "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
        "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
    )
    fingerprints = tuple(provenance["client"][name]["sha256"] for name in ("dll", "metadata"))
    if fingerprints != expected:
        raise ValueError("client fingerprint does not match this batch")
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    decoder.detail = True
    type_indices = {native.typename(row["index"]): row["index"] for row in native.types}
    fields = {
        name: [
            field
            for field in native.fields(type_indices[name])
            if field["name"] in requested
        ]
        for name, requested in FIELDS.items()
    }
    pool_methods = [native.address_methods[address][0] for address in POOL_METHOD_ADDRESSES]
    result = {
        "fields": fields,
        "recycleMessage": recycle_message(native),
        "characterPoolAllocation": character_pool_allocation(native),
        "directCallers": [native.xrefs(native.method(index)["address"]) for index in (79122, 79125, 65649)],
        "methods": [body(native, decoder, index) for index in sorted([*METHODS, *pool_methods])],
    }
    provenance["scope"] += " Bodies use the next tracked method as the maximum extent. Tail control flow may lie outside this extent."
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

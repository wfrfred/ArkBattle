#!/usr/bin/env python3
"""Select native instruction ranges proving the seed and the two movement predicates."""

import argparse
import json
from pathlib import Path


CLIENT = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
SELECTION = {
    71327: ((0x1808CC314, 0x1808CC325),),
    71328: ((0x1808DB279, 0x1808DB2CF),),
    71331: ((0x1808DAB60, 0x1808DABD1), (0x1808DACB9, 0x1808DAD5E)),
    71338: ((0x1808DAF2B, 0x1808DAF49),),
    71474: ((0x1808E08C0, 0x1808E08C0),),
    71482: ((0x1808E1295, 0x1808E12AC),),
    71483: ((0x1808E158E, 0x1808E159B), (0x1808E15EA, 0x1808E1667)),
    71504: ((0x1808DF091, 0x1808DF0C8),),
    71526: ((0x1808DE3E4, 0x1808DE43A), (0x1808DE50C, 0x1808DE525)),
    77649: ((0x180ACD157, 0x180ACD172),),
    77672: ((0x180ACD007, 0x180ACD064),),
    77748: ((0x180ABD914, 0x180ABD968),),
    77750: ((0x180AB872F, 0x180AB878B),),
    94015: ((0x180F94709, 0x180F9473A),),
    94018: ((0x180F96AA8, 0x180F96B45),),
    101641: ((0x1811D8535, 0x1811D85B7),),
    101644: ((0x1811D8235, 0x1811D8243), (0x1811D82DE, 0x1811D82F4)),
}
FIELD_NAMES = {"position", "reachOffset", "randomizeReachOffset", "checkpoints", "allowDiagonalMove",
               "motionMode", "m_offset", "m_nextmap", "<isDisappeared>k__BackingField", "isHanging",
               "<data>k__BackingField", "<cursor>k__BackingField"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    src = json.loads(args.source.read_text())
    assert all(src["provenance"]["client"][key]["sha256"] == digest for key, digest in CLIENT.items())
    del src["provenance"]["location"]["modules"]
    ranges = {}
    for index, spans in SELECTION.items():
        section = src["result"]["ranges"][str(index)]
        rows = section["instructions"]
        for lo, hi in spans:
            assert any(int(row["address"], 16) == lo for row in rows)
            assert any(int(row["address"], 16) == hi for row in rows)
        ranges[index] = {"method": section["method"], "ranges": [
            {"start": hex(lo), "lastInstruction": hex(hi), "instructions": [row for row in rows
                if lo <= int(row["address"], 16) <= hi]} for lo, hi in spans
        ]}
    fields = {name: [field for field in rows if field["name"] in FIELD_NAMES]
              for name, rows in src["result"]["fields"].items()}
    value = {"provenance": src["provenance"], "result": {"ranges": ranges, "fields": fields}}
    args.out.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Read the checked PC client's unbalance and blocking paths."""

import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "push"))
from extract_push_native import extract_body
from native import DEFAULT_GAME, Native, fingerprint


METHODS = (32166, 63902, 63906, 63907, 67510, 77742, 77750, 77751, 77752, 77753,
           77758, 78054, 78060, 78061, 78062, 78064)
FIELDS = {
    "Torappu.Battle.BattleOptions": {"MOVE_MULTIPLIER"},
    "Torappu.Battle.Consts": {"GRAVITY"},
    "Torappu.Battle.Enemy": {"m_pullSources", "m_disabledPullSources"},
    "Torappu.LevelData/Options": {"moveMultiplier"},
}
FLOATS = {"frictionCoefficient": 0x1870adda8, "stopSpeed": 0x1870aded8}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    native = Native(args.game)
    bodies = []
    for index in METHODS:
        method = native.method(index)
        body = extract_body(native, method)
        body["fragments"][0]["method"] = method
        bodies.append(body)
    fields = {
        name: [field for field in native.fields(row["index"]) if field["name"] in FIELDS[name]]
        for row in native.types
        if (name := native.typename(row["index"])) in FIELDS
    }
    constants = {
        name: {
            "address": hex(address),
            "bytes": native.pe.read(address, 4).hex(),
            "values": native.pe.unpack("<f", address),
            "format": "<f",
        }
        for name, address in FLOATS.items()
    }
    provenance = native.provenance() | {"caseScript": fingerprint(Path(__file__))}
    evidence = {"date": "2026-11-18", "provenance": provenance,
                "result": {"bodies": bodies, "fields": fields, "constants": constants}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

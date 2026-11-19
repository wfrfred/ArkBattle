#!/usr/bin/env python3
"""Extract the checked client paths for unit and tile friction."""

import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "forced-motion-20261118/push"))
from extract_push_native import extract_body, resolve_string
from native import DEFAULT_GAME, Native


METHODS = {
    71648: "Torappu.Battle.CoopFootballTile.OnSwitchMode",
    71746: "Torappu.Battle.IceCornerTile._DoOrbitInternal",
    71749: "Torappu.Battle.IceCornerTile._StopOrbit",
    71796: "Torappu.Battle.Tile.get_additionalFriction",
    71840: "Torappu.Battle.Tile.Init",
    77716: "Torappu.Battle.Enemy.get_frictionFactor",
    77723: "Torappu.Battle.Enemy.UpdateFrictionFactor",
    77724: "Torappu.Battle.Enemy.RestoreFrictionFactor",
    77814: "Torappu.Battle.Enemy._UpdateCurrentTile",
    77876: "Torappu.Battle.Enemy..ctor",
    100322: "Torappu.Battle.Action.Nodes/UpdateFrictionFactor.Execute",
}
EXCERPTS = {
    71648: [(0x1808E5BD0, 0x1808E5C18)],
    71746: [(0x1808ECCD5, 0x1808ECCFA)],
    71749: [(0x1808ED5CF, 0x1808ED5E1)],
    71840: [(0x1808F49E0, 0x1808F4A30)],
    77814: [(0x180AC91C0, 0x180AC9232)],
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    bodies = []
    for index, name in METHODS.items():
        method = native.method(index)
        assert method["fullname"] == name, method
        if index not in EXCERPTS:
            bodies.append(native.disassemble(index))
            continue

        body = extract_body(native, method)
        instructions = [
            ins
            for start, end in EXCERPTS[index]
            for fragment in body["fragments"]
            for ins in fragment["instructions"]
            if start <= int(ins["address"], 16) < end
        ]
        assert instructions, name
        bodies.append({"method": method, "excerpt": True, "instructions": instructions})

    xrefs = {}
    for index in (77723, 77724):
        method = native.method(index)
        refs = native.xrefs(method["address"])
        for candidate in refs["candidates"]:
            candidate["methodNames"] = [
                native.method(i)["fullname"] for i in candidate["precedingMethodCandidates"]
            ]
        xrefs[method["fullname"]] = refs

    keys = {"buffNode": resolve_string(native, 0x188BF3680)}
    result = {"bodies": bodies, "xrefs": xrefs, "keys": keys}
    args.out.write_text(
        json.dumps({"date": "2026-11-20", "provenance": native.provenance(), "result": result},
                   ensure_ascii=False, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()

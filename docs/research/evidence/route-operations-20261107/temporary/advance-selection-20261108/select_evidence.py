#!/usr/bin/env python3
"""Select archived receiver/slot evidence without interpreting or executing code."""
import argparse
import hashlib
import json
from pathlib import Path


def fingerprint(path):
    data = path.read_bytes()
    return {"path": path.as_posix(), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    base = Path("docs/research/evidence/route-operations-20261107")
    sources = {
        "temporary": base / "temporary/native.json",
        "enemy": base / "content/enemy-type.json",
        "cursor": base / "cursor/state-bodies.json",
    }
    documents = {key: json.loads(path.read_text()) for key, path in sources.items()}
    enemy = documents["enemy"]["result"][0]
    slots = [
        {"fullname": method["fullname"], "index": method["index"], "slot": method["slot"],
         "address": hex(method["address"]), "vtableOffset": hex(0x140 + 16 * method["slot"])}
        for method in enemy["methods"]
        if method["fullname"] in {
            "Torappu.Battle.Enemy.get_cursor", "Torappu.Battle.Enemy.get_moveCursor",
            "Torappu.Battle.Enemy.get_usingTraceCursor", "Torappu.Battle.Enemy._MoveByRoute",
        }
    ]
    requests = {
        "temporary": {
            "Torappu.Battle.Enemy.OnTick": [(0x180AC0B5B, 0x180AC0C6B), (0x180AC0E2D, 0x180AC0E36), (0x180AC0EE2, 0x180AC1033)],
            "Torappu.Battle.Enemy.get_cursor": [(0x180ACABDB, 0x180ACABF4)],
            "Torappu.Battle.Enemy.get_moveCursor": [(0x180ACDAFE, 0x180ACDB4B), (0x180ACDCC9, 0x180ACDD43)],
            "Torappu.Battle.Enemy.get_usingTraceCursor": [(0x180ACF517, 0x180ACF5FF)],
            "Torappu.Battle.Enemy._CursorNeedCheckReached": [(0x180AC704D, 0x180AC709B)],
            "Torappu.Battle.Enemy/States/MoveState.OnTick": [(0x180AE5566, 0x180AE5778)],
            "Torappu.Battle.Enemy/FearController.OnTick": [(0x180AD4BD0, 0x180AD4BE4)],
            "Torappu.Battle.Enemy._MoveInFearArea": [(0x180AC82C6, 0x180AC8323)],
            "Torappu.Battle.Enemy._MoveInAttractArea": [(0x180AC81C6, 0x180AC821F)],
        },
        "cursor": {
            "Torappu.Battle.DirectionCursor.OnTick": [(0x1808D2803, 0x1808D28A8)],
            "Torappu.Battle.BasicCursor/WaitForSecondsCheckpoint.OnTick": [(0x1808E4462, 0x1808E44AC)],
        },
    }
    excerpts = []
    for source, methods in requests.items():
        bodies = {body["selector"]["fullname"]: body for body in documents[source]["result"]["bodies"]}
        for name, ranges in methods.items():
            body = bodies[name]
            instructions = [
                instruction for fragment in body["fragments"] for instruction in fragment["instructions"]
                if any(start <= int(instruction["address"], 16) < end for start, end in ranges)
            ]
            if not instructions:
                raise ValueError(f"empty selection for {name}")
            excerpts.append({
                "source": sources[source].as_posix(), "selector": body["selector"],
                "ranges": [{"start": hex(start), "endExclusive": hex(end)} for start, end in ranges],
                "instructions": instructions,
            })
    output = {
        "provenance": {
            "scope": "Selection from archived static native evidence; not a new disassembly or runtime observation.",
            "client": documents["temporary"]["provenance"]["client"],
            "inputs": [fingerprint(path) for path in sources.values()],
            "queryScript": fingerprint(Path(__file__)),
        },
        "result": {
            "vtableBase": "0x140", "vtableEntryBytes": 16, "slots": slots,
            "enemyFields": [field for field in enemy["fields"] if not field["static"]
                            and field["offset"] in [0x370, 0x390, 0x3E0, 0x3E8]],
            "excerpts": excerpts,
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

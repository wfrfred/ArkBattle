#!/usr/bin/env python3
"""Decode the exact side-index and side-mask enums consumed by the prefab fields."""
import argparse
import importlib.util
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    tool = Path(".agents/skills/arkbattle-native-research/scripts/native.py")
    spec = importlib.util.spec_from_file_location("native_reader", tool)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    defaults = {row["fieldIndex"]: row for row in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    values, _ = native.table(8)

    def int32(offset):
        data = native.metadata[values + offset:]
        head = data[0]
        if head < 0x80:
            number, size = head, 1
        elif head < 0xC0:
            number, size = ((head & 0x3F) << 8) | data[1], 2
        elif head < 0xE0:
            number, size = ((head & 0x1F) << 24) | (data[1] << 16) | (data[2] << 8) | data[3], 4
        elif head == 0xF0:
            number, size = int.from_bytes(data[1:5], "little"), 5
        elif head in [0xFE, 0xFF]:
            number, size = 0xFFFFFFFE if head == 0xFE else 0xFFFFFFFF, 1
        else:
            raise ValueError("unknown compressed int")
        return (-(number >> 1) - 1 if number & 1 else number >> 1), data[:size].hex()

    rows = []
    for entry in native.types:
        fullname = native.typename(entry["index"])
        if fullname not in ["Torappu.Battle.SideTypeIndex", "Torappu.Battle.SideType", "Torappu.MotionMode"]:
            continue
        fields = native.fields(entry["index"])
        constants = []
        for field in fields:
            default = defaults.get(field["index"])
            if default is not None and default["dataIndex"] >= 0:
                value, encoded = int32(default["dataIndex"])
                constants.append({"field": field["name"], "fieldIndex": field["index"], "dataIndex": default["dataIndex"],
                                  "value": value, "bytes": encoded, "encoding": "IL2CPP v29 compressed signed integer"})
        rows.append({"fullname": fullname, "index": entry["index"], "fields": fields, "constants": constants})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": {**native.provenance(), "queryScript": module.fingerprint(Path(__file__))},
                                    "result": rows}, ensure_ascii=False, indent=2) + "\n")
    for row in rows:
        print(row["fullname"], [(item["field"], item["value"]) for item in row["constants"]])


if __name__ == "__main__":
    main()

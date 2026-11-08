#!/usr/bin/env python3
"""Read only the constants referenced by the archived Enemy blocking getters."""
import argparse
import importlib.util
import json
import struct
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    tool = Path(".agents/skills/arkbattle-native-research/scripts/native.py")
    spec = importlib.util.spec_from_file_location("native_reader", tool)
    native = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(native)
    source = args.game / "GameAssembly.dll"
    if native.fingerprint(source)["sha256"] != "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff":
        raise ValueError("client changed; locate the getter constants again before reading these addresses")
    pe = native.PE(source)
    rows = []
    for name, address in [("non-FLY radius squared", 0x1870AFDE0), ("FLY radius squared", 0x1870AFDE4), ("default radius scale", 0x1870ADBE0)]:
        raw = pe.read(address, 4)
        rows.append({"name": name, "address": hex(address), "bytes": raw.hex(), "format": "<f", "value": struct.unpack("<f", raw)[0]})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "provenance": {"script": native.fingerprint(Path(__file__)), "reader": native.fingerprint(tool),
                       "input": native.fingerprint(source), "scope": "Constants referenced by get_blockRadiusSquare/get_defaultBlockRadiusScale in blocking-native.json; static reads only."},
        "result": rows,
    }, ensure_ascii=False, indent=2) + "\n")
    print([(row["name"], row["value"]) for row in rows])


if __name__ == "__main__":
    main()

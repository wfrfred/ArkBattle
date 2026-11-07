#!/usr/bin/env python3
"""Decode the three string-literal usages read by Act46's map initialization."""
import argparse
import json
import struct
import sys
from pathlib import Path
sys.path.insert(0, ".agents/skills/arkbattle-native-research/scripts")
from native import PE, DEFAULT_GAME, fingerprint
parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
pe = PE(args.game/"GameAssembly.dll")
metadata_path = args.game/"Arknights_Data/il2cpp_data/Metadata/global-metadata.dat"
metadata = metadata_path.read_bytes()
records, size, data, data_size = struct.unpack_from("<4I", metadata, 8)
rows = []
for va in (0x188c5af98, 0x188bb5f10, 0x188bb6160):
    encoded = pe.unpack("<Q", va)[0]
    assert encoded >> 29 == 5 and encoded & 1
    index = (encoded & 0x1fffffff) >> 1
    assert index*8 < size
    length, offset = struct.unpack_from("<II", metadata, records+index*8)
    assert offset+length <= data_size
    value = metadata[data+offset:data+offset+length].decode("utf-8")
    rows.append({"slot":hex(va), "encodedUsage":hex(encoded), "literalIndex":index, "value":value})
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({"provenance":{"queryScript":fingerprint(Path(__file__)), "dll":fingerprint(pe.path), "metadata":fingerprint(metadata_path), "scope":"Three IL2CPP encoded string-literal usages selected from Act46SideBattleManager._InitMapIfNot; metadata stringLiteral records/data tables, not runtime heap strings."}, "result":rows}, ensure_ascii=False, indent=2)+"\n")

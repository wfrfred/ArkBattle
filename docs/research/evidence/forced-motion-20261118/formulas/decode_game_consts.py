#!/usr/bin/env python3
"""Read the force table slots of the checked PC client's GameDataConsts."""

import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized


SLOTS = (
    (72, "pushForces", "f"),
    (73, "pushForceZeroIndex", None),
    (74, "normalGachaUnlockPrice", "i"),
    (75, "pullForces", "f"),
    (76, "pullForceZeroIndex", None),
)
OBJECT_ID = "-6968129341170069194"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    path = args.game / "Arknights_Data/PersistentData/Bundles/anon/a2adf558e4aef8b8e3d9dafb2c9a941c.bin"
    files, unity_version = bundle(path)
    name = "CAB-c72300404a9eb1f1f4a60cef09d18fe1"
    data = dict(files)[name]
    obj = next(row for row in serialized(data)["objects"] if str(row["id"]) == OBJECT_ID)
    assert obj["classid"] == 49
    asset = data[obj["start"]:obj["start"] + obj["size"]]

    def value(fmt, position):
        return struct.unpack_from("<" + fmt, asset, position)[0]

    name_length = value("I", 0)
    assert asset[4:4 + name_length] == b"gamedata_const61fefd"
    length_position = (4 + name_length + 3) & ~3
    payload_start = length_position + 4
    assert payload_start + value("I", length_position) == len(asset)
    flatbuffer = payload_start + 128
    root = flatbuffer + value("I", flatbuffer)
    vtable = root - value("i", root)
    vtable_size = value("H", vtable)

    fields = {}
    for slot, field, element in SLOTS:
        entry = 4 + slot * 2
        assert entry < vtable_size
        position = root + value("H", vtable + entry)
        if element:
            position += value("I", position)
            count = value("I", position)
            assert 0 < count <= 7
            end = position + 4 + count * 4
            decoded = struct.unpack_from(f"<{count}{element}", asset, position + 4)
        else:
            end = position + 4
            decoded = value("i", position)
        fields[field] = {
            "slot": slot, "offset": position, "bytes": asset[position:end].hex(), "value": decoded,
        }

    evidence = {
        "provenance": {"source": fingerprint(path), "tool": fingerprint(Path(__file__)),
                       "unityVersion": unity_version},
        "result": {"file": name, "pathId": OBJECT_ID, "sha256": hashlib.sha256(asset).hexdigest(),
                   "flatbuffer": flatbuffer, "root": root, "vtable": vtable, "fields": fields},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

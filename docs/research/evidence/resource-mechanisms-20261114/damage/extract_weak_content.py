#!/usr/bin/env python3
"""Extract actual Mountain/Ch'en bindings and the pinned WeakDamage DB definition."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint

MIRROR = ROOT / ".cache/native-research/elemental-zero-20261105/templates/buff_table.json"
MIRROR_SHA256 = "f9c67db93cd9e8d40a3ff76ec6375d232993f1b61f3d277cb96b05e32fe537c3"
MIRROR_REVISION = "bffe31bf66739842f99b457327066c695e2af389"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("weak_content_reader", HERE / "extract_bindings.py")
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    reader.CHARACTERS = ["char_264_f12yin", "char_1050_chen3"]
    reader.SKILLS = [f"skchr_{key}_{index}" for key in ["f12yin", "chen3"] for index in [1, 2, 3]]
    reader.main()
    payload = json.loads(args.out.read_text())
    raw = MIRROR.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == MIRROR_SHA256
    table = json.loads(raw)
    payload["provenance"]["selectionWrapper"] = fingerprint(Path(__file__))
    payload["provenance"]["buffDbMirror"] = {
        "file": fingerprint(MIRROR), "revision": MIRROR_REVISION,
        "url": f"https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{MIRROR_REVISION}/zh_CN/gamedata/buff_table.json",
        "scope": "Pinned third-party extracted table, separate from installed Holder/native versions; no claim they are the same release.",
    }
    payload["result"]["buffDb"] = {"pointer": "/common_weak_damage", "value": table["common_weak_damage"]}
    payload["result"]["buffDbTemplateScan"] = {
        "entriesScanned": len(table), "field": "templateKey", "exactMatch": True,
        "matches": {key: [{"pointer": "/" + name.replace("~", "~0").replace("/", "~1"), "buffKey": value["buffKey"]}
                          for name, value in table.items() if value.get("templateKey") == key]
                    for key in ["common_weak_damage_buff", "scale_damage_on_hp_less"]},
        "scope": "Complete pinned 114-entry mirror, not a claim about other versions or live hotfix data.",
    }
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

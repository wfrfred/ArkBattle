#!/usr/bin/env python3
"""Reuse the typed resource reader to follow Entelecheia's actual summon source."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    helper_path = HERE / "extract_bindings.py"
    spec = importlib.util.spec_from_file_location("entlec_origin_reader", helper_path)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    helper.CHARACTERS = ["char_4010_etlchi"]
    helper.SKILLS = ["skchr_etlchi_1", "skchr_etlchi_2", "skchr_etlchi_3"]
    helper.main()
    payload = json.loads(args.out.read_text())
    payload["provenance"]["selectionWrapper"] = fingerprint(Path(__file__))
    revision = "63c7cec73c3858d0ae913f85cc89af3cef4d744f"
    skill_path = ROOT / ".cache/native-research/route-operations-20261107/data/skill_table.json"
    level_relative = "zh_CN/gamedata/levels/activities/act18mini/level_act18mini_sub-1-1.json"
    level_path = ROOT / ".cache/native-research/checkpoint-nondefault-20261107/mirror-current" / level_relative
    payload["provenance"]["additionalStaticSources"] = {
        "revision": revision,
        "verification": "docs/research/evidence/route-operations-20261107/data-source-verification.json",
        "skill": fingerprint(skill_path), "level": fingerprint(level_path),
        "levelUrl": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/" + revision + "/" + level_relative,
        "skillUrl": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/" + revision + "/zh_CN/gamedata/excel/skill_table.json",
    }
    payload["result"]["additionalStaticInputs"] = {
        "skillPointer": "/skchr_etlchi_3", "skill": json.loads(skill_path.read_text())["skchr_etlchi_3"],
        "levelPointer": "/predefines/characterCards/0", "levelCard": json.loads(level_path.read_text())["predefines"]["characterCards"][0],
        "levelScope": "Ordinary stage supplies Entelecheia as a card, with skillIndex=1 (S2). This card is not presented as evidence that this stage casts S3 or directly spawns Heartcandle.",
    }
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

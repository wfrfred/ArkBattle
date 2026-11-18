#!/usr/bin/env python3
"""Read the Arc Frontliner's passive and its two Buff templates."""

import argparse
import json
from pathlib import Path
import runpy
from tempfile import TemporaryDirectory


PUSH = Path(__file__).resolve().parent.parent / "push" / "extract_push_config.py"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    extract = runpy.run_path(str(PUSH))["extract_with"]
    with TemporaryDirectory(prefix="arkbattle-arc-frontliner-") as temp:
        prefab_path = Path(temp) / "prefabs.json"
        template_path = Path(temp) / "templates.json"
        extract("extract_aak_fuze_prefabs.py", prefab_path, SELECTION={
            "battle/enm_pfb_13.ab": ["enemy_1328_cbjedi"],
        })
        extract("extract_templates.py", template_path, KEYS={
            "enemy_cbjedi_bleed", "periodic_damage_without_modify",
        })
        prefabs = json.loads(prefab_path.read_text())
        templates = json.loads(template_path.read_text())

    passive = [
        row for row in prefabs["result"]
        if row["hierarchy"][-1] == "unbalanced_bleed" and row["script"]["cl"] == "PassiveBuffAbility"
    ]
    assert {row["hierarchy"][0] for row in passive} == {"enemy_1328_cbjedi", "enemy_1328_cbjedi_2"}
    evidence = {
        "checkedOn": "2026-11-19",
        "provenance": {"prefabs": prefabs["provenance"] | {"collectedOn": "2026-11-19"},
                       "templates": templates["provenance"] | {"collectedOn": "2026-11-19"}},
        "result": {"passives": passive, "templates": templates["result"]},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Read the checked skill and module bindings for movement-distance damage."""

import argparse
import json
from pathlib import Path
import runpy
from tempfile import TemporaryDirectory

ROOT = Path.cwd()
PUSH = Path(__file__).resolve().parent.parent / "push" / "extract_push_config.py"
HELPER = runpy.run_path(str(PUSH))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    roots = ("skchr_weedy_3", "glady_equip_1_1_p1", "rope_equip_1_1_p1")
    with TemporaryDirectory(prefix="arkbattle-movement-damage-") as temp:
        prefab = Path(temp) / "prefabs.json"
        holder = Path(temp) / "templates.json"
        HELPER["extract_with"]("extract_aak_fuze_prefabs.py", prefab, SELECTION={
            "battle/prefabs/[uc]skills.ab": [roots[0]],
            "battle/prefabs/[uc]equips.ab": list(roots[1:]),
        })
        HELPER["extract_with"]("extract_templates.py", holder, KEYS={
            "rupture", "glady_e_trait", "rope_e_trait", "glady_e_rupture", "rope_e_rupture",
        })
        prefabs = json.loads(prefab.read_text())
        templates = json.loads(holder.read_text())

    components = [
        row for row in prefabs["result"]
        if row["hierarchy"][0] in roots and row["script"]
        and row["script"]["cl"] in {"RangedAttack", "PassiveBuffAbility"}
    ]
    assert {row["hierarchy"][0] for row in components} == set(roots)
    characters, character_source = HELPER["read_table"]("character_table.json")
    skills, skill_source = HELPER["read_table"]("skill_table.json")
    skill = characters["char_400_weedy"]["skills"][2]
    assert skill["skillId"] == roots[0] and skill["overridePrefabKey"] is None
    blackboard = skills[roots[0]]["levels"][-1]["blackboard"]
    provenance = {
        "prefabs": prefabs["provenance"],
        "templates": templates["provenance"],
        "skillSourceRevision": HELPER["REVISION"],
        "tableSources": [character_source, skill_source],
    }
    evidence = {
        "provenance": provenance,
        "result": {
            "weedySkill": {key: skill[key] for key in ("skillId", "overridePrefabKey")},
            "weedyMastery3": blackboard,
            "components": components,
            "templates": templates["result"],
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

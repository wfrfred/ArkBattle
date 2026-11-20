#!/usr/bin/env python3
"""Project the current enemy ability and projectile selection for the dispel case."""

import argparse
import json
from pathlib import Path
import runpy
import sys
from tempfile import TemporaryDirectory


sys.dont_write_bytecode = True
ROOT = Path.cwd()
HELPER = ROOT / "docs/research/evidence/forced-motion-20261118/push/extract_push_config.py"
TOOLS = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(TOOLS))
from native import fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument(
        "--game-data",
        type=Path,
        default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data"),
    )
    args = parser.parse_args()

    shared = args.game_data / "PersistentData/Bundles/battle/prefabs/[uc]projectiles.ab"
    selection = {
        str(shared.resolve()): ["projectile_enemy_cbsisy", "projectile_crossbow"],
        "battle/enm_pfb_13.ab": ["enemy_1331_cbsisy"],
    }
    fields = {
        "-8223809503309271891": ["_commonAbilities"],
        "-8915949423972979539": ["_projectileKey"],
        "-7436304583270929235": ["_projectileKey"],
    }
    projectile_ids = (
        "2585524171859296351",
        "5238304719443313584",
        "5817916136774037088",
        "-6540156056414461813",
    )
    for path_id in projectile_ids:
        fields[path_id] = ["_eliminatableStatus", "_movementAdjustableStatus", "_mainEffect", "_lifeTime"]

    extract = runpy.run_path(str(HELPER))["extract_with"]
    with TemporaryDirectory() as work:
        extracted = Path(work) / "prefabs.json"
        extract(
            "extract_prefabs.py", extracted, BASE=args.game_data / "StreamingAssets/AB/Windows", SELECTION=selection
        )
        record = json.loads(extracted.read_text())
        lookup = {row["pathId"]: row for row in record["result"]}

    result = []
    for path_id, chosen in fields.items():
        row = lookup[path_id]
        assert row["script"] is not None, path_id
        result.append({**row, "value": {name: row["value"][name] for name in chosen}})

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "provenance": {
            **record["provenance"],
            "collectedOn": "2026-11-20",
            "projection": {"script": fingerprint(Path(__file__)), "wrapper": fingerprint(HELPER), "fieldsByPathId": fields},
            "scope": "Selected serialized prefab fields with resolved MonoScript and ability PPtr. No live activation or hit observation.",
        },
        "result": result,
    }, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

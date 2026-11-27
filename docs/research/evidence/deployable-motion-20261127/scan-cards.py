"""Scan predefined card keys in the repository's pinned game-data mirror."""

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mirror", type=Path, default=Path("assets/arknights-game-data"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    base = args.mirror / "zh_CN/gamedata"
    table_path = base / "excel/character_table.json"
    table = json.loads(table_path.read_bytes())
    levels = sorted((base / "levels").rglob("*.json"))
    groups = Counter()
    entries = Counter()
    keys = Counter()
    missing = []
    failures = []
    digest = hashlib.sha256()
    for path in levels:
        relative = path.relative_to(base).as_posix()
        if "/sandbox" in relative or "/tower" in relative:
            continue
        group = (
            "autochess" if "autochess" in relative else
            "roguelike" if "/roguelike/" in relative else
            "main" if "/main/" in relative else "others"
        )
        groups[group] += 1
        try:
            raw = path.read_bytes()
            data = json.loads(raw)
        except (OSError, ValueError) as exc:
            failures.append({"file": relative, "error": str(exc)})
            continue
        digest.update(relative.encode("utf-8") + b"\0")
        digest.update(hashlib.sha256(raw).digest())
        for section in ("predefines", "hardPredefines"):
            for field in ("characterCards", "tokenCards"):
                for index, entry in enumerate((data.get(section) or {}).get(field) or []):
                    key = (entry.get("inst") or {}).get("characterKey")
                    entries[field] += 1
                    keys[key] += 1
                    if key not in table:
                        missing.append({
                            "file": relative, "pointer": f"/{section}/{field}/{index}/inst/characterKey", "key": key
                        })

    result = {
        "mirror_commit": subprocess.check_output(
            ["git", "-C", str(args.mirror), "rev-parse", "HEAD"], text=True
        ).strip(),
        "character_table_sha256": hashlib.sha256(table_path.read_bytes()).hexdigest(),
        "scanned_levels_digest": {
            "algorithm": "SHA256(sorted relative UTF-8 path + NUL + raw SHA256 digest for each parsed file)",
            "sha256": digest.hexdigest(),
        },
        "selection": {
            "glob": "zh_CN/gamedata/levels/**/*.json",
            "exclude_relative_path_substrings": ["/sandbox", "/tower"],
            "group_priority": [
                "relative contains autochess", "relative contains /roguelike/",
                "relative contains /main/", "others"
            ],
            "pointers": [
                f"/{section}/{field}/*/inst/characterKey"
                for section in ("predefines", "hardPredefines")
                for field in ("characterCards", "tokenCards")
            ],
        },
        "source_level_files": len(levels),
        "selected_level_files": sum(groups.values()),
        "parsed_level_files": sum(groups.values()) - len(failures),
        "level_files_by_group": dict(groups),
        "card_records": sum(entries.values()),
        "card_records_by_field": dict(entries),
        "distinct_card_keys": len(keys),
        "distinct_card_keys_by_prefix": dict(Counter(
            key.split("_")[0] if isinstance(key, str) else "<missing>" for key in keys
        )),
        "distinct_matched_card_keys_by_profession": dict(Counter(
            table[key]["profession"] for key in keys if key in table
        )),
        "missing_card_key_records": len(missing),
        "missing_distinct_card_keys": len({record["key"] for record in missing}),
        "enemy_prefixed_distinct_card_keys": sum(
            isinstance(key, str) and key.startswith("enemy_") for key in keys
        ),
        "character_table_records": len(table),
        "character_table_keys_by_prefix": dict(Counter(key.split("_")[0] for key in table)),
        "missing_records": missing,
        "read_failures": failures,
        "limitation": "Only level-defined Card keys in the selected fixed mirror; excludes runtime card grants, dynamically created units, behavior/Prefab analysis, and other versions. Matched keys do not by themselves establish movement behavior.",
    }
    provenance = {key: result.pop(key) for key in (
        "mirror_commit", "character_table_sha256", "scanned_levels_digest", "selection", "limitation"
    )}
    args.out.write_text(json.dumps({"provenance": provenance, "result": result},
                                   ensure_ascii=False, indent=2, sort_keys=True) + "\n")


if __name__ == "__main__":
    main()

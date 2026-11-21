import argparse
import hashlib
import json
import re
from pathlib import Path


BRANCH = re.compile(r"cjstel_move_\d+")
REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"


def references(value, pointer=""):
    if isinstance(value, dict):
        for key, item in value.items():
            escaped = key.replace("~", "~0").replace("/", "~1")
            yield from references(item, f"{pointer}/{escaped}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from references(item, f"{pointer}/{index}")
    elif isinstance(value, str) and BRANCH.fullmatch(value):
        yield {"pointer": pointer, "value": value}


def inspect(root):
    files = []
    for path in sorted(root.glob("level_*.json")):
        content = path.read_bytes()
        level = json.loads(content)
        branches = []
        for key, branch in sorted((level.get("branches") or {}).items()):
            if BRANCH.fullmatch(key):
                phases = [
                    [
                        {field: action.get(field) for field in ("actionType", "key", "routeIndex", "count")}
                        for action in phase["actions"]
                    ]
                    for phase in branch["phases"]
                ]
                branches.append({"pointer": f"/branches/{key}", "phases": phases})
        files.append({
            "file": path.name,
            "sha256": hashlib.sha256(content).hexdigest(),
            "branches": branches,
            "references": list(references(level)),
        })
    return files


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("levels", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    output = {
        "provenance": {
            "source": "https://github.com/Kengxxiao/ArknightsGameData",
            "revision": REVISION,
            "selection": "gamedata/levels/activities/act40side/level_*.json",
        },
        "result": inspect(args.levels),
    }
    args.out.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")

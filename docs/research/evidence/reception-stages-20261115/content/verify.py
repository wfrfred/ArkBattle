#!/usr/bin/env python3
"""Re-extract into a separate directory and compare complete result payloads."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys


def fingerprint(path):
    raw = path.read_bytes()
    return {"path": str(path), "size": len(raw), "sha256": hashlib.sha256(raw).hexdigest()}


def result_digest(path):
    result = json.loads(path.read_text())["result"]
    raw = json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--work", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    base = Path(__file__).parent
    args.work.mkdir(parents=True, exist_ok=True)
    commands = [
        ["scan_reception.py", "--out", str(args.work)],
        ["search_resources.py", "--programs", str(args.work / "programs.json"), "--out", str(args.work / "resource-search.json")],
        ["extract_selected.py", "--out", str(args.work)],
        ["summarize.py", "--batch", str(args.work), "--out", str(args.work)],
    ]
    runs = []
    for command in commands:
        argv = [sys.executable, str(base / command[0]), *command[1:]]
        process = subprocess.run(argv, text=True, capture_output=True)
        runs.append({"argv": argv, "exitCode": process.returncode, "stdout": process.stdout, "stderr": process.stderr})
        print(json.dumps({"script": command[0], "exitCode": process.returncode, "summary": process.stdout.strip()}), flush=True)
        if process.returncode:
            break
    comparisons = []
    names = ("inventory.json", "programs.json", "resource-search.json", "selected-content.json", "selected-programs.json", "profiles.json", "family-inventory.json", "static-inputs.json", "level-witnesses.json")
    if len(runs) == len(commands) and all(row["exitCode"] == 0 for row in runs):
        for name in names:
            expected, fresh = base / name, args.work / name
            expected_digest, fresh_digest = result_digest(expected), result_digest(fresh)
            comparisons.append({"name": name, "expected": fingerprint(expected), "fresh": fingerprint(fresh),
                                "expectedResultSha256": expected_digest, "freshResultSha256": fresh_digest,
                                "sameResult": expected_digest == fresh_digest})
    complete = len(comparisons) == len(names) and all(row["sameResult"] for row in comparisons)
    payload = {"checkedOn": "2026-11-15", "script": fingerprint(Path(__file__)),
               "scope": "Independent output-directory replay using the recorded installed resources and fixed mirrors. Complete result payload equality is compared after canonical JSON encoding; provenance differs because output paths differ. This checks extraction reproducibility, not live gameplay.",
               "runs": runs, "comparisons": comparisons, "complete": complete}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"sameResults": sum(row["sameResult"] for row in comparisons), "expectedResults": len(names), "complete": complete}))
    if not complete:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

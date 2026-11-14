#!/usr/bin/env python3
"""Independently replay the bounded current-version WeakDamage evidence."""
import argparse
import ast
import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    env = os.environ | {"UV_CACHE_DIR": str(ROOT / ".cache/uv")}
    records = []

    def run(name, command, native=False):
        destination = args.out / name
        command = (["uv", "run", "--offline"] if native else [sys.executable]) + [str(command[0])] + command[1:] + ["--out", str(destination)]
        subprocess.run(command, cwd=ROOT, env=env, check=True)
        expected = json.loads((HERE / name).read_text())["result"]
        actual = json.loads(destination.read_text())["result"]
        expected, actual = copy.deepcopy(expected), copy.deepcopy(actual)
        for value in [expected, actual]:
            if isinstance(value.get("selection"), dict):
                value["selection"].pop("out", None)
                value["selection"].pop("game", None)
        assert expected == actual, name
        records.append({"record": name, "command": command, "equalResult": True,
                        "archivedSha256": hashlib.sha256((HERE / name).read_bytes()).hexdigest(),
                        "reextractedSha256": hashlib.sha256(destination.read_bytes()).hexdigest()})

    run("weak-content.json", [HERE / "extract_weak_content.py"])
    run("weak-templates.json", [HERE / "scan_holder.py", "--select", "common_weak_damage_buff", "--select", "f12yin_t_atk_scale"])
    run("weak-flag-bindings.json", [HERE / "search_bindings.py", "--needle", "common_weak_damage_flag"])
    for name in ["weak-native.json", "weak-attack-info.json", "weak-rng.json", "weak-database.json"]:
        selection = json.loads((HERE / name).read_text())["result"]["selection"]
        command = [ROOT / "docs/research/evidence/facing-semantics-20261113/extract.py"]
        for key in ["search", "body", "body_index", "body_prefix", "owner", "xref"]:
            for value in selection[key]:
                command += ["--" + key.replace("_", "-"), str(value)]
        run(name, command, True)
    scripts = []
    for path in sorted(HERE.glob("*.py")):
        ast.parse(path.read_text())
        scripts.append({"path": str(path.relative_to(ROOT)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    report = {"scope": "Independent current-version native and actual-content WeakDamage re-extraction; no product tests or live client execution.",
              "script": {"path": str(Path(__file__).relative_to(ROOT)), "sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
              "records": records, "pythonSyntax": scripts}
    (args.out / "verification-weak.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"records": len(records), "allEqual": True, "out": str(args.out)}))


if __name__ == "__main__":
    main()

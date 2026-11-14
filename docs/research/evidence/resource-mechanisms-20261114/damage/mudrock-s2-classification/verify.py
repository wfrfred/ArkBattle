#!/usr/bin/env python3
"""Independently replay the bounded Mudrock S2 content and native records."""
import argparse
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
    selection = json.loads((HERE / "native.json").read_text())["result"]["selection"]
    native = ["uv", "run", "--offline", "docs/research/evidence/facing-semantics-20261113/extract.py"]
    for key in ["search", "body", "body_index", "body_prefix", "owner", "xref"]:
        for value in selection[key]:
            native += ["--" + key.replace("_", "-"), str(value)]
    records = []
    for name, command in [("content.json", [sys.executable, str(HERE / "extract_content.py")]), ("native.json", native)]:
        destination = args.out / name
        command += ["--out", str(destination)]
        subprocess.run(command, cwd=ROOT, env=os.environ | {"UV_CACHE_DIR": str(ROOT / ".cache/uv")}, check=True)
        expected = copy.deepcopy(json.loads((HERE / name).read_text())["result"])
        actual = copy.deepcopy(json.loads(destination.read_text())["result"])
        for value in [expected, actual]:
            if isinstance(value.get("selection"), dict):
                value["selection"].pop("out", None)
                value["selection"].pop("game", None)
        assert expected == actual, name
        records.append({"record": name, "command": command, "equalResult": True,
                        "archivedSha256": hashlib.sha256((HERE / name).read_bytes()).hexdigest(),
                        "reextractedSha256": hashlib.sha256(destination.read_bytes()).hexdigest()})
    report = {"scope": "Independent Mudrock S2 static re-extraction; no other content scan or client execution.",
              "script": {"path": str(Path(__file__).relative_to(ROOT)), "sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}, "records": records}
    (args.out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"records": len(records), "allEqual": True, "out": str(args.out)}))


if __name__ == "__main__":
    main()

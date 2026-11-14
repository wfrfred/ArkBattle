#!/usr/bin/env python3
"""Re-extract archived selections and compare semantic JSON results."""
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
GENERIC = ROOT / "docs/research/evidence/facing-semantics-20261113/extract.py"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalized(result):
    result = copy.deepcopy(result)
    selection = result.get("selection")
    if isinstance(selection, dict):
        selection.pop("out", None)
        selection.pop("game", None)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--native", action="store_true", help="also replay all native evidence selections")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    env = os.environ | {"UV_CACHE_DIR": str(ROOT / ".cache/uv")}
    records = []

    def run(name, command, native=False):
        destination = args.out / name
        invocation = (["uv", "run", "--offline"] if native else [sys.executable]) + [str(command[0])] + command[1:] + ["--out", str(destination)]
        subprocess.run(invocation, cwd=ROOT, env=env, check=True)
        expected = json.loads((HERE / name).read_text())
        actual = json.loads(destination.read_text())
        same = normalized(expected["result"]) == normalized(actual["result"])
        records.append({"record": name, "command": invocation, "equalResult": same,
                        "archivedSha256": digest(HERE / name), "reextractedSha256": digest(destination)})
        if not same:
            raise RuntimeError("Re-extracted semantic result changed: " + name)

    selection = json.loads((HERE / "holder-scan.json").read_text())["result"]["selection"]
    command = [HERE / "scan_holder.py"]
    for key in selection["selectedKeys"]:
        command += ["--select", key]
    for key in selection["extraNodeTypes"]:
        command += ["--node-type", key]
    run("holder-scan.json", command)
    run("operator-bindings.json", [HERE / "extract_bindings.py"])
    run("dynamic-classification.json", [HERE / "scan_dynamic_classification.py"])
    selection = json.loads((HERE / "resource-bindings-search.json").read_text())["result"]["selection"]
    command = [HERE / "search_bindings.py"]
    for needle in selection["needles"]:
        command += ["--needle", needle]
    run("resource-bindings-search.json", command)

    if args.native:
        run("inventory.json", [HERE / "inventory.py"], True)
        run("flag-callers.json", [HERE / "trace_flags.py"], True)
        run("buff-missable.json", [HERE / "trace_buff_missable.py"], True)
        command = [HERE / "trace_literals.py"]
        for literal in json.loads((HERE / "literal-consumers.json").read_text())["result"]["selection"]:
            command += ["--literal", literal]
        run("literal-consumers.json", command, True)
        for name in ["modifier-core.json", "classification-producers.json", "secondary-contracts.json", "receiving-dispatch.json", "receiving-actions.json"]:
            selection = json.loads((HERE / name).read_text())["result"]["selection"]
            command = [GENERIC]
            for key in ["search", "body", "body_index", "body_prefix", "owner", "xref"]:
                for value in selection[key]:
                    command += ["--" + key.replace("_", "-"), str(value)]
            run(name, command, True)

    syntax = []
    for path in sorted(HERE.glob("*.py")):
        ast.parse(path.read_text())
        syntax.append({"file": str(path.relative_to(ROOT)), "sha256": digest(path)})
    report = {"script": {"path": str(Path(__file__).relative_to(ROOT)), "sha256": digest(Path(__file__))},
              "scope": "Independent extraction runs; compare result excluding destination/game arguments. No client execution or product tests.",
              "nativeIncluded": args.native, "records": records, "pythonSyntax": syntax}
    destination = args.out / "verification.json"
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"records": len(records), "allEqual": True, "report": str(destination)}))


if __name__ == "__main__":
    main()

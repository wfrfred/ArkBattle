#!/usr/bin/env python3
"""Re-extract three Buff event bindings used by the selected content.

No generic entry-order conclusion is inferred from these callbacks. Client
fingerprints and method names are checked before applying recorded selectors.
"""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import copy
import datetime
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

SELECTORS = (
    (65143, "Torappu.Battle.Buff.OnStart", 0),
    (65145, "Torappu.Battle.Buff.OnTrigger", 2),
    (65171, "Torappu.Battle.Buff.OnTakeDamage", 10),
)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    recorded = json.loads(Path(__file__).with_name("content-event-mapping.json").read_text())
    for key, relative in (("dll", "GameAssembly.dll"), ("metadata", "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat")):
        if fingerprint(args.game / relative)["sha256"] != recorded["provenance"]["client"][key]["sha256"]:
            raise ValueError(f"{key} differs from the recorded content investigation")
    native = Native(args.game)
    bodies, event_bindings = [], []
    for index, expected, event in SELECTORS:
        body = native.disassemble(index)
        if body["method"]["fullname"] != expected:
            raise ValueError(f"method identity changed at {index}")
        found = False
        rows = body["instructions"]
        for pos, row in enumerate(rows):
            if "Torappu.Battle.Buff._RunActions" not in row.get("methods", []):
                continue
            preceding = rows[max(0, pos-12):pos]
            matches = [r for r in preceding if r["mnemonic"] == "mov"
                       and r["operands"].startswith("r8d, ")
                       and int(r["operands"].split(", ", 1)[1], 0) == event]
            if event == 0:
                matches += [r for r in preceding if r["mnemonic"] == "xor" and r["operands"] == "r8d, r8d"]
            if matches:
                found = True
                event_bindings.append(dict(method=expected, event=event, eventLoad=matches[-1]["address"], runActionsCall=row["address"]))
        if not found:
            raise ValueError(f"event {event} binding not found in {expected}")
        compact = copy.deepcopy(body)
        for row in compact["instructions"]:
            if len(row.get("methods", [])) > 12:
                row["omittedMethodAliasCount"] = len(row.pop("methods"))
        bodies.append(compact)
    provenance = native.provenance()
    provenance["collectedOn"] = datetime.date.today().isoformat()
    provenance["extractionScript"] = fingerprint(Path(__file__))
    output = dict(provenance=provenance, result=dict(methods=bodies, eventBindings=event_bindings))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(dict(methods=[name for _, name, _ in SELECTORS], output=str(args.out)), ensure_ascii=False))

if __name__ == "__main__":
    main()

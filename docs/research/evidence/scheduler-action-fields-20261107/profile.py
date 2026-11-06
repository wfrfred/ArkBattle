#!/usr/bin/env python3
"""Summarize archived Action selections; counts describe this source set only."""
import argparse
import collections
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("actions", type=Path)
    parser.add_argument("fields", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    actions = json.loads(args.actions.read_text())
    fields = json.loads(args.fields.read_text())
    rows = actions["result"]["matches"]
    names = [field["name"] for field in fields["result"]["types"][0]["fields"]]
    profiles = {}
    for name in names:
        buckets = {}
        missing = 0
        for row in rows:
            if name not in row["value"]:
                missing += 1
                continue
            value = row["value"][name]
            key = json.dumps(value, ensure_ascii=False, sort_keys=True)
            bucket = buckets.setdefault(key, {"value": value, "count": 0, "examples": []})
            bucket["count"] += 1
            if len(bucket["examples"]) < 3:
                bucket["examples"].append({"file": Path(row["source"]).name, "pointer": row["pointer"]})
        profiles[name] = {"missing": missing, "values": sorted(buckets.values(), key=lambda item: -item["count"])}
    result = {
        "files": actions["result"]["scanned"],
        "actions": len(rows),
        "fields": profiles,
        "unknownJsonFields": sorted({key for row in rows for key in row["value"]} - set(names)),
        "actionTypes": dict(collections.Counter(row["value"]["actionType"] for row in rows)),
        "randomActions": [{"file": Path(row["source"]).name, "pointer": row["pointer"], "action": row["value"]}
                          for row in rows if row["value"].get("randomSpawnGroupKey") is not None],
    }
    output = {"provenance": {"scope": "Finite selected level configurations, not all playable stages or runtime overrides.",
                              "inputs": [str(args.actions), str(args.fields)]}, "result": result}
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"files={result['files']}, actions={result['actions']}, native_fields={len(names)}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Summarize the shared selector's finite checkpoint sample and retain witnesses."""
import argparse
import collections
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--selection", default=".cache/native-research/checkpoint-semantics-20261107/move/checkpoints.json")
    parser.add_argument("--sources", default="docs/research/evidence/scheduler-general-20261107/config/sources.json")
    parser.add_argument("--out", default="docs/research/evidence/checkpoint-semantics-20261107/move/config-summary.json")
    args = parser.parse_args()
    selection = json.loads(Path(args.selection).read_text())
    sources = json.loads(Path(args.sources).read_text())
    lookup, documents = {}, {}
    for source in sources["sources"]:
        path = Path(source["cache"])
        raw = path.read_bytes()
        blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
        assert blob == source["githubBlobSha"], source["path"]
        lookup[path.name] = source
        documents[path.name] = json.loads(raw)
    result = selection["result"]
    assert result["complete"] and not result["errors"]

    def stats(rows):
        return {
            "checkpoints": len(rows),
            "types": dict(collections.Counter(str(row["value"]["type"]) for row in rows)),
            "randomizeReachOffset": dict(collections.Counter(json.dumps(row["value"].get("randomizeReachOffset", "MISSING")) for row in rows)),
            "reachDistance": dict(collections.Counter(json.dumps(row["value"].get("reachDistance", "MISSING")) for row in rows)),
            "nonzeroReachOffset": sum(any(row["value"].get("reachOffset", {}).values()) for row in rows),
        }

    rows = result["matches"]
    supported = [row for row in rows if not lookup[Path(row["source"]).name]["unsupportedModeControl"]]
    moves = [row for row in supported if row["value"]["type"] in ("MOVE", 0)]
    first_types = {"routes": collections.Counter(), "extraRoutes": collections.Counter()}
    first_presence = []
    for name, doc in documents.items():
        for kind in first_types:
            for index, route in enumerate(doc.get(kind) or []):
                checkpoints = route.get("checkpoints") if isinstance(route, dict) else None
                if checkpoints:
                    type_ = checkpoints[0]["type"]
                    first_types[kind][str(type_)] += 1
                    if type_ in ("DISAPPEAR", "APPEAR_AT_POS", 5, 6):
                        first_presence.append({"file": lookup[name]["path"], "pointer": f"/{kind}/{index}/checkpoints/0", "checkpoint": checkpoints[0]})
    witnesses = []
    for name, route_index, checkpoint_index, action_pointer in [
        ("level_main_03-04.json", 40, 0, "/waves/1/fragments/0/actions/1"),
        ("level_main_10-15.json", 9, 4, "/waves/0/fragments/2/actions/1"),
    ]:
        doc, source = documents[name], lookup[name]
        action = doc
        for key in action_pointer.strip("/").split("/"):
            action = action[int(key)] if isinstance(action, list) else action[key]
        assert action["actionType"] == "SPAWN" and action["routeIndex"] == route_index and not action.get("useExtraRoute", False)
        route = doc["routes"][route_index]
        checkpoint = route["checkpoints"][checkpoint_index]
        assert checkpoint["type"] == "MOVE" and any(checkpoint["reachOffset"].values())
        witnesses.append({
            "source": {key: source[key] for key in ("path", "url", "githubBlobSha", "bytes", "connectorTextSha256")},
            "routePointer": f"/routes/{route_index}",
            "route": route,
            "checkpointPointer": f"/routes/{route_index}/checkpoints/{checkpoint_index}",
            "checkpoint": checkpoint,
            "actionPointer": action_pointer,
            "action": action,
        })
    out = {
        "provenance": {
            "scope": "Finite reuse of 82 pinned full level files selected for prior Scheduler research; not all game levels.",
            "repository": sources["repository"], "revision": sources["revision"],
            "sourceManifest": args.sources,
            "sourceManifestSha256": hashlib.sha256(Path(args.sources).read_bytes()).hexdigest(),
            "selector": selection["provenance"],
            "excludedControls": [source["path"] for source in sources["sources"] if source["unsupportedModeControl"]],
            "validation": "All source byte strings reproduce the upstream Git blob SHA-1. MOVE includes numeric type 0.",
        },
        "result": {"sourceFiles": len(sources["sources"]), "supportedSourceFiles": sum(not source["unsupportedModeControl"] for source in sources["sources"]),
                   "all": stats(rows), "excludingUnsupportedControls": stats(supported), "supportedMove": stats(moves), "witnesses": witnesses,
                   "firstCheckpointTypes": {key: dict(value) for key, value in first_types.items()}, "firstPresenceInstructions": first_presence,
                   "limitations": ["No true randomizeReachOffset or nonzero reachDistance in this finite sample; no global absence conclusion.",
                                   "A SPAWN-to-route reference establishes configured use, not a live game observation."]},
    }
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: out["result"][key] for key in ("sourceFiles", "supportedSourceFiles", "all", "supportedMove")}))


if __name__ == "__main__":
    main()

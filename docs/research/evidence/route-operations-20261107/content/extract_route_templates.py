#!/usr/bin/env python3
"""Extract current holder templates containing selected route-changing action nodes."""
import argparse
import datetime
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path.cwd()
tools = root / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(tools))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized

parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
helper = root / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
spec = importlib.util.spec_from_file_location("reader", helper)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
source = args.game / "Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab"
assert fingerprint(source)["sha256"] == "8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79"
wanted = {
    "Act38SideTryGetRouteAndCacheOrigin", "Act46SideRebuildNpcRoute", "ForceSetToSourcePosition", "BlinkNode",
    "ClearCheckpointInRuntimeRoute", "InsertCheckPointInRuntimeRoute", "ModifyRuntimeRouteUseBranchRoute", "OverwriteEnemyRoute",
    "AssignSpecialEndPointOrRevert", "EnemyChangeRouteToEndTile", "EnemyChangeRouteToTargetUseSelector", "EnemyChangeRouteToTarget",
    "EnemyDurcarChangeDirection", "RistarMove", "MoveEnemyToTargetDirPos", "EnemyReconstructRouteToBlackboardGrid",
    "SkipCursorCheckPoint", "EnemySkipWaitCheckPoint", "ChangeEnemyRouteMotionMode", "TryRemoveRuntimeRoute",
    "IgnoreAllButMoveCp",
    "Transport",
}
rows = []
def walk_nodes(value, pointer=""):
    if isinstance(value, dict):
        if value.get("$type", "").rsplit("+", 1)[-1] in wanted:
            yield {"pointer":pointer, "type":value["$type"]}
        for key, child in value.items():
            yield from walk_nodes(child, pointer+"/"+key.replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_nodes(child, pointer+"/"+str(index))
for filename, data in bundle(source)[0]:
    if filename.endswith((".resS", ".resource")):
        continue
    state = serialized(data)
    trees = m.trees(data)
    for o in state["objects"]:
        if o["id"] != 6070581171229484677:
            continue
        raw = data[o["start"]:o["start"]+o["size"]]
        holder = m.decode(raw, trees[o["typeid"]])
        for index, template in enumerate(holder["_templates"]["Array"]):
            events = []
            hits = []
            for ev in template["eventToActions"]["_items"]["Array"]:
                actions = json.loads(ev["value"]["SerializedState"])
                events.append({"event":ev["key"], "actions":actions})
                hits.extend({"event":ev["key"], **hit} for hit in walk_nodes(actions))
            if hits:
                rows.append({"bundle":"config/buff_template_holder.ab", "file":filename, "pathId":str(o["id"]),
                             "templateIndex":index, "template":template, "events":events, "hits":hits})
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({"provenance":{"collectedOn":datetime.date.today().isoformat(), "script":fingerprint(Path(__file__)), "typeTreeReader":fingerprint(helper), "sources":[fingerprint(source)], "scope":"Complete current holder scan for the explicitly listed route-mutating node types; selected complete template programs preserve guards. Existence is not prefab activation."}, "result":{"wantedNodeTypes":sorted(wanted), "templates":rows}}, ensure_ascii=False, indent=2)+"\n")
print("selected templates",len(rows), "action hits",sum(len(r["hits"]) for r in rows))

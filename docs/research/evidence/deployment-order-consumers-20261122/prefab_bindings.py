"""Verify the deployment-order manager and selector bindings in the selected Windows assets."""
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(root / "docs/research/evidence/special-redeploy-failure-20261122"))
from extract_prefab import DEFAULT_GAME, SCRIPTS, bundle, fingerprint, read_bindings, script, serialized

assets = DEFAULT_GAME / "Arknights_Data/StreamingAssets/AB/Windows"
scripts = {
    (file, obj["id"]): script(obj, data)
    for file, data in bundle(assets / SCRIPTS)[0]
    if not file.endswith((".resS", ".resource"))
    for obj in serialized(data)["objects"]
    if obj["classid"] == 115
}
selections = {
    "battle/prefabs/[uc]envsystems.ab": (
        "CAB-63d3144cebdd9c7c80a7d0b4f965ca02",
        ("Rogue4DLC2LastDeployManager", -258206237697375398, ()),
    ),
    "charpack/char_300_phenxi.ab": (
        "CAB-7a64bdbb726987a07b984077e2d17e98",
        ("LatestDeployedAllyAttackRangeSelector", -2367124869781431311, ()),
    ),
}
result = {
    path: read_bindings(assets / path, serialized_file, [component], scripts)
    for path, (serialized_file, component) in selections.items()
}
provenance = {"inputs": [fingerprint(assets / path) for path in (SCRIPTS, *selections)]}
print(json.dumps({"provenance": provenance, "result": result}, indent=2) + "\n", end="")

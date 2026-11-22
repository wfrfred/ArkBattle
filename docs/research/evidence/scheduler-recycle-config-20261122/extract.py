# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Replay the installed configuration for Schedule's final recycle wait."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
from subprocess import check_output
import sys

ROOT = Path(__file__).resolve().parents[4]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

BUNDLE = "anon/6b47e416a75e403ef16a6730a1c790f0.bin"
KEY = "useRecycleToFinishScheduler"
CONFIG_ADDRESS = "config/config"
TEXT_ASSET = "dyn/config/config.json"
GAME_DATA_REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"


def configuration(game):
    data = game / "Arknights_Data"
    base = data / "StreamingAssets/AB/Windows"
    cache = data / "PersistentData/Bundles"
    options = data / "sharedassets0.assets"
    raw = options.read_bytes()
    label = raw.index(b"\r\x00\x00\x00GlobalOptions")
    reader = Reader(raw, "<", label)
    assert reader.string() == "GlobalOptions"
    reader.read(4)
    config_address = reader.string()
    assert config_address.casefold() == CONFIG_ADDRESS

    manifests = []
    for folder in (base, cache):
        manifest = folder / "hot_update_list.json"
        document = json.loads(manifest.read_bytes())
        record = next(item for item in document["abInfos"] if item["name"] == BUNDLE)
        manifests.append({"manifest": fingerprint(manifest), "revision": document["versionId"],
                          "record": record, "bundlePresent": (folder / BUNDLE).is_file()})
    for key in ("hash", "md5", "abSize"):
        assert manifests[0]["record"][key] == manifests[1]["record"][key]

    archive = (cache if manifests[1]["bundlePresent"] else base) / BUNDLE
    [(node, payload)], _ = bundle(archive)
    objects = serialized(payload)["objects"]
    container = next(obj for obj in objects if obj["classid"] == 142)
    reader = Reader(payload, "<", container["start"])
    bundle_name = reader.string()
    reader.read(12 * reader.val("i"))
    assets = {}
    for _ in range(reader.val("i")):
        path = reader.string()
        reader.read(8)
        assets[path] = (reader.val("i"), reader.val("q"))
    file_id, path_id = assets[TEXT_ASSET]
    assert file_id == 0
    text = next(obj for obj in objects if obj["classid"] == 49 and obj["id"] == path_id)
    reader = Reader(payload, "<", text["start"])
    assert reader.string() == "config"
    raw = reader.read(reader.val("i"))
    document = json.loads(raw)
    setting = next(((key, value) for key, value in document.items()
                    if key.casefold() == KEY.casefold()), None)
    return {"globalOptions": {"file": fingerprint(options), "offset": hex(label), "address": config_address},
            "manifests": manifests,
            "textAsset": {"bundle": fingerprint(archive), "bundleName": bundle_name,
                          "serializedFile": node, "containerPath": TEXT_ASSET, "pathId": path_id,
                          "sha256": hashlib.sha256(raw).hexdigest(), "jsonMemberCount": len(document),
                          "setting": setting}}


def load_bindings(native):
    _, specs = native.pe.unpack("<2Q", native.registration + 64)
    _, instantiations = native.pe.unpack("<2Q", native.registration + 16)
    slots = (0x188BD4DE8, 0x188BB65C8, 0x188B232E0)
    bindings = []
    for slot in slots:
        raw, = native.pe.unpack("<Q", slot)
        assert raw >> 29 == 6 and raw & 1
        index = (raw & 0x1FFFFFFF) >> 1
        method, class_inst, method_inst = native.pe.unpack("<iii", specs + 12 * index)
        type_inst = class_inst if method_inst == -1 else method_inst
        arguments, = native.pe.unpack("<Q", instantiations + 8 * type_inst)
        count, types = native.pe.unpack("<2Q", arguments)
        assert count == 1
        pointer, = native.pe.unpack("<Q", types)
        bindings.append({"slot": hex(slot), "encoded": hex(raw), "spec": index,
                         "method": native.method(method), "argument": native.type_name(pointer=pointer)})
    return bindings


def ordinary_enemy(game):
    level = "zh_CN/gamedata/levels/obt/main/level_main_00-01.json"
    raw = check_output(["git", "-C", ROOT / "assets/arknights-game-data", "show",
                        f"{GAME_DATA_REVISION}:{level}"])
    actions = json.loads(raw)["waves"][0]["fragments"][5]["actions"]
    action = actions[1]
    assert action["actionType"] == "SPAWN" and action["managedByScheduler"]
    assert action["key"] == "enemy_1002_nsabr" and action["count"] == 1

    base = game / "Arknights_Data/StreamingAssets/AB/Windows"
    prefab = base / "battle/enm_pfb_base_0.ab"
    shared = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    decoder_path = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("scheduler_enemy_decoder", decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    node, payload = next(item for item in bundle(prefab)[0] if item[0] == "CAB-b2b15d37e92fccb550555511a61b9297")
    objects = serialized(payload)["objects"]
    component = next(obj for obj in objects if obj["id"] == 9155688708999578803)
    layouts, external = decoder.trees(payload)
    value = decoder.decode(payload[component["start"]:component["start"] + component["size"]], layouts[component["typeid"]])
    owner_id = value["common:374"]["m_PathID"]
    owner = next(obj for obj in objects if obj["id"] == owner_id)
    reader = Reader(payload, "<", owner["start"])
    reader.read(12 * reader.val("i"))
    reader.val("i")
    assert reader.string() == action["key"]
    pointer = value["common:490"]
    script_path = external[pointer["m_FileID"] - 1]["path"].split("/")[-1]
    _, scripts = next(item for item in bundle(shared)[0] if item[0] == script_path)
    mono = next(obj for obj in serialized(scripts)["objects"] if obj["id"] == pointer["m_PathID"])
    identity = script(mono, scripts)
    assert identity["cl"] == "Enemy" and value["common:349"]
    return {"level": {"revision": GAME_DATA_REVISION, "path": level, "sha256": hashlib.sha256(raw).hexdigest(),
                      "pointer": "/waves/0/fragments/5/actions/1", "action": action},
            "prefab": {"sources": [fingerprint(p) for p in (prefab, shared, decoder_path)],
                       "serializedFile": node, "pathId": component["id"], "script": identity}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    expected = ("cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
                "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5")
    assert tuple(provenance["client"][key]["sha256"] for key in ("dll", "metadata")) == expected
    field = next(entry for entry in native.fields(6607) if entry["name"] == KEY)
    bodies = []
    for index in (44076, 44091, 44093, 77689):
        method = native.method(index)
        body = native.disassemble_at(method["address"], method=method)
        instructions = [{key: ins[key] for key in ("address", "mnemonic", "operands")}
                        for ins in body["instructions"]]
        bodies.append({"method": method, "instructions": instructions})
    final_wait = 0x188B306F8
    raw, = native.pe.unpack("<Q", final_wait)
    assert (raw & 0x1FFFFFFF) >> 1 == 73332
    for index, address, size in ((73393, 0x18098E357, 0x49), (73393, 0x18098E5E1, 0x1E),
                                 (73564, 0x18097C264, 0x3D), (77784, 0x180AC0358, 0x1A),
                                 (77876, 0x180AC9C7E, 0x1A)):
        method = native.method(index)
        body = native.disassemble_at(address, max_bytes=size)
        instructions = [{key: ins[key] for key in ("address", "mnemonic", "operands")}
                        for ins in body["instructions"]]
        bodies.append({"method": method, "instructions": instructions})
    result = {"configuration": configuration(args.game), "loadBindings": load_bindings(native),
              "field": field, "ordinaryEnemy": ordinary_enemy(args.game),
              "finalWaitCallback": {"slot": hex(final_wait), "encoded": hex(raw), "method": native.method(73332)},
              "bodies": bodies}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": {**provenance, "collectedOn": "2026-11-22"},
                                    "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

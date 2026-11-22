# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Select the actual Kalts2 S3 selector and its creation-time inputs."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import bundle, script, serialized

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "special-redeploy-failure-20261122"))
from extract_prefab import CHARACTER, HOLDER, SCRIPTS, read_bindings, read_holder


METHODS = {
    75505: [(0x1809F185D, 0x1809F1899)],
    75974: [(0x180A241DB, 0x180A24218)],
    76060: [(0x180A34338, 0x180A34360), (0x180A3437C, 0x180A3439A)],
    77217: [(0x180AAF942, 0x180AAF954)],
    77293: [(0x180AAAC75, 0x180AAAC83)],
}


def read_native(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    methods = []
    for index, spans in METHODS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= low < high <= end for low, high in spans), index
        instructions = [dict(address=hex(inst.address), bytes=inst.bytes.hex(),
                             mnemonic=inst.mnemonic, operands=inst.op_str)
                        for inst in decoder.disasm(native.pe.read(start, end - start), start)
                        if any(low <= inst.address < high for low, high in spans)]
        assert instructions, index
        methods.append(dict(method=method, selected=[[hex(low), hex(high)] for low, high in spans],
                            instructions=instructions))
    owners = {native.typename(row["index"]): row["index"] for row in native.types
              if row["namespace"] == "Torappu.Battle" or row["name"] == "FilterType"}
    created = next(field for field in native.fields(owners["Torappu.Battle.Character"])
                   if field["name"] == "m_createdTime")
    order = next(field for field in native.fields(owners["Torappu.Battle.FilterUtil/FilterType"])
                 if field["name"] == "CREATED_TIME_DES")
    data_index = next(row["dataIndex"] for row in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")
                      if row["fieldIndex"] == order["index"])
    encoded = native.metadata[native.table(8)[0] + data_index]
    assert encoded == 0x44 and created["offset"] == 0x398
    return dict(fields=[created], filter=dict(field=order, dataIndex=data_index, encoded=hex(encoded), value=34),
                methods=methods)


def read_prefab(assets):
    scripts = {(file, row["id"]): script(row, data) for file, data in bundle(assets / SCRIPTS)[0]
               if not file.endswith((".resS", ".resource")) for row in serialized(data)["objects"]
               if row["classid"] == 115}
    bindings = read_bindings(assets / CHARACTER, "CAB-9f91da3a576bbe3aad2aece933113030", [
        ("EmptyAbility", -6540820176560234913, ("_metadata", "_selector")),
        ("Kalts2S3TransportCharacterSelector", -5841978077489111457, (
            "_targetSide", "_postFilter", "_maxNum", "_maxTargetKey", "_excludeOwner",
            "_checkPlayerSideSameWithOwner", "_onlySelectTargetWithValidCardUid",
        )),
    ], scripts)
    ability = bindings["components"]["EmptyAbility"]["fields"]
    assert ability["_metadata"]["namedAsAlias"] == "S3OperatorSelector"
    assert ability["_selector"]["m_PathID"] == -5841978077489111457
    assert bindings["components"]["Kalts2S3TransportCharacterSelector"]["fields"]["_postFilter"] == 34
    return dict(bindings=bindings, templates=read_holder(assets / HOLDER, {
        "kalts2_s3_trigger_transporting", "kalts2_s_3[on_token_born]",
    }))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    assets = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    provenance = native.provenance()
    assert provenance["client"]["dll"]["sha256"] == "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
    assert provenance["client"]["metadata"]["sha256"] == "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
    provenance.update(collectedOn="2026-11-22", extractionScript=fingerprint(Path(__file__)),
                      bundles={path: fingerprint(assets / path) for path in (CHARACTER, SCRIPTS, HOLDER)},
                      scope="Selected static selector binding and creation-time path.")
    result = dict(provenance=provenance, result=dict(native=read_native(native), prefab=read_prefab(assets)))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

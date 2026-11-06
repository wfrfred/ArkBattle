#!/usr/bin/env python3
"""Re-extract the bounded Card-to-Character entry and Buff publication chain."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import copy
import datetime
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


# Continuations are PE ranges actually followed in this fingerprinted input.
SPECS = [
    (75932, "Torappu.Battle.Character.BuildAt", [0x180a27b7d, 0x180a27c80]),
    (75986, "Torappu.Battle.Character._BuildAtInternal", []),
    (76025, "Torappu.Battle.Character.OnInit", [0x180a2de67]),
    (76026, "Torappu.Battle.Character._SpawnDeckBuffs", [0x180a38364, 0x180a383a0, 0x180a38541]),
    (65857, "Torappu.Battle.Deck/Card.get_deckBuffOnBorn", []),
    (66545, "Torappu.Battle.Entity.AddBuff", []),
    (66544, "Torappu.Battle.Entity.AddBuff", []),
    (65310, "Torappu.Battle.Buff/BuffContainer.NewBuff", [0x180668fad, 0x180669512]),
    (65301, "Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal", []),
    (65099, "Torappu.Battle.Buff.set_isEnabled", []),
    (65267, "Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished", [0x18068dcba, 0x18068df61]),
    (65141, "Torappu.Battle.Buff.OnEnable", []),
    (65143, "Torappu.Battle.Buff.OnStart", []),
    (64273, "Torappu.Battle.Attributes.AddModifier", []),
    (65029, "Torappu.Battle.BObject.Init", []),
    (66506, "Torappu.Battle.Entity.get_initHp", []),
    (66647, "Torappu.Battle.Entity.OnBorn", [0x1806f7e47]),
    (65370, "Torappu.Battle.Buff/BuffContainer.OnOwnerBorn", []),
    (65151, "Torappu.Battle.Buff.OnOwnerBorn", []),
]


def compact(body):
    result = copy.deepcopy(body)
    for instruction in result["instructions"]:
        instruction.pop("methods", None)
    result["omitted"] = "Per-instruction generic call aliases; machine bytes, targets and range metadata retained."
    return result


def collect(native):
    rows = []
    for index, name, continuations in SPECS:
        method = native.method(index)
        if method["fullname"] != name:
            raise ValueError(f"method identity differs at {index}")
        rows.append(dict(
            method=method,
            blocks=[compact(native.disassemble(index))] +
                   [compact(native.disassemble_at(address)) for address in continuations],
        ))
    types = []
    for name, wanted in (
        ("Torappu.Battle.Character", {"m_deckBuffDatas", "m_deckBuffBlackboard"}),
        ("Torappu.Battle.Character/BuildParam", {"deckBuffs", "deckBlackboards"}),
        ("Torappu.Battle.Buff", {"m_isActuallyEnabled", "m_isManuallyEnabled", "m_isFinished"}),
        ("Torappu.Battle.Attributes", None),
    ):
        owner = next(t for t in native.types if native.typename(t["index"]) == name)
        fields = native.fields(owner["index"])
        types.append(dict(index=owner["index"], fullname=name,
                          fields=[f for f in fields if not f["static"] and
                                  (wanted is None or f["name"] in wanted)]))
    return dict(
        scope="Ordinary native entry, Buff installation/enabling and owner-born paths. "
              "This does not identify every content binding or prescribe one common entry callback. "
              "External hotfix/error edges remain explicit; selected .pdata ranges do not exhaust a lifecycle.",
        rows=rows, types=types,
        callTargets=[native.method(index) for index in (
            65925, 76054, 66624, 66657, 66454, 65300,
            66358, 66402, 64283,
        )],
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    expected = json.loads(Path(__file__).with_name("probe.json").read_text())["provenance"]["client"]
    for kind, relative in (
        ("dll", "GameAssembly.dll"),
        ("metadata", "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat"),
    ):
        if fingerprint(args.game / relative)["sha256"] != expected[kind]["sha256"]:
            raise ValueError(f"{kind} fingerprint differs from this investigation")
    native = Native(args.game)
    result = collect(native)
    provenance = native.provenance()
    provenance["collectedOn"] = datetime.date.today().isoformat()
    provenance["extractionScript"] = fingerprint(Path(__file__))
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "generic-entry.json").write_text(json.dumps(
        dict(provenance=provenance, result=result), ensure_ascii=False, indent=2,
    ) + "\n")
    print(f"Wrote {len(result['rows'])} bounded method chains to {args.out}")


if __name__ == "__main__":
    main()

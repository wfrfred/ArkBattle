#!/usr/bin/env python3
"""Re-extract the bounded Card ordering evidence, without resolving live XLua."""
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


def compact(body, spans=None):
    """Keep instruction bytes; omit potentially huge generic call aliases."""
    result = copy.deepcopy(body)
    for instruction in result["instructions"]:
        instruction.pop("methods", None)
    if spans is not None:
        result["selectedInstructions"] = [
            row for row in result.pop("instructions")
            if any(start <= int(row["address"], 16) < end for start, end in spans)
        ]
        result["selection"] = "Address spans within the recorded decoded range; not a complete body."
        result["spans"] = [[hex(start), hex(end)] for start, end in spans]
    result["omitted"] = "Per-instruction generic method alias lists; addresses and machine bytes retained."
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    recorded = json.loads(Path(__file__).with_name("probe.json").read_text())
    for kind, relative in (
        ("dll", "GameAssembly.dll"),
        ("metadata", "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat"),
    ):
        expected = recorded["provenance"]["client"][kind]["sha256"]
        if fingerprint(args.game / relative)["sha256"] != expected:
            raise ValueError(f"{kind} fingerprint differs from the recorded investigation")

    native = Native(args.game)
    provenance = native.provenance()
    provenance["collectedOn"] = datetime.date.today().isoformat()
    provenance["extractionScript"] = fingerprint(Path(__file__))
    args.out.mkdir(parents=True, exist_ok=True)

    def write(name, result):
        (args.out / name).write_text(json.dumps(
            dict(provenance=provenance, result=result), ensure_ascii=False, indent=2,
        ) + "\n")

    def method(index, expected, spans=None):
        body = native.disassemble(index)
        if body["method"]["fullname"] != expected:
            raise ValueError(f"method identity differs at index {index}")
        return compact(body, spans)

    write("runtime-sort.json", [
        method(64737, "Torappu.Battle.BattleController.SortDeckRuntime"),
        method(65790, "Torappu.Battle.Deck.Compare"),
        compact(native.disassemble_at(0x1806c7e32)),
        compact(native.disassemble_at(0x1806c7f1d)),
    ])
    write("callers.json", [
        method(17511, "XLua.CSObjectWrap.TorappuBattleBattleControllerWrap._m_SortDeckRuntime"),
        method(65769, "Torappu.Battle.Deck.OnFixedUpdate", [(0x1806c97da, 0x1806c985e)]),
        method(96495, "Torappu.Battle.Action.Nodes/Svash2LRCardPositionSwap._SwapCardByCount",
               [(0x1810449ad, 0x1810449ec)]),
        method(97114, "Torappu.Battle.Action.Nodes/SortDeck.Execute",
               [(0x181071d30, 0x181071d69)]),
        method(99981, "Torappu.Battle.Action.Nodes/ClearDeckOverrider._ClearRawCostOverriderAndSort",
               [(0x181164023, 0x181164068)]),
    ])
    write("aura.json", [
        method(94222, "Torappu.Battle.Abilities.Svash2DeckAuraBehaviour/DeckBuffCardBuffDeckArua..ctor",
               [(0x180f7cf2e, 0x180f7cf60), (0x180f7d233, 0x180f7d26e)]),
        method(94223, "Torappu.Battle.Abilities.Svash2DeckAuraBehaviour/DeckBuffCardBuffDeckArua.OnEnable"),
        method(94224, "Torappu.Battle.Abilities.Svash2DeckAuraBehaviour/DeckBuffCardBuffDeckArua.OnDisable"),
        method(94226, "Torappu.Battle.Abilities.Svash2DeckAuraBehaviour/DeckBuffCardBuffDeckArua._ApplyByFilter"),
    ])
    write("call-targets.json", [native.method(index) for index in (
        65735, 65745, 65778, 65836, 94226, 65875, 65876, 65886, 65889,
    )])
    write("probe.json", dict(typeCount=len(native.types), methodCount=len(native.methods)))
    print(f"Wrote five bounded evidence records to {args.out}")


if __name__ == "__main__":
    main()

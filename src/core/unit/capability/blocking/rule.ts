import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Blocker } from "./blocker.js";
import type { Blockable } from "./blockable.js";
import { hasAllegiance, type Side } from "../allegiance/capability.js";

export interface Rule {
    readonly id: string;
    readonly allows: (
        battle: BattleState,
        blocker: Unit & Blocker,
        blockable: Unit & Blockable,
    ) => boolean;
}

export function sides(...sides: readonly Side[]): Rule {
    return {
        id: "blocking/sides",
        allows: (_battle, _blocker, blockable) =>
            hasAllegiance(blockable) && sides.includes(blockable.allegiance.side),
    };
}

import * as blocking from "../../../../battle/blocking/operations.js";
import { usedCapacity } from "../../../../battle/blocking/query.js";
import type { State as BattleState } from "../../../../battle/state.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../unit.js";
import type { RemovingHook } from "../../../hook.js";
import * as units from "../../../query.js";
import { resolveCapacity, type Blocker } from "./blocker.js";

export const removing: RemovingHook = {
    id: "@blocker/prepare",
    priority: 0,
    invoke: (battle, { unit }) => ({
        state: releaseAll(battle, units.ref(unit as Unit & Blocker)),
        value: undefined,
    }),
};

export function releaseAll(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const self = reference.get(battle);

    if (self === undefined) {
        return battle;
    }

    return blocking.release(battle, self.blocker.relations);
}

export function settleCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    let current = reference.get(battle);

    while (current !== undefined) {
        if (
            usedCapacity(battle, reference) <=
            resolveCapacity(current.definition.blocker, current.blocker)
        ) {
            return battle;
        }

        const relation = current.blocker.relations.at(-1)!;
        battle = blocking.release(battle, [relation]);
        current = reference.get(battle);
    }

    return battle;
}

import * as blocking from "../../../../battle/blocking/operations.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../unit.js";
import type { RemovingHook } from "../../../hook.js";
import type { Blockable } from "./blockable.js";
import type { State as BattleState } from "../../../../battle/state.js";
import { replace } from "../../../operations.js";
import { TICKS_PER_SECOND } from "../../../../tick.js";
import * as units from "../../../query.js";
import type { WorldPosition } from "../../../../geometry/coordinate.js";
import { Vec2 } from "../../../../common/vector.js";
import { replaceIn } from "../../../../common/object.js";

const BLOCK_OFFSET_TICKS = 0.2 * TICKS_PER_SECOND;

export const removing: RemovingHook = {
    id: "@blockable/prepare",
    priority: 0,
    invoke: (battle, { unit }) => ({
        state: release(battle, units.ref(unit as Unit & Blockable)),
        value: undefined,
    }),
};

export function release(battle: BattleState, reference: Ref<Unit & Blockable>): BattleState {
    const self = reference.get(battle);
    if (self === undefined) {
        return battle;
    }

    if (self.blockable.offset !== null) {
        battle = replace(battle, [replaceIn(self, ["blockable", "offset"], null)]);
    }

    const relation = self.blockable.relation;

    return relation === null ? battle : blocking.release(battle, [relation]);
}

export function advanceOffset(battle: BattleState, reference: Ref<Unit & Blockable>): BattleState {
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const offset = self.blockable.offset;
    if (offset === null) {
        return battle;
    }

    const progress = Math.min(1, (battle.tick - offset.startTick) / BLOCK_OFFSET_TICKS);
    let position: WorldPosition =
        progress === 1 ? offset.to : Vec2.lerp(offset.from, offset.to, progress);
    if (Vec2.equal(position, self.position)) {
        position = self.position;
    }

    const nextOffset = progress === 1 ? null : offset;
    if (position === self.position && nextOffset === offset) {
        return battle;
    }

    return replace(battle, [
        {
            ...self,
            position,
            blockable:
                nextOffset === offset ? self.blockable : { ...self.blockable, offset: nextOffset },
        },
    ]);
}

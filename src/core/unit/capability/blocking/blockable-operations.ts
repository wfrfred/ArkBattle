import * as blocking from "../../../battle/blocking/operations.js";
import { relations } from "../../../battle/blocking/query.js";
import * as entries from "../../../common/collection/entries.js";
import type * as contribution from "../../../common/contribution.js";
import { createChange, type Change } from "../../change.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { RemovingHook } from "../../hook.js";
import type { Restriction } from "./restriction.js";
import { assertSafeInteger } from "../../../common/assert.js";
import type { Blockable } from "./blockable.js";
import type { State as BattleState } from "../../../battle/state.js";
import { replace } from "../../operations.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import * as units from "../../query.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import { Vec2 } from "../../../common/vector.js";
import { settleCapacity } from "./blocker-operations.js";
import { replaceIn } from "../../../common/object.js";

const BLOCK_OFFSET_TICKS = 0.2 * TICKS_PER_SECOND;

export const removing: RemovingHook = {
    id: "@blockable/prepare",
    priority: 0,
    invoke: (battle, { unit }) => ({
        state: release(battle, units.ref(unit as Unit & Blockable)),
        value: undefined,
    }),
};

function settleRestrictions(battle: BattleState, reference: Ref<Unit & Blockable>): BattleState {
    for (const relation of relations(battle, reference)) {
        battle = blocking.maintain(battle, relation);
    }

    return battle;
}

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

export function setRestriction(
    entry: contribution.Contribution<Restriction>,
): Change<Unit & Blockable> {
    return createChange<Unit & Blockable>(
        (self) => {
            const restrictions = entries.set(self.blockable.restrictions, entry);

            return restrictions === self.blockable.restrictions
                ? self
                : { ...self, blockable: { ...self.blockable, restrictions } };
        },
        (battle, previous) => settleRestrictions(battle, units.ref(previous)),
    );
}

export function removeRestriction(id: string): Change<Unit & Blockable> {
    return createChange<Unit & Blockable>(
        (self) => {
            const restrictions = entries.remove(self.blockable.restrictions, id);

            return restrictions === self.blockable.restrictions
                ? self
                : { ...self, blockable: { ...self.blockable, restrictions } };
        },
        (battle, previous) => settleRestrictions(battle, units.ref(previous)),
    );
}

export function setVolumeContribution(
    entry: contribution.Contribution<number>,
): Change<Unit & Blockable> {
    assertSafeInteger(entry.value, "blocking volume addition");

    return createChange<Unit & Blockable>(
        (self) => {
            const volume = entries.set(self.blockable.volume, entry);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle, previous) => {
            const owner = units.ref(previous).get(battle)?.blockable.relation?.blocker;

            return owner == null ? battle : settleCapacity(battle, owner);
        },
    );
}

export function removeVolumeContribution(id: string): Change<Unit & Blockable> {
    return createChange<Unit & Blockable>(
        (self) => {
            const volume = entries.remove(self.blockable.volume, id);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle, previous) => {
            const owner = units.ref(previous).get(battle)?.blockable.relation?.blocker;

            return owner == null ? battle : settleCapacity(battle, owner);
        },
    );
}

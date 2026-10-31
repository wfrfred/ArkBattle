import * as blocking from "../../../battle/blocking/operations.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import { createChange, type Change } from "../../change.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Hook, Key } from "./contract.js";
import type { Rule } from "./rule.js";
import { assertSafeInteger } from "../../../common/assert.js";
import type { Blockable } from "./blockable.js";
import type { State as BattleState } from "../../../battle/state.js";
import { replace } from "../../../battle/unit.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import * as units from "../../query.js";
import { isSpatiallyPresent } from "../presence/capability.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import { Vec2 } from "../../../common/vector.js";

const POSITION_ADJUSTMENT_TICKS = 0.2 * TICKS_PER_SECOND;

export function release(battle: BattleState, reference: Ref<Unit & Blockable>): BattleState {
    let self = units.get(battle, reference);
    if (self === undefined) {
        return battle;
    }

    if (self.blockable.adjustment !== null) {
        self = { ...self, blockable: { ...self.blockable, adjustment: null } };
    }

    const owner = self.blockable.blocker;
    if (owner === null) {
        return replace(battle, [self]);
    }

    const blocker = units.get(battle, owner)!;
    const blocked = blocker.blocker.blocked.find((blocked) => blocked.id === self.id)!;

    return blocking.releaseAll(battle, [{ blocker: owner, blocked }], [self]);
}

export function advancePosition(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
): BattleState {
    const self = units.get(battle, reference);
    if (self?.lifecycle !== "PRESENT" || !isSpatiallyPresent(self)) {
        return battle;
    }

    const adjustment = self.blockable.adjustment;
    if (adjustment === null) {
        return battle;
    }

    const progress = Math.min(1, (battle.tick - adjustment.startTick) / POSITION_ADJUSTMENT_TICKS);
    let position: WorldPosition =
        progress === 1 ? adjustment.to : Vec2.lerp(adjustment.from, adjustment.to, progress);
    if (Vec2.equal(position, self.position)) {
        position = self.position;
    }

    const nextAdjustment = progress === 1 ? null : adjustment;
    if (position === self.position && nextAdjustment === adjustment) {
        return battle;
    }

    battle = replace(battle, [
        {
            ...self,
            position,
            blockable:
                nextAdjustment === adjustment
                    ? self.blockable
                    : { ...self.blockable, adjustment: nextAdjustment },
        },
    ]);

    return position === self.position ? battle : blocking.maintainRelations(battle, reference);
}

export function setRule(reference: Ref<Unit & Blockable>, rule: Rule): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.set(self.blockable.rules, rule);

            return rules === self.blockable.rules
                ? self
                : { ...self, blockable: { ...self.blockable, rules } };
        },
        (battle) => blocking.maintainBlockableRule(battle, reference),
    );
}

export function removeRule(reference: Ref<Unit & Blockable>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.remove(self.blockable.rules, id);

            return rules === self.blockable.rules
                ? self
                : { ...self, blockable: { ...self.blockable, rules } };
        },
        (battle) => blocking.maintainBlockableRule(battle, reference),
    );
}

export function setVolumeContribution(
    reference: Ref<Unit & Blockable>,
    entry: contribution.Contribution<number>,
): Change {
    assertSafeInteger(entry.value, "blocking volume addition");

    return createChange(
        reference,
        (self) => {
            const volume = contribution.set(self.blockable.volume, entry);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle) => blocking.maintainBlockable(battle, reference),
    );
}

export function removeVolumeContribution(reference: Ref<Unit & Blockable>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const volume = contribution.remove(self.blockable.volume, id);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle) => blocking.maintainBlockable(battle, reference),
    );
}

export function setHook(
    reference: Ref<Unit & Blockable>,
    key: Key,
    hook: Hook<Unit & Blockable>,
): Change {
    return createChange(reference, (self) => {
        const entries = registry.set(self.blockable[key], hook);

        return entries === self.blockable[key]
            ? self
            : { ...self, blockable: { ...self.blockable, [key]: entries } };
    });
}

export function removeHook(reference: Ref<Unit & Blockable>, key: Key, id: string): Change {
    return createChange(reference, (self) => {
        const entries = registry.remove(self.blockable[key], id);

        return entries === self.blockable[key]
            ? self
            : { ...self, blockable: { ...self.blockable, [key]: entries } };
    });
}

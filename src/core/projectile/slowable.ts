import type { State as BattleState } from "../battle/state.js";
import { assertNonnegativeNumber } from "../common/assert.js";
import * as entries from "../common/collection/entries.js";
import * as contribution from "../common/contribution.js";
import type { Ref } from "../common/ref.js";
import { replace } from "./operations.js";
import type { Projectile } from "./projectile.js";

export interface Slowable {
    readonly move: {
        readonly contributions: readonly contribution.Contribution<number>[];
    };
}

export function hasSlowable<P extends Projectile>(self: P): self is P & Slowable {
    return "move" in self;
}

export function resolve(self: Slowable): number {
    return contribution.resolve(self.move.contributions).reduce((scale, value) => scale * value, 1);
}

export function setContribution(
    battle: BattleState,
    reference: Ref<Projectile & Slowable>,
    entry: contribution.Contribution<number>,
): BattleState {
    assertNonnegativeNumber(entry.value, "projectile movement scale");

    return updateContributions(battle, reference, (current) => entries.set(current, entry));
}

export function removeContribution(
    battle: BattleState,
    reference: Ref<Projectile & Slowable>,
    id: string,
): BattleState {
    return updateContributions(battle, reference, (current) => entries.remove(current, id));
}

function updateContributions(
    battle: BattleState,
    reference: Ref<Projectile & Slowable>,
    update: (current: Slowable["move"]["contributions"]) => Slowable["move"]["contributions"],
): BattleState {
    const self = reference.get(battle);
    if (self === undefined) {
        throw new RangeError("unknown projectile");
    }

    const contributions = update(self.move.contributions);

    return contributions === self.move.contributions
        ? battle
        : replace(battle, reference, { ...self, move: { ...self.move, contributions } });
}

import type { State as BattleState } from "../battle/state.js";
import { assertNonnegativeNumber } from "../common/assert.js";
import * as entries from "../common/collection/entries.js";
import * as contribution from "../common/contribution.js";
import type { Ref } from "../common/ref.js";
import { replace } from "./operations.js";
import type { ProjectileFields } from "./projectile.js";
import { get } from "./query.js";

export interface Slowable {
    readonly move: {
        readonly contributions: readonly contribution.Contribution<number>[];
    };
}

export function hasSlowable<P extends ProjectileFields<any, any>>(self: P): self is P & Slowable {
    return self.move !== undefined;
}

export function resolve(self: Slowable): number {
    return contribution.resolve(self.move.contributions).reduce((scale, value) => scale * value, 1);
}

export function setContribution<P extends ProjectileFields<any, any> & Slowable>(
    battle: BattleState,
    reference: Ref<P>,
    entry: contribution.Contribution<number>,
): BattleState {
    assertNonnegativeNumber(entry.value, "projectile movement scale");

    return updateContributions(battle, reference, (current) => entries.set(current, entry));
}

export function removeContribution<P extends ProjectileFields<any, any> & Slowable>(
    battle: BattleState,
    reference: Ref<P>,
    id: string,
): BattleState {
    return updateContributions(battle, reference, (current) => entries.remove(current, id));
}

function updateContributions<P extends ProjectileFields<any, any> & Slowable>(
    battle: BattleState,
    reference: Ref<P>,
    update: (current: Slowable["move"]["contributions"]) => Slowable["move"]["contributions"],
): BattleState {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown projectile: ${reference.id}`);
    }

    const contributions = update(self.move.contributions);

    return contributions === self.move.contributions
        ? battle
        : replace(battle, reference, { ...self, move: { ...self.move, contributions } });
}

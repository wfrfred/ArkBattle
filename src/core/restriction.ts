import type { State as BattleState } from "./battle/state.js";
import { resolve, type Contribution } from "./common/contribution.js";

export interface Restriction<C> {
    readonly allows: (battle: BattleState, context: C) => boolean;
}

export function allows<C>(
    battle: BattleState,
    context: C,
    entries: readonly Contribution<Restriction<C>>[],
    ignore?: (restriction: Restriction<C>) => boolean,
): boolean {
    return resolve(entries).every(
        (restriction) => (ignore?.(restriction) ?? false) || restriction.allows(battle, context),
    );
}

import * as restriction from "../../../../restriction.js";
import type { State as BattleState } from "../../../state.js";
import { get } from "../deck.js";
import type { Ref } from "../../../../common/ref.js";
import type { Card } from "./card.js";
import type { RestrictionContext } from "./restriction.js";

export function allows<T extends Card>(
    battle: BattleState,
    context: Exclude<RestrictionContext<T>, { readonly purpose: "DEPLOY" }>,
): boolean {
    const self = get(battle, context.ref);

    return self !== undefined && restriction.allows(battle, context, self.restrictions);
}

export function requireCard<T extends Card>(battle: BattleState, reference: Ref<T>): T {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown deployment card ${reference.id}`);
    }

    return self;
}

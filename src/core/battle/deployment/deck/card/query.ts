import * as restriction from "../../../../restriction.js";
import type { State as BattleState } from "../../../state.js";
import { get } from "../deck.js";
import type { Card } from "./card.js";
import type { RestrictionContext } from "./restriction.js";

export function allows<T extends Card<any>>(
    battle: BattleState,
    context: Exclude<RestrictionContext<T>, { readonly purpose: "DEPLOY" }>,
): boolean {
    const self: Card | undefined = get(battle, context.ref);

    return self !== undefined && restriction.allows(battle, context, self.restrictions);
}

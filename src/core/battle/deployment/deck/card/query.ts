import * as restriction from "../../../../restriction.js";
import type { State as BattleState } from "../../../state.js";
import type { Card } from "./card.js";
import type { RestrictionContext } from "./restriction.js";

export function allows<T extends Card<any>>(
    battle: BattleState,
    context: Exclude<RestrictionContext<T>, { readonly purpose: "DEPLOY" }>,
): boolean {
    const self: Card | undefined = context.ref.get(battle);

    return self !== undefined && restriction.allows(battle, context, self.restrictions);
}

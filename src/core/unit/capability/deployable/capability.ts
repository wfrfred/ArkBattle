import type * as contribution from "../../../common/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { Card } from "../../../battle/deployment/deck/card/card.js";
import { validateRestrictions, type Restriction as BaseRestriction } from "../../../restriction.js";
import { hasOccupancy, type Occupancy } from "../occupancy/capability.js";
import { Hooks } from "../../../hook.js";
import { removed } from "../../hook.js";
import { depart } from "../../../battle/deployment/deck/card/operations.js";
import { release } from "../../../battle/deployment/slot/operations.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { ref } from "../../query.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Definition extends Restrictions {
    readonly refund: {
        readonly rate: number;
        readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
    } | null;
}

export interface Restrictions {
    readonly retreatRestrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly slots: number;
    readonly refund: {
        readonly rate: number;
        readonly limit: number;
    } | null;
}

export interface RestrictionContext {
    readonly self: Unit & Deployable;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Deployable = Occupancy & {
    readonly definition: { readonly deployable: Definition };
    readonly deployable: State;
};

export function initialize<
    U extends Unit & Occupancy & { readonly definition: { readonly deployable: Definition } },
>(battle: BattleState, unit: U): Result<U & Deployable> {
    if (!hasOccupancy(unit)) {
        throw new TypeError("deployable requires occupancy");
    }

    const { refund, retreatRestrictions } = unit.definition.deployable;
    validateRestrictions(retreatRestrictions);

    if (refund !== null) {
        assertNonnegativeNumber(refund.rate, "withdrawal refund rate");
    }

    return {
        state: battle,
        value: {
            ...unit,
            hooks: Hooks.empty()
                .set(removed, {
                    id: "@deployable/settle-departure",
                    priority: 0,
                    invoke: (current, departure) => {
                        const unit = departure.unit as Unit & Deployable;
                        const { card, slots } = unit.deployable;
                        const { reason } = departure;
                        current =
                            reason === "DEATH"
                                ? release(current, slots, TICKS_PER_SECOND)
                                : release(current, slots);

                        if (card !== null) {
                            current = depart(current, card, ref(unit), reason);
                        }

                        return { state: current, value: undefined };
                    },
                })
                .merge(unit.hooks),
            deployable: {
                card: null,
                cost: 0,
                slots: 0,
                refund: null,
                retreatRestrictions,
            },
        },
    };
}

export function hasDeployable<U extends Unit>(unit: U): unit is U & Deployable {
    return "deployable" in unit && "deployable" in unit.definition;
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Deployable,
    "deployable",
    keyof Restrictions
>("deployable", "retreatRestrictions");

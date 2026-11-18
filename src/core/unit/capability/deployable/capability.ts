import type * as contribution from "../../../common/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Card } from "../../../battle/deployment/card/card.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import { hasOccupancy, type Occupancy } from "../occupancy/capability.js";
import { Hooks } from "../../../hook.js";
import { leave } from "../../hook.js";
import { releaseSlots } from "../../../battle/deployment/resources.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Refund {
    readonly rate: number;
    readonly limit: number;
}

export interface Definition extends Restrictions {}

export interface Restrictions {
    readonly retreatRestrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly slots: number;
    readonly refund: Refund | null;
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

    return {
        state: battle,
        value: {
            ...unit,
            hooks: Hooks.empty()
                .set(leave, {
                    id: "@deployable/release-slots",
                    invoke: (current, departure) => {
                        const { slots } = (departure.unit as Unit & Deployable).deployable;

                        return { state: releaseSlots(current, slots), value: undefined };
                    },
                })
                .merge(unit.hooks),
            deployable: {
                card: null,
                cost: 0,
                slots: 0,
                refund: null,
                retreatRestrictions: unit.definition.deployable.retreatRestrictions,
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

import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Card } from "../../../battle/deployment/card/card.js";
import type { Rule as BaseRule } from "../../../rule.js";
import { hasOccupancy, type Occupancy } from "../occupancy/capability.js";

export interface Refund {
    readonly rate: number;
    readonly limit: number;
}

export interface Definition {
    readonly retreatRules: readonly Rule[];
}

export interface State {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly slots: number;
    readonly refund: Refund | null;
    readonly retreatRules: readonly Rule[];
}

export interface RuleContext {
    readonly ref: Ref<Unit & Deployable>;
}

export type Rule = BaseRule<RuleContext>;

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
            hooks: [
                {
                    id: "@deployable/release-slots",
                    stage: "leave",
                    invoke: (current, departure) => {
                        const { slots } = (departure.unit as Unit & Deployable).deployable;
                        if (slots !== 0) {
                            current = {
                                ...current,
                                deployment: {
                                    ...current.deployment,
                                    usedSlots: current.deployment.usedSlots - slots,
                                },
                            };
                        }

                        return { state: current, value: undefined };
                    },
                },
                ...unit.hooks,
            ],
            deployable: {
                card: null,
                cost: 0,
                slots: 0,
                refund: null,
                retreatRules: unit.definition.deployable.retreatRules,
            },
        },
    };
}

export function hasDeployable<U extends Unit>(unit: U): unit is U & Deployable {
    return "deployable" in unit && "deployable" in unit.definition;
}

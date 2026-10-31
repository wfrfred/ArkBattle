import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Placement, SiteCondition } from "../../../battlefield/map/tile.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type { DeployedHook } from "./hook.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { prepare, leave } from "../../../battle/deployment/lifecycle.js";
import type { Ref } from "../../../common/ref.js";
import type { Card, Program } from "../../../battle/deployment/card/card.js";

export interface Definition<S extends object = object> {
    readonly cost: number;
    readonly redeployTicks: number;
    readonly slots: number;
    readonly placement: Exclude<Placement, "NONE">;
    readonly allowedSiteConditions: readonly SiteCondition[];
    readonly refund: {
        readonly rate: number;
        readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
    };
    readonly card?: Program<S>;
}

export interface State {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly refundLimit: number;
    readonly refundAllowed: boolean;
    readonly deployedHooks: readonly DeployedHook[];
}

export interface Deployable {
    // Narrow deployment fields without erasing a known Card program's private type.
    readonly definition: { readonly deployable: Omit<Definition, "card"> };
    readonly deployable: State;
}

export function initialize<
    U extends Unit & { readonly definition: { readonly deployable: Definition<any> } },
>(battle: BattleState, unit: U): Result<U & Deployable> {
    const definition = unit.definition.deployable;

    return {
        state: battle,
        value: {
            ...unit,
            hooks: [...unit.hooks, prepare, leave],
            deployable: {
                card: null,
                cost: definition.cost,
                refundLimit: definition.cost,
                refundAllowed: false,
                deployedHooks: [],
            },
        },
    };
}

export function resolveRefund(definition: Pick<Definition, "refund">, state: State): number {
    return state.refundAllowed
        ? Math.max(0, Math.floor(Math.min(state.cost * definition.refund.rate, state.refundLimit)))
        : 0;
}

export function hasDeployable<U extends Unit>(unit: U): unit is U & Deployable {
    return "deployable" in unit && "deployable" in unit.definition;
}

export function hasDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Deployable["definition"] {
    return "deployable" in definition;
}

type Input<S extends object = object> = Omit<Definition<S>, "refund"> & {
    readonly refund?: Definition["refund"];
};

export function createDefinition<S extends object>(
    definition: Input<S> & { readonly card: Program<S> },
): Definition<S> & { readonly card: Program<S> };
export function createDefinition(definition: Input): Definition;
export function createDefinition(
    definition: Omit<Definition<any>, "refund"> & {
        readonly refund?: Definition["refund"];
    },
): Definition<any> {
    const refund = definition.refund ?? { rate: 0.5, limit: "BASE_COST" };
    assertNonnegativeNumber(definition.cost, "deployment cost");
    assertNonnegativeSafeInteger(definition.redeployTicks, "redeployment duration");
    assertNonnegativeSafeInteger(definition.slots, "deployment slot usage");
    assertNonnegativeNumber(refund.rate, "retreat refund rate");

    return {
        cost: definition.cost,
        redeployTicks: definition.redeployTicks,
        slots: definition.slots,
        placement: definition.placement,
        allowedSiteConditions: definition.allowedSiteConditions,
        refund,
        ...(definition.card === undefined ? {} : { card: definition.card }),
    };
}

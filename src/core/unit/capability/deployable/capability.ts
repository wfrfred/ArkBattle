import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Placement, SiteCondition } from "../../../battlefield/map/tile.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type { DeployedHook } from "./hook.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { prepare } from "../../../battle/deployment/lifecycle.js";
import type { Refund } from "../../../battle/deployment/program.js";
import type { Ref } from "../../../common/ref.js";
import type { Card } from "../../../battle/deployment/card/card.js";
import type { Definition as CardDefinition } from "../../../battle/deployment/card/definition.js";

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
    readonly card: CardDefinition<S>;
}

export interface State {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly slots: number;
    readonly refund: Refund | null;
    readonly retreatAllowed: boolean;
    readonly retreatRules: readonly Rule[];
    readonly deployedHooks: readonly DeployedHook[];
}

export interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, reference: Ref<Unit & Deployable>) => boolean;
}

export interface Deployable {
    // Narrow deployment fields without erasing a known Card definition's private type.
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
            hooks: [...unit.hooks, prepare],
            deployable: {
                card: null,
                cost: definition.cost,
                slots: definition.slots,
                refund: null,
                retreatAllowed: true,
                retreatRules: [],
                deployedHooks: [],
            },
        },
    };
}

export function resolveRefund(state: State): number {
    return state.refund !== null
        ? Math.max(0, Math.floor(Math.min(state.cost * state.refund.rate, state.refund.limit)))
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

export function createDefinition<S extends object>(definition: Input<S>): Definition<S>;
export function createDefinition(
    definition: Omit<Input, "card"> & { readonly card: Partial<CardDefinition> },
): Definition;
export function createDefinition(
    definition: Omit<Definition<any>, "refund" | "card"> & {
        readonly refund?: Definition["refund"];
        readonly card: Partial<CardDefinition<any>>;
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
        card: {
            ...definition.card,
            initialize: definition.card.initialize ?? ((battle) => ({ state: battle, value: {} })),
        },
    };
}

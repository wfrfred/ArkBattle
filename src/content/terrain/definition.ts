import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../core/common/assert.js";
import type { Definition } from "../../core/battlefield/map/terrain.js";

export interface EmptyParams {}

export interface InfectionParams {
    readonly damage: number;
    readonly attackBonusRatio: number;
    readonly attackSpeedBonus: number;
    readonly durationTicks: number;
}

export interface MireParams {
    readonly stackIntervalTicks: number;
    readonly massThreshold: number;
    readonly attackSpeedPerStack: number;
    readonly moveSpeedRatioPerStack: number;
    readonly maxStacks: number;
}

export interface DeepseaParams {
    readonly damage: number;
    readonly attackSpeedModifier: number;
    readonly moveSpeedMultiplier: number;
}

function define<P extends object>(name: string, validate: (params: P) => void): Definition<P> {
    const definition: Definition<P> = {
        id: Symbol(name),
        create(params) {
            validate(params);

            return { definition, params };
        },
    };

    return definition;
}

export const normal = define<EmptyParams>("normal", () => undefined);

export const hole = define<EmptyParams>("hole", () => undefined);

export const smog = define<EmptyParams>("smog", () => undefined);

export const infection = define<InfectionParams>("infection", (params) => {
    assertNonnegativeNumber(params.damage, "infection damage");
    assertFiniteNumber(params.attackBonusRatio, "infection attack bonus");
    assertFiniteNumber(params.attackSpeedBonus, "infection attack speed bonus");
    assertNonnegativeSafeInteger(params.durationTicks, "infection duration");
});

export const mire = define<MireParams>("mire", (params) => {
    assertPositiveSafeInteger(params.stackIntervalTicks, "mire stack interval");
    assertNonnegativeNumber(params.massThreshold, "mire mass threshold");
    assertFiniteNumber(params.attackSpeedPerStack, "mire attack speed per stack");
    assertFiniteNumber(params.moveSpeedRatioPerStack, "mire movement speed per stack");
    assertPositiveSafeInteger(params.maxStacks, "mire maximum stacks");
});

export const deepsea = define<DeepseaParams>("deepsea", (params) => {
    assertNonnegativeNumber(params.damage, "deepsea damage");
    assertFiniteNumber(params.attackSpeedModifier, "deepsea attack speed modifier");
    assertNonnegativeNumber(params.moveSpeedMultiplier, "deepsea movement multiplier");
});

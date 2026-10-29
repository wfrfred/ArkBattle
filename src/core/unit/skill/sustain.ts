import type * as contribution from "../contribution/contribution.js";
import type * as attribute from "../contribution/attribute.js";
import type { Unit } from "../unit.js";
import type { Skill } from "../capability/skill/capability.js";
import type { Input as AmmoInput } from "./ammo.js";

export type Input = contribution.Input<attribute.Modifier, Unit & Skill>;

export type Definition =
    | { readonly type: "TIME"; readonly durationTicks: number }
    | { readonly type: "AMMO"; readonly amount: number }
    | { readonly type: "INFINITE" };

export interface Ammo {
    readonly type: "AMMO";
    readonly initial: number;
    readonly remaining: number;
    readonly replenished: number;
}

export type State =
    { readonly type: "TIME"; readonly endsAtTick: number } | Ammo | { readonly type: "INFINITE" };

export type Contributions =
    | { readonly type: "TIME"; readonly duration: readonly contribution.Contribution<Input>[] }
    | { readonly type: "AMMO"; readonly ammo: readonly contribution.Contribution<AmmoInput>[] }
    | { readonly type: "INFINITE" };

export function initialize(definition: Definition): Contributions {
    switch (definition.type) {
        case "TIME":
            return { type: "TIME", duration: [] };

        case "AMMO":
            return { type: "AMMO", ammo: [] };

        case "INFINITE":
            return { type: "INFINITE" };
    }
}

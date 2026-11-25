import type { WorldPosition } from "../geometry/coordinate.js";
import type { Effects } from "./effect/effects.js";
import type { Ref } from "../common/ref.js";
import type { Config, Lifetime } from "../lifetime/index.js";
import type { Hooks } from "../hook.js";

export type Id = number;

export type DefinitionId = string;

export type Lifecycle = "ACTIVE" | "ENDING";

export type End =
    | { readonly reason: "DEATH"; readonly killer: Ref<Unit> | null }
    | { readonly reason: "RETREAT" | "EXPIRED" | "SCRIPT" | "REDEPLOY_SELF" | "REDEPLOY_EXTERNAL" };

export type EndReason = End["reason"];

export interface Definition {
    readonly id: DefinitionId;
    readonly hooks: Hooks;
}

export type Departure = End & {
    readonly unit: Unit;
};

export interface Unit extends Lifetime<{ readonly id: Id }> {
    readonly id: Id;
    readonly config: Config<Unit, End>;
    readonly lifecycle: Lifecycle;
    readonly definition: Definition;
    readonly hooks: Hooks;
    readonly position: WorldPosition;
    readonly effects: Effects;
}

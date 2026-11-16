import type { WorldPosition } from "../geometry/coordinate.js";
import type { Effects } from "./effect/effects.js";
import type { Identified, Ref } from "../common/ref.js";
import type { Hooks } from "../hook.js";

export type Id = number;

export type DefinitionId = string;

export type Lifecycle = "PRESENT" | "LEAVING";

export type LeaveReason = "DEATH" | "RETREAT" | "EXPIRED" | "SCRIPT";

export type End =
    | { readonly reason: "DEATH"; readonly killer: Ref<Unit> | null }
    | { readonly reason: Exclude<LeaveReason, "DEATH"> };

export interface Definition {
    readonly id: DefinitionId;
    readonly hooks: Hooks;
}

export type Departure = End & {
    readonly unit: Unit;
};

export interface Unit extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly lifecycle: Lifecycle;
    readonly definition: Definition;
    readonly hooks: Hooks;
    readonly position: WorldPosition;
    readonly effects: Effects;
}

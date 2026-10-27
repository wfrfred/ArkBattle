import type { WorldPosition } from "../geometry/coordinate.js";
import type { Effects } from "./effect/effects.js";
import type { Identified } from "../common/ref.js";
import type { Hook } from "./hook.js";

export type Id = number;

export type DefinitionId = string;

export type Lifecycle = "PRESENT" | "LEAVING";

export type LeaveReason = "DEATH" | "RETREAT" | "EXPIRED" | "SCRIPT";

export interface Definition {
    readonly id: DefinitionId;
    readonly hooks: readonly Hook[];
}

export interface Departure {
    readonly unit: Unit;
    readonly reason: LeaveReason;
}

export interface Unit extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly lifecycle: Lifecycle;
    readonly definition: Definition;
    readonly position: WorldPosition;
    readonly effects: Effects;
}

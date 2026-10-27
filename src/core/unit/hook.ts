import type { Hook as TacticalHook } from "../hook.js";
import type { Departure, Unit } from "./unit.js";

export interface EnterHook extends TacticalHook<Unit, void> {
    readonly stage: "enter";
}

export interface TickHook extends TacticalHook<Unit, void> {
    readonly stage: "tick";
}

export interface LeaveHook extends TacticalHook<Departure, void> {
    readonly stage: "leave";
}

export type Hook = EnterHook | TickHook | LeaveHook;

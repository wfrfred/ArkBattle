import type { Unit } from "../../unit.js";
import * as attribute from "../../attribute.js";
import type { Definition } from "../../action/definition.js";
import type { Action as ActionCapability } from "./capability.js";

export function resolveSpeed(source: Unit & ActionCapability): number {
    return attribute.resolve(source.definition.action.speed, source.action.speed);
}

export function resolveBaseInterval(source: Unit & ActionCapability): number {
    return attribute.resolve(source.definition.action.interval, source.action.interval);
}

export function resolveAttackPeriod(source: Unit & ActionCapability): number {
    return period(resolveBaseInterval(source), resolveSpeed(source));
}

export function resolvePeriod(
    source: Unit & ActionCapability,
    definition: Pick<Definition, "period">,
): number {
    return definition.period.type === "FIXED"
        ? definition.period.ticks
        : resolveAttackPeriod(source);
}

export function period(intervalTicks: number, speed: number): number {
    const periodTicks = intervalTicks * (100 / Math.min(600, Math.max(10, speed)));

    return Math.max(1, periodTicks);
}

import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Action } from "../../action/action.js";
import type { Action as ActionCapability } from "./capability.js";

export function resolveSpeed<P extends object, E extends object>(
    battle: BattleState,
    source: Unit & ActionCapability,
    self: Action<P, E>,
): number {
    return Math.max(
        20,
        attribute.apply(
            self.definition.speed,
            contribution
                .resolve(source.action.speed)
                .flatMap((input) => (typeof input === "function" ? input(battle, source) : input)),
        ),
    );
}

export function resolveBaseInterval<P extends object, E extends object>(
    battle: BattleState,
    source: Unit & ActionCapability,
    self: Action<P, E>,
): number {
    return Math.max(
        0,
        attribute.apply(
            self.definition.intervalTicks,
            contribution
                .resolve(source.action.interval)
                .flatMap((input) => (typeof input === "function" ? input(battle, source) : input)),
        ),
    );
}

export function resolvePeriod<P extends object, E extends object>(
    battle: BattleState,
    source: Unit & ActionCapability,
    self: Action<P, E>,
): number {
    return period(resolveBaseInterval(battle, source, self), resolveSpeed(battle, source, self));
}

export function period(intervalTicks: number, speed: number): number {
    const periodTicks = intervalTicks * (100 / Math.min(600, Math.max(20, speed)));

    return Math.max(1, periodTicks);
}

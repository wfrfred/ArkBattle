import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Definition } from "../../action/definition.js";
import type { Action } from "./capability.js";

type Timing = Pick<Definition, "intervalTicks" | "speed">;

export function resolveSpeed(battle: BattleState, self: Unit & Action, definition: Timing): number {
    return Math.max(
        20,
        attribute.apply(
            definition.speed,
            contribution
                .resolve(self.action.speed)
                .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
        ),
    );
}

export function resolveBaseInterval(
    battle: BattleState,
    self: Unit & Action,
    definition: Timing,
): number {
    return Math.max(
        0,
        attribute.apply(
            definition.intervalTicks,
            contribution
                .resolve(self.action.interval)
                .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
        ),
    );
}

export function resolvePeriod(
    battle: BattleState,
    self: Unit & Action,
    definition: Timing,
): number {
    return period(
        resolveBaseInterval(battle, self, definition),
        resolveSpeed(battle, self, definition),
    );
}

export function period(intervalTicks: number, speed: number): number {
    const periodTicks = intervalTicks * (100 / Math.min(600, Math.max(20, speed)));

    return Math.max(1, periodTicks);
}

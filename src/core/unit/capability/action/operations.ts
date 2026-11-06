import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { createChange, type Change } from "../../change.js";
import * as contribution from "../../contribution/contribution.js";
import { refreshCooldowns } from "../../action/operations.js";
import type { Action, Input, State } from "./capability.js";

export function setIntervalContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setContributions(self, "interval", contribution.set(self.action.interval, entry)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function removeIntervalContribution(id: string): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setContributions(self, "interval", contribution.remove(self.action.interval, id)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function setSpeedContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setContributions(self, "speed", contribution.set(self.action.speed, entry)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function removeSpeedContribution(id: string): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setContributions(self, "speed", contribution.remove(self.action.speed, id)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

function setContributions<U extends Unit & Action>(
    self: U,
    key: "interval" | "speed",
    entries: State["interval"],
): U {
    return entries === self.action[key]
        ? self
        : { ...self, action: { ...self.action, [key]: entries } };
}

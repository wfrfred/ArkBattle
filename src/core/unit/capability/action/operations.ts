import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { createChange, type Change } from "../../change.js";
import type * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../attribute.js";
import { refreshCooldowns } from "../../action/operations.js";
import type { Action, Input, State } from "./capability.js";

export function setIntervalContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(self, "interval", attribute.setContribution(self.action.interval, entry)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function removeIntervalContribution(id: string): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(self, "interval", attribute.removeContribution(self.action.interval, id)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function setSpeedContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setAttribute(self, "speed", attribute.setContribution(self.action.speed, entry)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function removeSpeedContribution(id: string): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) => setAttribute(self, "speed", attribute.removeContribution(self.action.speed, id)),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function setIntervalRange(range: attribute.Range): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(
                self,
                "interval",
                attribute.setRange(self.definition.action.interval, self.action.interval, range),
            ),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function clearIntervalRange(): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(
                self,
                "interval",
                attribute.clearRange(self.definition.action.interval, self.action.interval),
            ),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function setSpeedRange(range: attribute.Range): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(
                self,
                "speed",
                attribute.setRange(self.definition.action.speed, self.action.speed, range),
            ),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

export function clearSpeedRange(): Change<Unit & Action> {
    return createChange<Unit & Action>(
        (self) =>
            setAttribute(
                self,
                "speed",
                attribute.clearRange(self.definition.action.speed, self.action.speed),
            ),
        (battle, previous) => refreshCooldowns(battle, units.ref(previous)),
    );
}

function setAttribute<U extends Unit & Action>(
    self: U,
    key: "interval" | "speed",
    next: State["interval"],
): U {
    return next === self.action[key] ? self : { ...self, action: { ...self.action, [key]: next } };
}

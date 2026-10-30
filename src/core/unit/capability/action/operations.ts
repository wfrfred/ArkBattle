import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import { createChange, type Change } from "../../change.js";
import * as contribution from "../../contribution/contribution.js";
import { refreshCooldowns } from "../../action/operations.js";
import type { Action, Input, State } from "./capability.js";

export function setIntervalContribution(
    reference: Ref<Unit & Action>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "interval", contribution.set(self.action.interval, entry)),
        (battle, previous) =>
            previous.action.interval.includes(entry) ? battle : refreshCooldowns(battle, reference),
    );
}

export function removeIntervalContribution(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "interval", contribution.remove(self.action.interval, id)),
        (battle, previous) =>
            previous.action.interval.some((entry) => entry.id === id)
                ? refreshCooldowns(battle, reference)
                : battle,
    );
}

export function setSpeedContribution(
    reference: Ref<Unit & Action>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "speed", contribution.set(self.action.speed, entry)),
        (battle, previous) =>
            previous.action.speed.includes(entry) ? battle : refreshCooldowns(battle, reference),
    );
}

export function removeSpeedContribution(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "speed", contribution.remove(self.action.speed, id)),
        (battle, previous) =>
            previous.action.speed.some((entry) => entry.id === id)
                ? refreshCooldowns(battle, reference)
                : battle,
    );
}

function setContributions(
    self: Unit & Action,
    key: "interval" | "speed",
    entries: State["interval"],
): Unit & Action {
    return entries === self.action[key]
        ? self
        : { ...self, action: { ...self.action, [key]: entries } };
}

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
        (battle) => refreshCooldowns(battle, reference),
    );
}

export function removeIntervalContribution(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "interval", contribution.remove(self.action.interval, id)),
        (battle) => refreshCooldowns(battle, reference),
    );
}

export function setSpeedContribution(
    reference: Ref<Unit & Action>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "speed", contribution.set(self.action.speed, entry)),
        (battle) => refreshCooldowns(battle, reference),
    );
}

export function removeSpeedContribution(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(
        reference,
        (self) => setContributions(self, "speed", contribution.remove(self.action.speed, id)),
        (battle) => refreshCooldowns(battle, reference),
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

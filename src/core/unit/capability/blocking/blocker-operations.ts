import * as blocking from "../../../battle/blocking/operations.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import { createChange, type Change } from "../../change.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Hook, Key } from "./contract.js";
import type { Rule } from "./rule.js";
import { DEFAULT_RADIUS, type Blocker, type Layer, type Modifier } from "./blocker.js";

export function setRule(reference: Ref<Unit & Blocker>, rule: Rule): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.set(self.blocker.rules, rule);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle) => blocking.maintainBlocker(battle, reference),
    );
}

export function removeRule(reference: Ref<Unit & Blocker>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.remove(self.blocker.rules, id);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle) => blocking.maintainBlocker(battle, reference),
    );
}

export function setCapacityContribution(
    reference: Ref<Unit & Blocker>,
    entry: contribution.Contribution<readonly Modifier[]>,
): Change {
    return createChange(
        reference,
        (self) => {
            const capacity = contribution.set(self.blocker.capacity, entry);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle) => blocking.maintainBlocker(battle, reference),
    );
}

export function removeCapacityContribution(reference: Ref<Unit & Blocker>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const capacity = contribution.remove(self.blocker.capacity, id);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle) => blocking.maintainBlocker(battle, reference),
    );
}

export function setLayer(reference: Ref<Unit & Blocker>, layer: Layer): Change {
    return createChange(
        reference,
        (self) =>
            self.blocker.layer === layer
                ? self
                : {
                      ...self,
                      blocker: {
                          ...self.blocker,
                          layer,
                          radius: self.definition.blocker.radius ?? DEFAULT_RADIUS[layer],
                      },
                  },
        (battle, previous) =>
            blocking.releaseAll(
                battle,
                previous.blocker.blocked.map((blocked) => ({ blocker: reference, blocked })),
            ),
    );
}

export function setHook(
    reference: Ref<Unit & Blocker>,
    key: Key,
    hook: Hook<Unit & Blocker>,
): Change {
    return createChange(reference, (self) => {
        const entries = registry.set(self.blocker[key], hook);

        return entries === self.blocker[key]
            ? self
            : { ...self, blocker: { ...self.blocker, [key]: entries } };
    });
}

export function removeHook(reference: Ref<Unit & Blocker>, key: Key, id: string): Change {
    return createChange(reference, (self) => {
        const entries = registry.remove(self.blocker[key], id);

        return entries === self.blocker[key]
            ? self
            : { ...self, blocker: { ...self.blocker, [key]: entries } };
    });
}

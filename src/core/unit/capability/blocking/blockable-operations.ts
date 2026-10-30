import * as blocking from "../../../battle/blocking/operations.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import { createChange, type Change } from "../../change.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Hook, Key } from "./contract.js";
import type { Rule } from "./rule.js";
import { assertSafeInteger } from "../../../common/assert.js";
import type { Blockable } from "./blockable.js";

export function setRule(reference: Ref<Unit & Blockable>, rule: Rule): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.set(self.blockable.rules, rule);

            return rules === self.blockable.rules
                ? self
                : { ...self, blockable: { ...self.blockable, rules } };
        },
        (battle, previous) =>
            !previous.blockable.rules.includes(rule)
                ? blocking.maintainBlockableRule(battle, reference)
                : battle,
    );
}

export function removeRule(reference: Ref<Unit & Blockable>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.remove(self.blockable.rules, id);

            return rules === self.blockable.rules
                ? self
                : { ...self, blockable: { ...self.blockable, rules } };
        },
        (battle, previous) =>
            previous.blockable.rules.some((entry) => entry.id === id)
                ? blocking.maintainBlockableRule(battle, reference)
                : battle,
    );
}

export function setVolumeContribution(
    reference: Ref<Unit & Blockable>,
    entry: contribution.Contribution<number>,
): Change {
    assertSafeInteger(entry.value, "blocking volume addition");

    return createChange(
        reference,
        (self) => {
            const volume = contribution.set(self.blockable.volume, entry);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle, previous) =>
            !previous.blockable.volume.includes(entry)
                ? blocking.maintainBlockable(battle, reference)
                : battle,
    );
}

export function removeVolumeContribution(reference: Ref<Unit & Blockable>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const volume = contribution.remove(self.blockable.volume, id);

            return volume === self.blockable.volume
                ? self
                : { ...self, blockable: { ...self.blockable, volume } };
        },
        (battle, previous) =>
            previous.blockable.volume.some((entry) => entry.id === id)
                ? blocking.maintainBlockable(battle, reference)
                : battle,
    );
}

export function setHook(
    reference: Ref<Unit & Blockable>,
    key: Key,
    hook: Hook<Unit & Blockable>,
): Change {
    return createChange(reference, (self) => {
        const entries = registry.set(self.blockable[key], hook);

        return entries === self.blockable[key]
            ? self
            : { ...self, blockable: { ...self.blockable, [key]: entries } };
    });
}

export function removeHook(reference: Ref<Unit & Blockable>, key: Key, id: string): Change {
    return createChange(reference, (self) => {
        const entries = registry.remove(self.blockable[key], id);

        return entries === self.blockable[key]
            ? self
            : { ...self, blockable: { ...self.blockable, [key]: entries } };
    });
}

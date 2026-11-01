import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import { createChange, type Change } from "../../change.js";
import type { Deployable, Rule } from "./capability.js";
import * as hook from "../../../hook.js";

export function setRetreatRule(reference: Ref<Unit & Deployable>, rule: Rule): Change {
    return createChange(reference, (self) => {
        const retreatRules = hook.set(self.deployable.retreatRules, rule);

        return retreatRules === self.deployable.retreatRules
            ? self
            : { ...self, deployable: { ...self.deployable, retreatRules } };
    });
}

export function removeRetreatRule(reference: Ref<Unit & Deployable>, id: string): Change {
    return createChange(reference, (self) => {
        const retreatRules = self.deployable.retreatRules.filter((entry) => entry.id !== id);

        return retreatRules.length === self.deployable.retreatRules.length
            ? self
            : { ...self, deployable: { ...self.deployable, retreatRules } };
    });
}

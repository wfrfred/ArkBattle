import type { Unit } from "../unit/unit.js";
import { ref as unitRef } from "../unit/query.js";
import { hasAction } from "../unit/capability/action/capability.js";
import { hasSkill } from "../unit/capability/skill/capability.js";
import { hasElemental } from "../unit/capability/elemental/capability.js";
import { ref as executionRef, type View as ExecutionView } from "../unit/action/execution.js";
import { ref as activationRef } from "../unit/skill/activation.js";
import { ref as burstRef } from "../unit/capability/elemental/burst.js";
import { ref as effectRef } from "../unit/effect/effect.js";
import { lifetime as actionLifetime } from "../unit/action/operations.js";
import { lifetime as skillLifetime } from "../unit/skill/operations.js";
import { lifetime as burstLifetime } from "../unit/capability/elemental/operations.js";
import { lifetime as effectLifetime } from "../unit/effect/operations.js";
import { lifetime as unitLifetime } from "./unit.js";
import { scope } from "../lifetime/operations.js";
import type { Scope } from "../lifetime/lifetime.js";
import type { Entry } from "../lifetime/dependency.js";

export interface UnitTransition {
    readonly previousUnit: Unit | undefined;
    readonly nextUnit: Unit | undefined;
}

export function projectUnit(unit: Unit | undefined): readonly Entry[] {
    if (unit === undefined) {
        return [];
    }

    const host = unitRef(unit);
    const owner = scope(unitLifetime, host);
    const entries: Entry[] = [];

    const add = (target: Scope, scopes: readonly Scope[] = []): void => {
        entries.push({ target, owner: { target: owner, order: entries.length }, scopes });
    };
    if (hasSkill(unit) && unit.skill.active !== null) {
        add(scope(skillLifetime, activationRef(unit.skill.active)));
    }
    if (hasAction(unit)) {
        const executions = [
            ...unit.action.actions
                .values()
                .filter((self): self is ExecutionView => self.execution !== null),
        ].sort((left, right) => left.execution.id - right.execution.id);

        for (const self of executions) {
            add(scope(actionLifetime, executionRef(unitRef(unit), self)));
        }
    }
    if (hasElemental(unit) && unit.elemental.burst !== null) {
        add(scope(burstLifetime, burstRef(unit.elemental.burst)));
    }
    for (const self of unit.effects.values()) {
        add(
            scope(effectLifetime, effectRef(self)),
            self.scopes.filter((scope) => scope.type !== "TICK"),
        );
    }

    return entries;
}

import type { Identified, Ref } from "../../../common/ref.js";
import { sort } from "../../../common/collection.js";
import * as registry from "../../../hook.js";
import type { Rule } from "../../../rule.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { createChange, type Change } from "../../change.js";
import { ref as executionRef, type Execution } from "../../action/execution.js";
import { cancel } from "../../action/operations.js";
import { hasAction } from "../action/capability.js";
import { hasSkill } from "../skill/capability.js";
import { hasLocomotion } from "../locomotion/capability.js";
import { hasVitality } from "../vitality/capability.js";
import { hasElemental } from "../elemental/capability.js";
import { hasBlocker } from "../blocking/blocker.js";
import { hasBlockable } from "../blocking/blockable.js";
import { releaseCaptured } from "../blocking/blocker-operations.js";
import { release as releaseBlockable } from "../blocking/blockable-operations.js";
import type { SpatialPresence } from "./capability.js";

const restriction = { id: "@presence/absent", allows: () => false };

export function disappear(reference: Ref<Unit & SpatialPresence>): Change {
    return changePresence(reference, false);
}

export function appear(reference: Ref<Unit & SpatialPresence>, position: WorldPosition): Change {
    return changePresence(reference, true, position);
}

function changePresence(
    reference: Ref<Unit & SpatialPresence>,
    present: boolean,
    position?: WorldPosition,
): Change {
    return createChange(
        reference,
        (self) => {
            if (self.lifecycle !== "PRESENT") {
                return self;
            }

            const rules = <C>(entries: readonly Rule<C>[]) =>
                present
                    ? registry.remove(entries, restriction.id)
                    : registry.set(entries, restriction);

            return {
                ...self,
                position: position ?? self.position,
                spatialPresence: { present },
                ...(hasAction(self)
                    ? { action: { ...self.action, rules: rules(self.action.rules) } }
                    : {}),
                ...(hasSkill(self)
                    ? {
                          skill: {
                              ...self.skill,
                              activationRules: rules(self.skill.activationRules),
                          },
                      }
                    : {}),
                ...(hasLocomotion(self)
                    ? { locomotion: { ...self.locomotion, rules: rules(self.locomotion.rules) } }
                    : {}),
                ...(hasBlocker(self)
                    ? { blocker: { ...self.blocker, rules: rules(self.blocker.rules) } }
                    : {}),
                ...(hasBlockable(self)
                    ? {
                          blockable: {
                              ...self.blockable,
                              adjustment: null,
                              rules: rules(self.blockable.rules),
                          },
                      }
                    : {}),
                ...(hasVitality(self)
                    ? {
                          vitality: {
                              ...self.vitality,
                              damageRules: rules(self.vitality.damageRules),
                          },
                      }
                    : {}),
                ...(hasElemental(self)
                    ? {
                          elemental: {
                              ...self.elemental,
                              damageRules: rules(self.elemental.damageRules),
                          },
                      }
                    : {}),
            };
        },
        (battle, previous) => {
            const executions =
                !present && hasAction(previous)
                    ? sort(
                          previous.action.actions
                              .values()
                              .filter(
                                  (self): self is Identified<never, Execution> =>
                                      self.execution !== null,
                              )
                              .map((self) => executionRef<Execution>(units.ref(previous), self)),
                          (left, right) => left.id - right.id,
                      )
                    : [];

            if (hasBlocker(previous)) {
                battle = releaseCaptured(battle, previous);
            } else if (hasBlockable(previous)) {
                const owner = previous.blockable.blocker;
                const current = units.get(battle, units.ref(previous));
                if (owner !== null && current?.blockable.blocker === owner) {
                    battle = releaseBlockable(battle, units.ref(previous));
                }
            }

            for (const execution of executions) {
                battle = cancel(battle, execution, "SOURCE_ABSENT");
            }

            return battle;
        },
    );
}

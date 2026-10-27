import { update as updateUnit } from "../../core/battle/unit.js";
import { get as getUnit, ref as unitRef } from "../../core/unit/query.js";

import * as attribute from "../../core/unit/contribution/attribute.js";
import type { Definition } from "../../core/unit/effect/definition.js";
import { install } from "../../core/unit/effect/operations.js";
import {
    hasOffense,
    removeAttackContribution,
    setAttackContribution,
    type Offense,
} from "../../core/unit/capability/offense/capability.js";
import type { Definition as SkillDefinition } from "../../core/unit/capability/skill/capability.js";
import { ref as activationRef } from "../../core/unit/capability/skill/activation.js";
import { parseArknightsSkillLevel } from "./skill-definition.js";

export function compileArknightsAttackBuffSkill(value: unknown, level: number): SkillDefinition {
    const parsed = parseArknightsSkillLevel(value, level);

    if (!/^skcom_atk_up\[[123]\]$/.test(parsed.definition.id)) {
        throw new TypeError(`unsupported attack buff skill ${parsed.definition.id}`);
    }

    const entries = parsed.blackboard.filter((entry) => entry.key.toLowerCase() === "atk");

    if (entries.length !== 1 || typeof entries[0]!.value !== "number") {
        throw new TypeError("attack buff skill requires one numeric atk blackboard entry");
    }

    const attackIncrease = entries[0]!.value;
    const buff: Definition<{ readonly attackIncrease: number }, Offense> = {
        id: `skill/${parsed.definition.id}/${level}/attack`,
        initialize: () => ({ attackIncrease }),
        onEnable: (state, self) => {
            const unit = getUnit(state, self.host);

            if (unit === undefined) {
                return state;
            }

            return updateUnit(state, [
                {
                    ...unit,
                    offense: setAttackContribution(unit.offense, {
                        id: `@effect/${self.id}/attack`,
                        value: [attribute.create({ multiplier: self.data.attackIncrease })],
                    }),
                },
            ]);
        },
        onDisable: (state, self) => {
            const unit = getUnit(state, self.host);

            if (unit === undefined) {
                return state;
            }

            return updateUnit(state, [
                {
                    ...unit,
                    offense: removeAttackContribution(unit.offense, `@effect/${self.id}/attack`),
                },
            ]);
        },
    };

    return {
        ...parsed.definition,
        activation: {
            ...parsed.definition.activation!,
            accepts: (battle, self) => {
                const host = getUnit(battle, self.host);

                return host !== undefined && hasOffense(host);
            },
            onStart: (state, self) => {
                const unit = getUnit(state, self.host);

                if (unit === undefined || !hasOffense(unit)) {
                    return state;
                }

                const installed = install(state, unitRef(unit), buff, {
                    source: unit.id,
                    scopes: [
                        {
                            type: "SKILL",
                            ref: activationRef(self),
                        },
                    ],
                });

                return installed.state;
            },
        },
    };
}

import { normal as normalSite } from "../terrain/condition.js";
import { update as updateUnit } from "../../core/battle/unit.js";
import { createArknightsElementalDefinition } from "../../data/arknights/elemental.js";
import { Definitions } from "../../core/unit/action/definitions.js";
import { create as createAttack } from "../actions/attack.js";
import * as filters from "../../core/battle/targeting/filter.js";
import * as compare from "../../core/battle/targeting/compare.js";
import { first } from "../../core/battle/targeting/selector.js";
import { get as getCurrentUnit, ref as unitRef } from "../../core/unit/query.js";
import type { Profile } from "../../data/arknights/operator.js";

import type { Definition as UnitDefinition } from "../../core/unit/unit.js";
import type { Definitions as CapabilityDefinitions } from "../../core/unit/capability/catalog.js";
import type { Definition as SkillDefinition } from "../../core/unit/capability/skill/capability.js";
import { ref as activationRef } from "../../core/unit/capability/skill/activation.js";
import { createDefinition as createDeployableDefinition } from "../../core/unit/capability/deployable/capability.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
    type Offense,
} from "../../core/unit/capability/offense/capability.js";
import type { Definition as EffectDefinition } from "../../core/unit/effect/definition.js";
import { install } from "../../core/unit/effect/operations.js";
import * as attribute from "../../core/unit/contribution/attribute.js";
import type { Direction } from "../../core/geometry/direction.js";
import { fromTiles } from "../../core/geometry/range.js";
import { secondsToTicks } from "../../data/arknights/tick.js";

export interface Definition
    extends
        UnitDefinition,
        Pick<
            CapabilityDefinitions,
            | "action"
            | "allegiance"
            | "blocker"
            | "deployable"
            | "elemental"
            | "hitbox"
            | "layer"
            | "occupancy"
            | "offense"
            | "skill"
            | "targetable"
            | "vitality"
        > {
    readonly profile: Profile;
    readonly direction: Direction;
}

function attackBonus(id: string, amount: number): EffectDefinition<object, Offense> {
    return {
        id,
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(state, [
                      {
                          ...unit,
                          offense: setAttackContribution(unit.offense, {
                              id: `effect/${self.id}/attack`,
                              value: [attribute.create({ multiplier: amount })],
                          }),
                      },
                  ]);
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(state, [
                      {
                          ...unit,
                          offense: removeAttackContribution(
                              unit.offense,
                              `effect/${self.id}/attack`,
                          ),
                      },
                  ]);
        },
    };
}

export function create(profile: Profile, direction: Direction = "RIGHT"): Definition {
    if (profile.id !== "char_208_melan" || profile.skill.definition.id !== "skcom_atk_up[1]") {
        throw new TypeError("Melantha content requires her first skill");
    }

    const skillBonus = profile.skill.blackboard.find((entry) => entry.key === "atk")!.value;
    const talentBonus = profile.talents
        .find((talent) => talent.key === "1")
        ?.blackboard.find((entry) => entry.key === "atk")?.value;
    const talent = attackBonus("melantha/attack-talent", talentBonus ?? 0);
    const skillEffect = attackBonus("melantha/attack-up", skillBonus);
    const skill: SkillDefinition = {
        ...profile.skill.definition,
        activation: {
            ...profile.skill.definition.activation!,
            onStart(state, self) {
                const unit = getCurrentUnit(state, self.host);

                if (unit === undefined || !hasOffense(unit)) {
                    return state;
                }

                const result = install(state, unitRef(unit), skillEffect, {
                    source: unit.id,
                    scopes: [{ type: "SKILL", ref: activationRef(self) }],
                });

                return result.state;
            },
        },
    };

    return {
        id: profile.id,
        profile,
        direction,
        occupancy: { slot: "OCCUPANT" },
        targetable: { restrictions: [] },
        deployable: createDeployableDefinition({
            cost: profile.attributes.cost,
            redeployTicks: secondsToTicks(profile.attributes.respawnTime),
            slots: 1,
            placement: "MELEE",
            allowedSiteConditions: [normalSite],
        }),
        elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
        vitality: {
            maxHp: profile.attributes.maxHp,
            defense: profile.attributes.defense,
            resistance: profile.attributes.resistance,
        },
        offense: { attack: profile.attributes.attack },

        allegiance: { side: "ALLY" },
        layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.25 } },
        blocker: {
            capacity: profile.attributes.blockCapacity,
            geometry: { radius: 0.70709997 },
        },
        action: {
            definitions: Definitions.empty().add(
                createAttack({
                    id: "normal-attack",
                    speed: profile.attributes.attackSpeed,
                    triggerBindingId: "primary",
                    intervalTicks: secondsToTicks(profile.attributes.baseAttackTime),
                    recoveryTicks: 0,
                    followUps: [],
                    targetGroups: [
                        {
                            id: "primary",
                            targeting: {
                                purposes: ["DAMAGE"],
                                filter: filters.and(
                                    filters.damage,
                                    filters.ground,
                                    filters.or(
                                        filters.range(fromTiles(profile.range, direction)),
                                        filters.blocking,
                                    ),
                                ),
                                selector: first(
                                    1,
                                    compare.combine(compare.blockedFirst, compare.distance),
                                ),
                            },
                            operations: [
                                {
                                    type: "DAMAGE",
                                    power: profile.attributes.attack,
                                    powerSource: "SOURCE_ATTACK",
                                    damageType: "PHYSICAL",
                                },
                            ],
                        },
                    ],
                }),
            ),
        },
        skill,
        hooks: [
            {
                id: "melantha/install-talent",
                stage: "enter",
                invoke(state, self) {
                    return {
                        state:
                            talentBonus !== undefined && hasOffense(self)
                                ? install(state, unitRef(self), talent).state
                                : state,
                        value: undefined,
                    };
                },
            },
        ],
    };
}

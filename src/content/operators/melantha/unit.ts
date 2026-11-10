import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { normal as normalSite } from "../../terrain/condition.js";
import { update as updateUnit } from "../../../core/battle/unit.js";
import { scope } from "../../../core/lifetime/index.js";
import { createArknightsElementalDefinition } from "../../../data/elemental.js";
import { create as createAction, createActions } from "../../../core/unit/action/index.js";
import {
    get as getCurrentUnit,
    ref as unitRef,
    type Definition as UnitDefinition,
} from "../../../core/unit/index.js";
import type { Profile } from "../../../data/operator.js";

import type { Definitions as CapabilityDefinitions } from "../../../core/unit/capability/catalog.js";
import {
    type Definition as SkillDefinition,
    create as createSkill,
    activationRef,
    lifetime as skillLifetime,
} from "../../../core/unit/skill/index.js";

import type { Definition as CardDefinition } from "../../../core/battle/deployment/card/index.js";
import { get as getTile } from "../../../core/battlefield/map/map.js";
import { sides } from "../../../core/unit/capability/blocking/index.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
    type Offense,
} from "../../../core/unit/capability/offense/index.js";
import { type Definition as EffectDefinition, install } from "../../../core/unit/effect/index.js";

import * as attribute from "../../../core/unit/contribution/attribute.js";
import { secondsToTicks } from "../../../data/tick.js";
import { create as createAttack } from "./action.js";

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
    readonly card: CardDefinition;
}

function attackBonus(id: string, amount: number): EffectDefinition<object, Offense> {
    return {
        id,
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(
                      state,
                      unitRef(unit),
                      setAttackContribution({
                          id: `effect/${self.id}/attack`,
                          value: [attribute.create({ multiplier: amount })],
                      }),
                  );
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(
                      state,
                      unitRef(unit),
                      removeAttackContribution(`effect/${self.id}/attack`),
                  );
        },
    };
}

export function create(profile: Profile): Definition {
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
            onStart(state, source, self) {
                const unit = getCurrentUnit(state, source);
                if (unit === undefined || !hasOffense(unit)) {
                    return state;
                }

                const result = install(state, unitRef(unit), skillEffect, {
                    source: unitRef(unit),
                    scopes: [scope(skillLifetime, activationRef(source, self))],
                });

                return result.state;
            },
        },
    };

    const attack = createAttack(profile);
    const initializeAttack = createAction(attack);

    return {
        id: profile.id,
        profile,
        occupancy: { slot: "OCCUPANT" },
        targetable: { taunt: profile.attributes.taunt, restrictions: [] },
        deployable: { retreatRules: [] },
        card: {
            cost: profile.attributes.cost,
            redeployTicks: secondsToTicks(profile.attributes.respawnTime),
            slots: 1,
            stock: 1,
            stockLimit: 1,
            activeLimit: 1,
            cooldownOnDeploy: false,
            recoverOnRetreatOrDeath: true,
            increaseCostOnRetreatOrDeath: true,
            refund: { rate: 0.5, limit: "BASE_COST" },
            deploymentRules: [
                {
                    id: "deployment/site",
                    allows(battle, { request }) {
                        const tile = getTile(battle.battlefield.map, request.tilePosition);

                        return (
                            tile !== undefined &&
                            (tile.state.placement === "MELEE" || tile.state.placement === "ALL") &&
                            (tile.state.siteCondition === null ||
                                tile.state.siteCondition === normalSite)
                        );
                    },
                },
            ],
            unitHooks: Hooks.empty(),
            initialize: (battle) => ({ state: battle, value: {} }),
        },
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
            layer: "GROUND",
            rules: [sides("ENEMY")],
        },
        action: {
            initialize: (battle) => createActions(battle, initializeAttack),
        },
        skill: { initialize: (battle) => createSkill(battle, skill) },
        hooks: Hooks.empty().set(unitHooks.enter, {
            id: "melantha/install-talent",
            invoke(state, self) {
                return {
                    state:
                        talentBonus !== undefined && hasOffense(self)
                            ? install(state, unitRef(self), talent).state
                            : state,
                    value: undefined,
                };
            },
        }),
    };
}

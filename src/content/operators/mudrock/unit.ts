import { secondsToTicks, TICKS_PER_SECOND } from "../../../core/tick.js";
import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { normal as normalSite } from "../../terrain/condition.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { create as createElemental } from "../../elemental.js";
import type { ActionCapability } from "../../../core/unit/capability/action/index.js";
import { ref as unitRef } from "../../../core/unit/index.js";
import { sides } from "../../../core/unit/capability/blocking/index.js";
import type { SkillCapability } from "../../../core/unit/capability/skill/index.js";
import type { Definition as CardDefinition } from "../../../core/battle/deployment/card/index.js";
import { get as getTile } from "../../../core/battlefield/map/map.js";
import { healFree } from "../../../core/effects/protection.js";
import { hasVitality } from "../../../core/unit/capability/vitality/index.js";
import { install } from "../../../core/unit/effect/index.js";
import type { Operator } from "../operator.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import type { Tables } from "../parameters.js";
import { createNormal, createSkill as createSkillAction } from "./action.js";
import { shieldEffect } from "./effect.js";
import { create as createSkill } from "./skill.js";
import { resolve } from "./parameters.js";

export type Mudrock = Operator &
    ActionCapability<Mudrock> &
    SkillCapability<Mudrock> & {
        readonly definition: {
            readonly card: CardDefinition;
        };
    };

export type Definition = Mudrock["definition"];

export function create(configuration: Configuration & SkillSelection, tables: Tables) {
    const parameters = resolve(configuration, tables);
    const { attributes } = parameters;
    const shield = shieldEffect(parameters.shield);
    const normalAttack = createNormal(parameters.normalAttack);
    const action = createSkillAction(parameters.s2Action);
    const skill = createSkill(parameters.s2Skill, normalAttack, action);

    const definition = {
        elemental: createElemental({ receiver: "CHARACTER" }),
        id: parameters.id,
        occupancy: { slot: "OCCUPANT" },
        facing: { restrictions: [] },
        targetable: {
            category: "DEFAULT",
            taunt: { default: attributes.taunt, min: -2, max: 2 },
            restrictions: [],
        },
        deployable: { retreatRestrictions: [] },
        card: {
            cost: attributes.cost,
            redeployTicks: secondsToTicks(attributes.respawnTime),
            slots: 1,
            stock: 1,
            stockLimit: 1,
            activeLimit: 1,
            cooldownOnDeploy: false,
            recoverOnRetreatOrDeath: true,
            increaseCostOnRetreatOrDeath: true,
            refund: { rate: 0.5, limit: "BASE_COST" },
            deploymentRestrictions: [
                {
                    id: "deployment/site",
                    value: {
                        allows(battle, { request }) {
                            const tile = getTile(battle.battlefield.map, request.tilePosition);

                            return (
                                tile !== undefined &&
                                (tile.state.placement === "MELEE" ||
                                    tile.state.placement === "ALL") &&
                                (tile.state.siteCondition === null ||
                                    tile.state.siteCondition === normalSite)
                            );
                        },
                    },
                },
            ],
            unitHooks: Hooks.empty(),
            initialize: (battle) => ({ state: battle, value: {} }),
        },
        vitality: {
            maxHp: { default: attributes.maxHp, min: 1, max: null },
            defense: { default: attributes.defense, min: 0, max: null },
            resistance: { default: attributes.resistance, min: 0, max: 100 },
            recoverySpeed: { default: attributes.recoverySpeed, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        offense: { attack: { default: attributes.attack, min: 0, max: null } },

        classification: {
            type: "OPERATOR",
            side: "ALLY",
            profession: "TANK",
            subProfession: "UNYIELD",
            extraProfessions: [],
            groupTags: parameters.groupTags,
        },
        layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.25 } },
        blocker: {
            capacity: attributes.blockCapacity,
            layer: "GROUND",
            restrictions: [{ id: "blocking/sides", value: sides("ENEMY") }],
        },
        action: {
            speed: { default: attributes.attackSpeed, min: 20, max: null },
            interval: {
                default: attributes.baseAttackTime * TICKS_PER_SECOND,
                min: 0,
                max: null,
            },
            definitions: [normalAttack, action],
            select: (battle, self) => ({
                state: battle,
                value: [self.skill.activation === null ? normalAttack.id : action.id],
            }),
        },
        skill: { definition: skill },
        hooks: Hooks.empty().set(unitHooks.entered, {
            id: "mudrock/install-initial-effects",
            invoke(state, self) {
                if (!hasVitality(self) || !hasTargetable(self)) {
                    return { state, value: undefined };
                }

                const host = unitRef(self);
                state = install(state, host, shield).state;

                return { state: install(state, host, healFree).state, value: undefined };
            },
        }),
    } satisfies Definition;

    return definition;
}

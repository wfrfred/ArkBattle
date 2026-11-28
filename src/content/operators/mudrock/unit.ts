import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import type { ActionCapability } from "../../../core/unit/capability/action/index.js";
import { ref as unitRef } from "../../../core/unit/index.js";
import type { SkillCapability } from "../../../core/unit/capability/skill/index.js";
import { healFree } from "../../../core/effects/protection.js";
import { hasVitality } from "../../../core/unit/capability/vitality/index.js";
import { install } from "../../../core/effect/index.js";
import type { Operator } from "../operator.js";
import * as capabilities from "../capabilities.js";
import { createNormal, createSkill as createSkillAction } from "./action.js";
import { shieldEffect } from "./effect.js";
import { create as createSkill } from "./skill.js";
import { operatorId, type Parameters } from "./parameters.js";

export type Mudrock = Operator & ActionCapability<Mudrock> & SkillCapability<Mudrock>;

export type Definition = Mudrock["definition"];

export function create(parameters: Parameters) {
    const { attributes } = parameters;
    const shield = shieldEffect(parameters.shield);
    const normalAttack = createNormal(parameters.normalAttack);
    const action = createSkillAction(parameters.s2Action);
    const skill = createSkill(parameters.s2Skill, normalAttack, action);

    const definition = {
        elemental: capabilities.elemental(),
        id: operatorId,
        occupancy: { slot: "OCCUPANT" },
        facing: { restrictions: [] },
        targetable: capabilities.targetable(attributes.taunt),
        deployable: capabilities.deployable(),
        vitality: capabilities.vitality(attributes),
        offense: capabilities.offense(attributes.attack),

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
        blocker: capabilities.blocker(attributes.blockCapacity),
        action: {
            ...capabilities.attackAttributes(attributes.attackSpeed, attributes.baseAttackTime),
            definitions: [normalAttack, action],
            select: (battle, self) => ({
                state: battle,
                value: [self.skill.activation === null ? normalAttack.id : action.id],
            }),
        },
        skill: { definition: skill },
        hooks: Hooks.empty().set(unitHooks.entered, {
            id: "mudrock/install-initial-effects",
            priority: 0,
            invoke(state, self) {
                if (!hasVitality(self)) {
                    return { state, value: undefined };
                }

                const host = unitRef(self);
                state = install(state, host, shield, {
                    source: null,
                    scopes: [],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;

                return {
                    state: install(state, host, healFree, {
                        source: null,
                        scopes: [],
                        expiration: { type: "INFINITE" },
                        enabled: true,
                    }).state,
                    value: undefined,
                };
            },
        }),
    } satisfies Definition;

    return definition;
}

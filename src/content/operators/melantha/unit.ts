import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { create as createElemental } from "../../elemental.js";
import {
    getAction,
    ref as actionRef,
    setState as setActionState,
    type ActionCapability,
} from "../../../core/unit/capability/action/index.js";
import { ref as unitRef } from "../../../core/unit/index.js";

import type { SkillCapability } from "../../../core/unit/capability/skill/index.js";

import { sides } from "../../../core/unit/capability/blocking/index.js";
import { hasOffense } from "../../../core/unit/capability/offense/index.js";
import { install } from "../../../core/unit/effect/index.js";

import { create as createAttack, hasTarget } from "./action.js";
import { createAttackBonus } from "./effect.js";
import { create as createSkill } from "./skill.js";
import type { Operator } from "../operator.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import type { Tables } from "../../../data/unit/operator.js";
import { resolve } from "./parameters.js";
import { allows } from "../../../core/restriction.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export type Melantha = Operator & ActionCapability<Melantha> & SkillCapability<Melantha>;

export type Definition = Melantha["definition"];

export function create(configuration: Configuration & SkillSelection, tables: Tables) {
    const {
        id,
        groupTags,
        attributes,
        attack: attackParameters,
        s1,
        talentBonus,
    } = resolve(configuration, tables);
    const skill = createSkill(s1);
    const talent =
        talentBonus === undefined
            ? undefined
            : createAttackBonus("melantha/attack-talent", talentBonus);
    const attack = createAttack(attackParameters);

    const definition = {
        id,
        occupancy: { slot: "OCCUPANT" },
        facing: { restrictions: [] },
        targetable: {
            category: "DEFAULT",
            taunt: { default: attributes.taunt, min: -2, max: 2 },
            restrictions: [],
        },
        deployable: { retreatRestrictions: [], refund: { rate: 0.5, limit: "BASE_COST" } },
        elemental: createElemental({ receiver: "CHARACTER" }),
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
            profession: "WARRIOR",
            subProfession: "FEARLESS",
            extraProfessions: [],
            groupTags,
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
            definitions: [attack],
            select(battle, self) {
                const reference = actionRef(unitRef(self), attack);
                const current = getAction(battle, reference);
                if (
                    !hasTarget(battle, self, attackParameters.range) ||
                    !allows(battle, { self, definitionId: attack.id }, self.action.restrictions)
                ) {
                    if (current?.execution === null && current.state.inSession) {
                        battle = setActionState(battle, reference, { inSession: false });
                    }

                    return { state: battle, value: [] };
                }

                return { state: battle, value: [attack.id] };
            },
        },
        skill: { definition: skill },
        hooks: Hooks.empty().set(unitHooks.entered, {
            id: "melantha/install-talent",
            invoke(state, self) {
                return {
                    state:
                        talent !== undefined && hasOffense(self)
                            ? install(state, unitRef(self), talent).state
                            : state,
                    value: undefined,
                };
            },
        }),
    } satisfies Definition;

    return definition;
}

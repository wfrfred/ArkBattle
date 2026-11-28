import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import {
    ref as actionRef,
    setState as setActionState,
    type ActionCapability,
} from "../../../core/unit/capability/action/index.js";
import { ref as unitRef } from "../../../core/unit/index.js";

import type { SkillCapability } from "../../../core/unit/capability/skill/index.js";

import { hasOffense } from "../../../core/unit/capability/offense/index.js";
import { install } from "../../../core/effect/index.js";

import { create as createAttack, hasTarget } from "./action.js";
import { createAttackBonus } from "./effect.js";
import { create as createSkill } from "./skill.js";
import type { Operator } from "../operator.js";
import * as capabilities from "../capabilities.js";
import { operatorId, type Parameters } from "./parameters.js";
import { allows } from "../../../core/restriction.js";

export type Melantha = Operator & ActionCapability<Melantha> & SkillCapability<Melantha>;

export type Definition = Melantha["definition"];

export function create(parameters: Parameters) {
    const { groupTags, attributes, attack: attackParameters, s1, talentBonus } = parameters;
    const skill = createSkill(s1);
    const talent =
        talentBonus === null ? null : createAttackBonus("melantha/attack-talent", talentBonus);
    const attack = createAttack(attackParameters);

    const definition = {
        id: operatorId,
        occupancy: { slot: "OCCUPANT" },
        facing: { restrictions: [] },
        targetable: capabilities.targetable(attributes.taunt),
        deployable: capabilities.deployable(),
        elemental: capabilities.elemental(),
        vitality: capabilities.vitality(attributes),
        offense: capabilities.offense(attributes.attack),

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
        blocker: capabilities.blocker(attributes.blockCapacity),
        action: {
            ...capabilities.actionAttributes(attributes.attackSpeed, attributes.baseAttackTime),
            definitions: [attack],
            select(battle, self) {
                const current = self.action.actions.get(attack);
                if (
                    !hasTarget(battle, self, attackParameters.range) ||
                    !allows(battle, { self, definitionId: attack.id }, self.action.restrictions)
                ) {
                    if (current?.execution === null && current.state.inSession) {
                        battle = setActionState(battle, actionRef(current), { inSession: false });
                    }

                    return { state: battle, value: [] };
                }

                return { state: battle, value: [attack.id] };
            },
        },
        skill: { definition: skill },
        hooks: Hooks.empty().set(unitHooks.entered, {
            id: "melantha/install-talent",
            priority: 0,
            invoke(state, self) {
                return {
                    state:
                        talent !== null && hasOffense(self)
                            ? install(state, unitRef(self), talent, {
                                  source: null,
                                  scopes: [],
                                  expiration: { type: "INFINITE" },
                                  enabled: true,
                              }).state
                            : state,
                    value: undefined,
                };
            },
        }),
    } satisfies Definition;

    return definition;
}

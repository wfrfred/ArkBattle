import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { normal as normalSite } from "../../terrain/condition.js";
import { create as createElemental } from "../../elemental.js";
import {
    getAction,
    ref as actionRef,
    setState as setActionState,
    type ActionCapability,
} from "../../../core/unit/capability/action/index.js";
import { ref as unitRef } from "../../../core/unit/index.js";

import type { SkillCapability } from "../../../core/unit/capability/skill/index.js";

import type { Definition as CardDefinition } from "../../../core/battle/deployment/card/index.js";
import { get as getTile } from "../../../core/battlefield/map/map.js";
import { sides } from "../../../core/unit/capability/blocking/index.js";
import { hasOffense } from "../../../core/unit/capability/offense/index.js";
import { install } from "../../../core/unit/effect/index.js";

import { create as createAttack, hasTarget } from "./action.js";
import { createAttackBonus } from "./effect.js";
import { create as createSkill } from "./skill.js";
import type { Operator } from "../operator.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    resolveAttributes,
    selectModule,
    selectPhase,
    selectSkill,
    selectTalents,
    type Parameters,
} from "../parameters.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import { allows } from "../../../core/restriction.js";
import { secondsToTicks, TICKS_PER_SECOND } from "../../../core/tick.js";
import source from "./parameters.json" with { type: "json" };

export type Melantha = Operator &
    ActionCapability<Melantha> &
    SkillCapability<Melantha> & {
        readonly definition: {
            readonly card: CardDefinition;
        };
    };

export type Definition = Melantha["definition"];

const parameters = source as unknown as Parameters & { readonly timing: AttackSpeedTiming };

export function create(configuration: Configuration & SkillSelection) {
    if (configuration.skillIndex !== 0) {
        throw new TypeError("Melantha content requires her first skill");
    }

    const phase = selectPhase(parameters.phases, configuration);
    const stage = selectModule(parameters.modules, configuration);
    const attributes = resolveAttributes(parameters, phase, configuration, stage);
    const { id, level } = selectSkill(parameters.skills, configuration);
    const skill = createSkill(id, level);
    const talentBonus = selectTalents(parameters.talents, configuration, stage)
        .find((talent) => talent.key === "1")
        ?.blackboard.find((entry) => entry.key === "atk")?.value;
    const talent = createAttackBonus("melantha/attack-talent", talentBonus ?? 0);
    const attack = createAttack(phase.range, parameters.timing);

    const definition = {
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
            definitions: [attack],
            select(battle, self) {
                const reference = actionRef(unitRef(self), attack);
                const current = getAction(battle, reference);
                if (
                    !hasTarget(battle, self, phase.range) ||
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
                        talentBonus !== undefined && hasOffense(self)
                            ? install(state, unitRef(self), talent).state
                            : state,
                    value: undefined,
                };
            },
        }),
    } satisfies Definition;

    return definition;
}

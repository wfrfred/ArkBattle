import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { normal as normalSite } from "../../terrain/condition.js";
import { update as updateUnit } from "../../../core/battle/unit.js";
import { scope } from "../../../core/lifetime/index.js";
import { createArknightsElementalDefinition } from "../../../data/effect/elemental.js";
import {
    create as createAction,
    createActions,
    getAction,
    ref as actionRef,
    setState as setActionState,
} from "../../../core/unit/action/index.js";
import {
    get as getCurrentUnit,
    ref as unitRef,
    type Definition as UnitDefinition,
} from "../../../core/unit/index.js";
import type { Profile } from "../../../data/unit/operator.js";

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
import {
    type OrdinaryDefinition as EffectDefinition,
    install,
} from "../../../core/unit/effect/index.js";

import * as modifier from "../../../core/common/modifier.js";
import { secondsToTicks } from "../../../data/time.js";
import { create as createAttack, hasTarget } from "./action.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import { allows } from "../../../core/restriction.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface Definition
    extends
        UnitDefinition,
        Pick<
            CapabilityDefinitions,
            | "action"
            | "classification"
            | "blocker"
            | "deployable"
            | "elemental"
            | "facing"
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
                          value: [modifier.create({ multiplier: amount })],
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

export function create(profile: Profile, timing: AttackSpeedTiming): Definition {
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

    const attack = createAttack(profile, timing);
    const initializeAttack = createAction(attack);

    return {
        id: profile.id,
        profile,
        occupancy: { slot: "OCCUPANT" },
        facing: { restrictions: [] },
        targetable: {
            taunt: { default: profile.attributes.taunt, min: -2, max: 2 },
            restrictions: [],
        },
        deployable: { retreatRestrictions: [] },
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
        elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
        vitality: {
            maxHp: { default: profile.attributes.maxHp, min: 1, max: null },
            defense: { default: profile.attributes.defense, min: 0, max: null },
            resistance: { default: profile.attributes.resistance, min: 0, max: 100 },
            recoverySpeed: { default: profile.attributes.recoverySpeed, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        offense: { attack: { default: profile.attributes.attack, min: 0, max: null } },

        classification: {
            type: "OPERATOR",
            side: "ALLY",
            profession: "WARRIOR",
            subProfession: "FEARLESS",
            extraProfessions: [],
            groupTags: profile.groupTags,
        },
        layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.25 } },
        blocker: {
            capacity: profile.attributes.blockCapacity,
            layer: "GROUND",
            restrictions: [{ id: "blocking/sides", value: sides("ENEMY") }],
        },
        action: {
            speed: { default: profile.attributes.attackSpeed, min: 20, max: null },
            interval: {
                default: profile.attributes.baseAttackTime * TICKS_PER_SECOND,
                min: 0,
                max: null,
            },
            initialize: (battle, self) => createActions(battle, self, initializeAttack),
            select(battle, self) {
                const reference = actionRef(unitRef(self), attack);
                const current = getAction(battle, reference);
                if (
                    !hasTarget(battle, self, profile) ||
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

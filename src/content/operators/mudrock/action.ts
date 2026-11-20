import type { Timing } from "../../actions/timing.js";
import {
    create as createAttack,
    faceTarget,
    type Attack,
    type Configuration as AttackConfiguration,
} from "../../actions/attack.js";
import {
    create as createSkillAttack,
    type State as SkillAttackState,
} from "../../actions/skill.js";
import { getExecution, executionRef } from "../../../core/unit/capability/action/index.js";
import {
    get as getCurrentUnit,
    ref as unitRef,
    all as allUnits,
    type Unit,
} from "../../../core/unit/index.js";
import {
    hasTargetable,
    type Targetable,
} from "../../../core/unit/capability/targetable/capability.js";
import { hasOffense, resolveAttack } from "../../../core/unit/capability/offense/index.js";
import {
    hasClassification,
    type Classification,
} from "../../../core/unit/capability/classification/index.js";

import { finish, hasSkill } from "../../../core/unit/capability/skill/index.js";

import type { Vitality } from "../../../core/unit/capability/vitality/index.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/resource/hp/damage/index.js";

import * as targeting from "../../../core/battle/targeting/index.js";
import { hasBlockable, hasBlocker } from "../../../core/unit/capability/blocking/index.js";
import { hasDirection } from "../../../core/unit/capability/occupancy/index.js";
import { hasLayer, type Layer } from "../../../core/unit/capability/layer/index.js";
import { fromTiles } from "../../../core/geometry/range.js";
import { topK } from "../../../core/common/collection/order.js";
import type { State as BattleState } from "../../../core/battle/index.js";

import { createRng } from "../../../core/common/rng.js";
import type { Profile } from "../../../data/unit/operator.js";
import { secondsToTicks } from "../../../data/time.js";
import { stun } from "../../../core/effects/control.js";
import { install } from "../../../core/unit/effect/index.js";
import { value, healSelf } from "./common.js";

const inDefaultCategory = targeting.inCategories(["DEFAULT"]);

function attackTarget(
    battle: BattleState,
    self: Unit & Classification,
    profile: Profile,
    skill: boolean,
) {
    const eligible = targeting.damage(self)(battle);
    const withinRange = hasDirection(self)
        ? targeting.inRange(
              self.position,
              fromTiles(skill ? profile.skillRange! : profile.range, self.occupancy.direction),
          )
        : () => false;

    return <U extends Unit>(
        target: U,
    ): target is U & Targetable & Vitality & Classification & Layer =>
        hasTargetable(target) &&
        eligible(target) &&
        hasLayer(target) &&
        target.layer.type === "GROUND" &&
        ((inDefaultCategory(target) && withinRange(target)) ||
            (!skill && hasBlockable(target) && target.blockable.relation?.blocker.id === self.id));
}

export function skillTarget(battle: BattleState, self: Unit & Classification, profile: Profile) {
    return attackTarget(battle, self, profile, true);
}

export function skillTargets(battle: BattleState, self: Unit & Classification, profile: Profile) {
    return allUnits(battle).filter(skillTarget(battle, self, profile));
}

function attackDefinition(profile: Profile, skill: boolean, timing: Timing) {
    return {
        id: skill ? "mudrock/s2" : "normal-attack",
        triggerBindingId: "primary",
        period: skill ? { type: "FIXED", ticks: 0 } : { type: "ATTACK_SPEED" },
        timing,
        followUps: [],
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = getCurrentUnit(battle, source);
                    if (self === undefined || !hasClassification(self)) {
                        return { state: battle, value: [] };
                    }

                    const candidates = skill
                        ? skillTargets(battle, self, profile)
                        : allUnits(battle).filter(attackTarget(battle, self, profile, false));
                    const blockedFirst =
                        !skill && hasBlocker(self) ? targeting.blockedFirst(self) : () => 0;
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates,
                            skill ? Number.MAX_SAFE_INTEGER : 1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(unitRef),
                    };
                },
                operations: skill
                    ? []
                    : [
                          {
                              type: "DAMAGE",
                              attackType: "NORMAL",
                              applyWay: "MELEE",
                              power: 0,
                              powerSource: "SOURCE_ATTACK",
                              damageType: "PHYSICAL",
                          },
                      ],
            },
        ],
    } satisfies AttackConfiguration;
}

export function createNormal(profile: Profile, timing: Timing): Attack {
    return createAttack({
        ...attackDefinition(profile, false, timing),
        onStart: faceTarget,
    });
}

export function createSkill(
    profile: Profile,
    recoveryTicks: number,
): Attack<object, SkillAttackState> {
    const activeConfiguration = attackDefinition(profile, true, {
        type: "FIXED",
        windupTicks: 0,
        recoveryTicks,
    });
    const attackScale = value(profile.skill.blackboard, "atk_scale");
    const healRatio = value(profile.skill.blackboard, "hp_ratio");
    const stunChance = value(profile.skill.blackboard, "buff_prob");
    const stunTicks = secondsToTicks(value(profile.skill.blackboard, "stun"));

    return createSkillAttack({
        ...activeConfiguration,
        applyWay: "MELEE",
        output(state, host, self) {
            const source = getCurrentUnit(state, host);
            if (source === undefined || !hasSkill(source) || source.skill.activation === null) {
                return state;
            }

            const power = hasOffense(source) ? resolveAttack(state, source) : 0;
            state = healSelf(state, source.id, healRatio);

            for (const targetRef of self.execution.state.bindings.primary ?? []) {
                if (
                    getExecution(state, executionRef(host, self))?.execution.lifecycle !== "RUNNING"
                ) {
                    return state;
                }

                const currentSource = getCurrentUnit(state, host);
                const target = getCurrentUnit(state, targetRef);

                if (currentSource?.lifecycle !== "PRESENT" || !hasClassification(currentSource)) {
                    return state;
                }

                if (target === undefined || !skillTarget(state, currentSource, profile)(target)) {
                    continue;
                }

                const request: DamageRequest = {
                    attackType: "NORMAL",
                    applyWay: self.definition.applyWay,
                    source: unitRef(source),
                    killer: unitRef(source),
                    target: unitRef(target),
                    nature: "DAMAGE",
                    hitRecovery: true,
                    parameters: {
                        type: "PHYSICAL",
                        attack: { power, multiplier: attackScale, addition: 0 },
                        penetration: { fixed: 0, proportional: 0 },
                    },
                };
                state = applyDamage(request, calculateDamage(state, request)).state;
                const rng = createRng(state.execution.rngState);
                const applyStun = rng.chance(stunChance);
                state = { ...state, execution: { ...state.execution, rngState: rng.state() } };
                const survivor = getCurrentUnit(state, unitRef(target));
                if (applyStun && survivor !== undefined) {
                    state = install(state, unitRef(survivor), stun, {
                        source: unitRef(source),
                        expiration: { type: "DEADLINE", tick: state.tick + stunTicks },
                    }).state;
                }
            }

            return state;
        },
        onEnd(state, _host, self) {
            return self.execution.state.data.activation === null
                ? state
                : finish(state, self.execution.state.data.activation);
        },
    });
}

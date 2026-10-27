import {
    create as createAttack,
    type Attack,
    type Configuration as AttackConfiguration,
} from "../../actions/attack.js";
import {
    create as createSkillAttack,
    type State as SkillAttackState,
} from "../../actions/skill.js";
import { get as getAction, ref as actionRef } from "../../../core/unit/action/index.js";
import { get as getCurrentUnit, ref as unitRef } from "../../../core/unit/query.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { hasOffense } from "../../../core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../../core/unit/capability/offense/query.js";
import { hasSkill } from "../../../core/unit/capability/skill/capability.js";
import { finish } from "../../../core/unit/capability/skill/operations.js";
import { hasVitality } from "../../../core/unit/capability/vitality/capability.js";
import { calculateDamage } from "../../../core/battle/damage/calculate.js";
import { applyDamage } from "../../../core/battle/damage/apply.js";
import type { DamageRequest } from "../../../core/battle/damage/contract.js";
import * as filters from "../../../core/battle/targeting/filter.js";
import * as compare from "../../../core/battle/targeting/compare.js";
import { first } from "../../../core/battle/targeting/selector.js";
import { createRng } from "../../../core/common/rng.js";
import type { Direction } from "../../../core/geometry/direction.js";
import { fromTiles } from "../../../core/geometry/range.js";
import type { Profile } from "../../../data/arknights/operator.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import { stun } from "../../effects/stun.js";
import { install } from "../../../core/unit/effect/operations.js";
import { value, healSelf } from "./common.js";

function attackDefinition(
    profile: Profile,
    direction: Direction,
    skill: boolean,
    recoveryTicks: number,
): AttackConfiguration {
    const withinRange = filters.range(
        fromTiles(skill ? profile.skillRange! : profile.range, direction),
    );

    return {
        id: skill ? "mudrock/s2" : "normal-attack",
        speed: profile.attributes.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.attributes.baseAttackTime),
        recoveryTicks,
        followUps: [],
        targetGroups: [
            {
                id: "primary",
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: filters.and(
                        filters.damage,
                        filters.ground,
                        skill ? withinRange : filters.or(withinRange, filters.blocking),
                    ),
                    selector: first(
                        skill ? Number.MAX_SAFE_INTEGER : 1,
                        skill
                            ? compare.distance
                            : compare.combine(compare.blockedFirst, compare.distance),
                    ),
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: 0,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
    };
}

export function createNormal(
    profile: Profile,
    direction: Direction,
    recoveryTicks: number,
): Attack {
    return createAttack(attackDefinition(profile, direction, false, recoveryTicks));
}

export function createSkill(
    profile: Profile,
    direction: Direction,
    recoveryTicks: number,
): Attack<object, SkillAttackState> {
    const activeConfiguration = attackDefinition(profile, direction, true, recoveryTicks);
    const targeting = activeConfiguration.targetGroups[0].targeting;
    const attackScale = value(profile.skill.blackboard, "atk_scale");
    const healRatio = value(profile.skill.blackboard, "hp_ratio");
    const stunChance = value(profile.skill.blackboard, "buff_prob");
    const stunTicks = secondsToTicks(value(profile.skill.blackboard, "stun"));

    return createSkillAttack({
        ...activeConfiguration,
        markerId: "mudrock/s2",
        output(state, host, self) {
            const source = getCurrentUnit(state, host);

            if (source === undefined || !hasSkill(source) || source.skill.active === null) {
                return state;
            }

            const power = hasOffense(source) ? resolveAttack(state, unitRef(source))! : 0;
            state = healSelf(state, source.id, healRatio);

            for (const targetRef of self.execution.state.bindings.primary ?? []) {
                if (getAction(state, actionRef(host, self))?.execution.status !== "RUNNING") {
                    return state;
                }

                const currentSource = getCurrentUnit(state, host);
                const target = getCurrentUnit(state, targetRef);

                if (currentSource?.lifecycle !== "PRESENT") {
                    return state;
                }

                if (
                    target === undefined ||
                    !hasVitality(target) ||
                    !hasTargetable(target) ||
                    !targeting.filter(
                        state,
                        { ...targeting, source: unitRef(currentSource) },
                        target,
                    )
                ) {
                    continue;
                }

                const request: DamageRequest = {
                    source: unitRef(source),
                    target: unitRef(target),
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
                        source: source.id,
                        scopes: [{ type: "TICK", tick: state.tick + stunTicks }],
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

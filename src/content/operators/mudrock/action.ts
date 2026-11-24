import type { Timing } from "../../actions/timing.js";
import {
    create as createAttack,
    faceTarget,
    sourceAttack,
    type Attack,
} from "../../actions/attack.js";
import {
    create as createSkillAttack,
    type State as SkillAttackState,
} from "../../actions/skill.js";
import { executionRef } from "../../../core/unit/capability/action/index.js";
import { ref as unitRef, all as allUnits, type Unit } from "../../../core/unit/index.js";
import {
    hasTargetable,
    type Targetable,
} from "../../../core/unit/capability/targetable/capability.js";
import { resolveAttack, type Offense } from "../../../core/unit/capability/offense/index.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";

import { finish, type SkillCapability } from "../../../core/unit/capability/skill/index.js";

import type { Vitality } from "../../../core/unit/capability/vitality/index.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/resource/hp/damage/index.js";

import * as targeting from "../../../core/battle/targeting/index.js";
import { hasBlockable, type Blocker } from "../../../core/unit/capability/blocking/index.js";
import type { Occupancy } from "../../../core/unit/capability/occupancy/index.js";
import { hasLayer, type Layer } from "../../../core/unit/capability/layer/index.js";
import type { TilePosition } from "../../../core/geometry/coordinate.js";
import { fromTiles } from "../../../core/geometry/range.js";
import { sort, topK } from "../../../core/common/collection/order.js";
import type { State as BattleState } from "../../../core/battle/index.js";

import { createRng } from "../../../core/common/rng.js";
import { stun } from "../../../core/effects/control.js";
import { install } from "../../../core/unit/effect/index.js";
import { healSelf } from "./common.js";

export type AttackHost = Classification & Occupancy & Blocker & Offense;

export interface NormalAttackParameters {
    readonly range: readonly TilePosition[];
    readonly timing: Timing;
}

export interface SkillActionParameters {
    readonly range: readonly TilePosition[];
    readonly attackScale: number;
    readonly healRatio: number;
    readonly stunChance: number;
    readonly stunTicks: number;
}

const inDefaultCategory = targeting.inCategories(["DEFAULT"]);

type Target = Unit & Targetable & Vitality & Classification & Layer;

function groundTarget(battle: BattleState, self: Unit & Classification) {
    const eligible = targeting.damage(self)(battle);

    return (target: Unit): target is Target =>
        hasTargetable(target) &&
        eligible(target) &&
        hasLayer(target) &&
        target.layer.type === "GROUND";
}

function inAttackRange(self: Unit & Occupancy, range: readonly TilePosition[]) {
    const { direction } = self.occupancy;

    return direction === null
        ? () => false
        : targeting.inRange(self.position, fromTiles(range, direction));
}

function skillTarget(
    battle: BattleState,
    self: Unit & Classification & Occupancy,
    range: readonly TilePosition[],
) {
    const eligible = groundTarget(battle, self);
    const withinRange = inAttackRange(self, range);

    return (target: Unit): target is Target =>
        eligible(target) && inDefaultCategory(target) && withinRange(target);
}

export function skillTargets(
    battle: BattleState,
    self: Unit & Classification & Occupancy,
    range: readonly TilePosition[],
) {
    return allUnits(battle).filter(skillTarget(battle, self, range));
}

export function createNormal({
    range,
    timing,
}: NormalAttackParameters): Attack<object, object, AttackHost> {
    return createAttack<AttackHost>({
        id: "normal-attack",
        triggerBindingId: "primary",
        period: { type: "ATTACK_SPEED" },
        timing,
        followUps: [],
        onStart: faceTarget,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = source.get(battle);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const withinRange = inAttackRange(self, range);
                    const candidates = allUnits(battle)
                        .filter(groundTarget(battle, self))
                        .filter(
                            (target) =>
                                (inDefaultCategory(target) && withinRange(target)) ||
                                (hasBlockable(target) &&
                                    target.blockable.relation?.blocker.id === self.id),
                        );
                    const blockedFirst = targeting.blockedFirst(self);
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates,
                            1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(unitRef),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        attackType: "NORMAL",
                        applyWay: "MELEE",
                        power: sourceAttack,
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
    });
}

export function createSkill({
    range,
    attackScale,
    healRatio,
    stunChance,
    stunTicks,
}: SkillActionParameters): Attack<object, SkillAttackState, AttackHost & SkillCapability> {
    return createSkillAttack<AttackHost>({
        id: "mudrock/s2",
        triggerBindingId: "primary",
        period: { type: "FIXED", ticks: 0 },
        timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 },
        followUps: [],
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = source.get(battle);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const targets = skillTargets(battle, self, range);

                    return {
                        state: battle,
                        value: sort(targets, targeting.distance(self.position)).map(unitRef),
                    };
                },
                operations: [],
            },
        ],
        applyWay: "MELEE",
        output(state, host, self) {
            const source = host.get(state);
            if (source?.skill.activation == null) {
                return state;
            }

            const power = resolveAttack(state, source);
            state = healSelf(state, host, healRatio);

            for (const targetRef of self.execution.state.bindings.primary ?? []) {
                if (executionRef(host, self).get(state)?.execution.lifecycle !== "ACTIVE") {
                    return state;
                }

                const currentSource = host.get(state);
                const target = targetRef.get(state);

                if (currentSource?.lifecycle !== "ACTIVE") {
                    return state;
                }

                if (target === undefined || !skillTarget(state, currentSource, range)(target)) {
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
                const survivor = unitRef(target).get(state);
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

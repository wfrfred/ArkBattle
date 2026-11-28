import {
    groundTarget,
    inAttackRange,
    inDefaultCategory,
    selectNormalMeleeTarget,
} from "../targeting.js";
import { normalMeleeOutput } from "../../actions/normal-melee.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import {
    create as createAttack,
    createWithState,
    faceTarget,
    type Attack,
} from "../../actions/attack.js";
import { ref as executionRef } from "../../../core/unit/capability/action/index.js";
import { ref as unitRef, all as allUnits, type Unit } from "../../../core/unit/index.js";
import { type Targetable } from "../../../core/unit/capability/targetable/capability.js";
import { resolveAttack, type Offense } from "../../../core/unit/capability/offense/index.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";

import {
    finish,
    ref as activationRef,
    type ActivationRef,
    type SkillCapability,
} from "../../../core/unit/capability/skill/index.js";

import type { Vitality } from "../../../core/unit/capability/vitality/index.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/resource/hp/damage/index.js";

import * as targeting from "../../../core/battle/targeting/index.js";
import type { Blocker } from "../../../core/unit/capability/blocking/index.js";
import type { Occupancy } from "../../../core/unit/capability/occupancy/index.js";
import type { Layer } from "../../../core/unit/capability/layer/index.js";
import type { TilePosition } from "../../../core/geometry/coordinate.js";
import { sort } from "../../../core/common/collection/order.js";
import type { State as BattleState } from "../../../core/battle/index.js";

import { createRng } from "../../../core/common/rng.js";
import { stun } from "../../../core/effects/control.js";
import { install } from "../../../core/effect/index.js";
import { healSelf } from "./common.js";

export type AttackHost = Classification & Occupancy & Blocker & Offense;

export interface NormalAttackParameters {
    readonly range: readonly TilePosition[];
}

interface SkillAttackState {
    readonly activation: ActivationRef | null;
}

export interface SkillActionParameters {
    readonly range: readonly TilePosition[];
    readonly attackScale: number;
    readonly healRatio: number;
    readonly stunChance: number;
    readonly stunTicks: number;
}

const timing = {
    type: "ATTACK_SPEED",
    beginTicks: 0,
    durationTicks: 48,
    releaseTicks: 19,
    minScale: 0.1,
    maxScale: 1,
} satisfies AttackSpeedTiming;

type Target = Unit & Targetable & Vitality & Classification & Layer;

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
}: NormalAttackParameters): Attack<object, object, AttackHost> {
    return createAttack<AttackHost>({
        id: "normal-attack",
        period: { type: "ATTACK_SPEED" },
        timing,
        onStart: faceTarget,
        applyWay: "MELEE",
        select(battle, source) {
            const self = source.get(battle);
            if (self === undefined) {
                return { state: battle, value: [] };
            }

            return {
                state: battle,
                value: selectNormalMeleeTarget(battle, self, range),
            };
        },
        output: normalMeleeOutput,
    });
}

export function createSkill({
    range,
    attackScale,
    healRatio,
    stunChance,
    stunTicks,
}: SkillActionParameters): Attack<object, SkillAttackState, AttackHost & SkillCapability> {
    return createWithState<object, SkillAttackState, AttackHost & SkillCapability>({
        id: "mudrock/s2",
        initialize: (battle) => ({ state: battle, value: {} }),
        prepare(battle, host) {
            const activation = host.get(battle)?.skill.activation;

            return {
                state: battle,
                value: { activation: activation == null ? null : activationRef(activation) },
            };
        },
        period: { type: "FIXED", ticks: 0 },
        timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 },
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
        applyWay: "MELEE",
        output(state, host, self, action) {
            const source = host.get(state);
            if (source?.skill.activation == null) {
                return state;
            }

            const { applyWay } = action.get(state)!.definition;
            const power = resolveAttack(state, source);
            state = healSelf(state, host, healRatio);

            for (const targetRef of self.state.targets) {
                if (executionRef(self).get(state)?.lifecycle !== "ACTIVE") {
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
                    applyWay,
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
                state = applyDamage(request, calculateDamage(state, request, null), null).state;
                const rng = createRng(state.execution.rngState);
                const applyStun = rng.chance(stunChance);
                state = { ...state, execution: { ...state.execution, rngState: rng.state() } };
                const survivor = unitRef(target).get(state);
                if (applyStun && survivor !== undefined) {
                    state = install(state, unitRef(survivor), stun, {
                        source: unitRef(source),
                        scopes: [],
                        expiration: { type: "DEADLINE", tick: state.tick + stunTicks },
                        enabled: true,
                    }).state;
                }
            }

            return state;
        },
        onEnd(state, _host, self) {
            return self.state.data.activation === null
                ? state
                : finish(state, self.state.data.activation);
        },
    });
}

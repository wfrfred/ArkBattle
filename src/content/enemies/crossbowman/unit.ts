import { assertPositiveNumber } from "../../../core/common/assert.js";
import { Hooks } from "../../../core/hook.js";
import { perSecondToPerTick, TICKS_PER_SECOND } from "../../../core/tick.js";
import { ref } from "../../../core/unit/index.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { hasExecution, type ActionCapability } from "../../../core/unit/capability/action/index.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import type { Rank } from "../../../core/unit/capability/classification/index.js";
import type { Presence } from "../../../core/unit/capability/presence/index.js";
import type { Route } from "../../../core/unit/capability/route/index.js";
import type { Shiftable } from "../../../core/unit/capability/shifting/index.js";
import type { Timing as AttackTiming } from "../../actions/timing.js";
import { create as createElemental } from "../../elemental.js";
import type { Enemy } from "../enemy.js";
import { faceRoute, restrictMovementDuringAction } from "../hook.js";
import { createMelee, createRanged } from "./action.js";
import type { Projectile } from "./projectile.js";

export interface Parameters {
    readonly motion: string;
    readonly maxHp: number;
    readonly attack: number;
    readonly defense: number;
    readonly resistance: number;
    readonly recoverySpeed: number;
    readonly taunt: number;
    readonly moveSpeedPerSecond: number;
    readonly filterTags: readonly string[];
    readonly rank: Rank;
    readonly blockVolume: number;
    readonly massLevel: number;
    readonly stunImmune: boolean;
    readonly hitRadius: number;
    readonly movement: Pick<Definition["locomotion"], "steeringParameters" | "halfBodyWidth"> &
        Pick<Definition["route"], "alwaysCheckCurrentPoint">;
    readonly attackSpeed: number;
    readonly baseAttackTime: number;
    readonly timing: { readonly melee: AttackTiming; readonly ranged: AttackTiming };
    readonly rangeRadius: number;
    readonly projectile: Projectile;
}

export type Crossbowman = Enemy &
    Blockable &
    Shiftable &
    Route &
    Presence &
    ActionCapability<Crossbowman>;

export type Definition = Crossbowman["definition"];

export function create(parameters: Parameters) {
    if (parameters.motion !== "WALK") {
        throw new TypeError(`unsupported enemy motion ${parameters.motion}`);
    }
    if (parameters.stunImmune) {
        throw new TypeError("this enemy content does not implement stun immunity");
    }
    if (parameters.blockVolume === 0) {
        throw new TypeError("this enemy content requires a blockable ground unit");
    }

    const { hitRadius, movement } = parameters;
    assertPositiveNumber(hitRadius, "enemy hit radius");

    const melee = createMelee(parameters.timing.melee);
    const ranged = createRanged(
        parameters.rangeRadius,
        parameters.timing.ranged,
        parameters.projectile,
    );

    return {
        id: "enemy_1003_ncbow",
        hooks: Hooks.empty()
            .set(unitHooks.entered, {
                id: "enemy/restrict-movement-during-action",
                invoke: restrictMovementDuringAction,
            })
            .set(unitHooks.entered, {
                id: "enemy/face-route",
                invoke: faceRoute,
            }),
        elemental: createElemental({ receiver: "ENEMY", boss: parameters.rank === "BOSS" }),
        facing: { restrictions: [] },
        vitality: {
            maxHp: { default: parameters.maxHp, min: 1, max: null },
            defense: { default: parameters.defense, min: 0, max: null },
            resistance: { default: parameters.resistance, min: 0, max: 100 },
            recoverySpeed: { default: parameters.recoverySpeed, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        offense: { attack: { default: parameters.attack, min: 0, max: null } },
        classification: {
            type: "ENEMY",
            side: "ENEMY",
            filterTags: parameters.filterTags,
            rank: parameters.rank,
        },
        layer: { type: "GROUND" },
        hitbox: {
            shape: { type: "CIRCLE", offset: [0, 0], radius: hitRadius },
        },
        blockable: { volume: parameters.blockVolume, restrictions: [] },
        locomotion: {
            speed: {
                default: perSecondToPerTick(parameters.moveSpeedPerSecond),
                min: perSecondToPerTick(0.1),
                max: null,
            },
            steeringParameters: movement.steeringParameters,
            halfBodyWidth: movement.halfBodyWidth,
        },
        shiftable: {
            massLevel: { default: parameters.massLevel, min: 0, max: null },
            restrictions: [],
            body: {
                shape: {
                    type: "CAPSULE",
                    offset: [0, -0.1],
                    radius: 0.1,
                    halfLength: 0.1,
                    axis: "Y",
                },
                mass: 1,
                frictionFactor: 1,
            },
        },
        route: { alwaysCheckCurrentPoint: movement.alwaysCheckCurrentPoint },
        presence: {},
        targetable: {
            category: "DEFAULT",
            taunt: { default: parameters.taunt, min: -2, max: 2 },
            restrictions: [],
        },
        action: {
            speed: { default: parameters.attackSpeed, min: 20, max: null },
            interval: { default: parameters.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [melee, ranged],
            select: (battle, self) => ({
                state: battle,
                value: hasExecution(battle, ref(self))
                    ? []
                    : [self.blockable.relation !== null ? melee.id : ranged.id],
            }),
        },
    } satisfies Definition;
}

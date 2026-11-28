import { Hooks } from "../../../core/hook.js";
import { perSecondToPerTick, TICKS_PER_SECOND } from "../../../core/tick.js";
import type { ActionCapability } from "../../../core/unit/capability/action/index.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import type { Presence } from "../../../core/unit/capability/presence/index.js";
import type { Route } from "../../../core/unit/capability/route/index.js";
import type { Shiftable } from "../../../core/unit/capability/shifting/index.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { enemyBursts } from "../../../core/effects/elemental/index.js";
import { enemyId, type Parameters } from "./parameters.js";
import type { Enemy } from "../enemy.js";
import { faceRoute, restrictMovementDuringAction } from "../hook.js";
import { create as createAttack } from "./action.js";

export type Hound = Enemy & Blockable & Shiftable & Route & Presence & ActionCapability<Hound>;

export type Definition = Hound["definition"];

export function create(parameters: Parameters) {
    const attack = createAttack();

    return {
        id: enemyId,
        hooks: Hooks.empty()
            .set(unitHooks.entered, {
                id: "enemy/restrict-movement-during-action",
                priority: 0,
                invoke: restrictMovementDuringAction,
            })
            .set(unitHooks.entered, {
                id: "enemy/face-route",
                priority: 0,
                invoke: faceRoute,
            }),
        elemental: {
            maxEp: { default: parameters.rank === "BOSS" ? 2000 : 1000, min: 1, max: null },
            recoverySpeed: { default: 0, min: 0, max: null },
            elementResistance: { default: 0, min: 0, max: 100 },
            damageResistance: { default: 0, min: 0, max: 100 },
            burstRecoverySpeed: { default: 1, min: 0, max: null },
            bursts: enemyBursts,
        },
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
            shape: { type: "CIRCLE", offset: [0, 0], radius: 0.2 },
        },
        blockable: { volume: parameters.blockVolume, restrictions: [] },
        locomotion: {
            speed: {
                default: perSecondToPerTick(parameters.moveSpeedPerSecond),
                min: perSecondToPerTick(0.1),
                max: null,
            },
            steeringParameters: {
                steeringFactor: 8 / TICKS_PER_SECOND,
                maxSteeringForce: 10 / TICKS_PER_SECOND ** 2,
            },
            halfBodyWidth: 0.20000000298023224,
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
        route: { alwaysCheckCurrentPoint: false },
        presence: {},
        targetable: {
            category: "DEFAULT",
            taunt: { default: parameters.taunt, min: -2, max: 2 },
            restrictions: [],
        },
        action: {
            speed: { default: parameters.attackSpeed, min: 20, max: null },
            interval: { default: parameters.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [attack],
        },
    } satisfies Definition;
}

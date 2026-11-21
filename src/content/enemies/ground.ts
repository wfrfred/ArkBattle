import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import { createArknightsElementalDefinition } from "../../data/effect/elemental.js";

import { update as updateUnit, get as getUnit, ref as unitRef } from "../../core/unit/index.js";
import { Vec2 } from "../../core/common/vector.js";
import { hasAction, hasExecution } from "../../core/unit/capability/action/index.js";
import type { Blockable } from "../../core/unit/capability/blocking/index.js";
import {
    hasLocomotion,
    setRestriction,
    type Restriction,
} from "../../core/unit/capability/locomotion/index.js";
import { hasFacing, fromVector, turn } from "../../core/unit/capability/facing/index.js";
import { hasRoute, movementTarget, type Route } from "../../core/unit/capability/route/index.js";
import type { Presence } from "../../core/unit/capability/presence/index.js";
import type { Shiftable } from "../../core/unit/capability/shifting/index.js";

import type { Profile } from "../../data/unit/enemy.js";
import { perSecondToPerTick } from "../../data/time.js";
import { assertPositiveNumber } from "../../core/common/assert.js";

import type { Enemy } from "./enemy.js";

const castingRestriction: Restriction = {
    allows: (battle, { self }) => !hasAction(self) || !hasExecution(battle, unitRef(self)),
};

export type GroundEnemy = Enemy & Blockable & Shiftable & Route & Presence;

export type Definition = GroundEnemy["definition"];

export function createDefinition(
    profile: Profile,
    hitRadius: number,
    movement: Pick<Definition["locomotion"], "steeringParameters" | "halfBodyWidth">,
): Definition {
    if (profile.stunImmune) {
        throw new TypeError("this enemy content does not implement stun immunity");
    }
    if (profile.blockVolume === 0) {
        throw new TypeError("this enemy content requires a blockable ground unit");
    }

    assertPositiveNumber(hitRadius, "enemy hit radius");

    const elemental = createArknightsElementalDefinition({
        receiver: "ENEMY",
        boss: profile.rank === "BOSS",
    });

    return {
        id: profile.id,
        hooks: Hooks.empty()
            .set(unitHooks.entered, {
                id: "ground-enemy/movement-casting-rule",
                invoke(battle, self) {
                    return {
                        state: !hasLocomotion(self)
                            ? battle
                            : updateUnit(
                                  battle,
                                  unitRef(self),
                                  setRestriction({
                                      id: "attack-casting",
                                      value: castingRestriction,
                                  }),
                              ),
                        value: undefined,
                    };
                },
            })
            .set(unitHooks.entered, {
                id: "ground-enemy/facing",
                invoke(battle, self) {
                    const current = getUnit(battle, unitRef(self));
                    if (current !== undefined && hasRoute(current) && hasFacing(current)) {
                        const target = movementTarget(battle, unitRef(current));
                        const direction =
                            target === null
                                ? null
                                : fromVector(Vec2.sub(target.nextPoint, current.position));

                        if (direction !== null) {
                            battle = turn(battle, unitRef(current), direction, "FORCED");
                        }
                    }

                    return { state: battle, value: undefined };
                },
            }),
        elemental,
        facing: { restrictions: [] },
        vitality: {
            maxHp: { default: profile.maxHp, min: 1, max: null },
            defense: { default: profile.defense, min: 0, max: null },
            resistance: { default: profile.resistance, min: 0, max: 100 },
            recoverySpeed: { default: profile.recoverySpeed, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        offense: { attack: { default: profile.attack, min: 0, max: null } },
        classification: {
            type: "ENEMY",
            side: "ENEMY",
            filterTags: profile.filterTags,
            rank: profile.rank,
        },
        layer: { type: "GROUND" },
        hitbox: {
            shape: { type: "CIRCLE", offset: [0, 0], radius: hitRadius },
        },
        blockable: { volume: profile.blockVolume, restrictions: [] },
        locomotion: {
            speed: {
                default: perSecondToPerTick(profile.moveSpeedPerSecond),
                min: perSecondToPerTick(0.1),
                max: null,
            },
            steeringParameters: movement.steeringParameters,
            halfBodyWidth: movement.halfBodyWidth,
        },
        shiftable: {
            massLevel: { default: profile.massLevel, min: 0, max: null },
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
        route: { alwaysCheckCurrentPoint: true },
        presence: {},
        targetable: {
            category: "DEFAULT",
            taunt: { default: profile.taunt, min: -2, max: 2 },
            restrictions: [],
        },
    };
}

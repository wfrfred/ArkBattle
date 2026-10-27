import { update as updateUnit } from "../../core/battle/unit.js";
import { createArknightsElementalDefinition } from "../../data/arknights/elemental.js";

import { ref as unitRef } from "../../core/unit/query.js";
import { isCasting } from "../../core/unit/action/operations.js";
import { hasLocomotion } from "../../core/unit/capability/locomotion/capability.js";
import { setRule } from "../../core/unit/capability/locomotion/operations.js";
import { Definitions } from "../../core/unit/action/definitions.js";
import { create as createAttack, type Attack } from "../actions/attack.js";
import type { Profile } from "../../data/arknights/enemy.js";
import { perSecondToPerTick, secondsToTicks } from "../../data/arknights/tick.js";
import { assertNonnegativeSafeInteger, assertPositiveNumber } from "../../core/common/assert.js";
import type { Definition as UnitDefinition } from "../../core/unit/unit.js";
import type { Definitions as CapabilityDefinitions } from "../../core/unit/capability/catalog.js";
import type { Range } from "../../core/geometry/range.js";
import * as filters from "../../core/battle/targeting/filter.js";
import * as compare from "../../core/battle/targeting/compare.js";
import { first } from "../../core/battle/targeting/selector.js";

export type Scope =
    { readonly type: "RANGE"; readonly geometry: Range } | { readonly type: "BLOCKER" };

export interface AttackTiming {
    readonly windupTicks: number;
    readonly recoveryTicks: number;
    readonly hitRadius: number;
}

export interface Definition
    extends
        UnitDefinition,
        Pick<
            CapabilityDefinitions,
            | "action"
            | "allegiance"
            | "blockable"
            | "elemental"
            | "hitbox"
            | "layer"
            | "locomotion"
            | "offense"
            | "spatialPresence"
            | "targetable"
            | "vitality"
        > {
    readonly attack: Attack;
    readonly massLevel: number;
}

export function createDefinition(
    profile: Profile,
    timing: AttackTiming,
    scope: Scope,
    halfBodyWidth: number,
): Definition {
    if (profile.stunImmune) {
        throw new TypeError("this enemy content does not implement stun immunity");
    }
    if (profile.blockVolume === 0) {
        throw new TypeError("this enemy content requires a blockable ground unit");
    }

    assertNonnegativeSafeInteger(timing.windupTicks, "enemy attack windup");
    assertNonnegativeSafeInteger(timing.recoveryTicks, "enemy attack recovery");
    assertPositiveNumber(timing.hitRadius, "enemy hit radius");

    const combat = filters.and(filters.present, filters.alive, filters.hostile, filters.blocker);
    const attack = createAttack({
        id: "normal-attack",
        speed: profile.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.baseAttackTime),
        windupTicks: timing.windupTicks,
        recoveryTicks: timing.recoveryTicks,
        targetGroups: [
            {
                id: "primary",
                targeting: {
                    purposes: ["DAMAGE"],
                    filter:
                        scope.type === "BLOCKER"
                            ? combat
                            : filters.or(
                                  combat,
                                  filters.and(filters.damage, filters.range(scope.geometry)),
                              ),
                    selector: first(1, compare.combine(compare.blockedFirst, compare.distance)),
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: profile.attack,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
        followUps: [],
    });

    const elemental = createArknightsElementalDefinition({ receiver: "ENEMY" });

    return {
        id: profile.id,
        massLevel: profile.mass,
        hooks: [
            {
                id: "ground-enemy/movement-casting-rule",
                stage: "enter",
                invoke(battle, self) {
                    return {
                        state: !hasLocomotion(self)
                            ? battle
                            : updateUnit(battle, [
                                  {
                                      ...self,
                                      locomotion: setRule(self.locomotion, {
                                          id: "attack-casting",
                                          allows: (current, self) =>
                                              !isCasting(current, unitRef(self)),
                                      }),
                                  },
                              ]),
                        value: undefined,
                    };
                },
            },
        ],
        elemental,
        vitality: {
            maxHp: profile.maxHp,
            defense: profile.defense,
            resistance: profile.resistance,
        },
        offense: { attack: profile.attack },
        allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" },
        hitbox: {
            shape: { type: "CIRCLE", offset: [0, 0], radius: timing.hitRadius },
        },
        blockable: { volume: profile.blockVolume },
        locomotion: {
            speed: perSecondToPerTick(profile.moveSpeedPerSecond),
            minSpeed: perSecondToPerTick(0.1),
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
            halfBodyWidth,
        },
        spatialPresence: {},
        targetable: { restrictions: [] },
        action: { definitions: Definitions.empty().add(attack) },
        attack,
    };
}

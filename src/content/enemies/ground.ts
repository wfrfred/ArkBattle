import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import { update as updateUnit } from "../../core/battle/unit.js";
import { createArknightsElementalDefinition } from "../../data/arknights/elemental.js";

import { ref as unitRef, type Definition as UnitDefinition } from "../../core/unit/index.js";
import { isCasting } from "../../core/unit/action/index.js";
import { hasAction } from "../../core/unit/capability/action/index.js";
import { hasLocomotion, setRule } from "../../core/unit/capability/locomotion/index.js";

import type { Profile } from "../../data/arknights/enemy.js";
import { perSecondToPerTick } from "../../data/arknights/tick.js";
import { assertPositiveNumber } from "../../core/common/assert.js";

import type { Definitions as CapabilityDefinitions } from "../../core/unit/capability/catalog.js";

export interface Definition
    extends
        UnitDefinition,
        Pick<
            CapabilityDefinitions,
            | "allegiance"
            | "blockable"
            | "elemental"
            | "hitbox"
            | "layer"
            | "locomotion"
            | "offense"
            | "route"
            | "spatialPresence"
            | "targetable"
            | "vitality"
        > {
    readonly massLevel: number;
}

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

    const elemental = createArknightsElementalDefinition({ receiver: "ENEMY" });

    return {
        id: profile.id,
        massLevel: profile.mass,
        hooks: Hooks.empty().set(unitHooks.enter, {
            id: "ground-enemy/movement-casting-rule",
            invoke(battle, self) {
                return {
                    state: !hasLocomotion(self)
                        ? battle
                        : updateUnit(
                              battle,
                              unitRef(self),
                              setRule({
                                  id: "attack-casting",
                                  allows: (current, { self }) =>
                                      !hasAction(self) || !isCasting(current, unitRef(self)),
                              }),
                          ),
                    value: undefined,
                };
            },
        }),
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
            shape: { type: "CIRCLE", offset: [0, 0], radius: hitRadius },
        },
        blockable: { volume: profile.blockVolume, rules: [] },
        locomotion: {
            speed: perSecondToPerTick(profile.moveSpeedPerSecond),
            minSpeed: perSecondToPerTick(0.1),
            steeringParameters: movement.steeringParameters,
            halfBodyWidth: movement.halfBodyWidth,
        },
        route: { alwaysCheckCurrentPoint: true },
        spatialPresence: {},
        targetable: { taunt: profile.taunt, restrictions: [] },
    };
}

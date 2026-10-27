import { update as updateUnit } from "../../core/battle/unit.js";
import { createArknightsElementalDefinition } from "../../data/arknights/elemental.js";

import { ref as unitRef } from "../../core/unit/query.js";
import { isCasting } from "../../core/unit/action/operations.js";
import { hasLocomotion } from "../../core/unit/capability/locomotion/capability.js";
import { setRule } from "../../core/unit/capability/locomotion/operations.js";
import type { Profile } from "../../data/arknights/enemy.js";
import { perSecondToPerTick } from "../../data/arknights/tick.js";
import { assertPositiveNumber } from "../../core/common/assert.js";
import type { Definition as UnitDefinition } from "../../core/unit/unit.js";
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
            | "spatialPresence"
            | "targetable"
            | "vitality"
        > {
    readonly massLevel: number;
}

export function createDefinition(
    profile: Profile,
    hitRadius: number,
    halfBodyWidth: number,
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
            shape: { type: "CIRCLE", offset: [0, 0], radius: hitRadius },
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
    };
}

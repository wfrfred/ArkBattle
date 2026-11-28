import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import type { State as TileState } from "../../core/battlefield/map/tile.js";
import type { Deployable } from "../../core/unit/capability/deployable/index.js";
import { hasOccupancy, type Occupancy } from "../../core/unit/capability/occupancy/index.js";
import type { Targetable } from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import type { Device } from "./device.js";
import type { ArknightsCharacterInstanceConfig } from "../../data/level/definition.js";
import { resolveParameters, type Parameters } from "./parameters.js";
import { apply, restore } from "./tile.js";

export type { Parameters } from "./parameters.js";

export type Crate = Device & Vitality & Targetable & Occupancy & Deployable;

export type Definition = Crate["definition"];

export function resolve(
    configuration: ArknightsCharacterInstanceConfig,
    characterValue: unknown,
): Parameters {
    return resolveParameters(configuration, characterValue, "trap_1105_accrate");
}

export function create(parameters: Parameters): Definition {
    const { maxHp, recoverySpeed, taunt, groupTags } = parameters;
    const tileChanges = { placement: "NONE", walkCost: 1000 } satisfies Partial<TileState>;

    return {
        id: "trap_1105_accrate",
        classification: {
            type: "DEVICE",
            side: "ALLY",
            filterTags: [],
            groupTags,
        },
        targetable: {
            category: "OBSTACLE",
            taunt: { default: taunt, min: -2, max: 2 },
            restrictions: [],
        },
        vitality: {
            defense: { default: 0, min: 0, max: null },
            resistance: { default: 0, min: 0, max: 100 },
            maxHp: { default: maxHp, min: 1, max: null },
            recoverySpeed: { default: recoverySpeed, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        deployable: { retreatRestrictions: [], refund: null },
        occupancy: { slot: "OCCUPANT" },
        hooks: Hooks.empty()
            .set(unitHooks.entered, {
                id: "crate/apply-tile",
                priority: 0,
                invoke(battle, self) {
                    return {
                        state: hasOccupancy(self)
                            ? apply(battle, self.occupancy.tile, tileChanges)
                            : battle,
                        value: undefined,
                    };
                },
            })
            .set(unitHooks.removed, {
                id: "crate/restore-tile",
                priority: 0,
                invoke(battle, { unit }) {
                    return {
                        state: hasOccupancy(unit)
                            ? restore(battle, unit.occupancy.tile, tileChanges)
                            : battle,
                        value: undefined,
                    };
                },
            }),
    };
}

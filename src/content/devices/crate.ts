import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import type { State as TileState } from "../../core/battlefield/map/tile.js";
import type { Deployable } from "../../core/unit/capability/deployable/index.js";
import { hasOccupancy, type Occupancy } from "../../core/unit/capability/occupancy/index.js";
import type { Targetable } from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import type { Device } from "./device.js";
import { apply, restore } from "./tile.js";

export type Crate = Device & Vitality & Targetable & Occupancy & Deployable;

export type Definition = Crate["definition"];

export interface Parameters extends Pick<
    Definition,
    "id" | "classification" | "vitality" | "deployable"
> {
    readonly taunt: number;
    readonly tileChanges: Partial<TileState>;
}

export function create(parameters: Parameters): Definition {
    const { id, classification, taunt, vitality, deployable } = parameters;
    const tileChanges = { ...parameters.tileChanges, walkCost: 1000 };

    return {
        id,
        classification,
        targetable: {
            category: "OBSTACLE",
            taunt: { default: taunt, min: -2, max: 2 },
            restrictions: [],
        },
        vitality,
        deployable,
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

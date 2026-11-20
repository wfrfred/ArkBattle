import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import { hasOccupancy } from "../../core/unit/capability/occupancy/index.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

export function create(configuration: Configuration): Definition {
    const { id, classification, taunt, vitality, deployable, card } = configuration;
    const tileChanges = { ...configuration.tileChanges, walkCost: 1000 };

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
        card,
        occupancy: { slot: "OCCUPANT" },
        hooks: Hooks.empty()
            .set(unitHooks.entered, {
                id: "crate/apply-tile",
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

import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import { hasOccupancy } from "../../core/unit/capability/occupancy/index.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

export function create(configuration: Configuration): Definition {
    const { id, vitality, deployable, card } = configuration;
    const tileChanges = { ...configuration.tileChanges, walkCost: 1000 };

    return {
        id,
        vitality,
        deployable,
        card,
        occupancy: { slot: "OCCUPANT" },
        hooks: Hooks.empty()
            .set(unitHooks.enter, {
                id: "crate/apply-tile",
                invoke(battle, self) {
                    return {
                        state:
                            !hasOccupancy(self) || self.occupancy.tile === null
                                ? battle
                                : apply(battle, self.occupancy.tile, tileChanges),
                        value: undefined,
                    };
                },
            })
            .set(unitHooks.leave, {
                id: "crate/restore-tile",
                invoke(battle, { unit }) {
                    return {
                        state:
                            !hasOccupancy(unit) || unit.occupancy.tile === null
                                ? battle
                                : restore(battle, unit.occupancy.tile, tileChanges),
                        value: undefined,
                    };
                },
            }),
    };
}

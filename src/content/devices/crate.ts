import { hasOccupancy } from "../../core/unit/capability/occupancy/capability.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

export function create(configuration: Configuration): Definition {
    const { id, vitality, deployable } = configuration;
    const tileChanges = { ...configuration.tileChanges, walkCost: 1000 };

    return {
        id,
        vitality,
        deployable,
        occupancy: { slot: "OCCUPANT" },
        hooks: [
            {
                id: "crate/apply-tile",
                stage: "enter",
                invoke(battle, self) {
                    return {
                        state:
                            !hasOccupancy(self) || self.occupancy.tile === null
                                ? battle
                                : apply(battle, self.occupancy.tile, tileChanges),
                        value: undefined,
                    };
                },
            },
            {
                id: "crate/restore-tile",
                stage: "leave",
                invoke(battle, { unit }) {
                    return {
                        state:
                            !hasOccupancy(unit) || unit.occupancy.tile === null
                                ? battle
                                : restore(battle, unit.occupancy.tile, tileChanges),
                        value: undefined,
                    };
                },
            },
        ],
    };
}

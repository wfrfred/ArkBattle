import type { State as BattleState } from "../../core/battle/index.js";
import { remove as removeUnit, update } from "../../core/battle/unit.js";
import { at as occupancyAt } from "../../core/battlefield/occupancy.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { hasOccupancy } from "../../core/unit/capability/occupancy/index.js";
import {
    hasBlocker,
    removeBlockerRule as removeRule,
    setBlockerRule as setRule,
} from "../../core/unit/capability/blocking/index.js";
import { ref as unitRef } from "../../core/unit/index.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

function clearOccupant(battle: BattleState, position: TilePosition): BattleState {
    const occupant = occupancyAt(battle.battlefield, position)?.occupant;

    return occupant == null ? battle : removeUnit(battle, occupant.id, "DEATH");
}

export function create(configuration: Configuration): Definition {
    const { id, vitality, deployable, card } = configuration;
    const tileChanges = {
        ...configuration.tileChanges,
        walkCost: 1000,
    };

    return {
        id,
        vitality,
        deployable,
        card,
        occupancy: {
            slot: "SUPPORT",
            hooks: [
                {
                    id: "shooting-platform/block-passenger",
                    stage: "occupantAdded",
                    invoke(battle, { support, occupant }) {
                        const ruleId = `shooting-platform/${support.id}/block-free`;

                        return {
                            state: hasBlocker(occupant)
                                ? update(battle, [
                                      setRule(unitRef(occupant), {
                                          id: ruleId,
                                          allows: (_battle, { blocker }) =>
                                              blocker.blocker.layer === "AIR",
                                      }),
                                  ])
                                : battle,
                            value: undefined,
                        };
                    },
                },
                {
                    id: "shooting-platform/unblock-passenger",
                    stage: "occupantRemoved",
                    invoke(battle, { support, occupant }) {
                        const current = battle.battlefield.units.get(occupant.id);
                        if (current !== undefined && hasBlocker(current)) {
                            battle = update(battle, [
                                removeRule(
                                    unitRef(current),
                                    `shooting-platform/${support.id}/block-free`,
                                ),
                            ]);
                        }

                        return { state: battle, value: undefined };
                    },
                },
            ],
        },
        hooks: [
            {
                id: "shooting-platform/apply-tile",
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
                id: "shooting-platform/restore-tile",
                stage: "leave",
                invoke(battle, { unit }) {
                    if (!hasOccupancy(unit) || unit.occupancy.tile === null) {
                        return { state: battle, value: undefined };
                    }

                    const position = unit.occupancy.tile;
                    battle = clearOccupant(battle, position);

                    return { state: restore(battle, position, tileChanges), value: undefined };
                },
            },
        ],
    };
}

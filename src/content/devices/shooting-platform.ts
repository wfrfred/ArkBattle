import type { State as BattleState } from "../../core/battle/index.js";
import { remove as removeUnit, update as updateUnit } from "../../core/battle/unit.js";
import { at as occupancyAt } from "../../core/battlefield/occupancy.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { hasOccupancy } from "../../core/unit/capability/occupancy/index.js";
import {
    hasBlocker,
    removeBlockerRule as removeRule,
    setBlockerRule as setRule,
} from "../../core/unit/capability/blocking/index.js";
import type { Id } from "../../core/unit/index.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

function clearOccupant(battle: BattleState, position: TilePosition): BattleState {
    const occupant = occupancyAt(battle.battlefield, position)?.occupant;

    return occupant == null ? battle : removeUnit(battle, occupant.id, "DEATH");
}

function currentOccupant(battle: BattleState, platformId: Id) {
    const platform = battle.battlefield.units.get(platformId);
    if (
        platform?.lifecycle !== "PRESENT" ||
        !hasOccupancy(platform) ||
        platform.definition.occupancy.slot !== "SUPPORT" ||
        platform.occupancy.tile === null
    ) {
        return undefined;
    }

    const occupancy = occupancyAt(battle.battlefield, platform.occupancy.tile);
    if (occupancy?.support?.id !== platform.id || occupancy.occupant === null) {
        return undefined;
    }

    const occupant = battle.battlefield.units.get(occupancy.occupant.id);

    return occupant?.lifecycle === "PRESENT" && hasBlocker(occupant) ? occupant : undefined;
}

export function create(configuration: Configuration): Definition {
    const { id, vitality, deployable } = configuration;
    const tileChanges = {
        ...configuration.tileChanges,
        walkCost: 1000,
    };

    return {
        id,
        vitality,
        deployable,
        occupancy: {
            slot: "SUPPORT",
            hooks: [
                {
                    id: "shooting-platform/block-passenger",
                    stage: "occupantAdded",
                    invoke(battle, { support }) {
                        const ruleId = `shooting-platform/${support.id}/block-free`;
                        const occupant = currentOccupant(battle, support.id);

                        return {
                            state:
                                occupant === undefined ||
                                occupant.blocker.rules.some((rule) => rule.id === ruleId)
                                    ? battle
                                    : updateUnit(battle, [
                                          {
                                              ...occupant,
                                              blocker: setRule(occupant.blocker, {
                                                  id: ruleId,
                                                  allows: () => false,
                                              }),
                                          },
                                      ]),
                            value: undefined,
                        };
                    },
                },
                {
                    id: "shooting-platform/unblock-passenger",
                    stage: "occupantRemoved",
                    invoke(battle, { support, occupant }) {
                        const current = battle.battlefield.units.get(occupant.id);
                        if (
                            current !== undefined &&
                            hasBlocker(current) &&
                            currentOccupant(battle, support.id)?.id !== current.id
                        ) {
                            const blocker = removeRule(
                                current.blocker,
                                `shooting-platform/${support.id}/block-free`,
                            );
                            if (blocker !== current.blocker) {
                                battle = updateUnit(battle, [{ ...current, blocker }]);
                            }
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

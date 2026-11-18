import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import type { State as BattleState } from "../../core/battle/index.js";
import { remove as removeUnit, update, ref as unitRef } from "../../core/unit/index.js";
import { at as occupancyAt } from "../../core/battlefield/occupancy.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { hasOccupancy } from "../../core/unit/capability/occupancy/index.js";
import {
    hasBlocker,
    removeBlockerRestriction as removeRestriction,
    setBlockerRestriction as setRestriction,
    type Restriction,
} from "../../core/unit/capability/blocking/index.js";
import { apply, restore, type Configuration, type Definition } from "./tile.js";

const groundBlockingRestriction: Restriction = {
    allows: (_battle, { blocker }) => blocker.blocker.layer === "AIR",
};

function clearOccupant(battle: BattleState, position: TilePosition): BattleState {
    const occupant = occupancyAt(battle.battlefield, position)?.occupant;

    return occupant == null
        ? battle
        : removeUnit(battle, occupant, { reason: "DEATH", killer: null });
}

export function create(configuration: Configuration): Definition {
    const { id, classification, taunt, vitality, deployable, card } = configuration;
    const tileChanges = {
        ...configuration.tileChanges,
        walkCost: 1000,
    };

    return {
        id,
        classification,
        targetable: {
            category: "DEVICE",
            taunt: { default: taunt, min: -2, max: 2 },
            restrictions: [],
        },
        vitality,
        deployable,
        card,
        occupancy: {
            slot: "SUPPORT",
            onOccupantAdded(battle, { support, occupant }) {
                const restrictionId = `shooting-platform/${support.id}/block-free`;

                return hasBlocker(occupant)
                    ? update(
                          battle,
                          unitRef(occupant),
                          setRestriction({
                              id: restrictionId,
                              value: groundBlockingRestriction,
                          }),
                      )
                    : battle;
            },
            onOccupantRemoved(battle, { support, occupant }) {
                const current = battle.battlefield.units.get(occupant.id);
                if (current !== undefined && hasBlocker(current)) {
                    battle = update(
                        battle,
                        unitRef(current),
                        removeRestriction(`shooting-platform/${support.id}/block-free`),
                    );
                }

                return battle;
            },
        },
        hooks: Hooks.empty()
            .set(unitHooks.enter, {
                id: "shooting-platform/apply-tile",
                invoke(battle, self) {
                    return {
                        state: hasOccupancy(self)
                            ? apply(battle, self.occupancy.tile, tileChanges)
                            : battle,
                        value: undefined,
                    };
                },
            })
            .set(unitHooks.leave, {
                id: "shooting-platform/restore-tile",
                invoke(battle, { unit }) {
                    if (!hasOccupancy(unit)) {
                        return { state: battle, value: undefined };
                    }

                    const position = unit.occupancy.tile;
                    battle = clearOccupant(battle, position);

                    return { state: restore(battle, position, tileChanges), value: undefined };
                },
            }),
    };
}

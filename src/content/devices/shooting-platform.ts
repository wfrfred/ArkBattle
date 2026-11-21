import { Hooks } from "../../core/hook.js";
import * as unitHooks from "../../core/unit/hook.js";
import type { State as BattleState } from "../../core/battle/index.js";
import type { Definition as CardDefinition } from "../../core/battle/deployment/card/index.js";
import type { State as TileState } from "../../core/battlefield/map/tile.js";
import { remove as removeUnit, update, ref as unitRef } from "../../core/unit/index.js";
import { at as occupancyAt } from "../../core/battlefield/occupancy.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import type { Deployable } from "../../core/unit/capability/deployable/index.js";
import { hasOccupancy, type Occupancy } from "../../core/unit/capability/occupancy/index.js";
import type { Targetable } from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import {
    hasBlocker,
    removeBlockerRestriction as removeRestriction,
    setBlockerRestriction as setRestriction,
    type Restriction,
} from "../../core/unit/capability/blocking/index.js";
import type { Device } from "./device.js";
import { apply, restore } from "./tile.js";

export type ShootingPlatform = Device &
    Vitality &
    Targetable &
    Occupancy &
    Deployable & {
        readonly definition: { readonly card: CardDefinition };
    };

export type Definition = ShootingPlatform["definition"];

export interface Parameters extends Pick<
    Definition,
    "id" | "classification" | "vitality" | "deployable" | "card"
> {
    readonly taunt: number;
    readonly tileChanges: Partial<TileState>;
}

const groundBlockingRestriction: Restriction = {
    allows: (_battle, { blocker }) => blocker.blocker.layer === "AIR",
};

function clearOccupant(battle: BattleState, position: TilePosition): BattleState {
    const occupant = occupancyAt(battle.battlefield, position)?.occupant;

    return occupant == null
        ? battle
        : removeUnit(battle, occupant, { reason: "DEATH", killer: null });
}

export function create(parameters: Parameters): Definition {
    const { id, classification, taunt, vitality, deployable, card } = parameters;
    const tileChanges = {
        ...parameters.tileChanges,
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
            .set(unitHooks.entered, {
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
            .set(unitHooks.removed, {
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

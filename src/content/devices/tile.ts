import type { State as BattleState } from "../../core/battle/index.js";
import { update as updateTile } from "../../core/battle/tile.js";
import { get as getTile } from "../../core/battlefield/map/map.js";
import type { State as TileState } from "../../core/battlefield/map/tile.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import type { Definition as DeployableDefinition } from "../../core/unit/capability/deployable/index.js";
import type { Definition as OccupancyDefinition } from "../../core/unit/capability/occupancy/index.js";
import type { Definition as VitalityDefinition } from "../../core/unit/capability/vitality/index.js";
import type { Definition as UnitDefinition } from "../../core/unit/index.js";
import { hole } from "../terrain/definition.js";

export interface Definition extends UnitDefinition {
    readonly vitality: VitalityDefinition;
    readonly deployable: DeployableDefinition;
    readonly occupancy: OccupancyDefinition;
}

export interface Configuration extends Pick<Definition, "id" | "vitality" | "deployable"> {
    readonly tileChanges: Partial<TileState>;
}

export function apply(
    battle: BattleState,
    position: TilePosition,
    changes: Partial<TileState>,
): BattleState {
    const tile = getTile(battle.battlefield.map, position)!;

    return updateTile(battle, position, {
        ...tile.state,
        ...changes,
        walkCost:
            changes.walkCost !== undefined && tile.definition.terrain.definition === hole
                ? tile.definition.initial.walkCost
                : (changes.walkCost ?? tile.state.walkCost),
    });
}

export function restore(
    battle: BattleState,
    position: TilePosition,
    changes: Partial<TileState>,
): BattleState {
    const tile = getTile(battle.battlefield.map, position)!;
    const { initial } = tile.definition;

    return updateTile(battle, position, {
        ...tile.state,
        ...(changes.elevation === undefined ? {} : { elevation: initial.elevation }),
        ...(changes.placement === undefined ? {} : { placement: initial.placement }),
        ...(changes.passability === undefined ? {} : { passability: initial.passability }),
        ...(changes.walkCost === undefined ? {} : { walkCost: initial.walkCost }),
        ...(changes.allowsBlocking === undefined ? {} : { allowsBlocking: initial.allowsBlocking }),
        ...("siteCondition" in changes ? { siteCondition: initial.siteCondition } : {}),
    });
}

import type { State as BattleState } from "../../core/battle/index.js";
import { update as updateTile } from "../../core/battle/tile.js";
import { get as getTile } from "../../core/battlefield/map/map.js";
import type {
    State as TileState,
    Placement,
    SiteCondition,
} from "../../core/battlefield/map/tile.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import type { Deployable } from "../../core/unit/capability/deployable/index.js";
import type { Occupancy } from "../../core/unit/capability/occupancy/index.js";
import type { Targetable } from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import type { Definition as CardDefinition } from "../../core/battle/deployment/card/index.js";
import type { Restriction as DeploymentRestriction } from "../../core/battle/deployment/index.js";
import { hole } from "../terrain/definition.js";
import type { Device } from "./device.js";

export type TileDevice = Device &
    Vitality &
    Targetable &
    Occupancy &
    Deployable & {
        readonly definition: { readonly card: CardDefinition };
    };

export type Definition = TileDevice["definition"];

export interface Configuration extends Pick<
    Definition,
    "id" | "classification" | "vitality" | "deployable" | "card"
> {
    readonly taunt: number;
    readonly tileChanges: Partial<TileState>;
}

export function deploymentSiteRestriction(
    placement: Exclude<Placement, "NONE">,
    allowedSiteConditions: readonly SiteCondition[],
): DeploymentRestriction {
    return {
        allows(battle, { request }) {
            const tile = getTile(battle.battlefield.map, request.tilePosition);

            return (
                tile !== undefined &&
                tile.state.placement !== "NONE" &&
                (tile.state.placement === "ALL" ||
                    placement === "ALL" ||
                    tile.state.placement === placement) &&
                (tile.state.siteCondition === null ||
                    allowedSiteConditions.includes(tile.state.siteCondition))
            );
        },
    };
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
        ...(changes.collision === undefined ? {} : { collision: initial.collision ?? null }),
        ...("siteCondition" in changes ? { siteCondition: initial.siteCondition } : {}),
    });
}

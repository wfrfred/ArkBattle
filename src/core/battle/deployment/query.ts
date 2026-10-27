import type { TilePosition } from "../../geometry/coordinate.js";
import type { Definition as DeployableDefinition } from "../../unit/capability/deployable/capability.js";
import type { Slot } from "../../unit/capability/occupancy/capability.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { at } from "../../battlefield/occupancy.js";
import type { State as BattlefieldState } from "../../battlefield/state.js";

export interface DeploymentRequest {
    readonly profile: DeployableDefinition;
    readonly tile: TilePosition;
    readonly slot?: Slot;
}

export type DeploymentDecision =
    | { readonly type: "ALLOWED" }
    | {
          readonly type: "DENIED";
          readonly reason: "OUTSIDE_MAP" | "OCCUPIED" | "BUILDABLE_TYPE" | "TERRAIN";
      };

export function evaluateDeployment(
    field: BattlefieldState,
    request: DeploymentRequest,
): DeploymentDecision {
    const tile = getTile(field.map, request.tile);

    if (tile === undefined) {
        return { type: "DENIED", reason: "OUTSIDE_MAP" };
    }

    const slot = request.slot ?? "OCCUPANT";
    const occupancy = at(field, request.tile);

    if (occupancy?.occupant != null || (slot === "SUPPORT" && occupancy?.support != null)) {
        return { type: "DENIED", reason: "OCCUPIED" };
    }

    const { placement, siteCondition } = tile.state;

    if (
        placement === "NONE" ||
        (placement !== "ALL" &&
            request.profile.placement !== "ALL" &&
            placement !== request.profile.placement)
    ) {
        return { type: "DENIED", reason: "BUILDABLE_TYPE" };
    }
    if (siteCondition !== null && !request.profile.allowedSiteConditions.includes(siteCondition)) {
        return { type: "DENIED", reason: "TERRAIN" };
    }

    return { type: "ALLOWED" };
}

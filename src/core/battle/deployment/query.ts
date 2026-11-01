import type { TilePosition } from "../../geometry/coordinate.js";
import {
    hasDeployable,
    type Definition as DeployableDefinition,
} from "../../unit/capability/deployable/capability.js";
import type { Slot } from "../../unit/capability/occupancy/capability.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { at } from "../../battlefield/occupancy.js";
import type { State as BattlefieldState } from "../../battlefield/state.js";
import type { State as BattleState } from "../state.js";
import type { Ref } from "../../common/ref.js";
import type { Card } from "./card/card.js";
import type { Preparation, Rejected, Program } from "./program.js";
import { advance as advanceDp } from "./dp.js";

export function usedSlots(state: BattleState): number {
    let slots = 0;

    for (const unit of state.battlefield.units.values()) {
        if (hasDeployable(unit)) {
            slots += unit.deployable.slots;
        }
    }

    return slots;
}

export function activeCount(battle: BattleState, reference: Ref<Card>): number {
    let count = 0;

    for (const unit of battle.battlefield.units.values()) {
        if (hasDeployable(unit) && unit.deployable.card?.id === reference.id) {
            count++;
        }
    }

    return count;
}

export function evaluate(battle: BattleState, prepared: Preparation): Rejected | null {
    const limit = battle.deployment.definition.slotLimit;
    if (limit !== null && usedSlots(battle) + prepared.slots > limit) {
        return { type: "REJECTED", reason: "SLOT_LIMIT" };
    }
    if (
        prepared.payment !== null &&
        advanceDp(battle.deployment, battle.tick).dp - prepared.payment.amount <
            battle.deployment.minDp
    ) {
        return { type: "REJECTED", reason: "INSUFFICIENT_DP" };
    }

    const decision = evaluateDeployment(battle.battlefield, prepared.placement);

    return decision.type === "DENIED" ? { type: "REJECTED", reason: decision.reason } : null;
}

export function preview<I>(
    battle: BattleState,
    input: I,
    program: Program<I>,
):
    | Rejected
    | {
          readonly type: "ALLOWED";
          readonly cost: number;
          readonly payment: Preparation["payment"];
      } {
    const prepared = program.prepare(battle, input);
    if (prepared.type === "REJECTED") {
        return prepared;
    }

    return (
        evaluate(battle, prepared) ?? {
            type: "ALLOWED",
            cost: prepared.cost,
            payment: prepared.payment,
        }
    );
}

export interface DeploymentRequest {
    readonly profile: Pick<DeployableDefinition, "placement" | "allowedSiteConditions">;
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

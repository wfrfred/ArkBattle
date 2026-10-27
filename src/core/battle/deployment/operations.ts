import { evaluateDeployment, getCard, usedSlots } from "./query.js";
import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import { hasDeployable } from "../../unit/capability/deployable/capability.js";
import { instantiateUnitPlacement } from "../creation/placement.js";
import type { Id } from "../../unit/unit.js";
import type { Command } from "../contract.js";
import { add, remove } from "../unit.js";
import { appendEvents, type State as BattleState, type Result } from "../state.js";
import { changeDp } from "./deployment.js";
import { notifyDeployed } from "./lifecycle.js";
import { updateCard } from "./resources.js";
import * as card from "./card.js";

export interface DeployRequest {
    readonly cardId: card.Id;
    readonly tilePosition: TilePosition;
}

export type DeploymentCommand =
    | ({ readonly type: "DEPLOY_UNIT" } & DeployRequest)
    | { readonly type: "RETREAT_UNIT"; readonly unitId: Id };

export type Rejection =
    | "UNKNOWN_CARD"
    | "NO_STOCK"
    | "COOLDOWN"
    | "ACTIVE_LIMIT"
    | "SLOT_LIMIT"
    | "INSUFFICIENT_DP"
    | Extract<ReturnType<typeof evaluateDeployment>, { readonly type: "DENIED" }>["reason"];

export type DeployOutcome =
    | { readonly type: "DEPLOYED"; readonly cardId: card.Id; readonly unitId: Id }
    | { readonly type: "REJECTED"; readonly reason: Rejection };

export function deploy(state: BattleState, request: DeployRequest): Result<DeployOutcome> {
    let value = getCard(state, request.cardId);
    const reject = (reason: Rejection): Result<DeployOutcome> => ({
        state,
        value: { type: "REJECTED", reason },
    });

    if (value === undefined) {
        return reject("UNKNOWN_CARD");
    }

    value = card.advance(value, state.tick);
    state = updateCard(state, value);

    if (value.stock === 0) {
        return reject("NO_STOCK");
    }
    if (value.definition.supply.recharge !== "QUEUED" && value.cooldown !== null) {
        return reject("COOLDOWN");
    }

    const activeLimit = value.definition.supply.activeLimit;
    const active = [...state.battlefield.units.values()].filter(
        (unit) => hasDeployable(unit) && unit.deployable.cardId === request.cardId,
    ).length;

    if (activeLimit !== null && active >= activeLimit) {
        return reject("ACTIVE_LIMIT");
    }

    const definition = value.definition.unit;
    const slotLimit = state.deployment.definition.slotLimit;

    if (slotLimit !== null && usedSlots(state) + definition.deployable.slots > slotLimit) {
        return reject("SLOT_LIMIT");
    }

    const cost = card.resolveCost(value);

    if (state.deployment.dp < cost) {
        return reject("INSUFFICIENT_DP");
    }

    const slot = definition.occupancy.slot;
    const decision = evaluateDeployment(state.battlefield, {
        profile: definition.deployable,
        tile: request.tilePosition,
        slot,
    });

    if (decision.type === "DENIED") {
        return reject(decision.reason);
    }

    const placed = instantiateUnitPlacement(state, {
        definition,
        position: Tile.center(request.tilePosition),
        tile: request.tilePosition,
    });
    state = placed.state;
    const unit = {
        ...placed.value,
        deployable: {
            ...placed.value.deployable,
            cardId: value.id,
            cost,
            refundLimit:
                definition.deployable.refund.limit === "DEPLOYMENT_COST"
                    ? cost
                    : card.resolveBaseCost(value),
            refundAllowed: true,
        },
    };
    state = updateCard(state, card.advance(card.consume(value, state.tick), state.tick));
    state = {
        ...state,
        deployment: changeDp(state.deployment, -cost, state.tick),
    };
    state = add(state, unit);
    state = notifyDeployed(state, { unit, kind: "MANUAL" });

    return { state, value: { type: "DEPLOYED", cardId: value.id, unitId: unit.id } };
}

export function retreat(state: BattleState, unitId: Id): BattleState {
    if (state.battlefield.units.get(unitId) === undefined) {
        throw new RangeError(`unknown retreat unit ${unitId}`);
    }

    return remove(state, unitId, "RETREAT");
}

export function resolveDeploymentCommands(
    state: BattleState,
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (command.type === "DEPLOY_UNIT") {
            const result = deploy(state, command);
            state = result.state;

            if (result.value.type === "REJECTED") {
                state = appendEvents(state, [
                    {
                        type: "DEPLOYMENT_REJECTED",
                        cardId: command.cardId,
                        reason: result.value.reason,
                        tick: state.tick,
                    },
                ]);
            }
        } else if (command.type === "RETREAT_UNIT") {
            state = retreat(state, command.unitId);
        }
    }

    return state;
}

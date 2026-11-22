import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import { get as getUnit, ref as unitRef } from "../../unit/query.js";
import type {
    Deployable,
    State as DeployableState,
} from "../../unit/capability/deployable/capability.js";
import { setDeployment, canRetreat, retreat } from "../../unit/capability/deployable/operations.js";
import type { Command } from "../contract.js";
import { add, remove } from "../../unit/operations.js";
import type { State as BattleState, Result } from "../state.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import { dispatch as notifyDeployed } from "./hook.js";
import { get } from "./card/query.js";
import type { Card } from "./card/card.js";
import * as card from "./card/state.js";
import * as cards from "./card/operations.js";
import * as dp from "./dp.js";
import { advanceResources, reserveSlots } from "./resources.js";
import { evaluateCurrent, resolveRestrictions, createRequest } from "./query.js";
import { refreshOrder } from "./order.js";
import {
    validateRequest,
    type DeployRequest,
    type DeployOutcome,
    type RedeployRequest,
} from "./request.js";
import { Hooks } from "../../hook.js";
import * as lifecycle from "../../unit/hook.js";
import * as observers from "../unit-hook.js";

export { canRetreat, retreat };

export type { DeployRequest, DeployOutcome, Rejection } from "./request.js";

export type DeploymentCommand<T extends Card<any> = Card> =
    | {
          readonly type: "DEPLOY_UNIT";
          readonly ref: Ref<T>;
          readonly tilePosition: TilePosition;
          readonly direction?: Direction;
      }
    | { readonly type: "RETREAT_UNIT"; readonly ref: Ref<Unit & Deployable> };

export function deploy<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): Result<DeployOutcome> {
    const input = request as object as DeployRequest;
    validateRequest(input);

    const previous = battle;
    let self = get(battle, request.card);
    if (self === undefined) {
        return { state: battle, value: { type: "REJECTED", reason: "UNKNOWN_CARD" } };
    }

    battle = advanceResources(battle, self);
    const rejected = evaluateCurrent(battle, input, resolveRestrictions(self, input));
    if (rejected !== null) {
        return { state: previous, value: rejected };
    }

    self = get(battle, request.card)!;
    const definition = self.definition;
    const cost = card.resolveCost(self, battle.deployment.definition.costCeiling ?? 99);
    const refund =
        definition.refund === null
            ? null
            : {
                  rate: definition.refund.rate,
                  limit:
                      definition.refund.limit === "DEPLOYMENT_COST"
                          ? cost
                          : card.resolveBaseCost(self),
              };
    const amount = request.quote.dp;
    if (amount !== null) {
        battle = dp.pay(battle, amount).state;
    }

    battle = reserveSlots(battle, request.quote.slots);
    let consumed = card.consume(self, request.quote.stock);
    if (definition.cooldownOnDeploy) {
        consumed = card.advance(card.startCooldown(consumed, battle.tick), battle.tick);
    }

    battle = cards.replace(battle, consumed);

    return placeUnit(battle, self, input, { cost, slots: request.quote.slots, refund }, null);
}

export function redeploy(battle: BattleState, request: RedeployRequest): BattleState {
    const unit = getUnit(battle, request.unit);
    if (unit?.lifecycle !== "ACTIVE" || unit.deployable.card === null) {
        return battle;
    }

    const { card: reference, cost, slots, refund } = unit.deployable;
    const self = get(battle, reference)!;
    const input: DeployRequest = {
        card: reference,
        tilePosition: request.tilePosition,
        ...(request.direction === null ? {} : { direction: request.direction }),
        quote: { dp: null, stock: 0, slots },
        restrictions: [],
        hooks: Hooks.empty(),
    };

    const current = advanceResources(battle, self);
    if (evaluateCurrent(current, input, resolveRestrictions(self, input, unit), unit) !== null) {
        return battle;
    }

    const reason = request.kind === "SELF" ? "REDEPLOY_SELF" : "REDEPLOY_EXTERNAL";
    const id = `@deployment/redeploy/${unit.id}`;
    battle = observers.setHook(current, observers.removed, {
        id,
        accepts: (_state, departure) =>
            departure.unit.id === unit.id && departure.reason === reason,
        invoke: (state) => {
            state = observers.removeHook(state, observers.removed, id);
            const facts = { cost, slots, refund };

            return { state: finishRedeploy(state, input, facts, request), value: undefined };
        },
    });

    return remove(battle, request.unit, { reason });
}

function finishRedeploy(
    battle: BattleState,
    input: DeployRequest,
    facts: Pick<DeployableState, "cost" | "slots" | "refund">,
    request: RedeployRequest,
): BattleState {
    const reference = input.card;
    const definition = get(battle, reference)!.definition;
    if (request.kind === "EXTERNAL" && definition.increaseCostOnRetreatOrDeath) {
        battle = cards.incrementCostStage(battle, reference);
    }

    const self = get(battle, reference)!;
    if (evaluateCurrent(battle, input, resolveRestrictions(self, input, null)) === null) {
        return placeUnit(reserveSlots(battle, facts.slots), self, input, facts, request).state;
    }

    if (request.kind === "SELF") {
        return cards.recoverOnDeparture(battle, reference);
    }

    return definition.recoverOnRetreatOrDeath ? cards.enqueueRecovery(battle, reference) : battle;
}

function placeUnit(
    battle: BattleState,
    self: Card,
    request: DeployRequest,
    facts: Pick<DeployableState, "cost" | "slots" | "refund">,
    redeploy: RedeployRequest | null,
): Result<DeployOutcome> {
    const initialized = initializeUnit(battle, {
        definition: self.unitDefinition,
        position: Tile.center(request.tilePosition),
        initial: {
            facing: { direction: request.direction === "LEFT" ? "LEFT" : "RIGHT" },
            occupancy: {
                tile: request.tilePosition,
                ...(request.direction === undefined ? {} : { direction: request.direction }),
            },
        },
        hooks: Hooks.empty()
            .set(lifecycle.entered, {
                id: "@deployment/enter",
                invoke: (state, unit) => ({
                    state: notifyDeployed(state, {
                        unit: unit as Unit & Deployable,
                        request,
                        redeploy,
                    }),
                    value: undefined,
                }),
            })
            .set(lifecycle.removed, {
                id: "@deployment/death",
                accepts: (_state, departure) => departure.reason === "DEATH",
                invoke: (state) => ({
                    state: cards.recoverOnDeparture(state, request.card),
                    value: undefined,
                }),
            })
            .merge(self.unitHooks)
            .merge(request.hooks),
    });
    const unit = setDeployment(initialized.value, { card: request.card, ...facts });
    battle = initialized.state;
    battle = refreshOrder({
        ...battle,
        deployment: {
            ...battle.deployment,
            history: [...battle.deployment.history, { card: request.card, unit: unitRef(unit) }],
        },
    });
    battle = add(battle, unit);

    return {
        state: battle,
        value: { type: "DEPLOYED", cardId: self.id, unitId: unit.id },
    };
}

export function resolveDeploymentCommands(
    battle: BattleState,
    commands: readonly Command<Card<any>>[],
): BattleState {
    for (const command of commands) {
        if (command.type === "DEPLOY_UNIT") {
            const request = createRequest(
                battle,
                command.ref,
                command.tilePosition,
                command.direction,
            );
            if (request !== undefined) {
                battle = deploy(battle, request).state;
            }
        } else if (command.type === "RETREAT_UNIT") {
            battle = retreat(battle, command.ref);
        }
    }

    return battle;
}

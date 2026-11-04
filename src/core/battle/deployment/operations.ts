import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { canRetreat, retreat } from "../../unit/capability/deployable/operations.js";
import type { Command } from "../contract.js";
import { add } from "../unit.js";
import type { State as BattleState, Result } from "../state.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import { dispatch as notifyDeployed } from "./hook.js";
import { get } from "./card/query.js";
import type { Card } from "./card/card.js";
import * as card from "./card/state.js";
import * as cards from "./card/operations.js";
import { advanceResources, replaceCard } from "./resources.js";
import { evaluateRules, resolveRules, createRequest } from "./query.js";
import type { DeployRequest, DeployOutcome } from "./request.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../common/assert.js";
import { Hooks } from "../../hook.js";
import * as lifecycle from "../../unit/hook.js";

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
    if (request.quote.dp !== null) {
        assertNonnegativeNumber(request.quote.dp, "deployment payment");
    }

    assertNonnegativeSafeInteger(request.quote.stock, "deployment stock consumption");
    assertNonnegativeSafeInteger(request.quote.slots, "deployment slot consumption");
    const input = request as object as DeployRequest;
    const previous = battle;
    let self = get(battle, request.card);
    if (self === undefined) {
        return { state: battle, value: { type: "REJECTED", reason: "UNKNOWN_CARD" } };
    }

    battle = advanceResources(battle, self);
    const rejected = evaluateRules(battle, input, resolveRules(self, input));
    if (rejected !== null) {
        return { state: previous, value: rejected };
    }

    self = get(battle, request.card)!;
    const definition = self.definition.card;
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
    const current = battle.deployment;
    battle = {
        ...battle,
        deployment: {
            ...current,
            dp: request.quote.dp === null ? current.dp : current.dp - request.quote.dp,
            lastDpRecoveryTick:
                request.quote.dp !== null && request.quote.dp !== 0
                    ? battle.tick
                    : current.lastDpRecoveryTick,
            usedSlots: current.usedSlots + request.quote.slots,
        },
    };
    let consumed = card.consume(self, request.quote.stock);
    if (definition.cooldownOnDeploy) {
        consumed = card.advance(card.startCooldown(consumed, battle.tick), battle.tick);
    }

    battle = replaceCard(battle, consumed);
    const id = battle.execution.nextUnitId;
    battle = { ...battle, execution: { ...battle.execution, nextUnitId: id + 1 } };
    const initialized = initializeUnit(battle, {
        id,
        definition: self.definition,
        position: Tile.center(request.tilePosition),
        initial: {
            occupancy: {
                tile: request.tilePosition,
                ...(request.direction === undefined ? {} : { direction: request.direction }),
            },
        },
        hooks: Hooks.empty()
            .set(lifecycle.enter, {
                id: "@deployment/enter",
                invoke: (state, unit) => ({
                    state: notifyDeployed(state, {
                        unit: unit as Unit & Deployable,
                        request: input,
                    }),
                    value: undefined,
                }),
            })
            .set(lifecycle.leave, {
                id: "@deployment/death",
                accepts: (_state, departure) => departure.reason === "DEATH",
                invoke: (state) => {
                    if (definition.increaseCostOnLeave) {
                        state = cards.incrementCostStage(state, request.card);
                    }
                    if (definition.recoverOnLeave) {
                        state = cards.enqueueRecovery(state, request.card);
                    }

                    return { state, value: undefined };
                },
            })
            .merge(self.unitHooks)
            .merge(request.hooks),
    });
    const unit = {
        ...initialized.value,
        deployable: {
            ...initialized.value.deployable,
            card: input.card,
            cost,
            slots: request.quote.slots,
            refund,
        },
    };
    battle = add(initialized.state, unit);

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

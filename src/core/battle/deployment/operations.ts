import type { Ref } from "../../common/ref.js";
import { replaceIn } from "../../common/object.js";
import type { Unit } from "../../unit/unit.js";
import { ref as unitRef } from "../../unit/query.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { setDeployment, canRetreat, retreat } from "../../unit/capability/deployable/operations.js";
import type { Command } from "../contract.js";
import { add } from "../../unit/operations.js";
import type { State as BattleState, Result } from "../state.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import { dispatch as notifyDeployed } from "./hook.js";
import type { Card } from "./deck/card/card.js";
import { resolveBaseCost } from "./deck/card/dp/index.js";
import { deploy as deployCard } from "./deck/card/operations.js";
import { get } from "./deck/deck.js";
import * as deck from "./deck/operations.js";
import * as dp from "./dp/operations.js";
import * as slot from "./slot/operations.js";
import { evaluateCurrent, resolveRestrictions, createRequest } from "./query.js";
import { validateRequest, type DeployRequest, type DeployOutcome } from "./request.js";
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
    const input = request as object as DeployRequest;
    validateRequest(input);

    const self = get(battle, input.card);
    if (self === undefined) {
        return { state: battle, value: { type: "REJECTED", reason: "UNKNOWN_CARD" } };
    }

    const rejected = evaluateCurrent(battle, input, resolveRestrictions(self, input));
    if (rejected !== null) {
        return { state: battle, value: rejected };
    }

    const cost = deck.resolveCost(battle, self);
    const baseCost = resolveBaseCost(self);
    const amount = request.quote.dp;
    if (amount !== null) {
        battle = dp.pay(battle, amount).state;
    }

    battle = slot.occupy(battle, request.quote.slots);
    battle = deck.replace(battle, deployCard(self, request.quote.stock));
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
                        request: input,
                    }),
                    value: undefined,
                }),
            })
            .merge(self.unitHooks)
            .merge(request.hooks),
    });
    const unit = setDeployment(initialized.value, {
        card: input.card,
        cost,
        baseCost,
        slots: request.quote.slots,
    });
    battle = initialized.state;
    battle = replaceIn(
        battle,
        ["deployment", "history"],
        [...battle.deployment.history, { card: input.card, unit: unitRef(unit) }],
    );
    battle = add(battle, unit);

    return {
        state: battle,
        value: { type: "DEPLOYED", cardId: self.id, unitId: unit.id },
    };
}

export function resolveDeploymentCommands(
    battle: BattleState,
    commands: readonly Command[],
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

export function advance(state: BattleState): BattleState {
    state = slot.advance(state);
    state = deck.advance(state);

    return dp.advance(state);
}

import type { Ref } from "../../common/ref.js";
import { replaceIn } from "../../common/object.js";
import type { Unit, EndReason } from "../../unit/unit.js";
import { ref as unitRef } from "../../unit/query.js";
import type {
    Deployable,
    State as DeployableState,
} from "../../unit/capability/deployable/capability.js";
import { setDeployment } from "../../unit/capability/deployable/operations.js";
import type { Command } from "../contract.js";
import { add, remove } from "../../unit/operations.js";
import type { State as BattleState, Result } from "../state.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import { dispatch as prepareDeployment } from "./deck/card/hook.js";
import type { Card } from "./deck/card/card.js";
import { resolveBaseCost, resolveCost } from "./deck/card/dp/query.js";
import { deploy as deployCard, recycle } from "./deck/card/operations.js";
import * as deck from "./deck/operations.js";
import * as dp from "./dp/operations.js";
import * as slot from "./slot/operations.js";
import { evaluate, canRetreat } from "./query.js";
import { Hooks } from "../../hook.js";
import type { DeployRequest } from "./request.js";
import { TICKS_PER_SECOND } from "../../tick.js";

export type DeploymentCommand<T extends Card<any> = Card> =
    | {
          readonly type: "DEPLOY_UNIT";
          readonly ref: Ref<T>;
          readonly tilePosition: TilePosition;
          readonly direction: Direction | null;
      }
    | { readonly type: "RETREAT_UNIT"; readonly ref: Ref<Unit & Deployable> };

export function deploy<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): Result<Ref<Unit & Deployable> | null> {
    if (!evaluate(battle, request)) {
        return { state: battle, value: null };
    }

    const input = request as object as DeployRequest;
    const self = input.card.get(battle)!;
    const cost = resolveCost(battle, self);
    const baseCost = resolveBaseCost(self);
    const quote = request.quote ?? {
        dp: cost,
        stock: self.definition.supply.consumption,
        slots: self.definition.slot,
    };
    const amount = quote.dp;
    if (amount !== null) {
        battle = dp.pay(battle, amount).state;
    }

    battle = slot.occupy(battle, quote.slots);
    battle = deck.replace(battle, deployCard(self, quote.stock));
    const prepared = prepareDeployment(battle, input, {
        definition: self.unitDefinition,
        position: Tile.center(request.tilePosition),
        initial: {
            facing: { direction: request.direction === "LEFT" ? "LEFT" : "RIGHT" },
            occupancy: {
                tile: request.tilePosition,
                direction: request.direction,
            },
        },
        hooks: Hooks.empty(),
    });
    const initialized = initializeUnit(prepared.state, prepared.value);
    const unit = setDeployment(initialized.value, {
        card: input.card,
        cost,
        baseCost,
        slots: quote.slots,
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
        value: unitRef(unit),
    };
}

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
    if (!canRetreat(battle, reference)) {
        return battle;
    }

    const self = reference.get(battle)!;
    const refund = self.deployable.refund;
    if (refund !== null) {
        const amount = Math.max(
            0,
            Math.floor(Math.min(self.deployable.cost * refund.rate, refund.limit)),
        );
        battle = dp.modify(battle, amount);
    }

    return remove(battle, reference, { reason: "RETREAT" });
}

export function settleDeparture(
    battle: BattleState,
    reason: EndReason,
    { card, slots }: Pick<DeployableState, "card" | "slots">,
): BattleState {
    battle =
        reason === "DEATH"
            ? slot.release(battle, slots, TICKS_PER_SECOND)
            : slot.release(battle, slots);

    if (
        card !== null &&
        (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL")
    ) {
        const self = card.get(battle)!;

        return deck.replace(battle, recycle(self));
    }

    return battle;
}

export function resolveDeploymentCommands(
    battle: BattleState,
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (command.type === "DEPLOY_UNIT") {
            battle = deploy(battle, {
                card: command.ref,
                tilePosition: command.tilePosition,
                direction: command.direction,
                quote: null,
                restrictions: [],
            }).state;
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

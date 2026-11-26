import type { Ref } from "../../../../common/ref.js";
import { replaceIn } from "../../../../common/object.js";
import type { State as BattleState, Result } from "../../../state.js";
import type { Unit, EndReason } from "../../../../unit/unit.js";
import type { Deployable } from "../../../../unit/capability/deployable/capability.js";
import { ref as unitRef } from "../../../../unit/query.js";
import { setDeployment } from "../../../../unit/capability/deployable/operations.js";
import { add } from "../../../../unit/operations.js";
import { initialize as initializeUnit } from "../../../../unit/initialize.js";
import { Tile } from "../../../../geometry/coordinate.js";
import { Hooks } from "../../../../hook.js";
import { replace } from "../operations.js";
import type { Card } from "./card.js";
import { resolveBaseCost, resolveCost, resolveIncrease } from "./dp/query.js";
import { consume, enqueue, recharge, setCooldown } from "./supply/operations.js";
import { resolveCooldown } from "./supply/query.js";
import type { DeployRequest } from "./request.js";
import { canDeploy } from "./query.js";
import { dispatch as prepareDeployment } from "./hook.js";
import * as dp from "../../dp/operations.js";
import * as slot from "../../slot/operations.js";

export function setState<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = reference.get(battle)!;

    return state === self.state ? battle : replace(battle, { ...self, state });
}

export function deploy<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): Result<Ref<Unit & Deployable> | null> {
    if (!canDeploy(battle, request)) {
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
    if (quote.dp !== null) {
        battle = dp.pay(battle, quote.dp).state;
    }

    battle = slot.occupy(battle, quote.slots);
    let next = consume(self, quote.stock);
    if (self.policy === "DEFAULT") {
        next = setCooldown(next, resolveCooldown(self));
    }

    battle = replace(battle, next);
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
    const reference = unitRef(unit);
    battle = initialized.state;
    const current = input.card.get(battle)!;
    battle = replace(battle, replaceIn(current, ["units"], [...current.units, reference]));
    battle = replaceIn(
        battle,
        ["deployment", "history"],
        [...battle.deployment.history, { card: input.card, unit: reference }],
    );
    battle = add(battle, unit);

    return { state: battle, value: reference };
}

export function depart(
    battle: BattleState,
    reference: Ref<Card>,
    unit: Ref<Unit & Deployable>,
    reason: EndReason,
): BattleState {
    let self = reference.get(battle)!;
    self = replaceIn(
        self,
        ["units"],
        self.units.filter((candidate) => candidate !== unit),
    );

    if (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL") {
        switch (self.policy) {
            case "DEFAULT":
                break;

            case "UNIQUE":
                if (resolveIncrease(self)) {
                    self = replaceIn(self, ["dp", "stage"], self.dp.stage + 1);
                }

                self = setCooldown(recharge(self, 1), resolveCooldown(self));
                break;

            case "QUEUED":
                self = enqueue(self);
                break;
        }
    }

    return replace(battle, self);
}

export function advance(battle: BattleState, reference: Ref<Card>): BattleState {
    const card = reference.get(battle)!;
    let next = card;

    if (!card.supply.paused) {
        const cooldown = Math.max(0, card.supply.cooldown - 1);
        if (cooldown === 0 && card.policy === "QUEUED" && card.supply.pending > 0) {
            const pending = card.supply.pending - 1;
            next = {
                ...card,
                supply: {
                    ...card.supply,
                    stock: card.supply.stock + 1,
                    pending,
                    cooldown: pending === 0 ? 0 : resolveCooldown(card),
                },
            };
        } else {
            next = replaceIn(card, ["supply", "cooldown"], cooldown);
        }
    }

    battle = replace(battle, next);

    return (
        (
            next.definition as {
                readonly onTick?: (battle: BattleState, self: Card) => BattleState;
            }
        ).onTick?.(battle, next) ?? battle
    );
}

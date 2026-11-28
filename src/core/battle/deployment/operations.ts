import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { canRetreat, resolveRefund } from "../../unit/capability/deployable/query.js";
import { remove } from "../../unit/operations.js";
import type { Command } from "../contract.js";
import type { State as BattleState, Result } from "../state.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import type { Card } from "./deck/card/card.js";
import { deploy, recycle } from "./deck/card/operations.js";
import * as deck from "./deck/operations.js";
import * as dp from "./dp/operations.js";
import * as slot from "./slot/operations.js";

export type DeploymentCommand =
    | {
          readonly type: "DEPLOY_UNIT";
          readonly ref: Ref<Card>;
          readonly tilePosition: TilePosition;
          readonly direction: Direction | null;
      }
    | { readonly type: "RETREAT_UNIT"; readonly ref: Ref<Unit & Deployable> };

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

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
    if (!canRetreat(battle, reference)) {
        return battle;
    }

    const self = reference.get(battle)!;
    const amount = resolveRefund(self);
    if (amount !== null) {
        battle = dp.modify(battle, amount);
    }

    return remove(battle, reference, { reason: "RETREAT" });
}

export function redeploy(
    battle: BattleState,
    reference: Ref<Unit & Deployable>,
    tilePosition: TilePosition,
    direction: Direction | null,
    kind: "SELF" | "EXTERNAL",
): Result<Ref<Unit & Deployable> | null> {
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE" || self.deployable.card === null) {
        return { state: battle, value: null };
    }

    const { card } = self.deployable;
    const nextDirection = direction ?? self.occupancy.direction;
    battle = remove(battle, reference, {
        reason: kind === "SELF" ? "REDEPLOY_SELF" : "REDEPLOY_EXTERNAL",
    });

    if (reference.get(battle) !== undefined) {
        throw new Error(
            "redeploy requires completed removal; use lifetime.defer during settlement",
        );
    }

    const result = deploy(battle, {
        card,
        tilePosition,
        direction: nextDirection,
        quote: {
            dp: null,
            stock: 0,
            slots: card.get(battle)!.definition.slot,
        },
        restrictions: [
            {
                id: "@deployment/cooldown",
                group: null,
                value: { allows: () => true },
            },
        ],
    });

    if (result.value === null && kind === "SELF") {
        return { state: deck.replace(result.state, recycle(card.get(result.state)!)), value: null };
    }

    return result;
}

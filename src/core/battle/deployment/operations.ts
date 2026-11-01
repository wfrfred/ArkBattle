import type { Ref } from "../../common/ref.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Unit, Id } from "../../unit/unit.js";
import { hasDeployable, type Deployable } from "../../unit/capability/deployable/capability.js";
import * as units from "../../unit/query.js";
import type { Command } from "../contract.js";
import { add, remove } from "../unit.js";
import { appendEvents, type State as BattleState, type Result } from "../state.js";
import { changeDp } from "./dp.js";
import { notifyDeployed } from "./lifecycle.js";
import { get as getCard } from "./card/query.js";
import type { Card, Id as CardId } from "./card/card.js";
import { evaluate } from "./query.js";
import type { DeployRequest, DeployOutcome, Program } from "./program.js";

export type { DeployRequest, DeployOutcome, Rejection } from "./program.js";

export type DeploymentCommand =
    | {
          readonly type: "DEPLOY_UNIT";
          readonly cardId: CardId;
          readonly tilePosition: TilePosition;
          readonly direction?: Direction;
      }
    | { readonly type: "RETREAT_UNIT"; readonly unitId: Id };

export function deploy<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): Result<DeployOutcome>;
export function deploy<I>(
    battle: BattleState,
    input: I,
    program: Program<I>,
): Result<DeployOutcome>;
export function deploy(
    battle: BattleState,
    input: unknown,
    program?: Program<any>,
): Result<DeployOutcome> {
    const origin = program === undefined ? "MANUAL" : "CONTENT";
    if (program === undefined) {
        const request = input as DeployRequest;
        const self = getCard(battle, request.card);
        if (self === undefined) {
            return { state: battle, value: { type: "REJECTED", reason: "UNKNOWN_CARD" } };
        }

        program = self.program;
    }

    const prepared = program.prepare(battle, input);
    if (prepared.type === "REJECTED") {
        return { state: battle, value: prepared };
    }

    const rejected = evaluate(battle, prepared);
    if (rejected !== null) {
        return { state: battle, value: rejected };
    }

    if (prepared.payment !== null) {
        battle = {
            ...battle,
            deployment: changeDp(battle.deployment, -prepared.payment.amount, battle.tick),
        };
    }

    battle = prepared.consume?.(battle) ?? battle;
    const initialized = prepared.initialize(battle);
    battle = initialized.state;
    const unit = {
        ...initialized.value,
        deployable: {
            ...initialized.value.deployable,
            card: prepared.card,
            cost: prepared.cost,
            slots: prepared.slots,
            refund: prepared.refund,
            retreatAllowed: prepared.retreatAllowed,
        },
    };
    battle = appendEvents(battle, [
        {
            type: "UNIT_DEPLOYED",
            unitId: unit.id,
            position: unit.position,
            program: program.id,
            payment: prepared.payment,
            tick: battle.tick,
        },
    ]);
    battle = add(battle, unit);
    battle = notifyDeployed(battle, {
        unit,
        program: program.id,
        origin,
        payment: prepared.payment,
    });

    return {
        state: battle,
        value: { type: "DEPLOYED", cardId: prepared.card?.id ?? null, unitId: unit.id },
    };
}

export function canRetreat(battle: BattleState, reference: Ref<Unit & Deployable>): boolean {
    const self = units.get(battle, reference);

    return (
        self?.lifecycle === "PRESENT" &&
        self.deployable.retreatAllowed &&
        self.deployable.retreatRules.every((rule) => rule.allows(battle, reference))
    );
}

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
    return canRetreat(battle, reference) ? remove(battle, reference.id, "RETREAT") : battle;
}

export function resolveDeploymentCommands(
    battle: BattleState,
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (command.type === "DEPLOY_UNIT") {
            const result = deploy(battle, {
                card: { id: command.cardId } as Ref<Card>,
                tilePosition: command.tilePosition,
                ...(command.direction === undefined ? {} : { direction: command.direction }),
            });
            battle = result.state;

            if (result.value.type === "REJECTED") {
                battle = appendEvents(battle, [
                    {
                        type: "DEPLOYMENT_REJECTED",
                        cardId: command.cardId,
                        reason: result.value.reason,
                        tick: battle.tick,
                    },
                ]);
            }
        } else if (command.type === "RETREAT_UNIT") {
            const self = battle.battlefield.units.get(command.unitId);
            if (self !== undefined && hasDeployable(self)) {
                battle = retreat(battle, units.ref(self));
            }
        }
    }

    return battle;
}

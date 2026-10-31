import {
    hasRoute,
    isCompleted,
    pathMotionMode,
    type Definition as RouteDefinition,
    type Route,
} from "../../unit/capability/route/capability.js";
import * as route from "../../unit/capability/route/operations.js";
import { movementTarget } from "../../unit/capability/route/query.js";
import { hasLocomotion, type Locomotion } from "../../unit/capability/locomotion/capability.js";
import { hasBlockable } from "../../unit/capability/blocking/blockable.js";
import * as blockable from "../../unit/capability/blocking/blockable-operations.js";
import * as locomotion from "../../unit/capability/locomotion/operations.js";
import * as units from "../../unit/query.js";
import type { Id, Unit } from "../../unit/unit.js";
import type { Command } from "../contract.js";
import { appendEvents, type State as BattleState } from "../state.js";
import { remove } from "../unit.js";

function advanceLocomotion(
    battle: BattleState,
    unit: Unit & Route & Locomotion,
    moveMultiplier: number,
): BattleState {
    const ref = units.ref(unit);
    const target = movementTarget(battle, ref);

    return target === null
        ? battle
        : locomotion.advance(battle, ref, target, {
              mode: pathMotionMode(unit.route),
              speedMultiplier: moveMultiplier,
          });
}

export type AlternativeRouteCommand =
    | {
          readonly type: "SET_ALTERNATIVE_ROUTE";
          readonly unitId: Id;
          readonly route: RouteDefinition;
      }
    | { readonly type: "CLEAR_ALTERNATIVE_ROUTE"; readonly unitId: Id };

export function advanceRouteCommands(
    battle: BattleState,
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (
            command.type !== "SET_ALTERNATIVE_ROUTE" &&
            command.type !== "CLEAR_ALTERNATIVE_ROUTE"
        ) {
            continue;
        }

        const unit = battle.battlefield.units.get(command.unitId);
        if (unit === undefined) {
            throw new RangeError(`unknown alternative route unit: ${command.unitId}`);
        }
        if (!hasRoute(unit)) {
            throw new RangeError(`unit has no route: ${command.unitId}`);
        }

        battle =
            command.type === "SET_ALTERNATIVE_ROUTE"
                ? route.setAlternative(battle, units.ref(unit), command.route)
                : route.clearAlternative(battle, units.ref(unit));
    }

    return battle;
}

export function advanceMovement(
    battle: BattleState,
    { routeMoveMultiplier }: { readonly routeMoveMultiplier: number },
): BattleState {
    const candidates = units.all(battle);

    for (const unit of candidates.filter(hasBlockable)) {
        battle = blockable.advancePosition(battle, units.ref(unit));
    }

    for (const initial of candidates.filter(hasRoute)) {
        const ref = units.ref(initial);
        battle = route.advance(battle, ref);
        const unit = units.get(battle, ref);
        if (unit?.lifecycle !== "PRESENT") {
            continue;
        }
        if (
            !isCompleted(unit.route) &&
            (!hasBlockable(unit) || unit.blockable.blocker === null) &&
            hasLocomotion(unit)
        ) {
            battle = advanceLocomotion(battle, unit, routeMoveMultiplier);
        }
    }

    return battle;
}

export function resolveRouteCompletion(battle: BattleState): BattleState {
    const candidates = units.all(battle).filter(hasRoute);

    for (const initial of candidates) {
        const ref = units.ref(initial);
        const unit = units.get(battle, ref);
        if (
            unit?.lifecycle !== "PRESENT" ||
            !isCompleted(unit.route) ||
            (hasBlockable(unit) && unit.blockable.blocker !== null)
        ) {
            continue;
        }

        battle = appendEvents(battle, [
            { type: "ROUTE_COMPLETED", unitId: unit.id, tick: battle.tick },
        ]);
        battle = remove(battle, unit.id, "SCRIPT");
    }

    return battle;
}

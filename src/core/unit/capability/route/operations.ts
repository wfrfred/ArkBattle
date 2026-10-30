import { Vec2 } from "../../../common/vector.js";
import { update as updateUnit } from "../../../battle/unit.js";
import { maintain } from "../../../battle/blocking/operations.js";
import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import * as navigation from "../../../battlefield/navigation/state.js";
import { Tile, World, type WorldPosition } from "../../../geometry/coordinate.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import * as presence from "../presence/operations.js";
import { hasSpatialPresence } from "../presence/capability.js";
import {
    initialize,
    type Definition,
    type Phase,
    type Progress,
    type Route,
} from "./capability.js";
import { target } from "./query.js";

const RADIUS = 0.05;
const TRANSITION_BUDGET = 128;

export type Signal =
    | { readonly type: "DISAPPEAR" }
    | { readonly type: "APPEAR_AT_POS"; readonly position: WorldPosition }
    | { readonly type: "ALERT" };

export function setPathMotionMode(
    battle: BattleState,
    ref: Ref<Unit & Route>,
    mode: navigation.MotionMode,
): BattleState {
    const self = units.get(battle, ref);
    if (self?.lifecycle !== "PRESENT") {
        return battle;
    }

    const slot = self.route.alternative === null ? "main" : "alternative";
    const progress = self.route[slot]!;

    return progress.pathMotionMode === mode
        ? battle
        : updateUnit(battle, [
              {
                  ...self,
                  route: { ...self.route, [slot]: { ...progress, pathMotionMode: mode } },
              },
          ]);
}

export function setAlternative(
    battle: BattleState,
    ref: Ref<Unit & Route>,
    definition: Definition,
): BattleState {
    const self = units.get(battle, ref);
    if (self?.lifecycle !== "PRESENT") {
        return battle;
    }

    const initialized = initialize(battle, definition);

    return updateUnit(initialized.state, [
        {
            ...self,
            route: { ...self.route, alternative: initialized.value.main },
        },
    ]);
}

export function clearAlternative(battle: BattleState, ref: Ref<Unit & Route>): BattleState {
    const self = units.get(battle, ref);

    return self?.lifecycle !== "PRESENT" || self.route.alternative === null
        ? battle
        : updateUnit(battle, [{ ...self, route: { ...self.route, alternative: null } }]);
}

function atEnd(self: Unit, progress: Progress): boolean {
    const phase = progress.phase;
    if (
        phase.type === "COMPLETED" ||
        (phase.type === "CHECKPOINT" && progress.definition.requireAllCheckpoints)
    ) {
        return false;
    }

    return (
        Vec2.distanceSquared(
            Vec2.add(self.position, Vec2.negate(progress.definition.offset)),
            Tile.center(progress.definition.endPosition),
        ) <=
        RADIUS * RADIUS
    );
}

function replace(
    battle: BattleState,
    self: Unit & Route,
    progress: Progress,
    phase: Phase,
): BattleState {
    const slot = self.route.alternative === progress ? "alternative" : "main";

    return updateUnit(battle, [
        {
            ...self,
            route: { ...self.route, [slot]: { ...progress, phase } },
        },
    ]);
}

function following(progress: Progress, index: number): Phase {
    return index >= progress.definition.checkpoints.length
        ? { type: "END" }
        : { type: "CHECKPOINT", index, checkpointState: { type: "PENDING" } };
}

export function advance(battle: BattleState, ref: Ref<Unit & Route>): BattleState {
    for (let remaining = TRANSITION_BUDGET; remaining > 0; remaining--) {
        let self = units.get(battle, ref);
        if (self?.lifecycle !== "PRESENT") {
            return battle;
        }
        if (atEnd(self, self.route.main)) {
            battle = replace(battle, self, self.route.main, { type: "COMPLETED" });
            self = units.get(battle, ref);

            if (self?.lifecycle !== "PRESENT") {
                return battle;
            }
        }

        const progress = self.route.alternative ?? self.route.main;
        const phase = progress.phase;
        if (phase.type === "COMPLETED") {
            return battle;
        }
        if (atEnd(self, progress)) {
            return replace(battle, self, progress, { type: "COMPLETED" });
        }
        if (phase.type === "END") {
            return battle;
        }

        const checkpoint = progress.definition.checkpoints[phase.index]!;
        const state = phase.checkpointState;
        if (state.type === "WAITING") {
            if (battle.tick < state.deadlineTick) {
                return battle;
            }

            battle = replace(battle, self, progress, following(progress, phase.index + 1));
        } else if (state.type === "MOVING") {
            const goal = target(progress)!;
            const locator = Vec2.add(self.position, Vec2.negate(progress.definition.offset));
            const map = battle.battlefield.navigation.baseline[progress.pathMotionMode];
            const inside =
                map.contains(World.toTile(self.position)) && map.contains(World.toTile(locator));
            const skipped =
                !progress.definition.alwaysCheckCurrentPoint &&
                inside &&
                navigation.nextPoint(
                    battle.battlefield.navigation,
                    progress.pathMotionMode,
                    locator,
                    goal,
                ) === null;
            if (!(Vec2.distanceSquared(locator, goal) <= RADIUS * RADIUS) && !skipped) {
                return battle;
            }

            battle = replace(battle, self, progress, following(progress, phase.index + 1));
        } else if (state.type === "CONSUMED") {
            battle = replace(battle, self, progress, following(progress, phase.index + 1));
        } else if (checkpoint.type === "GOTO") {
            battle = replace(battle, self, progress, following(progress, checkpoint.index));
        } else if (checkpoint.type === "MOVE") {
            battle = replace(battle, self, progress, {
                ...phase,
                checkpointState: { type: "MOVING" },
            });
        } else if (checkpoint.type === "WAIT" || checkpoint.type === "WAIT_UNTIL") {
            const deadlineTick = checkpoint.tick + (checkpoint.type === "WAIT" ? battle.tick : 0);
            assertNonnegativeSafeInteger(deadlineTick, "route wait deadline");
            battle = replace(battle, self, progress, {
                ...phase,
                checkpointState: { type: "WAITING", deadlineTick },
            });
        } else {
            battle = replace(battle, self, progress, {
                ...phase,
                checkpointState: { type: "CONSUMED" },
            });
            let signal: Signal;

            if (checkpoint.type === "DISAPPEAR") {
                signal = checkpoint;

                if (hasSpatialPresence(self)) {
                    battle = presence.disappear(battle, units.ref(self));
                }
            } else if (checkpoint.type === "APPEAR_AT_POS") {
                const position = Vec2.add(Tile.center(checkpoint.position), checkpoint.offset);
                signal = { type: "APPEAR_AT_POS", position };
                battle = hasSpatialPresence(self)
                    ? presence.appear(battle, units.ref(self), position)
                    : maintain(updateUnit(battle, [{ ...units.get(battle, ref)!, position }]));
            } else {
                signal = checkpoint;
            }

            const current = units.get(battle, ref);
            battle = appendEvents(battle, [
                {
                    type: "ROUTE",
                    unitId: ref.id,
                    signal,
                    position: current?.position ?? self.position,
                    tick: battle.tick,
                },
            ]);
        }
    }

    return battle;
}

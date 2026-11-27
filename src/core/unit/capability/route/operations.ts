import { Vec2 } from "../../../common/vector.js";
import {
    assert,
    assertFiniteNumber,
    assertNonnegativeSafeInteger,
} from "../../../common/assert.js";
import { createRng } from "../../../common/rng.js";
import { remove as removeUnit, replace as replaceUnit, update } from "../../operations.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import * as navigation from "../../../battlefield/navigation/query.js";
import {
    Tile,
    World,
    type TilePosition,
    type WorldPosition,
} from "../../../geometry/coordinate.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { createChange, type Change } from "../../change.js";
import * as presence from "../presence/operations.js";
import { hasPresence } from "../presence/capability.js";
import { hasBlockable } from "../blocking/blockable/blockable.js";
import { release } from "../blocking/blockable/operations.js";
import { hasBlocker } from "../blocking/blocker/blocker.js";
import { releaseAll } from "../blocking/blocker/operations.js";
import { setTarget } from "../locomotion/capability.js";
import {
    createContext,
    validatePlan,
    type Checkpoint,
    type Context,
    type ContextInput,
    type Plan,
    type Route,
} from "./capability.js";
import { activeContext, contextFor, movementTarget, ref, target } from "./query.js";

const RADIUS = 0.05;

function changeContext<U extends Unit & Route>(
    self: U,
    reference: Ref<Context>,
    transform: (context: Context) => Context,
): U {
    const context = contextFor(self, reference);
    if (self.lifecycle !== "ACTIVE" || context === undefined) {
        return self;
    }

    const next = transform(context);

    if (next === context) {
        return self;
    }

    const route = self.route;
    if (route.main.ref === reference) {
        return { ...self, route: { ...route, main: next } };
    }
    if (route.alternative?.ref === reference) {
        return { ...self, route: { ...route, alternative: next } };
    }

    return {
        ...self,
        route: {
            ...route,
            overrides: route.overrides.map((entry) =>
                entry.context.ref === reference ? { ...entry, context: next } : entry,
            ),
        },
    };
}

function publish(battle: BattleState, self: Unit & Route, next: Context): BattleState {
    return replaceUnit(battle, [changeContext(self, ref(next), () => next)]);
}

export function setAlternative(
    battle: BattleState,
    host: Ref<Unit & Route>,
    input: ContextInput,
): Result<Ref<Context>> {
    const self = host.get(battle);
    assert(self?.lifecycle === "ACTIVE", "route host is not active", RangeError);

    const context = createContext(host, input);
    battle = replaceUnit(battle, [{ ...self, route: { ...self.route, alternative: context } }]);

    return { state: enter(battle, ref(context)), value: ref(context) };
}

export function addOverride(
    battle: BattleState,
    host: Ref<Unit & Route>,
    input: ContextInput & { readonly priority: number },
): Result<Ref<Context>> {
    const self = host.get(battle);
    assert(self?.lifecycle === "ACTIVE", "route host is not active", RangeError);
    assertFiniteNumber(input.priority, "route override priority");

    const context = createContext(host, input);
    battle = replaceUnit(battle, [
        {
            ...self,
            route: {
                ...self.route,
                overrides: [...self.route.overrides, { context, priority: input.priority }],
            },
        },
    ]);

    return { state: enter(battle, ref(context)), value: ref(context) };
}

export function removeContext(reference: Ref<Context>): Change<Unit & Route> {
    return createChange<Unit & Route>((self) => {
        assert(
            self.route.main.ref !== reference,
            "main route context cannot be removed",
            RangeError,
        );

        if (self.lifecycle !== "ACTIVE" || contextFor(self, reference) === undefined) {
            return self;
        }

        if (self.route.alternative?.ref === reference) {
            return { ...self, route: { ...self.route, alternative: null } };
        }

        return {
            ...self,
            route: {
                ...self.route,
                overrides: self.route.overrides.filter(({ context }) => context.ref !== reference),
            },
        };
    });
}

export function reassign(reference: Ref<Context>, plan: Plan, index = 0): Change<Unit & Route> {
    validatePlan(plan);
    assertNonnegativeSafeInteger(index, "route index");
    assert(index <= plan.checkpoints.length, "route index is outside its plan", RangeError);

    return createChange<Unit & Route>(
        (self) =>
            changeContext(self, reference, (context) => ({
                ...context,
                plan,
                index,
                current: null,
            })),
        (battle) => enter(battle, reference),
    );
}

export function skipWait(reference: Ref<Context>): Change<Unit & Route> {
    return createChange<Unit & Route>(
        (self) =>
            changeContext(self, reference, (context) =>
                context.current?.type !== "WAIT" || context.current.anchor !== "ENTER"
                    ? context
                    : { ...context, index: context.index + 1, current: null },
            ),
        (battle) => interpret(battle, reference, false),
    );
}

export function setTraceTarget(
    reference: Ref<Context>,
    position: TilePosition,
): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        changeContext(self, reference, (context) => {
            const current = context.current;

            return current?.type !== "TRACE" ||
                (!current.reached && Vec2.equal(current.position, position))
                ? context
                : { ...context, current: { ...current, position, reached: false } };
        }),
    );
}

function waitSatisfied(
    battle: BattleState,
    self: Unit & Route,
    current: Extract<Checkpoint, { readonly type: "WAIT" }>,
): boolean {
    switch (current.anchor) {
        case "ENTER":
            return current.timer === 0;

        case "BATTLE":
            return battle.tick >= current.tick;

        case "WAVE":
            return battle.tick >= self.route.waveStartTick + current.tick;

        case "FRAGMENT":
            return battle.tick >= self.route.fragmentReadyTick + current.tick;
    }
}

function atTarget(self: Unit, context: Context, position: WorldPosition): boolean {
    return (
        Vec2.distanceSquared(Vec2.sub(self.position, context.offset), position) <= RADIUS * RADIUS
    );
}

export function enter(battle: BattleState, reference: Ref<Context>): BattleState {
    const context = reference.get(battle);

    return context?.current === null ? interpret(battle, reference, true) : battle;
}

function interpret(battle: BattleState, reference: Ref<Context>, enterFirst: boolean): BattleState {
    const visited = new Set<number>();
    let plan: Plan | undefined;

    for (;;) {
        const self = reference.host.get(battle);
        const context = self === undefined ? undefined : contextFor(self, reference);
        if (self?.lifecycle !== "ACTIVE" || context === undefined) {
            return battle;
        }

        const active = activeContext(self).ref === reference;
        if (!active && (!enterFirst || context.current !== null)) {
            return battle;
        }
        if (plan !== context.plan) {
            visited.clear();
            plan = context.plan;
        }

        const current = context.current;
        if (current === null) {
            if (context.index === plan.checkpoints.length || visited.has(context.index)) {
                return battle;
            }

            visited.add(context.index);
            enterFirst = false;
            const checkpoint = plan.checkpoints[context.index]!;
            if (
                !active &&
                (checkpoint.type === "GOTO" ||
                    checkpoint.type === "DISAPPEAR" ||
                    checkpoint.type === "APPEAR")
            ) {
                return battle;
            }
            if (checkpoint.type === "GOTO") {
                battle = publish(battle, self, { ...context, index: checkpoint.index });
            } else if (checkpoint.type === "DISAPPEAR" || checkpoint.type === "APPEAR") {
                battle = publish(battle, self, { ...context, index: context.index + 1 });
                battle = executeSpatial(battle, self, checkpoint);
            } else {
                let entered: Checkpoint = checkpoint;
                if (checkpoint.type === "MOVE" && checkpoint.randomizeOffset) {
                    const rng = createRng(battle.execution.rngState);
                    entered = {
                        ...checkpoint,
                        offset: [
                            (rng.next() * 2 - 1) * checkpoint.offset[0],
                            (rng.next() * 2 - 1) * checkpoint.offset[1],
                        ],
                        randomizeOffset: false,
                    };
                    battle = {
                        ...battle,
                        execution: { ...battle.execution, rngState: rng.state() },
                    };
                } else if (checkpoint.type === "WAIT") {
                    entered = {
                        ...checkpoint,
                        timer: checkpoint.anchor === "ENTER" ? checkpoint.tick : null,
                    };
                } else if (checkpoint.type === "TRACE") {
                    entered = { ...checkpoint, reached: false };
                }

                battle = publish(battle, self, { ...context, current: entered });
            }

            continue;
        }

        enterFirst = false;
        visited.add(context.index);

        if (current.type === "TRACE") {
            return !current.reached && atTarget(self, context, Tile.center(current.position))
                ? publish(battle, self, { ...context, current: { ...current, reached: true } })
                : battle;
        }
        if (current.type === "WAIT") {
            if (!waitSatisfied(battle, self, current)) {
                return battle;
            }
        } else if (current.type === "MOVE") {
            const goal = target(context)!;
            if (!atTarget(self, context, goal.position)) {
                const locator = Vec2.sub(self.position, context.offset);
                const state = battle.battlefield.navigation;
                const map = navigation.effectiveMap(state, self.locomotion.mode);
                if (
                    context.alwaysCheckCurrentPoint ||
                    map.get(World.toTile(self.position))?.passable !== true ||
                    !map.contains(World.toTile(locator)) ||
                    navigation.nextTile(
                        state,
                        self.locomotion.mode,
                        World.toTile(locator),
                        goal.tile,
                    ) !== null
                ) {
                    return battle;
                }
            }
        } else {
            return battle;
        }

        battle = publish(battle, self, { ...context, index: context.index + 1, current: null });
    }
}

function executeSpatial(
    battle: BattleState,
    self: Unit & Route,
    checkpoint: Extract<Checkpoint, { readonly type: "DISAPPEAR" | "APPEAR" }>,
): BattleState {
    if (checkpoint.type === "DISAPPEAR") {
        return hasPresence(self) ? update(battle, units.ref(self), presence.disappear()) : battle;
    }

    const position = Vec2.add(Tile.center(checkpoint.position), checkpoint.offset);
    if (hasPresence(self)) {
        return update(battle, units.ref(self), presence.appear(position));
    }

    battle = update(
        battle,
        units.ref(self),
        createChange<Unit>((current) => ({ ...current, position })),
    );

    if (hasBlocker(self)) {
        return releaseAll(battle, units.ref(self));
    }
    if (hasBlockable(self)) {
        return release(battle, units.ref(self));
    }

    return battle;
}

export function advance(battle: BattleState, reference: Ref<Unit & Route>): BattleState {
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const tick = (context: Context): Context => {
        const current = context.current;

        return current?.type === "WAIT" && current.anchor === "ENTER" && current.timer! > 0
            ? { ...context, current: { ...current, timer: current.timer! - 1 } }
            : context;
    };

    const main = self.route.alternative === null ? tick(self.route.main) : self.route.main;
    const alternative = self.route.alternative === null ? null : tick(self.route.alternative);
    const overrides = self.route.overrides.map((entry) => {
        const context = tick(entry.context);

        return context === entry.context ? entry : { ...entry, context };
    });
    if (
        main !== self.route.main ||
        alternative !== self.route.alternative ||
        overrides.some((entry, index) => entry !== self.route.overrides[index])
    ) {
        battle = replaceUnit(battle, [
            { ...self, route: { ...self.route, main, alternative, overrides } },
        ]);
    }

    battle = interpret(battle, ref(activeContext(self)), false);
    const latest = reference.get(battle);
    if (latest?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const route = latest.route.main;
    const destination = route.plan.destination;
    if (
        destination?.type !== "EXIT" ||
        (destination.requireFinish &&
            (route.current !== null || route.index !== route.plan.checkpoints.length)) ||
        !atTarget(latest, route, Tile.center(destination.position))
    ) {
        return update(battle, reference, setTarget(movementTarget(battle, reference)));
    }

    return removeUnit(battle, reference, { reason: "EXIT" });
}

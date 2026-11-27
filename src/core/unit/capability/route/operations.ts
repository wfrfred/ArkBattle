import { Vec2 } from "../../../common/vector.js";
import { assert, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { createRng } from "../../../common/rng.js";
import { remove as removeUnit, replace as replaceUnit, update } from "../../operations.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { effectiveMap } from "../../../battlefield/navigation/cache.js";
import * as navigation from "../../../battlefield/navigation/state.js";
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
import {
    validatePlan,
    type Checkpoint,
    type Context,
    type ContextInput,
    type Plan,
    type Route,
} from "./capability.js";
import { activeContext, contextFor, createContextRef, ref, target } from "./query.js";

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

    return next === context
        ? self
        : {
              ...self,
              route:
                  self.route.main.ref === reference
                      ? { ...self.route, main: next }
                      : {
                            ...self.route,
                            others: self.route.others.map((entry) =>
                                entry.ref === reference ? next : entry,
                            ),
                        },
          };
}

function publish(battle: BattleState, self: Unit & Route, next: Context): BattleState {
    return replaceUnit(battle, [changeContext(self, ref(next), () => next)]);
}

export function createContext(
    battle: BattleState,
    host: Ref<Unit & Route>,
    input: ContextInput,
): Result<Ref<Context>> {
    validatePlan(input.plan);
    assert(Vec2.is(input.offset), "invalid route offset", TypeError);
    const self = host.get(battle);
    assert(self?.lifecycle === "ACTIVE", "route host is not active", RangeError);

    const reference = createContextRef(host);
    const context: Context = {
        ref: reference,
        plan: input.plan,
        offset: input.offset,
        index: 0,
        current: null,
        alwaysCheckCurrentPoint: input.alwaysCheckCurrentPoint,
        ticking: input.ticking,
    };
    battle = replaceUnit(battle, [
        {
            ...self,
            route: {
                ...self.route,
                others: [...self.route.others, context],
            },
        },
    ]);

    return { state: enter(battle, reference), value: reference };
}

export function removeContext(
    reference: Ref<Context>,
    nextActive: Ref<Context>,
): Change<Unit & Route> {
    return createChange<Unit & Route>((self) => {
        assert(
            self.route.main.ref !== reference,
            "main route context cannot be removed",
            RangeError,
        );

        if (self.lifecycle !== "ACTIVE" || contextFor(self, reference) === undefined) {
            return self;
        }

        const active = self.route.active === reference;
        if (active) {
            assert(
                nextActive !== reference && contextFor(self, nextActive) !== undefined,
                "route successor must identify a remaining context",
                RangeError,
            );
        }

        return {
            ...self,
            route: {
                ...self.route,
                others: self.route.others.filter((context) => context.ref !== reference),
                active: active ? nextActive : self.route.active,
            },
        };
    });
}

export function selectContext(reference: Ref<Context>): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        self.lifecycle !== "ACTIVE" ||
        self.route.active === reference ||
        contextFor(self, reference) === undefined
            ? self
            : { ...self, route: { ...self.route, active: reference } },
    );
}

export function setTicking(reference: Ref<Context>, ticking: boolean): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        changeContext(self, reference, (context) =>
            context.ticking === ticking ? context : { ...context, ticking },
        ),
    );
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
        if (!enterFirst && self.route.active !== reference) {
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
                const map = effectiveMap(state, plan.motionMode);
                if (
                    context.alwaysCheckCurrentPoint ||
                    map.get(World.toTile(self.position))?.passable !== true ||
                    !map.contains(World.toTile(locator)) ||
                    navigation.nextPoint(state, plan.motionMode, locator, goal) !== null
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

        return context.ticking &&
            current?.type === "WAIT" &&
            current.anchor === "ENTER" &&
            current.timer! > 0
            ? { ...context, current: { ...current, timer: current.timer! - 1 } }
            : context;
    };

    const main = tick(self.route.main);
    const others = self.route.others.map(tick);
    if (
        main !== self.route.main ||
        others.some((context, index) => context !== self.route.others[index])
    ) {
        battle = replaceUnit(battle, [{ ...self, route: { ...self.route, main, others } }]);
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
        return battle;
    }

    return removeUnit(battle, reference, { reason: "EXIT" });
}

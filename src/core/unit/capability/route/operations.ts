import { Vec2 } from "../../../common/vector.js";
import { assert, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { createRng } from "../../../common/rng.js";
import { remove as removeUnit, replace as replaceUnit, update } from "../../../battle/unit.js";
import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
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
import { hasBlockable } from "../blocking/blockable.js";
import { release } from "../blocking/blockable-operations.js";
import { hasBlocker } from "../blocking/blocker.js";
import { releaseAll } from "../blocking/blocker-operations.js";
import {
    validatePlan,
    type Checkpoint,
    type Context,
    type ContextId,
    type ContextInput,
    type Plan,
    type Route,
} from "./capability.js";
import { activeContext, contextFor, getContext, ref, target } from "./query.js";

const RADIUS = 0.05;

function changeContext<U extends Unit & Route>(
    self: U,
    id: ContextId,
    transform: (context: Context) => Context,
): U {
    const context = contextFor(self, id);
    if (self.lifecycle !== "PRESENT" || context === undefined) {
        return self;
    }

    const next = transform(context);

    return next === context
        ? self
        : {
              ...self,
              route:
                  id === 0
                      ? { ...self.route, main: next }
                      : {
                            ...self.route,
                            others: self.route.others.map((entry) =>
                                entry.id === id ? next : entry,
                            ),
                        },
          };
}

function publish(battle: BattleState, self: Unit & Route, next: Context): BattleState {
    return replaceUnit(battle, [changeContext(self, next.id, () => next)]);
}

export function createContext(
    battle: BattleState,
    host: Ref<Unit & Route>,
    input: ContextInput,
): Result<Ref<Context>> {
    validatePlan(input.plan);
    assert(Vec2.is(input.offset), "invalid route offset", TypeError);
    const self = units.get(battle, host);
    assert(self?.lifecycle === "PRESENT", "route host is not present", RangeError);

    const context: Context = {
        id: self.route.nextContextId,
        plan: input.plan,
        offset: input.offset,
        index: 0,
        current: null,
        alwaysCheckCurrentPoint: input.alwaysCheckCurrentPoint,
        ticking: input.ticking,
    };
    const reference = ref(host, context);
    battle = replaceUnit(battle, [
        {
            ...self,
            route: {
                ...self.route,
                others: [...self.route.others, context],
                nextContextId: context.id + 1,
            },
        },
    ]);

    return { state: enter(battle, reference), value: reference };
}

export function removeContext(id: ContextId, nextActiveId: ContextId): Change<Unit & Route> {
    assert(id !== 0, "main route context cannot be removed", RangeError);

    return createChange<Unit & Route>((self) => {
        if (self.lifecycle !== "PRESENT" || contextFor(self, id) === undefined) {
            return self;
        }

        const active = self.route.activeId === id;
        if (active) {
            assert(
                nextActiveId !== id && contextFor(self, nextActiveId) !== undefined,
                "route successor must identify a remaining context",
                RangeError,
            );
        }

        return {
            ...self,
            route: {
                ...self.route,
                others: self.route.others.filter((context) => context.id !== id),
                activeId: active ? nextActiveId : self.route.activeId,
            },
        };
    });
}

export function selectContext(id: ContextId): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        self.lifecycle !== "PRESENT" ||
        self.route.activeId === id ||
        contextFor(self, id) === undefined
            ? self
            : { ...self, route: { ...self.route, activeId: id } },
    );
}

export function setTicking(id: ContextId, ticking: boolean): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        changeContext(self, id, (context) =>
            context.ticking === ticking ? context : { ...context, ticking },
        ),
    );
}

export function reassign(id: ContextId, plan: Plan, index = 0): Change<Unit & Route> {
    validatePlan(plan);
    assertNonnegativeSafeInteger(index, "route index");
    assert(index <= plan.checkpoints.length, "route index is outside its plan", RangeError);

    return createChange<Unit & Route>(
        (self) =>
            changeContext(self, id, (context) => ({ ...context, plan, index, current: null })),
        (battle, previous) => enter(battle, { host: units.ref(previous), id } as Ref<Context>),
    );
}

export function skipWait(id: ContextId): Change<Unit & Route> {
    return createChange<Unit & Route>(
        (self) =>
            changeContext(self, id, (context) =>
                context.current?.type !== "WAIT" || context.current.anchor !== "ENTER"
                    ? context
                    : { ...context, index: context.index + 1, current: null },
            ),
        (battle, previous) => interpret(battle, { host: units.ref(previous), id } as Ref<Context>),
    );
}

export function setTraceTarget(id: ContextId, position: TilePosition): Change<Unit & Route> {
    return createChange<Unit & Route>((self) =>
        changeContext(self, id, (context) => {
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
    const context = getContext(battle, reference);

    return context?.current === null ? interpret(battle, reference, true) : battle;
}

function interpret(battle: BattleState, reference: Ref<Context>, enterFirst = false): BattleState {
    const visited = new Set<number>();
    let plan: Plan | undefined;

    for (;;) {
        const self = units.get(battle, reference.host);
        const context = self === undefined ? undefined : contextFor(self, reference.id);
        if (self?.lifecycle !== "PRESENT" || context === undefined) {
            return battle;
        }
        if (!enterFirst && self.route.activeId !== context.id) {
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
            const locator = Vec2.sub(self.position, context.offset);
            const map = battle.battlefield.navigation.baseline[plan.motionMode];
            const inside =
                map.contains(World.toTile(self.position)) && map.contains(World.toTile(locator));
            const skipped =
                !context.alwaysCheckCurrentPoint &&
                inside &&
                navigation.nextPoint(
                    battle.battlefield.navigation,
                    plan.motionMode,
                    locator,
                    goal,
                ) === null;
            if (!atTarget(self, context, goal) && !skipped) {
                return battle;
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
    const self = units.get(battle, reference);
    if (self?.lifecycle !== "PRESENT") {
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

    battle = interpret(battle, ref(reference, activeContext(self)));
    const latest = units.get(battle, reference);
    if (latest?.lifecycle !== "PRESENT") {
        return battle;
    }

    const route = latest.route.main;
    if (
        route.plan.endPosition === null ||
        (route.plan.requireAllCheckpoints &&
            (route.current !== null || route.index !== route.plan.checkpoints.length)) ||
        !atTarget(latest, route, Tile.center(route.plan.endPosition))
    ) {
        return battle;
    }

    battle = appendEvents(battle, [
        { type: "ROUTE_COMPLETED", unitId: latest.id, tick: battle.tick },
    ]);

    return removeUnit(battle, latest.id, "SCRIPT");
}

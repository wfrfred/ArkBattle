import { advanceForcedMotion } from "../../../battlefield/collision.js";
import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert } from "../../../common/assert.js";
import { replaceIn } from "../../../common/object.js";
import type { Identified, Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import * as lifetimes from "../../../lifetime/index.js";
import { register, unregister } from "../../../lifetime/operations.js";
import { allows } from "../../../restriction.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { lifetime as unitLifetime, replace as replaceUnits } from "../../operations.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasBlockable } from "../blocking/blockable.js";
import { release } from "../blocking/blockable-operations.js";
import { hasBlocker } from "../blocking/blocker.js";
import { releaseAll } from "../blocking/blocker-operations.js";
import { isPresent } from "../presence/capability.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import { dispatchMoved } from "./hook.js";
import * as pull from "./pull.js";
import type { Shiftable } from "./shiftable.js";

const ZERO: Vec2 = [0, 0];
const PROTECTION_TICKS = 0.1 * TICKS_PER_SECOND;
const REST_SPEED = 0.1 / TICKS_PER_SECOND;
const FRICTION = 9.81 * 0.5;

type Host = Unit & Shiftable;

export interface Unbalance extends Identified<{ readonly host: Ref<Host>; readonly id: number }> {
    readonly host: Ref<Host>;
    readonly id: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly velocity: Vec2;
    readonly protectedUntil: number;
    readonly pendingForce: Vec2;
    readonly pulls: ReadonlyMap<number, pull.Pull>;
    readonly nextPullId: number;
}

type End = "SETTLED" | "RESTRICTED" | "HOST_UNAVAILABLE";

export function ref(self: Unbalance): Ref<Unbalance> {
    return { host: self.host, id: self.id } as Ref<Unbalance>;
}

export function get(battle: BattleState, reference: Ref<Unbalance>): Unbalance | undefined {
    const state = units.get(battle, reference.host)?.shiftable;

    return state?.unbalance?.id === reference.id
        ? state.unbalance
        : state?.endingUnbalances.get(reference.id);
}

export function replace(battle: BattleState, unit: Host, next: Unbalance): BattleState {
    const { shiftable } = unit;
    const changes =
        shiftable.unbalance?.id === next.id
            ? { unbalance: next }
            : { endingUnbalances: new Map(shiftable.endingUnbalances).set(next.id, next) };

    return replaceUnits(battle, [{ ...unit, shiftable: { ...shiftable, ...changes } }]);
}

export const lifetime = lifetimes.create<Unbalance, Unbalance, End>({
    kind: "UNBALANCE",
    address: ({ host, id }) => [host.id, id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING", velocity: ZERO, pendingForce: ZERO }),
    replace: (battle, reference, next) => replace(battle, units.get(battle, reference.host)!, next),
    finalize(battle, reference): BattleState {
        const unit = units.get(battle, reference.host)!;
        const { shiftable } = unit;
        if (shiftable.unbalance?.id === reference.id) {
            battle = replaceUnits(battle, [replaceIn(unit, ["shiftable", "unbalance"], null)]);
        } else {
            const endingUnbalances = new Map(shiftable.endingUnbalances);
            endingUnbalances.delete(reference.id);
            battle = replaceUnits(battle, [
                replaceIn(unit, ["shiftable", "endingUnbalances"], endingUnbalances),
            ]);
        }

        return unregister(battle, lifetimes.scope(lifetime, reference));
    },
    reason: (end) => end,
    fromDependency: () => "HOST_UNAVAILABLE",
});

function present(unit: Host): boolean {
    return unit.lifecycle === "ACTIVE" && isPresent(unit) && (!hasVitality(unit) || isAlive(unit));
}

function permitsForce(battle: BattleState, unit: Host): boolean {
    return allows(battle, { self: unit }, unit.shiftable.restrictions);
}

export function prepare(battle: BattleState, unit: Host): Unbalance | null {
    if (!present(unit) || !permitsForce(battle, unit)) {
        return null;
    }

    const active = unit.shiftable.unbalance;
    const protectedUntil = battle.tick + PROTECTION_TICKS;

    return active?.lifecycle === "ACTIVE"
        ? { ...active, protectedUntil }
        : {
              host: units.ref(unit),
              id: unit.shiftable.nextUnbalanceId,
              lifecycle: "ACTIVE",
              velocity: ZERO,
              protectedUntil,
              pendingForce: ZERO,
              pulls: new Map(),
              nextPullId: 0,
          };
}

export function receive(
    battle: BattleState,
    unit: Host,
    next: Unbalance,
    traction?: { readonly target: lifetimes.Scope; readonly parents: readonly lifetimes.Scope[] },
): BattleState {
    const { shiftable } = unit;
    const previous = shiftable.unbalance;
    const started = previous?.id !== next.id;
    const owner = lifetimes.scope(lifetime, ref(next));
    if (started) {
        const endingUnbalances =
            previous === null
                ? shiftable.endingUnbalances
                : new Map(shiftable.endingUnbalances).set(previous.id, previous);
        battle = replaceUnits(battle, [
            {
                ...unit,
                shiftable: {
                    ...shiftable,
                    unbalance: next,
                    endingUnbalances,
                    nextUnbalanceId: next.id + 1,
                },
            },
        ]);
        battle = register(battle, owner, lifetimes.scope(unitLifetime, next.host));
    } else {
        battle = replace(battle, unit, next);
    }

    if (traction !== undefined) {
        battle = register(battle, traction.target, owner, traction.parents);
    }

    if (started && hasBlockable(unit)) {
        return release(battle, units.ref(unit));
    }

    return started && hasBlocker(unit) ? releaseAll(battle, units.ref(unit)) : battle;
}

export function applyImpulse(
    battle: BattleState,
    host: Ref<Host>,
    impulse: Vec2,
): Result<Ref<Unbalance> | null> {
    assert(Vec2.is(impulse), "impulse must be a finite vector", TypeError);
    const unit = units.get(battle, host);
    const next = unit === undefined ? null : prepare(battle, unit);
    if (unit === undefined || next === null) {
        return { state: battle, value: null };
    }

    const { mass } = unit.definition.shiftable.body;
    const velocity = Vec2.add(next.velocity, Vec2.scale(impulse, 1 / (mass * TICKS_PER_SECOND)));

    return { state: receive(battle, unit, { ...next, velocity }), value: ref(next) };
}

export function active(
    battle: BattleState,
    reference: Ref<Unbalance>,
): { readonly unit: Host; readonly self: Unbalance } | undefined {
    const unit = units.get(battle, reference.host);
    const self = unit?.shiftable.unbalance;

    return unit !== undefined &&
        self?.id === reference.id &&
        self.lifecycle === "ACTIVE" &&
        present(unit) &&
        permitsForce(battle, unit)
        ? { unit, self }
        : undefined;
}

export function addForce(battle: BattleState, reference: Ref<Unbalance>, force: Vec2): BattleState {
    assert(Vec2.is(force), "force must be a finite vector", TypeError);
    const current = active(battle, reference);
    if (current === undefined || Vec2.equal(force, ZERO)) {
        return battle;
    }

    const { unit, self } = current;

    return replace(battle, unit, { ...self, pendingForce: Vec2.add(self.pendingForce, force) });
}

export function setVelocity(
    battle: BattleState,
    reference: Ref<Unbalance>,
    velocity: Vec2,
): BattleState {
    assert(Vec2.is(velocity), "unbalance velocity must be a finite vector", TypeError);
    const current = active(battle, reference);
    if (current === undefined || Vec2.equal(current.self.velocity, velocity)) {
        return battle;
    }

    return replace(battle, current.unit, { ...current.self, velocity });
}

function finishIfSettled(battle: BattleState, reference: Ref<Unbalance>): BattleState {
    const self = get(battle, reference);

    return self?.lifecycle === "ACTIVE" &&
        battle.tick >= self.protectedUntil &&
        Vec2.length(self.velocity) <= REST_SPEED &&
        Vec2.equal(self.pendingForce, ZERO) &&
        ![...self.pulls.values()].some((item) => pull.available(battle, item))
        ? lifetime.end(battle, reference, "SETTLED")
        : battle;
}

function settlePulls(
    battle: BattleState,
    reference: Ref<Unbalance>,
    advanced: ReadonlySet<number>,
): BattleState {
    const current = active(battle, reference);
    if (current === undefined || advanced.size === 0) {
        return battle;
    }

    const effective = [...current.self.pulls.values()].filter((item) =>
        pull.available(battle, item),
    );
    const lost = effective.filter(
        (item) => advanced.has(item.id) && pull.position(battle, item.point) === undefined,
    );
    const sole = effective.length === 1 ? effective[0] : undefined;
    if (
        sole !== undefined &&
        advanced.has(sole.id) &&
        lost.length === 0 &&
        (!sole.braked || sole.brake === "WHILE_NEAR") &&
        pull.isNear(battle, sole)
    ) {
        battle = pull.brake(battle, pull.ref(sole));
    }

    for (const item of lost) {
        battle = pull.remove(battle, pull.ref(item), "SOURCE_UNAVAILABLE");
    }

    return battle;
}

export function advance(battle: BattleState, reference: Ref<Unbalance>): BattleState {
    const unit = units.get(battle, reference.host);
    const self = unit?.shiftable.unbalance;
    if (unit === undefined || self?.id !== reference.id || self.lifecycle !== "ACTIVE") {
        return battle;
    }
    if (!present(unit)) {
        return lifetime.end(battle, reference, "HOST_UNAVAILABLE");
    }
    if (!permitsForce(battle, unit)) {
        return lifetime.end(battle, reference, "RESTRICTED");
    }

    const pulls = [...self.pulls.values()].filter((item) => pull.available(battle, item));
    let force = self.pendingForce;

    for (const item of pulls) {
        force = Vec2.add(force, pull.force(battle, item, unit.position));
    }

    const { mass, shape } = unit.definition.shiftable.body;
    const friction = (FRICTION * mass * unit.shiftable.frictionFactor) / TICKS_PER_SECOND ** 2;
    const velocity = Vec2.add(
        Vec2.clampLength(self.velocity, Math.max(0, Vec2.length(self.velocity) - friction)),
        Vec2.scale(force, 1 / (mass * TICKS_PER_SECOND ** 2)),
    );
    const motion = advanceForcedMotion(battle.battlefield.map, unit.position, velocity, shape);
    battle = replaceUnits(battle, [
        {
            ...unit,
            position: motion.position,
            shiftable: {
                ...unit.shiftable,
                unbalance: { ...self, velocity: motion.velocity, pendingForce: ZERO },
            },
        },
    ]);

    if (!Vec2.equal(unit.position, motion.position) || motion.contacts.length > 0) {
        battle = dispatchMoved(battle, {
            unbalance: reference,
            from: unit.position,
            to: motion.position,
            contacts: motion.contacts,
        });
    }

    battle = settlePulls(battle, reference, new Set(pulls.map(({ id }) => id)));

    return finishIfSettled(battle, reference);
}

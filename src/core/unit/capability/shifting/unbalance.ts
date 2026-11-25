import { advanceForcedMotion } from "../../../battlefield/collision.js";
import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert } from "../../../common/assert.js";
import { replaceIn } from "../../../common/object.js";
import { createRef, ref, type Identified, type Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import * as lifetimes from "../../../lifetime/index.js";
import { register } from "../../../lifetime/operations.js";
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

export interface Unbalance extends Identified<{ readonly host: Ref<Host> }> {
    readonly host: Ref<Host>;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly velocity: Vec2;
    readonly protectedUntil: number;
    readonly pendingForce: Vec2;
    readonly pulls: ReadonlyMap<Ref<pull.Pull>, pull.Pull>;
}

type End = "SETTLED" | "RESTRICTED" | "HOST_UNAVAILABLE";

export { ref } from "../../../common/ref.js";

function getUnbalance(this: object, battle: BattleState): Unbalance | undefined {
    const reference = this as Ref<Unbalance>;
    const state = reference.host.get(battle)?.shiftable;

    return state?.unbalance?.ref === reference
        ? state.unbalance
        : state?.endingUnbalances.get(reference);
}

export function replace(battle: BattleState, unit: Host, next: Unbalance): BattleState {
    const { shiftable } = unit;
    const changes =
        shiftable.unbalance?.ref === next.ref
            ? { unbalance: next }
            : { endingUnbalances: new Map(shiftable.endingUnbalances).set(ref(next), next) };

    return replaceUnits(battle, [{ ...unit, shiftable: { ...shiftable, ...changes } }]);
}

export const lifetime = lifetimes.create<Unbalance, End>({
    end: {
        prepare(battle, reference, initial) {
            return replace(battle, reference.host.get(battle)!, {
                ...initial,
                lifecycle: "ENDING",
                velocity: ZERO,
                pendingForce: ZERO,
            });
        },
        finalize(battle, reference) {
            const unit = reference.host.get(battle)!;
            const { shiftable } = unit;
            if (shiftable.unbalance?.ref === reference) {
                return replaceUnits(battle, [replaceIn(unit, ["shiftable", "unbalance"], null)]);
            }

            const endingUnbalances = new Map(shiftable.endingUnbalances);
            endingUnbalances.delete(reference);

            return replaceUnits(battle, [
                replaceIn(unit, ["shiftable", "endingUnbalances"], endingUnbalances),
            ]);
        },
        dependencyEnd: "HOST_UNAVAILABLE",
    },
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

    if (active?.lifecycle === "ACTIVE") {
        return { ...active, protectedUntil };
    }

    const identity = { host: units.ref(unit) };

    return {
        ...identity,
        ref: createRef<Unbalance>(identity, getUnbalance),
        lifecycle: "ACTIVE",
        velocity: ZERO,
        protectedUntil,
        pendingForce: ZERO,
        pulls: new Map(),
    };
}

export function receive(
    battle: BattleState,
    unit: Host,
    next: Unbalance,
    traction?: { readonly reference: Ref<pull.Pull>; readonly scopes: readonly lifetimes.Scope[] },
): BattleState {
    const { shiftable } = unit;
    const previous = shiftable.unbalance;
    const started = previous?.ref !== next.ref;
    const reference = ref(next);
    if (started) {
        const endingUnbalances =
            previous === null
                ? shiftable.endingUnbalances
                : new Map(shiftable.endingUnbalances).set(ref(previous), previous);
        battle = replaceUnits(battle, [
            {
                ...unit,
                shiftable: {
                    ...shiftable,
                    unbalance: next,
                    endingUnbalances,
                },
            },
        ]);
        battle = register(battle, lifetime, reference, [lifetimes.scope(unitLifetime, next.host)]);
    } else {
        battle = replace(battle, unit, next);
    }

    if (traction !== undefined) {
        battle = register(battle, pull.lifetime, traction.reference, [
            lifetimes.scope(lifetime, reference),
            ...traction.scopes,
        ]);
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
    const unit = host.get(battle);
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
    const unit = reference.host.get(battle);
    const self = unit?.shiftable.unbalance;

    return unit !== undefined &&
        self?.ref === reference &&
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
    const self = reference.get(battle);

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
    advanced: ReadonlySet<Ref<pull.Pull>>,
): BattleState {
    const current = active(battle, reference);
    if (current === undefined || advanced.size === 0) {
        return battle;
    }

    const effective = [...current.self.pulls.values()].filter((item) =>
        pull.available(battle, item),
    );
    const lost = effective.filter(
        (item) => advanced.has(pull.ref(item)) && pull.position(battle, item.point) === undefined,
    );
    const sole = effective.length === 1 ? effective[0] : undefined;
    if (
        sole !== undefined &&
        advanced.has(pull.ref(sole)) &&
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
    const unit = reference.host.get(battle);
    const self = unit?.shiftable.unbalance;
    if (unit === undefined || self?.ref !== reference || self.lifecycle !== "ACTIVE") {
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

    battle = settlePulls(battle, reference, new Set(pulls.map(pull.ref)));

    return finishIfSettled(battle, reference);
}

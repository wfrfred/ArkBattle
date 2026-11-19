import { advanceForcedMotion } from "../../../battlefield/collision.js";
import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert } from "../../../common/assert.js";
import type { Identified, Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import * as lifetimes from "../../../lifetime/index.js";
import { key as scopeKey } from "../../../lifetime/dependency.js";
import { register, unregister } from "../../../lifetime/operations.js";
import { allows } from "../../../restriction.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { lifetime as unitLifetime, replace } from "../../operations.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasBlockable } from "../blocking/blockable.js";
import { release } from "../blocking/blockable-operations.js";
import { hasBlocker } from "../blocking/blocker.js";
import { releaseAll } from "../blocking/blocker-operations.js";
import { isPresent } from "../presence/capability.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import type { Locomotion } from "./capability.js";
import { dispatchMoved } from "./hook.js";

const ZERO: Vec2 = [0, 0];
const PROTECTION_TICKS = 0.1 * TICKS_PER_SECOND;
const REST_SPEED = 0.1 / TICKS_PER_SECOND;
const FRICTION = 9.81 * 0.5;

type Host = Unit & Locomotion;

interface Traction {
    readonly source: lifetimes.Scope;
    readonly pendingForce: Vec2;
}

export interface Unbalance extends Identified<{ readonly host: Ref<Host>; readonly id: number }> {
    readonly host: Ref<Host>;
    readonly id: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly velocity: Vec2;
    readonly protectedUntil: number;
    readonly pendingForce: Vec2;
    readonly pulls: ReadonlyMap<string, Traction>;
}

type End = "SETTLED" | "RESTRICTED" | "HOST_UNAVAILABLE";

function ref(self: Unbalance): Ref<Unbalance> {
    return { host: self.host, id: self.id } as Ref<Unbalance>;
}

function get(battle: BattleState, reference: Ref<Unbalance>): Unbalance | undefined {
    const current = units.get(battle, reference.host)?.locomotion.unbalance;

    return current?.id === reference.id ? current : undefined;
}

function replaceUnbalance(
    battle: BattleState,
    unit: Host,
    unbalance: Unbalance | null,
): BattleState {
    return replace(battle, [{ ...unit, locomotion: { ...unit.locomotion, unbalance } }]);
}

export const unbalanceLifetime: lifetimes.Lifetime<Unbalance, Unbalance, End> = lifetimes.create<
    Unbalance,
    Unbalance,
    End
>({
    kind: "UNBALANCE",
    address: (reference) => [reference.host.id, reference.id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({
        ...self,
        lifecycle: "ENDING",
        velocity: ZERO,
        pendingForce: ZERO,
        pulls: new Map(),
    }),
    replace: (battle, reference, next) =>
        replaceUnbalance(battle, units.get(battle, reference.host)!, next),
    finalize(battle, reference) {
        const host = units.get(battle, reference.host);
        if (host?.locomotion.unbalance?.id === reference.id) {
            battle = replaceUnbalance(battle, host, null);
        }

        return unregister(battle, lifetimes.scope(unbalanceLifetime, reference));
    },
    reason: (end) => end,
    fromDependency: () => "HOST_UNAVAILABLE",
});

function hostPresent(unit: Host): boolean {
    return unit.lifecycle === "PRESENT" && isPresent(unit) && (!hasVitality(unit) || isAlive(unit));
}

function permitsForce(battle: BattleState, unit: Host): boolean {
    return allows(battle, { self: unit }, unit.locomotion.forceRestrictions);
}

type Application = { readonly impulse: Vec2 } | Traction;

function receive(
    battle: BattleState,
    host: Ref<Host>,
    application: Application,
): Result<Ref<Unbalance> | null> {
    const unit = units.get(battle, host);
    if (unit === undefined || !hostPresent(unit) || !permitsForce(battle, unit)) {
        return { state: battle, value: null };
    }

    const current = unit.locomotion.unbalance;
    const active = current?.lifecycle === "ACTIVE" ? current : null;
    let velocity = active?.velocity ?? ZERO;
    let pulls = active?.pulls ?? new Map<string, Traction>();
    if ("impulse" in application) {
        const mass = unit.definition.locomotion.body?.mass ?? 1;
        velocity = Vec2.add(
            velocity,
            Vec2.scale(application.impulse, 1 / (mass * TICKS_PER_SECOND)),
        );
    } else {
        const next = new Map(pulls);
        next.set(scopeKey(application.source), application);
        pulls = next;
    }

    const self: Unbalance = {
        host,
        id: active?.id ?? unit.locomotion.nextUnbalanceId,
        lifecycle: "ACTIVE",
        velocity,
        protectedUntil: battle.tick + PROTECTION_TICKS,
        pendingForce: active?.pendingForce ?? ZERO,
        pulls,
    };
    const reference = ref(self);
    if (active !== null) {
        return { state: replaceUnbalance(battle, unit, self), value: reference };
    }

    battle = replace(battle, [
        {
            ...unit,
            locomotion: {
                ...unit.locomotion,
                unbalance: self,
                nextUnbalanceId: unit.locomotion.nextUnbalanceId + 1,
            },
        },
    ]);
    battle = register(
        battle,
        lifetimes.scope(unbalanceLifetime, reference),
        lifetimes.scope(unitLifetime, host),
    );

    if (hasBlockable(unit)) {
        battle = release(battle, units.ref(unit));
    }
    if (hasBlocker(unit)) {
        battle = releaseAll(battle, units.ref(unit));
    }

    return { state: battle, value: reference };
}

export function applyImpulse(
    battle: BattleState,
    host: Ref<Host>,
    impulse: Vec2,
): Result<Ref<Unbalance> | null> {
    assert(Vec2.is(impulse), "impulse must be a finite vector", TypeError);

    return receive(battle, host, { impulse });
}

export function beginPull(
    battle: BattleState,
    host: Ref<Host>,
    source: lifetimes.Scope,
    force: Vec2,
): Result<Ref<Unbalance> | null> {
    assert(Vec2.is(force), "pull force must be a finite vector", TypeError);

    return lifetimes.available(battle, source)
        ? receive(battle, host, { source, pendingForce: force })
        : { state: battle, value: null };
}

function activeForForce(
    battle: BattleState,
    reference: Ref<Unbalance>,
): { readonly unit: Host; readonly self: Unbalance } | undefined {
    const unit = units.get(battle, reference.host);
    const self = unit?.locomotion.unbalance;

    return unit !== undefined &&
        self?.id === reference.id &&
        self.lifecycle === "ACTIVE" &&
        hostPresent(unit) &&
        permitsForce(battle, unit)
        ? { unit, self }
        : undefined;
}

export function continuePull(
    battle: BattleState,
    reference: Ref<Unbalance>,
    source: lifetimes.Scope,
    force: Vec2,
): Result<boolean> {
    assert(Vec2.is(force), "pull force must be a finite vector", TypeError);
    const active = activeForForce(battle, reference);
    const identity = scopeKey(source);
    const pull = active?.self.pulls.get(identity);
    if (active === undefined || pull === undefined || !lifetimes.available(battle, pull.source)) {
        return { state: battle, value: false };
    }

    const { unit, self } = active;
    if (Vec2.equal(force, pull.pendingForce)) {
        return { state: battle, value: true };
    }

    const pulls = new Map(self.pulls);
    pulls.set(identity, { ...pull, pendingForce: force });

    return { state: replaceUnbalance(battle, unit, { ...self, pulls }), value: true };
}

export function endPull(
    battle: BattleState,
    reference: Ref<Unbalance>,
    source: lifetimes.Scope,
    { stopIfLast = false }: { readonly stopIfLast?: boolean } = {},
): BattleState {
    const unit = units.get(battle, reference.host);
    const self = unit?.locomotion.unbalance;
    if (unit === undefined || self?.id !== reference.id || self.lifecycle !== "ACTIVE") {
        return battle;
    }

    const identity = scopeKey(source);
    const pull = self.pulls.get(identity);
    if (pull === undefined) {
        return battle;
    }

    const pulls = new Map(self.pulls);
    pulls.delete(identity);
    const stop =
        stopIfLast &&
        lifetimes.available(battle, pull.source) &&
        ![...pulls.values()].some(({ source }) => lifetimes.available(battle, source));
    const next = { ...self, pulls, velocity: stop ? ZERO : self.velocity };

    return finishIfSettled(replaceUnbalance(battle, unit, next), reference);
}

export function addForce(battle: BattleState, reference: Ref<Unbalance>, force: Vec2): BattleState {
    assert(Vec2.is(force), "force must be a finite vector", TypeError);
    const active = activeForForce(battle, reference);
    if (active === undefined || Vec2.equal(force, ZERO)) {
        return battle;
    }

    const { unit, self } = active;

    return replaceUnbalance(battle, unit, {
        ...self,
        pendingForce: Vec2.add(self.pendingForce, force),
    });
}

export function setUnbalanceVelocity(
    battle: BattleState,
    reference: Ref<Unbalance>,
    velocity: Vec2,
): BattleState {
    assert(Vec2.is(velocity), "unbalance velocity must be a finite vector", TypeError);
    const active = activeForForce(battle, reference);
    if (active === undefined || Vec2.equal(active.self.velocity, velocity)) {
        return battle;
    }

    return replaceUnbalance(battle, active.unit, { ...active.self, velocity });
}

function finishIfSettled(battle: BattleState, reference: Ref<Unbalance>): BattleState {
    const self = get(battle, reference);

    return self?.lifecycle === "ACTIVE" &&
        battle.tick >= self.protectedUntil &&
        Vec2.length(self.velocity) <= REST_SPEED &&
        Vec2.equal(self.pendingForce, ZERO) &&
        ![...self.pulls.values()].some(({ source }) => lifetimes.available(battle, source))
        ? unbalanceLifetime.end(battle, reference, "SETTLED")
        : battle;
}

export function advanceUnbalance(battle: BattleState, host: Ref<Host>): BattleState {
    const unit = units.get(battle, host);
    const self = unit?.locomotion.unbalance;
    if (unit === undefined || self?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const reference = ref(self);
    if (!hostPresent(unit)) {
        return unbalanceLifetime.end(battle, reference, "HOST_UNAVAILABLE");
    }
    if (!permitsForce(battle, unit)) {
        return unbalanceLifetime.end(battle, reference, "RESTRICTED");
    }

    const pulls = new Map<string, Traction>();
    let force = self.pendingForce;

    for (const [identity, pull] of self.pulls) {
        if (lifetimes.available(battle, pull.source)) {
            pulls.set(identity, { ...pull, pendingForce: ZERO });
            force = Vec2.add(force, pull.pendingForce);
        }
    }

    const { body, halfBodyWidth } = unit.definition.locomotion;
    const mass = body?.mass ?? 1;
    const friction = (FRICTION * mass * (body?.frictionFactor ?? 1)) / TICKS_PER_SECOND ** 2;
    const velocity = Vec2.add(
        Vec2.clampLength(self.velocity, Math.max(0, Vec2.length(self.velocity) - friction)),
        Vec2.scale(force, 1 / (mass * TICKS_PER_SECOND ** 2)),
    );
    const motion = advanceForcedMotion(
        battle.battlefield.map,
        unit.position,
        velocity,
        body?.shape ?? { type: "CIRCLE", offset: ZERO, radius: halfBodyWidth },
    );
    const next: Unbalance = { ...self, velocity: motion.velocity, pendingForce: ZERO, pulls };
    battle = replace(battle, [
        {
            ...unit,
            position: motion.position,
            locomotion: { ...unit.locomotion, unbalance: next },
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

    return finishIfSettled(battle, reference);
}

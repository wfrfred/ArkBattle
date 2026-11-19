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

export interface Pull extends Identified<{
    readonly unbalance: Ref<Unbalance>;
    readonly id: number;
}> {
    readonly unbalance: Ref<Unbalance>;
    readonly id: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly source: lifetimes.Scope;
    readonly force: Vec2;
}

export interface Unbalance extends Identified<{ readonly host: Ref<Host>; readonly id: number }> {
    readonly host: Ref<Host>;
    readonly id: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly velocity: Vec2;
    readonly protectedUntil: number;
    readonly pendingForce: Vec2;
    readonly pulls: ReadonlyMap<number, Pull>;
    readonly nextPullId: number;
}

type UnbalanceEnd = "SETTLED" | "RESTRICTED" | "HOST_UNAVAILABLE";

type PullEnd =
    | { readonly type: "EXPLICIT"; readonly stopIfLast?: boolean }
    | { readonly type: "DEPENDENCY"; readonly reason: string };

function unbalanceRef(self: Unbalance): Ref<Unbalance> {
    return { host: self.host, id: self.id } as Ref<Unbalance>;
}

function pullRef(self: Pull): Ref<Pull> {
    return { unbalance: self.unbalance, id: self.id } as Ref<Pull>;
}

function findUnbalance(unit: Host, id: number): Unbalance | undefined {
    const { unbalance, endingUnbalances } = unit.locomotion;

    return unbalance?.id === id ? unbalance : endingUnbalances.get(id);
}

function getUnbalance(battle: BattleState, reference: Ref<Unbalance>): Unbalance | undefined {
    const unit = units.get(battle, reference.host);

    return unit === undefined ? undefined : findUnbalance(unit, reference.id);
}

function replaceUnbalance(battle: BattleState, unit: Host, next: Unbalance): BattleState {
    const { locomotion } = unit;
    const changes =
        locomotion.unbalance?.id === next.id
            ? { unbalance: next }
            : { endingUnbalances: new Map(locomotion.endingUnbalances).set(next.id, next) };

    return replace(battle, [{ ...unit, locomotion: { ...locomotion, ...changes } }]);
}

export const unbalanceLifetime = lifetimes.create<Unbalance, Unbalance, UnbalanceEnd>({
    kind: "UNBALANCE",
    address: (reference) => [reference.host.id, reference.id],
    get: getUnbalance,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({
        ...self,
        lifecycle: "ENDING",
        velocity: ZERO,
        pendingForce: ZERO,
    }),
    replace: (battle, reference, next) =>
        replaceUnbalance(battle, units.get(battle, reference.host)!, next),
    finalize(battle, reference): BattleState {
        const host = units.get(battle, reference.host)!;
        const { locomotion } = host;
        if (locomotion.unbalance?.id === reference.id) {
            battle = replace(battle, [{ ...host, locomotion: { ...locomotion, unbalance: null } }]);
        } else {
            const endingUnbalances = new Map(locomotion.endingUnbalances);
            endingUnbalances.delete(reference.id);
            battle = replace(battle, [
                { ...host, locomotion: { ...locomotion, endingUnbalances } },
            ]);
        }

        return unregister(battle, lifetimes.scope(unbalanceLifetime, reference));
    },
    reason: (end) => end,
    fromDependency: () => "HOST_UNAVAILABLE",
});

function getPull(battle: BattleState, reference: Ref<Pull>): Pull | undefined {
    return getUnbalance(battle, reference.unbalance)?.pulls.get(reference.id);
}

function replacePull(battle: BattleState, reference: Ref<Pull>, next: Pull | null): BattleState {
    const unit = units.get(battle, reference.unbalance.host)!;
    const self = findUnbalance(unit, reference.unbalance.id)!;
    const pulls = new Map(self.pulls);
    if (next === null) {
        pulls.delete(reference.id);
    } else {
        pulls.set(reference.id, next);
    }

    return replaceUnbalance(battle, unit, { ...self, pulls });
}

export const pullLifetime = lifetimes.create<Pull, Pull, PullEnd>({
    kind: "PULL",
    address: ({ unbalance, id }) => [unbalance.host.id, unbalance.id, id],
    get: getPull,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: replacePull,
    prepare(battle, reference, initial, end) {
        if (end.type !== "EXPLICIT" || !end.stopIfLast) {
            return battle;
        }

        const unit = units.get(battle, reference.unbalance.host)!;
        const self = findUnbalance(unit, reference.unbalance.id)!;

        return self.lifecycle === "ACTIVE" &&
            lifetimes.available(battle, initial.source) &&
            !hasActivePull(battle, self)
            ? replaceUnbalance(battle, unit, { ...self, velocity: ZERO })
            : battle;
    },
    finalize(battle, reference, end): BattleState {
        battle = replacePull(battle, reference, null);
        battle = unregister(battle, lifetimes.scope(pullLifetime, reference));

        return end.type === "EXPLICIT" ? finishIfSettled(battle, reference.unbalance) : battle;
    },
    reason: (end) => (end.type === "EXPLICIT" ? end.type : end.reason),
    fromDependency: (reason) => ({ type: "DEPENDENCY", reason }),
});

function isPullActive(battle: BattleState, self: Pull): boolean {
    return lifetimes.available(battle, lifetimes.scope(pullLifetime, pullRef(self)));
}

function hasActivePull(battle: BattleState, self: Unbalance): boolean {
    return [...self.pulls.values()].some((pull) => isPullActive(battle, pull));
}

function hostPresent(unit: Host): boolean {
    return unit.lifecycle === "PRESENT" && isPresent(unit) && (!hasVitality(unit) || isAlive(unit));
}

function permitsForce(battle: BattleState, unit: Host): boolean {
    return allows(battle, { self: unit }, unit.locomotion.forceRestrictions);
}

interface ImpulseInput {
    readonly impulse: Vec2;
}

type PullInput = Pick<Pull, "source" | "force">;

function receive(
    battle: BattleState,
    host: Ref<Host>,
    application: ImpulseInput,
): Result<Ref<Unbalance> | null>;
function receive(
    battle: BattleState,
    host: Ref<Host>,
    application: PullInput,
): Result<Ref<Pull> | null>;
function receive(
    battle: BattleState,
    host: Ref<Host>,
    application: ImpulseInput | PullInput,
): Result<Ref<Unbalance> | Ref<Pull> | null> {
    const unit = units.get(battle, host);
    if (unit === undefined || !hostPresent(unit) || !permitsForce(battle, unit)) {
        return { state: battle, value: null };
    }

    const { locomotion } = unit;
    const current = locomotion.unbalance;
    const active = current?.lifecycle === "ACTIVE" ? current : null;
    let self: Unbalance = {
        host,
        id: active?.id ?? locomotion.nextUnbalanceId,
        lifecycle: "ACTIVE",
        velocity: active?.velocity ?? ZERO,
        protectedUntil: battle.tick + PROTECTION_TICKS,
        pendingForce: active?.pendingForce ?? ZERO,
        pulls: active?.pulls ?? new Map(),
        nextPullId: active?.nextPullId ?? 0,
    };
    const reference = unbalanceRef(self);
    let received: Ref<Unbalance> | Ref<Pull> = reference;
    let createdPull: Pull | undefined;
    if ("impulse" in application) {
        const mass = unit.definition.locomotion.body?.mass ?? 1;
        const impulse = Vec2.scale(application.impulse, 1 / (mass * TICKS_PER_SECOND));
        self = { ...self, velocity: Vec2.add(self.velocity, impulse) };
    } else {
        const identity = scopeKey(application.source);
        const previous = [...self.pulls.values()].find(
            (pull) => scopeKey(pull.source) === identity && isPullActive(battle, pull),
        );
        const pull: Pull = {
            ...application,
            unbalance: reference,
            id: previous?.id ?? self.nextPullId,
            lifecycle: "ACTIVE",
        };
        received = pullRef(pull);

        if (previous === undefined) {
            createdPull = pull;
        }

        self = {
            ...self,
            pulls: new Map(self.pulls).set(pull.id, pull),
            nextPullId: self.nextPullId + (previous === undefined ? 1 : 0),
        };
    }

    const owner = lifetimes.scope(unbalanceLifetime, reference);
    if (active !== null) {
        battle = replaceUnbalance(battle, unit, self);
    } else {
        const endingUnbalances =
            current === null
                ? locomotion.endingUnbalances
                : new Map(locomotion.endingUnbalances).set(current.id, current);
        battle = replace(battle, [
            {
                ...unit,
                locomotion: {
                    ...locomotion,
                    unbalance: self,
                    endingUnbalances,
                    nextUnbalanceId: self.id + 1,
                },
            },
        ]);
        battle = register(battle, owner, lifetimes.scope(unitLifetime, host));
    }

    if (createdPull !== undefined) {
        battle = register(battle, lifetimes.scope(pullLifetime, pullRef(createdPull)), owner, [
            createdPull.source,
        ]);
    }

    if (active === null) {
        if (hasBlockable(unit)) {
            battle = release(battle, units.ref(unit));
        }
        if (hasBlocker(unit)) {
            battle = releaseAll(battle, units.ref(unit));
        }
    }

    return { state: battle, value: received };
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
): Result<Ref<Pull> | null> {
    assert(Vec2.is(force), "pull force must be a finite vector", TypeError);

    return lifetimes.available(battle, source)
        ? receive(battle, host, { source, force })
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
    reference: Ref<Pull>,
    force: Vec2,
): Result<boolean> {
    assert(Vec2.is(force), "pull force must be a finite vector", TypeError);
    const pull = getPull(battle, reference);
    if (
        pull === undefined ||
        !isPullActive(battle, pull) ||
        activeForForce(battle, reference.unbalance) === undefined
    ) {
        return { state: battle, value: false };
    }

    return {
        state: Vec2.equal(force, pull.force)
            ? battle
            : replacePull(battle, reference, { ...pull, force }),
        value: true,
    };
}

export function endPull(
    battle: BattleState,
    reference: Ref<Pull>,
    { stopIfLast = false }: { readonly stopIfLast?: boolean } = {},
): BattleState {
    return pullLifetime.end(battle, reference, { type: "EXPLICIT", stopIfLast });
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
    const self = getUnbalance(battle, reference);

    return self?.lifecycle === "ACTIVE" &&
        battle.tick >= self.protectedUntil &&
        Vec2.length(self.velocity) <= REST_SPEED &&
        Vec2.equal(self.pendingForce, ZERO) &&
        !hasActivePull(battle, self)
        ? unbalanceLifetime.end(battle, reference, "SETTLED")
        : battle;
}

export function advanceUnbalance(battle: BattleState, host: Ref<Host>): BattleState {
    const unit = units.get(battle, host);
    const self = unit?.locomotion.unbalance;
    if (unit === undefined || self?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const reference = unbalanceRef(self);
    if (!hostPresent(unit)) {
        return unbalanceLifetime.end(battle, reference, "HOST_UNAVAILABLE");
    }
    if (!permitsForce(battle, unit)) {
        return unbalanceLifetime.end(battle, reference, "RESTRICTED");
    }

    let force = self.pendingForce;

    for (const pull of self.pulls.values()) {
        if (isPullActive(battle, pull)) {
            force = Vec2.add(force, pull.force);
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
    const next: Unbalance = { ...self, velocity: motion.velocity, pendingForce: ZERO };
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

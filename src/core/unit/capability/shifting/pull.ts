import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert, assertNonnegativeNumber } from "../../../common/assert.js";
import type { Identified, Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import * as lifetimes from "../../../lifetime/index.js";
import { unregister } from "../../../lifetime/operations.js";
import * as projectiles from "../../../projectile/index.js";
import type { ProjectileFields } from "../../../projectile/projectile.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { resolvePullForce } from "./force.js";
import type { Shiftable } from "./shiftable.js";
import type { Shifter } from "./shifter.js";
import * as unbalance from "./unbalance.js";
import type { Unbalance } from "./unbalance.js";

const ZERO: Vec2 = [0, 0];

export type Point =
    | { readonly type: "FIXED"; readonly position: WorldPosition }
    | { readonly type: "PROJECTILE"; readonly projectile: Ref<ProjectileFields<any, any>> };

export type NearStop = (battle: BattleState, self: Pull) => boolean;

export type Brake = "ONCE" | "WHILE_NEAR";

export interface Input {
    readonly scope: lifetimes.Scope;
    readonly point: Point;
    readonly forceLevel: number;
    readonly nearStop: readonly NearStop[];
    readonly brake?: Brake;
}

export interface Pull extends Identified<{
    readonly unbalance: Ref<Unbalance>;
    readonly id: number;
}> {
    readonly unbalance: Ref<Unbalance>;
    readonly id: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly scope: lifetimes.Scope;
    readonly point: Point;
    readonly maxForce: number;
    readonly initialDistance: number;
    readonly nearStop: readonly NearStop[];
    readonly brake: Brake;
    readonly braked: boolean;
}

export function ref(self: Pull): Ref<Pull> {
    return { unbalance: self.unbalance, id: self.id } as Ref<Pull>;
}

export function get(battle: BattleState, reference: Ref<Pull>): Pull | undefined {
    return unbalance.get(battle, reference.unbalance)?.pulls.get(reference.id);
}

function replace(battle: BattleState, reference: Ref<Pull>, next: Pull | null): BattleState {
    const unit = units.get(battle, reference.unbalance.host)!;
    const self = unbalance.get(battle, reference.unbalance)!;
    const pulls = new Map(self.pulls);
    if (next === null) {
        pulls.delete(reference.id);
    } else {
        pulls.set(reference.id, next);
    }

    return unbalance.replace(battle, unit, { ...self, pulls });
}

export const lifetime = lifetimes.create<Pull, Pull, string>({
    kind: "PULL",
    address: ({ unbalance, id }) => [unbalance.host.id, unbalance.id, id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace,
    finalize(battle, reference): BattleState {
        battle = replace(battle, reference, null);

        return unregister(battle, lifetimes.scope(lifetime, reference));
    },
    reason: (reason) => reason,
    fromDependency: (reason) => reason,
});

export function available(battle: BattleState, self: Pull): boolean {
    return lifetimes.available(battle, lifetimes.scope(lifetime, ref(self)));
}

export function position(battle: BattleState, point: Point): WorldPosition | undefined {
    return point.type === "FIXED"
        ? point.position
        : projectiles.get(battle, point.projectile)?.position;
}

export function withinRadius(radius: number): NearStop {
    assertNonnegativeNumber(radius, "pull near-stop radius");
    const radiusSquared = radius ** 2;

    return (battle, self) => {
        const target = units.get(battle, self.unbalance.host);
        const point = position(battle, self.point);

        return (
            target !== undefined &&
            point !== undefined &&
            Vec2.distanceSquared(target.position, point) <= radiusSquared
        );
    };
}

export function isNear(battle: BattleState, self: Pull): boolean {
    return self.nearStop.some((test) => test(battle, self));
}

export function create(
    battle: BattleState,
    source: Ref<Unit & Shifter>,
    target: Ref<Unit & Shiftable>,
    input: Input,
): Result<Ref<Pull> | null> {
    if (input.point.type === "FIXED") {
        assert(Vec2.is(input.point.position), "pull point must be a finite position", TypeError);
    }

    const applier = units.get(battle, source);
    const unit = units.get(battle, target);
    const parents =
        input.point.type === "FIXED"
            ? [input.scope]
            : [input.scope, lifetimes.scope(projectiles.lifetime, input.point.projectile)];
    if (
        applier === undefined ||
        unit === undefined ||
        !parents.every((item) => lifetimes.available(battle, item))
    ) {
        return { state: battle, value: null };
    }

    const point = position(battle, input.point);
    const maxForce = resolvePullForce(battle, applier, unit, input.forceLevel);
    const next = unbalance.prepare(battle, unit);
    if (point === undefined || maxForce === 0 || next === null) {
        return { state: battle, value: null };
    }

    const item: Pull = {
        unbalance: unbalance.ref(next),
        id: next.nextPullId,
        lifecycle: "ACTIVE",
        scope: input.scope,
        point: input.point,
        maxForce,
        initialDistance: Vec2.length(Vec2.sub(point, unit.position)),
        nearStop: input.nearStop,
        brake: input.brake ?? "ONCE",
        braked: false,
    };

    const reference = ref(item);
    const pulls = new Map(next.pulls).set(item.id, item);
    battle = unbalance.receive(
        battle,
        unit,
        { ...next, pulls, nextPullId: next.nextPullId + 1 },
        { target: lifetimes.scope(lifetime, reference), parents },
    );

    return { state: battle, value: reference };
}

export function force(battle: BattleState, self: Pull, target: WorldPosition): Vec2 {
    const point = position(battle, self.point);
    if (point === undefined || isNear(battle, self)) {
        return ZERO;
    }

    const delta = Vec2.sub(point, target);
    const distance = Vec2.length(delta);
    if (distance === 0) {
        return ZERO;
    }

    const attenuation =
        distance > self.initialDistance ? 1 : (distance / self.initialDistance) ** 4;

    return Vec2.scale(delta, (self.maxForce * attenuation) / distance);
}

export function brake(battle: BattleState, reference: Ref<Pull>): BattleState {
    const current = unbalance.active(battle, reference.unbalance);
    const item = current?.self.pulls.get(reference.id);
    if (current === undefined || item === undefined || !available(battle, item)) {
        return battle;
    }

    const { unit, self } = current;
    if (
        [...self.pulls.values()].some((other) => other.id !== item.id && available(battle, other))
    ) {
        return battle;
    }

    if (item.braked && Vec2.equal(self.velocity, ZERO)) {
        return battle;
    }

    const pulls = item.braked
        ? self.pulls
        : new Map(self.pulls).set(item.id, { ...item, braked: true });

    return unbalance.replace(battle, unit, { ...self, velocity: ZERO, pulls });
}

export function end(battle: BattleState, reference: Ref<Pull>, reason = "EXPLICIT"): BattleState {
    return lifetime.end(battle, reference, reason);
}

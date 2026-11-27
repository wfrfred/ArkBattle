import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert, assertNonnegativeNumber } from "../../../common/assert.js";
import { createRef, ref, type Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import * as lifetimes from "../../../lifetime/index.js";
import * as projectiles from "../../../projectile/index.js";
import type { Unit } from "../../unit.js";
import { resolvePullForce } from "./force.js";
import type { Shiftable } from "./shiftable.js";
import type { Shifter } from "./shifter.js";
import * as unbalance from "./unbalance.js";
import type { Unbalance } from "./unbalance.js";

const ZERO: Vec2 = [0, 0];

export type Point =
    | { readonly type: "FIXED"; readonly position: WorldPosition }
    | {
          readonly type: "PROJECTILE";
          readonly projectile: Ref<projectiles.Projectile<object, any>>;
      };

export type NearStop = (battle: BattleState, self: Pull) => boolean;

export type Brake = "ONCE" | "WHILE_NEAR";

export interface Input {
    readonly scope: Ref<lifetimes.Lifetime>;
    readonly point: Point;
    readonly forceLevel: number;
    readonly nearStop: readonly NearStop[];
    readonly brake: Brake;
}

export interface Pull extends lifetimes.Lifetime<{
    readonly unbalance: Ref<Unbalance>;
}> {
    readonly config: lifetimes.Config<Pull, string>;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly scope: Ref<lifetimes.Lifetime>;
    readonly point: Point;
    readonly maxForce: number;
    readonly initialDistance: number;
    readonly nearStop: readonly NearStop[];
    readonly brake: Brake;
    readonly braked: boolean;
}

export { ref } from "../../../common/ref.js";

function getPull(this: object, battle: BattleState): Pull | undefined {
    const reference = this as Ref<Pull>;

    return reference.unbalance.get(battle)?.pulls.get(reference);
}

function replace(battle: BattleState, reference: Ref<Pull>, next: Pull | null): BattleState {
    const unit = reference.unbalance.host.get(battle)!;
    const self = reference.unbalance.get(battle)!;
    const pulls = new Map(self.pulls);
    if (next === null) {
        pulls.delete(reference);
    } else {
        pulls.set(reference, next);
    }

    return unbalance.replace(battle, unit, { ...self, pulls });
}

const config: Pull["config"] = {
    end: {
        prepare: (battle, reference, initial) =>
            replace(battle, reference, { ...initial, lifecycle: "ENDING" }),
        finalize: (battle, reference) => replace(battle, reference, null),
        dependencyEnd: "CANCELLED",
    },
};

export function available(battle: BattleState, self: Pull): boolean {
    return lifetimes.available(battle, ref(self));
}

export function position(battle: BattleState, point: Point): WorldPosition | undefined {
    return point.type === "FIXED" ? point.position : point.projectile.get(battle)?.position;
}

export function withinRadius(radius: number): NearStop {
    assertNonnegativeNumber(radius, "pull near-stop radius");
    const radiusSquared = radius ** 2;

    return (battle, self) => {
        const target = self.ref.unbalance.host.get(battle);
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

export function apply(
    battle: BattleState,
    source: Ref<Unit & Shifter>,
    target: Ref<Unit & Shiftable>,
    input: Input,
): Result<Ref<Pull> | null> {
    if (input.point.type === "FIXED") {
        assert(Vec2.is(input.point.position), "pull point must be a finite position", TypeError);
    }

    const applier = source.get(battle);
    const unit = target.get(battle);
    const scopes =
        input.point.type === "FIXED" ? [input.scope] : [input.scope, input.point.projectile];
    if (
        applier === undefined ||
        unit === undefined ||
        !scopes.every((scope) => lifetimes.available(battle, scope))
    ) {
        return { state: battle, value: null };
    }

    const point = position(battle, input.point);
    const maxForce = resolvePullForce(battle, applier, unit, input.forceLevel);
    const next = unbalance.prepare(battle, unit);
    if (point === undefined || maxForce === 0 || next === null) {
        return { state: battle, value: null };
    }

    const reference = createRef<Pull>({ unbalance: unbalance.ref(next) }, getPull);
    const item: Pull = {
        ref: reference,
        config,
        lifecycle: "ACTIVE",
        scope: input.scope,
        point: input.point,
        maxForce,
        initialDistance: Vec2.length(Vec2.sub(point, unit.position)),
        nearStop: input.nearStop,
        brake: input.brake,
        braked: false,
    };

    const pulls = new Map(next.pulls).set(reference, item);
    battle = unbalance.receive(battle, unit, { ...next, pulls }, { reference, scopes });

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
    const item = current?.self.pulls.get(reference);
    if (current === undefined || item === undefined || !available(battle, item)) {
        return battle;
    }

    const { unit, self } = current;
    if (
        [...self.pulls.values()].some(
            (other) => other.ref !== reference && available(battle, other),
        )
    ) {
        return battle;
    }

    if (item.braked && Vec2.equal(self.velocity, ZERO)) {
        return battle;
    }

    const pulls = item.braked
        ? self.pulls
        : new Map(self.pulls).set(reference, { ...item, braked: true });

    return unbalance.replace(battle, unit, { ...self, velocity: ZERO, pulls });
}

export function remove(
    battle: BattleState,
    reference: Ref<Pull>,
    reason = "EXPLICIT",
): BattleState {
    return lifetimes.end(battle, reference, reason);
}

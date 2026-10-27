import { Vec2 } from "../../core/common/vector.js";
import type { Ref } from "../../core/common/ref.js";
import { appendEvents, type State as BattleState } from "../../core/battle/index.js";
import * as projectiles from "../../core/projectile/index.js";
import type {
    Definition as ProjectileDefinition,
    Projectile,
    View,
} from "../../core/projectile/index.js";

import { stop, update } from "../../core/battle/projectile.js";
import { type WorldPosition } from "../../core/geometry/coordinate.js";
import { hasOffense, resolveAttack } from "../../core/unit/capability/offense/index.js";

import { isSpatiallyPresent } from "../../core/unit/capability/presence/index.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";

export interface State {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly destination: WorldPosition;
    readonly cachedAtk: number;
    readonly speedPerTick: number;
    readonly stopDelayTicks: number;
    readonly stopAtTick: number | null;
    readonly hitAttempted: boolean;
    readonly launchedAtTick: number;
}

export interface Definition extends ProjectileDefinition<State> {
    readonly tracking: true;
}

export interface Presentation {
    readonly id: number;
    readonly source: number | null;
    readonly traceTarget: number;
    readonly position: WorldPosition;
    readonly destination: WorldPosition;
    readonly launchedAtTick: number;
}

function isTracking(self: View): self is Projectile<State> {
    return "tracking" in self.definition && self.definition.tracking === true;
}

export function project(battle: BattleState, reference: Ref<View>): Presentation | undefined {
    const self = projectiles.get(battle, reference);

    return self === undefined || !isTracking(self)
        ? undefined
        : {
              id: self.id,
              source: self.state.source?.id ?? null,
              traceTarget: self.state.target.id,
              position: self.position,
              destination: self.state.destination,
              launchedAtTick: self.state.launchedAtTick,
          };
}

export function attackPower<S extends State>(battle: BattleState, self: Projectile<S>): number {
    const source = self.state.source === null ? undefined : units.get(battle, self.state.source);

    if (source === undefined) {
        return self.state.cachedAtk;
    }

    return hasOffense(source) ? resolveAttack(battle, units.ref(source))! : 0;
}

export function hit<S extends State>(
    battle: BattleState,
    self: Projectile<S>,
    invoke: (battle: BattleState, self: Projectile<S>, target: Unit & Vitality) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);
    const current = projectiles.get(battle, reference);

    if (current === undefined || current.state.hitAttempted) {
        return battle;
    }

    battle = update(battle, reference, {
        state: { ...current.state, hitAttempted: true },
    });
    const marked = projectiles.get(battle, reference)!;
    const target = units.get(battle, marked.state.target);

    if (target?.lifecycle !== "PRESENT" || target.vitality.hp <= 0) {
        return battle;
    }

    battle = appendEvents(battle, [
        {
            type: "PROJECTILE_HIT",
            projectileId: marked.id,
            source: marked.state.source?.id ?? null,
            targetUnitId: target.id,
            tick: battle.tick,
            position: marked.position,
        },
    ]);

    return invoke(battle, marked, target);
}

export function advance<S extends State>(
    battle: BattleState,
    self: Projectile<S>,
    onReached: (battle: BattleState, self: Projectile<S>) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);

    if (self.state.stopAtTick !== null) {
        return battle.tick >= self.state.stopAtTick ? stop(battle, reference, "ARRIVED") : battle;
    }

    const target = units.get(battle, self.state.target);
    const destination =
        target !== undefined && isSpatiallyPresent(target)
            ? target.position
            : self.state.destination;
    const reached =
        Vec2.distanceSquared(self.position, destination) <=
        self.state.speedPerTick * self.state.speedPerTick;
    const position = reached
        ? destination
        : Vec2.add(
              self.position,
              Vec2.clampLength(Vec2.sub(destination, self.position), self.state.speedPerTick),
          );
    const stopAtTick = reached ? battle.tick + self.state.stopDelayTicks : null;

    battle = update(battle, reference, {
        position,
        state: { ...self.state, destination, stopAtTick },
    });

    if (!reached) {
        return battle;
    }

    const advanced = projectiles.get(battle, reference)!;
    battle = appendEvents(battle, [
        {
            type: "PROJECTILE_REACHED",
            projectileId: advanced.id,
            source: advanced.state.source?.id ?? null,
            tick: battle.tick,
            position: advanced.position,
        },
    ]);
    battle = onReached(battle, advanced);
    const latest = projectiles.get(battle, reference);

    return latest?.lifecycle === "ACTIVE" &&
        latest.state.stopAtTick !== null &&
        battle.tick >= latest.state.stopAtTick
        ? stop(battle, reference, "ARRIVED")
        : battle;
}

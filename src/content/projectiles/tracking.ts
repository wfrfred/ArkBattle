import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
import * as projectiles from "../../core/projectile/index.js";
import type {
    Definition as ProjectileDefinition,
    Projectile,
} from "../../core/projectile/index.js";

import { type WorldPosition } from "../../core/geometry/coordinate.js";
import { hasOffense, resolveAttack } from "../../core/unit/capability/offense/index.js";

import { isAlive, type Vitality } from "../../core/unit/capability/vitality/index.js";
import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";
import { towards } from "./motion.js";

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

export interface Definition<T extends object = object> extends ProjectileDefinition<State, T> {
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

export function project<S extends object, T extends object>(
    battle: BattleState,
    reference: Ref<Projectile<S, T>>,
): Presentation | undefined {
    const self = projectiles.get(battle, reference);
    if (
        self === undefined ||
        !("tracking" in self.definition && self.definition.tracking === true)
    ) {
        return undefined;
    }

    const state = self.state as State;

    return {
        id: self.id,
        source: state.source?.id ?? null,
        traceTarget: state.target.id,
        position: self.position,
        destination: state.destination,
        launchedAtTick: state.launchedAtTick,
    };
}

export function attackPower<S extends State, T extends object>(
    battle: BattleState,
    self: Projectile<S, T>,
): number {
    const source = self.state.source === null ? undefined : units.get(battle, self.state.source);
    if (source === undefined) {
        return self.state.cachedAtk;
    }

    return hasOffense(source) ? resolveAttack(battle, source) : 0;
}

export function hit<S extends State, T extends object>(
    battle: BattleState,
    self: Projectile<S, T> & T,
    invoke: (
        battle: BattleState,
        self: Projectile<S, T> & T,
        target: Unit & Vitality,
    ) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);
    const current = projectiles.get(battle, reference);
    if (current === undefined || current.state.hitAttempted) {
        return battle;
    }

    battle = projectiles.update(battle, reference, {
        state: { ...current.state, hitAttempted: true },
    });
    const marked = projectiles.get(battle, reference)!;
    const target = units.get(battle, marked.state.target);
    if (target?.lifecycle !== "PRESENT" || !isAlive(target)) {
        return battle;
    }

    return invoke(battle, marked, target);
}

export function advance<S extends State, T extends object>(
    battle: BattleState,
    self: Projectile<S, T> & T,
    deltaTicks: number,
    onReached: (battle: BattleState, self: Projectile<S, T> & T) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);

    if (self.state.stopAtTick !== null) {
        return battle.tick >= self.state.stopAtTick
            ? projectiles.remove(battle, reference, "ARRIVED")
            : battle;
    }

    const target = units.get(battle, self.state.target);
    const destination = target?.position ?? self.state.destination;
    const { position, reached } = towards(
        self.position,
        destination,
        self.state.speedPerTick,
        deltaTicks,
    );
    const stopAtTick = reached ? battle.tick + self.state.stopDelayTicks : null;

    battle = projectiles.update(battle, reference, {
        position,
        state: { ...self.state, destination, stopAtTick },
    });

    if (!reached) {
        return battle;
    }

    const advanced = projectiles.get(battle, reference)!;
    battle = onReached(battle, advanced);
    const latest = projectiles.get(battle, reference);

    return latest?.lifecycle === "ACTIVE" &&
        latest.state.stopAtTick !== null &&
        battle.tick >= latest.state.stopAtTick
        ? projectiles.remove(battle, reference, "ARRIVED")
        : battle;
}

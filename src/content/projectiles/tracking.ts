import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
import * as projectiles from "../../core/projectile/index.js";
import type {
    Definition as ProjectileDefinition,
    Projectile,
} from "../../core/projectile/index.js";

import { type WorldPosition } from "../../core/geometry/coordinate.js";

import { isAlive, type Vitality } from "../../core/unit/capability/vitality/index.js";
import type { Unit } from "../../core/unit/index.js";
import { towards } from "./motion.js";

export interface State {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly destination: WorldPosition;
    readonly speedPerTick: number;
    readonly stopDelayTicks: number;
    readonly stopAtTick: number | null;
    readonly hitAttempted: boolean;
    readonly launchedAtTick: number;
}

export interface Definition<
    S extends State = State,
    T extends object = object,
> extends ProjectileDefinition<S, T> {
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

export function project(battle: BattleState, reference: Ref<Projectile>): Presentation | undefined {
    const self = reference.get(battle);
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

export function hit<S extends State, T extends object>(
    battle: BattleState,
    self: Projectile<S> & T,
    invoke: (battle: BattleState, self: Projectile<S> & T, target: Unit & Vitality) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);
    const current = reference.get(battle);
    if (current === undefined || current.state.hitAttempted) {
        return battle;
    }

    battle = projectiles.update(battle, reference, {
        state: { ...current.state, hitAttempted: true },
    });
    const marked = reference.get(battle)!;
    const target = marked.state.target.get(battle);
    if (target?.lifecycle !== "ACTIVE" || !isAlive(target)) {
        return battle;
    }

    return invoke(battle, marked, target);
}

export function advance<S extends State, T extends object>(
    battle: BattleState,
    self: Projectile<S> & T,
    deltaTicks: number,
    onReached: (battle: BattleState, self: Projectile<S> & T) => BattleState,
): BattleState {
    const reference = projectiles.ref(self);

    if (self.state.stopAtTick !== null) {
        return battle.tick >= self.state.stopAtTick
            ? projectiles.remove(battle, reference, "ARRIVED")
            : battle;
    }

    const target = self.state.target.get(battle);
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

    const advanced = reference.get(battle)!;
    battle = onReached(battle, advanced);
    const latest = reference.get(battle);

    return latest?.lifecycle === "ACTIVE" &&
        latest.state.stopAtTick !== null &&
        battle.tick >= latest.state.stopAtTick
        ? projectiles.remove(battle, reference, "ARRIVED")
        : battle;
}

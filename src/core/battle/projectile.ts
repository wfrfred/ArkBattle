import type { Ref } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Definition, StopReason } from "../projectile/definition.js";
import type { Projectile } from "../projectile/projectile.js";
import { get, ref } from "../projectile/query.js";
import { create as createLifetime } from "../lifetime/operations.js";
import { appendEvents, type State as BattleState, type Result } from "./state.js";

export interface CreateInput<S extends object> {
    readonly position: WorldPosition;
    readonly state: S;
}

export function create<S extends object>(
    battle: BattleState,
    definition: Definition<S>,
    input: CreateInput<NoInfer<S>>,
): Result<Ref<Projectile<S>>> {
    const id = battle.execution.nextProjectileId;
    const self: Projectile<S> = {
        id,
        definition,
        lifecycle: "ACTIVE",
        position: input.position,
        state: input.state,
    };
    const reference = ref(self);
    battle = {
        ...battle,
        execution: { ...battle.execution, nextProjectileId: id + 1 },
        battlefield: {
            ...battle.battlefield,
            projectiles: battle.battlefield.projectiles.add(self),
        },
    };

    return {
        state: definition.onStart?.(battle, self) ?? battle,
        value: reference,
    };
}

export function update<T extends Projectile<any>>(
    battle: BattleState,
    reference: Ref<T>,
    changes: {
        readonly position?: WorldPosition;
        readonly state?: NoInfer<T["state"]>;
    },
): BattleState {
    const current = get(battle, reference);
    if (current === undefined) {
        throw new RangeError(`unknown projectile: ${reference.id}`);
    }

    const position = changes.position ?? current.position;
    const state = (changes.state ?? current.state) as T["state"];
    if (position === current.position && state === current.state) {
        return battle;
    }

    return {
        ...battle,
        battlefield: {
            ...battle.battlefield,
            projectiles: battle.battlefield.projectiles.replace(reference, {
                ...current,
                position,
                state,
            }),
        },
    };
}

export const lifetime = createLifetime<Projectile, Projectile<any>, StopReason>({
    kind: "PROJECTILE",
    address: (ref) => [ref.id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, _ref, next) => ({
        ...battle,
        battlefield: {
            ...battle.battlefield,
            projectiles: battle.battlefield.projectiles.replace(ref(next), next),
        },
    }),
    prepare: (battle, reference, _initial, reason) => {
        const self = get(battle, reference)!;

        return appendEvents(battle, [
            {
                type: "PROJECTILE_STOPPED",
                projectileId: self.id,
                position: self.position,
                tick: battle.tick,
                reason,
            },
        ]);
    },
    finalize: (battle, reference, reason) => {
        const self = get(battle, reference)!;
        battle = self.definition.onEnd?.(battle, self, reason) ?? battle;

        return {
            ...battle,
            battlefield: {
                ...battle.battlefield,
                projectiles: battle.battlefield.projectiles.remove(reference.id),
            },
        };
    },
    reason: (reason) => reason,
});

export function stop<P extends Projectile<any>>(
    battle: BattleState,
    reference: Ref<P>,
    reason: StopReason = "EXPLICIT",
): BattleState {
    return lifetime.end(battle, reference, reason);
}

export function advance<P extends Projectile<any>>(
    battle: BattleState,
    candidates: Iterable<Ref<P>>,
): BattleState {
    for (const reference of candidates) {
        const self = get(battle, reference);
        if (self?.lifecycle === "ACTIVE") {
            battle = self.definition.onTick?.(battle, self) ?? battle;
        }
    }

    return battle;
}

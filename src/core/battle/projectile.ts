import type { Ref } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Definition, StopReason } from "../projectile/definition.js";
import type { Projectile, View } from "../projectile/projectile.js";
import { get, ref } from "../projectile/query.js";
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

export function update<S extends object>(
    battle: BattleState,
    reference: Ref<Projectile<S>>,
    changes: {
        readonly position?: WorldPosition;
        readonly state?: NoInfer<S>;
    },
): BattleState {
    const current = get(battle, reference);

    if (current === undefined) {
        throw new RangeError(`unknown projectile: ${reference.id}`);
    }

    const position = changes.position ?? current.position;
    const state = changes.state ?? current.state;

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

export function stop(
    battle: BattleState,
    reference: Ref<View>,
    reason: StopReason = "EXPLICIT",
): BattleState {
    return (
        battle.battlefield.projectiles.read(reference.id, (current) => {
            if (current.lifecycle !== "ACTIVE") {
                return battle;
            }

            const self: Projectile<typeof current.state> = {
                ...current,
                lifecycle: "ENDING",
            };
            battle = {
                ...battle,
                battlefield: {
                    ...battle.battlefield,
                    projectiles: battle.battlefield.projectiles.replace(ref(self), self),
                },
            };
            battle = appendEvents(battle, [
                {
                    type: "PROJECTILE_STOPPED",
                    projectileId: self.id,
                    position: self.position,
                    tick: battle.tick,
                    reason,
                },
            ]);
            battle = self.definition.onEnd?.(battle, self, reason) ?? battle;

            return {
                ...battle,
                battlefield: {
                    ...battle.battlefield,
                    projectiles: battle.battlefield.projectiles.remove(reference.id),
                },
            };
        }) ?? battle
    );
}

export function advance(battle: BattleState, candidates: readonly Ref<View>[]): BattleState {
    for (const reference of candidates) {
        battle =
            battle.battlefield.projectiles.read(reference.id, (self) =>
                self.lifecycle === "ACTIVE"
                    ? (self.definition.onTick?.(battle, self) ?? battle)
                    : battle,
            ) ?? battle;
    }

    return battle;
}

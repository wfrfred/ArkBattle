import type { State as BattleState } from "../battle/state.js";
import { ref, type Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import { available, type Lifetime } from "../lifetime/index.js";
import { cardForUnit } from "../battle/deployment/query.js";
import type { Unit } from "../unit/unit.js";
import type { Effect, StackEffect } from "./effect.js";
import type { Definition, StackDefinition } from "./definition.js";
import type { Group, GroupSource } from "./group.js";

export function get<
    S extends object,
    H extends Lifetime | null,
    Self extends StackEffect<S, H> = StackEffect<S, H>,
>(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: StackDefinition<S, H, Self>,
): Self | undefined;
export function get<
    S extends object,
    H extends Lifetime | null,
    Self extends Effect<S, H> = Effect<S, H>,
>(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: Definition<S, H, Self>,
): Self | undefined;
export function get(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: Definition<object, Lifetime | null, never>,
): Effect | undefined {
    const self = reference.get(battle);

    return self?.definition === definition ? self : undefined;
}

export function all(battle: BattleState): Query<Effect> {
    return battle.effects.values();
}

export function forHost(battle: BattleState, host: Ref<Lifetime> | null): Query<Effect> {
    return all(battle).filter((effect) => effect.ref.host === host);
}

export function forGroup(
    battle: BattleState,
    host: Ref<Lifetime> | null,
    group: Group,
    source: GroupSource,
): Query<Effect> {
    return forHost(battle, host).filter(
        (effect) =>
            effect.lifecycle !== "ENDING" &&
            effect.definition.group?.id === group.id &&
            effect.definition.group.independentSource === group.independentSource &&
            effect.groupSource === source,
    );
}

export function resolveGroupSource(
    battle: BattleState,
    group: Group | undefined,
    source: Ref<Unit> | null,
): GroupSource {
    if (group?.independentSource !== true || source === null) {
        return null;
    }

    return cardForUnit(battle, source) ?? source;
}

export function canEnable(battle: BattleState, self: Effect): boolean {
    if (!self.enabled || !available(battle, ref(self))) {
        return false;
    }

    const group = self.definition.group;
    if (group?.type !== "DEFAULT") {
        return true;
    }

    return !forGroup(battle, self.ref.host, group, self.groupSource).some((other) => {
        const competing = other.definition.group;

        return (
            competing?.type === "DEFAULT" &&
            (competing.priority > group.priority ||
                (competing.priority === group.priority && other.id < self.id))
        );
    });
}

export function hasStack<S extends object, H extends Lifetime | null>(
    self: Effect<S, H>,
): self is StackEffect<S, H> {
    return self.definition.group?.type === "STACK";
}

export function effectiveStackCount(self: StackEffect): number {
    const maximum = self.definition.group.maxEffectiveCount;

    return maximum === null ? self.stackCount : Math.min(self.stackCount, maximum);
}

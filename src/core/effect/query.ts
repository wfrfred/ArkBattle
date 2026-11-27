import type { State as BattleState } from "../battle/state.js";
import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { Lifetime } from "../lifetime/index.js";
import type { Effect, StackEffect } from "./effect.js";
import type { Definition, StackDefinition } from "./definition.js";

export function get<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: StackDefinition<S, H>,
): StackEffect<S, H> | undefined;
export function get<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: Definition<S, H>,
): Effect<S, H> | undefined;
export function get(
    battle: BattleState,
    reference: Ref<Effect>,
    definition: Effect["definition"],
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
    id: string,
    partition: Effect["partition"],
): Query<Effect> {
    return forHost(battle, host).filter(
        (effect) =>
            effect.lifecycle !== "ENDING" &&
            effect.definition.group?.id === id &&
            effect.partition === partition,
    );
}

export function wins(battle: BattleState, self: Effect): boolean {
    const group = self.definition.group;
    if (group?.type !== "DEFAULT") {
        return true;
    }

    return !forGroup(battle, self.ref.host, group.id, self.partition).some((other) => {
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
    return "stackCount" in self;
}

export function stacks(self: StackEffect): number {
    const maximum = self.definition.group.maxEffectiveCount;

    return maximum === null ? self.stackCount : Math.min(self.stackCount, maximum);
}

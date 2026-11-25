import { createRef, ref, type Identified, type Ref } from "../common/ref.js";
import { create as createLifetime } from "../lifetime/index.js";
import { register } from "../lifetime/operations.js";
import type { Query } from "../common/query.js";
import type { Result, State as BattleState } from "../battle/state.js";
import { replaceIn } from "../common/object.js";

export type Lifecycle = "ACTIVE" | "INACTIVE" | "ENDING";

export interface Definition<S extends object = object> {
    readonly id: string;
    readonly initialize: () => S;
    readonly onEnter?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onEnable?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onTick?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Mechanism<S>) => BattleState;
}

export interface Input<S extends object = object> {
    readonly definition: Definition<S>;
    readonly active?: boolean;
}

export interface Mechanism<S extends object = object> extends Identified<object> {
    readonly definition: Definition<S>;
    readonly lifecycle: Lifecycle;
    readonly state: S;
}

export { ref } from "../common/ref.js";

export function initialize<S extends object, const D extends Definition<S>>(
    battle: BattleState,
    input: Input<S> & { readonly definition: D },
): Result<Mechanism<S> & { readonly definition: D }> {
    const { definition, active = true } = input;

    return {
        state: battle,
        value: {
            ref: createRef<Mechanism>({}, getMechanism),
            definition,
            state: definition.initialize(),
            lifecycle: active ? "ACTIVE" : "INACTIVE",
        },
    };
}

export function add<S extends object>(battle: BattleState, self: Mechanism<S>): BattleState {
    battle = replaceIn(battle, ["mechanisms"], battle.mechanisms.add(ref(self), self));
    battle = register(battle, lifetime, ref(self));

    return self.definition.onEnter?.(battle, self) ?? battle;
}

function getMechanism(this: object, battle: BattleState): Mechanism | undefined {
    return battle.mechanisms.get(this as Ref<Mechanism>);
}

export function all(battle: BattleState): Query<Mechanism> {
    return battle.mechanisms.values() as Query<Mechanism>;
}

export function setState<T extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = reference.get(battle);
    if (self === undefined) {
        throw new RangeError("unknown mechanism");
    }

    return state === self.state
        ? battle
        : replaceIn(
              battle,
              ["mechanisms"],
              battle.mechanisms.replace(reference, { ...self, state }),
          );
}

export function setActive<M extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<M>,
    active: boolean,
): BattleState {
    const self = reference.get(battle);
    const lifecycle = active ? "ACTIVE" : "INACTIVE";
    if (self === undefined || self.lifecycle === "ENDING" || self.lifecycle === lifecycle) {
        return battle;
    }

    const next: M = { ...self, lifecycle };
    battle = replaceIn(battle, ["mechanisms"], battle.mechanisms.replace(reference, next));

    const callback = active ? next.definition.onEnable : next.definition.onDisable;

    return callback?.(battle, next) ?? battle;
}

export const lifetime = createLifetime<Mechanism<any>, string>({
    end: {
        prepare: (battle, reference, initial) =>
            replaceIn(
                battle,
                ["mechanisms"],
                battle.mechanisms.replace(reference, { ...initial, lifecycle: "ENDING" }),
            ),
        finalize: (battle, reference) => {
            const self = reference.get(battle)!;
            battle = self.definition.onEnd?.(battle, self) ?? battle;

            return replaceIn(battle, ["mechanisms"], battle.mechanisms.remove(reference));
        },
    },
});

export function remove<M extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<M>,
): BattleState {
    return lifetime.end(battle, reference, "EXPLICIT");
}

export function advance(battle: BattleState): BattleState {
    const candidates = all(battle);

    for (const candidate of candidates) {
        const reference = ref(candidate);
        const self = reference.get(battle);
        if (self?.lifecycle === "ACTIVE" && self.definition.onTick !== undefined) {
            battle = self.definition.onTick(battle, self);
        }
    }

    return battle;
}

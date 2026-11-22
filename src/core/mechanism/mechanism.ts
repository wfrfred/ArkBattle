import type { Identified, Ref } from "../common/ref.js";
import { create as createLifetime } from "../lifetime/operations.js";
import type { Query } from "../common/query.js";
import type { Result, State as BattleState } from "../battle/state.js";

export type MechanismId = number;

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

export interface Mechanism<S extends object = object> extends Identified<{
    readonly id: MechanismId;
}> {
    readonly id: MechanismId;
    readonly definition: Definition<S>;
    readonly lifecycle: Lifecycle;
    readonly state: S;
}

export function ref<M extends Mechanism<any>>(mechanism: M): Ref<M> {
    return { id: mechanism.id } as Ref<M>;
}

export function initialize<S extends object, const D extends Definition<S>>(
    battle: BattleState,
    input: Input<S> & { readonly definition: D },
): Result<Mechanism<S> & { readonly definition: D }> {
    const id = battle.execution.nextMechanismId;
    const { definition, active = true } = input;

    return {
        state: { ...battle, execution: { ...battle.execution, nextMechanismId: id + 1 } },
        value: {
            id,
            definition,
            state: definition.initialize(),
            lifecycle: active ? "ACTIVE" : "INACTIVE",
        },
    };
}

export function add<S extends object>(battle: BattleState, self: Mechanism<S>): BattleState {
    battle = {
        ...battle,
        mechanisms: battle.mechanisms.add(self.id, self),
    };
    battle = self.definition.onEnter?.(battle, self) ?? battle;

    if (self.lifecycle !== "ACTIVE") {
        return battle;
    }

    const current = get(battle, ref(self));

    return current?.lifecycle === "ACTIVE"
        ? (current.definition.onEnable?.(battle, current) ?? battle)
        : battle;
}

export function get<M extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<M>,
): M | undefined {
    return battle.mechanisms.get(reference.id) as M | undefined;
}

export function all(battle: BattleState): Query<Mechanism> {
    return battle.mechanisms.values() as Query<Mechanism>;
}

export function setState<T extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown mechanism: ${reference.id}`);
    }

    return state === self.state
        ? battle
        : { ...battle, mechanisms: battle.mechanisms.replace(reference.id, { ...self, state }) };
}

export function setActive<M extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<M>,
    active: boolean,
): BattleState {
    const self = get(battle, reference);
    const lifecycle = active ? "ACTIVE" : "INACTIVE";
    if (self === undefined || self.lifecycle === "ENDING" || self.lifecycle === lifecycle) {
        return battle;
    }

    const next: M = { ...self, lifecycle };
    battle = { ...battle, mechanisms: battle.mechanisms.replace(reference.id, next) };

    const callback = active ? next.definition.onEnable : next.definition.onDisable;

    return callback?.(battle, next) ?? battle;
}

export const lifetime = createLifetime<Mechanism, Mechanism<any>, string>({
    kind: "MECHANISM",
    address: (ref) => [ref.id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, reference, next) => ({
        ...battle,
        mechanisms: battle.mechanisms.replace(reference.id, next),
    }),
    prepare: (battle, reference, initial) => {
        const self = get(battle, reference)!;

        return initial.lifecycle === "ACTIVE"
            ? (self.definition.onDisable?.(battle, self) ?? battle)
            : battle;
    },
    finalize: (battle, reference) => {
        const self = get(battle, reference)!;
        battle = self.definition.onEnd?.(battle, self) ?? battle;

        return { ...battle, mechanisms: battle.mechanisms.remove(reference.id) };
    },
    reason: (reason) => reason,
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
        const self = get(battle, reference);
        if (self?.lifecycle === "ACTIVE" && self.definition.onTick !== undefined) {
            battle = self.definition.onTick(battle, self);
        }
    }

    return battle;
}

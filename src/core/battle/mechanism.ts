import type { Identified, Ref } from "../common/ref.js";
import { create as createLifetime } from "../lifetime/operations.js";
import type { Query } from "../common/query.js";
import type { Departure } from "../unit/unit.js";
import { instantiateMechanismPlacement } from "./creation/mechanism.js";
import type { Result, State as BattleState } from "./state.js";
import { removeHook } from "./unit-hook.js";

export type MechanismId = number;

export type Lifecycle = "ACTIVE" | "INACTIVE" | "ENDING";

export interface MechanismDefinition<S extends object = object> {
    readonly id: string;
    readonly initialize: () => S;
    readonly onTick?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onUnitLeave?: (
        battle: BattleState,
        self: Mechanism<S>,
        departure: Departure,
    ) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Mechanism<S>) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Mechanism<S>) => BattleState;
}

export interface Mechanism<S extends object = object> extends Identified<{
    readonly id: MechanismId;
}> {
    readonly id: MechanismId;
    readonly definition: MechanismDefinition<S>;
    readonly lifecycle: Lifecycle;
    readonly state: S;
}

export function ref<M extends Mechanism<any>>(mechanism: M): Ref<M> {
    return { id: mechanism.id } as Ref<M>;
}

export function createMechanismDefinition<S extends object>(
    definition: MechanismDefinition<S>,
): MechanismDefinition<S> {
    if (definition.id.length === 0) {
        throw new TypeError("mechanism definition id must be nonempty");
    }

    return definition;
}

export function create<S extends object>(
    battle: BattleState,
    definition: MechanismDefinition<S>,
    options: { readonly active?: boolean } = {},
): Result<Ref<Mechanism<S>>> {
    return instantiateMechanismPlacement(battle, { definition, ...options });
}

export function get<M extends Mechanism<any>>(
    battle: BattleState,
    reference: Ref<M>,
): M | undefined {
    return battle.mechanisms.get(reference);
}

export function all(battle: BattleState): Query<Mechanism> {
    return battle.mechanisms.values();
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
        : { ...battle, mechanisms: battle.mechanisms.replace(reference, { ...self, state }) };
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
    battle = { ...battle, mechanisms: battle.mechanisms.replace(ref(self), next) };

    return !active && next.definition.onDisable !== undefined
        ? next.definition.onDisable(battle, next)
        : battle;
}

export const lifetime = createLifetime<Mechanism, Mechanism<any>, string>({
    kind: "MECHANISM",
    address: (ref) => [ref.id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, _ref, next) => ({
        ...battle,
        mechanisms: battle.mechanisms.replace(ref(next), next),
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

        battle = { ...battle, mechanisms: battle.mechanisms.remove(reference.id) };

        return removeHook(battle, "leave", `@mechanism/${reference.id}/unit-leave`);
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

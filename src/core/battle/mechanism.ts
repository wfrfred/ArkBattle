import type { Identified, Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { Departure } from "../unit/unit.js";
import { instantiateMechanismPlacement } from "./creation/mechanism.js";
import type { Result, State as BattleState } from "./state.js";

export type MechanismId = number;

export type Status = "ACTIVE" | "INACTIVE" | "ENDING";

export interface CreationDefinition {
    readonly id: string;
    readonly initialize: () => object;
}

export interface MechanismDefinition<S extends object = object> extends CreationDefinition {
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

export interface View extends Identified<{ readonly id: MechanismId }> {
    readonly id: MechanismId;
    readonly definition: { readonly id: string };
    readonly status: Status;
}

export interface Mechanism<S extends object = object> extends View {
    readonly definition: MechanismDefinition<S>;
    readonly state: S;
}

export function ref<M extends View>(mechanism: M): Ref<M> {
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

export function get<M extends View>(battle: BattleState, reference: Ref<M>): M | undefined {
    return battle.mechanisms.get(reference);
}

export function all(battle: BattleState): Query<View> {
    return battle.mechanisms.values();
}

export function setState<S extends object>(
    battle: BattleState,
    reference: Ref<Mechanism<S>>,
    state: NoInfer<S>,
): BattleState {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown mechanism: ${reference.id}`);
    }

    return state === self.state
        ? battle
        : { ...battle, mechanisms: battle.mechanisms.replace(reference, { ...self, state }) };
}

export function setActive(battle: BattleState, reference: Ref<View>, active: boolean): BattleState {
    return (
        battle.mechanisms.read(reference.id, (self) => {
            const status = active ? "ACTIVE" : "INACTIVE";
            if (self.status === "ENDING" || self.status === status) {
                return battle;
            }

            const next: typeof self = { ...self, status };
            battle = { ...battle, mechanisms: battle.mechanisms.replace(ref(self), next) };

            return !active && next.definition.onDisable !== undefined
                ? next.definition.onDisable(battle, next)
                : battle;
        }) ?? battle
    );
}

export function remove(battle: BattleState, reference: Ref<View>): BattleState {
    return (
        battle.mechanisms.read(reference.id, (self) => {
            if (self.status === "ENDING") {
                return battle;
            }

            const ending = { ...self, status: "ENDING" as const };
            battle = { ...battle, mechanisms: battle.mechanisms.replace(ref(self), ending) };

            if (ending.definition.onEnd !== undefined) {
                battle = ending.definition.onEnd(battle, ending);
            }

            return { ...battle, mechanisms: battle.mechanisms.remove(reference.id) };
        }) ?? battle
    );
}

export function advance(battle: BattleState): BattleState {
    const candidates = all(battle).map(ref).toArray();

    for (const reference of candidates) {
        battle =
            battle.mechanisms.read(reference.id, (self) =>
                self.status === "ACTIVE" && self.definition.onTick !== undefined
                    ? self.definition.onTick(battle, self)
                    : battle,
            ) ?? battle;
    }

    return battle;
}

export function notifyUnitLeave(battle: BattleState, departure: Departure): BattleState {
    const candidates = all(battle).map(ref).toArray();

    for (const reference of candidates) {
        battle =
            battle.mechanisms.read(reference.id, (self) =>
                self.status === "ACTIVE" && self.definition.onUnitLeave !== undefined
                    ? self.definition.onUnitLeave(battle, self, departure)
                    : battle,
            ) ?? battle;
    }

    return battle;
}

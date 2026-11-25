import { createRef, type Identified, type Identity, type Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type { ActivationRestriction } from "./restriction.js";
import type { Skill } from "./skill.js";
import type { Definition as DurationDefinition, State as DurationState } from "./duration.js";

export type Operation = "STOP" | "RETRIGGER";

export type Trigger = "MANUAL" | "AUTO" | "PASSIVE";

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export interface Initial<A extends object = object> {
    readonly state: A;
    readonly duration: DurationDefinition;
}

export interface Parameters {
    readonly requirement: number;
    readonly cost: number;
}

export interface Definition<
    S extends object,
    A extends object,
    H extends object = object,
> extends Parameters {
    readonly trigger: Trigger;
    readonly ignoreRestrictions: readonly ActivationRestriction[];
    readonly initialize: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability & H>,
        self: Skill<S, A>,
    ) => Initial<A>;
    readonly accepts?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability & H>,
        self: Skill<S, A>,
    ) => boolean;
    readonly onStart?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability & H>,
        self: Activation<A>,
        skill: Ref<Skill<S, A>>,
    ) => BattleState;
    readonly onTick?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability & H>,
        self: Activation<A>,
        skill: Ref<Skill<S, A>>,
    ) => BattleState;
    readonly operations?: Readonly<
        Partial<
            Record<
                Operation,
                (
                    battle: BattleState,
                    source: Ref<Unit & SkillCapability & H>,
                    self: Activation<A>,
                    skill: Ref<Skill<S, A>>,
                ) => BattleState
            >
        >
    >;
    readonly onEnd?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability & H>,
        self: Activation<A>,
        end: End,
        skill: Ref<Skill<S, A>>,
    ) => BattleState;
}

export interface Activation<in out A extends object = object> extends Identified<{
    readonly host: Ref<Unit & SkillCapability>;
}> {
    readonly startedAtTick: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly duration: DurationState;
    readonly state: A;
}

export type ActivationIdentity = Omit<Activation, "state"> & { readonly state: unknown };

export type ActivationRef = Ref<ActivationIdentity>;

export function create<A extends object>(
    host: Ref<Unit & SkillCapability>,
    startedAtTick: number,
    duration: DurationState,
    state: A,
): Activation<A> {
    return {
        ref: createRef<Activation>({ host }, get),
        startedAtTick,
        lifecycle: "ACTIVE",
        duration,
        state,
    };
}

function get(this: object, battle: BattleState): Activation | undefined {
    const { host } = this as Identity<Activation>;
    const activation = host.get(battle)?.skill.activation;

    return activation?.ref === this ? activation : undefined;
}

import type { Identified, Ref } from "../../../common/ref.js";
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

export interface Definition<S extends object, A extends object> extends Parameters {
    readonly trigger: Trigger;
    readonly ignoreRestrictions: readonly ActivationRestriction[];
    readonly initialize: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => Initial<A>;
    readonly accepts?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => boolean;
    readonly onStart?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Activation<S, A>,
    ) => BattleState;
    readonly onTick?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Activation<S, A>,
    ) => BattleState;
    readonly operations?: Readonly<
        Partial<
            Record<
                Operation,
                (
                    battle: BattleState,
                    source: Ref<Unit & SkillCapability>,
                    self: Activation<S, A>,
                ) => BattleState
            >
        >
    >;
    readonly onEnd?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Activation<S, A>,
        end: End,
    ) => BattleState;
}

export interface State<A extends object = object> {
    readonly id: number;
    readonly startedAtTick: number;
    readonly lifecycle: "ACTIVE" | "ENDING";
    readonly duration: DurationState;
    readonly state: A;
}

export interface Activation<
    S extends object = object,
    A extends object = object,
> extends Identified<
    {
        readonly host: Ref<Unit & SkillCapability>;
        readonly id: number;
    },
    Skill<S, A>
> {
    readonly activation: State<A>;
}

export function ref<X extends Activation<any, any>>(
    host: Ref<Unit & SkillCapability>,
    self: X,
): Ref<X> {
    return { host, id: self.activation.id } as Ref<X>;
}

import type { Identified, Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import type { Skill as SkillCapability } from "../capability/skill/capability.js";
import type { Skill } from "./skill.js";
import type { Definition as SustainDefinition, State as SustainState } from "./sustain.js";

export type Operation = "STOP" | "RETRIGGER";

export type Trigger = "MANUAL" | "AUTO" | "PASSIVE";

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export interface Definition<S extends object, A extends object> {
    readonly trigger: Trigger;
    readonly sustain: SustainDefinition;
    readonly initialize: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => A;
    readonly accepts?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => boolean;
    readonly cost?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => number;
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
    readonly onOperation?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Activation<S, A>,
        operation: Operation,
    ) => BattleState;
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
    readonly status: "ACTIVE" | "ENDING";
    readonly sustain: SustainState;
    readonly state: A;
}

export interface Activation<S extends object = object, A extends object = object>
    extends
        Omit<Skill<S, A>, keyof Identified<object>>,
        Identified<{
            readonly host: Ref<Unit & SkillCapability>;
            readonly id: number;
        }> {
    readonly activation: State<A>;
}

export function ref<X extends Activation<any, any>>(
    host: Ref<Unit & SkillCapability>,
    self: X,
): Ref<X> {
    return { host, id: self.activation.id } as Ref<X>;
}

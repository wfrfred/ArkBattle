import type { MotionMode } from "../../battlefield/navigation/state.js";
import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Definitions } from "../../unit/capability/catalog.js";
import type { Plan, Route } from "../../unit/capability/route/capability.js";
import type { Definition as BaseDefinition } from "../../unit/unit.js";
import type { Result, State as BattleState } from "../state.js";
import type { Policy } from "../statistics.js";

export type UnitDefinition = BaseDefinition &
    Route["definition"] &
    Partial<Omit<Definitions, "route" | "locomotion" | "occupancy" | "deployable">> & {
        readonly occupancy?: never;
        readonly deployable?: never;
    };

export interface Spawn {
    readonly definition: UnitDefinition;
    readonly plan: Plan;
    readonly mode: MotionMode;
    readonly offset: WorldPosition;
    readonly randomRange: WorldPosition;
    readonly atTick: number;
    readonly wait: Wait;
    readonly statistics: Policy | null;
}

export type Wait = "NONE" | "FINAL" | "WAVE";

export interface Operation {
    readonly atTick: number;
    readonly execute: (battle: BattleState) => Result<boolean>;
}

export type Entry = Spawn | Operation;

export interface Definition {
    readonly waves: readonly Wave[];
    readonly branches: Readonly<Record<string, Branch>>;
}

export interface Wave {
    readonly preDelayTicks: number;
    readonly postDelayTicks: number;
    readonly maxWaitingTicks: number | null;
    readonly fragments: readonly Fragment[];
}

export interface Fragment {
    readonly preDelayTicks: number;
    readonly entries: readonly Entry[];
}

export interface Branch {
    readonly phases: readonly BranchPhase[];
}

export interface BranchPhase {
    readonly preDelayTicks: number;
    readonly entries: readonly (Entry | WeightedEntries)[];
}

export interface WeightedEntries {
    readonly options: readonly {
        readonly weight: number;
        readonly entries: readonly Entry[];
    }[];
}

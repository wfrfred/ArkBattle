import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Definitions } from "../../unit/capability/catalog.js";
import type { Plan, Route } from "../../unit/capability/route/capability.js";
import type { Definition as BaseDefinition } from "../../unit/unit.js";

export type UnitDefinition = BaseDefinition &
    Route["definition"] &
    Partial<Omit<Definitions, "route" | "occupancy" | "deployable">> & {
        readonly occupancy?: never;
        readonly deployable?: never;
    };

export interface Spawn {
    readonly definition: UnitDefinition;
    readonly plan: Plan;
    readonly offset: WorldPosition;
    readonly randomRange: WorldPosition;
    readonly atTick: number;
    readonly wait: Wait;
}

export type Wait = "NONE" | "FINAL" | "WAVE";

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
    readonly spawns: readonly Spawn[];
}

export interface Branch {
    readonly phases: readonly BranchPhase[];
}

export interface BranchPhase {
    readonly preDelayTicks: number;
    readonly entries: readonly Entry[];
}

export type Entry = readonly Spawn[] | WeightedSpawns;

export interface WeightedSpawns {
    readonly options: readonly {
        readonly weight: number;
        readonly spawns: readonly Spawn[];
    }[];
}

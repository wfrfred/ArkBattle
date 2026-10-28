import { assertPositiveSafeInteger } from "../../common/assert.js";
import type { Terrain } from "./terrain.js";

export type Elevation = "LOWLAND" | "HIGHLAND";

export type Placement = "NONE" | "MELEE" | "ALL" | "RANGED";

export type Passability = "NONE" | "WALK_ONLY" | "ALL" | "FLY_ONLY";

export type SiteCondition = symbol;

export interface State {
    readonly elevation: Elevation;
    readonly placement: Placement;
    readonly passability: Passability;
    readonly walkCost: number;
    readonly allowsBlocking: boolean;
    readonly siteCondition: SiteCondition | null;
}

export interface Definition<P extends object = object> {
    readonly terrain: Terrain<P>;
    readonly initial: State;
}

export interface Tile<P extends object = object> {
    readonly definition: Definition<P>;
    readonly state: State;
}

export function create<P extends object>(definition: Definition<P>): Tile<P> {
    assertPositiveSafeInteger(definition.initial.walkCost, "tile walk cost");

    return { definition, state: definition.initial };
}

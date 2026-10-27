import { assertPositiveSafeInteger } from "../../common/assert.js";
import type { Terrain, View as TerrainView } from "./terrain.js";

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

export interface Definition<P extends object> {
    readonly terrain: Terrain<P>;
    readonly initial: State;
}

export interface View {
    readonly definition: {
        readonly terrain: TerrainView;
        readonly initial: State;
    };
    readonly state: State;
}

export interface Tile<P extends object> extends View {
    readonly definition: Definition<P>;
}

export function create<P extends object>(definition: Definition<P>): Tile<P> {
    assertPositiveSafeInteger(definition.initial.walkCost, "tile walk cost");

    return { definition, state: definition.initial };
}

import { assert, assertPositiveSafeInteger } from "../../common/assert.js";
import { validateShape, type Shape } from "../../geometry/shape.js";
import type { Terrain } from "./terrain.js";

export type Elevation = "LOWLAND" | "HIGHLAND";

export type Placement = "NONE" | "MELEE" | "ALL" | "RANGED";

export type Passability = "NONE" | "WALK_ONLY" | "ALL" | "FLY_ONLY";

export type SiteCondition = symbol;

export type Collision = Extract<Shape, { readonly type: "BOX" }>;

export interface State {
    readonly elevation: Elevation;
    readonly placement: Placement;
    readonly passability: Passability;
    readonly walkCost: number;
    readonly allowsBlocking: boolean;
    readonly siteCondition: SiteCondition | null;
    readonly collision?: Collision | null;
}

export interface Definition<P extends object = object> {
    readonly terrain: Terrain<P>;
    readonly initial: State;
}

export interface Tile<P extends object = object> {
    readonly definition: Definition<P>;
    readonly state: State;
}

export function validateState(state: State): void {
    assertPositiveSafeInteger(state.walkCost, "tile walk cost");

    if (state.collision != null) {
        assert(["BOX"].includes(state.collision.type), "invalid tile collision box", TypeError);
        validateShape(state.collision);
    }
}

export function create<P extends object>(definition: Definition<P>): Tile<P> {
    validateState(definition.initial);

    return { definition, state: definition.initial };
}

import type { EraseCallbacks } from "../common/callback.js";
import type { Definition, EndReason } from "./definition.js";
import type { Config, Lifetime } from "../lifetime/index.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Side } from "../side.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface Projectile<S extends object = object> extends Lifetime {
    readonly id: Id;
    readonly config: Config<Projectile, EndReason>;
    readonly definition: EraseCallbacks<Definition>;
    readonly side: Side;
    readonly lifecycle: Lifecycle;
    readonly position: WorldPosition;
    readonly state: S;
}

export interface Eliminatable {
    readonly definition: { readonly eliminatable: true };
}

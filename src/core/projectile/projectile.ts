import type { Definition } from "./definition.js";
import type { Identified } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Side } from "../side.js";
import type { Slowable } from "./slowable.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface ProjectileFields<
    S extends object = object,
    T extends object = object,
> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Definition<S, T>;
    readonly side: Side;
    readonly lifecycle: Lifecycle;
    readonly position: WorldPosition;
    readonly state: S;
    readonly move?: Slowable["move"];
}

export type Projectile<S extends object = object, T extends object = object> = ProjectileFields<
    S,
    T
> &
    AdditionalFields<T>;

export type AdditionalFields<T extends object> = Omit<T, Exclude<keyof ProjectileFields, "move">>;

export interface Eliminatable {
    readonly definition: { readonly eliminatable: true };
}

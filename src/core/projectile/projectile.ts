import type { Definition } from "./definition.js";
import type { Identified } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface Projectile<S extends object = object> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Definition<S>;
    readonly lifecycle: Lifecycle;
    readonly position: WorldPosition;
    readonly state: S;
}

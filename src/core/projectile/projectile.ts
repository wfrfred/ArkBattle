import type { Definition } from "./definition.js";
import type { Identified } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface View extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Pick<Definition<object>, "id">;
    readonly lifecycle: Lifecycle;
    readonly position: WorldPosition;
}

export interface Projectile<S extends object> extends View {
    readonly definition: Definition<S>;
    readonly state: S;
}

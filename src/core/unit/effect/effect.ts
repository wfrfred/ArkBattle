import type { Unit } from "../unit.js";
import type { Definition } from "./definition.js";
import type { Identified, Ref } from "../../common/ref.js";
import type { Expiration } from "./expiration.js";

export type Id = number;

export type Lifecycle = "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";

export interface Effect<S extends object = object, H extends object = object> extends Identified<{
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly definition: Definition<S, H>;
    readonly state: S;
    readonly source: Ref<Unit> | null;
    readonly expiration: Expiration;
    readonly enabled: boolean;
    readonly lifecycle: Lifecycle;
}

export interface Snapshot extends Omit<Effect, "state" | "definition"> {
    readonly definition: Pick<Definition<object>, "id" | "group">;
    readonly state: unknown;
}

export function ref<E extends Effect<any, any>>(effect: E): Ref<E> {
    return { host: effect.host, id: effect.id } as Ref<E>;
}

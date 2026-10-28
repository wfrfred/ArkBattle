import type { Unit } from "../unit.js";
import type { Scope as LifetimeScope } from "../../lifetime/index.js";
import type { Definition } from "./definition.js";
import type { Identified, Ref } from "../../common/ref.js";

export type Id = number;

export type Scope = LifetimeScope | { readonly type: "TICK"; readonly tick: number };

export type Status = "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";

export interface Effect<S extends object = object, H extends object = object> extends Identified<{
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly definition: Definition<S, H>;
    readonly data: S;
    readonly source: Ref<Unit> | null;
    readonly scopes: readonly Scope[];
    readonly enabled: boolean;
    readonly status: Status;
}

export interface Snapshot extends Omit<Effect, "data" | "definition"> {
    readonly definition: Pick<Definition<object>, "id" | "group">;
    readonly data: unknown;
}

export function ref<E extends Effect<any, any>>(effect: E): Ref<E> {
    return { host: effect.host, id: effect.id } as Ref<E>;
}

export function deadline(instance: { readonly scopes: readonly Scope[] }): number | null {
    const ticks = instance.scopes.flatMap((scope) => (scope.type === "TICK" ? [scope.tick] : []));

    return ticks.length === 0 ? null : Math.min(...ticks);
}

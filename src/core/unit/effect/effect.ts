import type { Unit } from "../unit.js";
import type { Definition, OrdinaryDefinition, StackDefinition } from "./definition.js";
import type { Identified, Ref } from "../../common/ref.js";
import type { Expiration, ExpirationPolicy, StackExpiration } from "./expiration.js";

export type Id = number;

export type Lifecycle = "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";

export type GroupSource =
    { readonly type: "CARD"; readonly id: number } | { readonly type: "UNIT"; readonly id: number };

export interface EffectFields<S extends object, H extends object> extends Identified<{
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly state: S;
    readonly source: Ref<Unit> | null;
    readonly groupSource: GroupSource | null;
    readonly enabled: boolean;
    readonly lifecycle: Lifecycle;
}

export interface OrdinaryEffect<
    S extends object = object,
    H extends object = object,
> extends EffectFields<S, H> {
    readonly definition: OrdinaryDefinition<S, H>;
    readonly expiration: Expiration;
    readonly stackCount?: never;
}

export type StackEffect<
    S extends object = object,
    H extends object = object,
    P extends ExpirationPolicy = ExpirationPolicy,
> = P extends ExpirationPolicy
    ? EffectFields<S, H> & {
          readonly definition: StackDefinition<S, H, P>;
          readonly expiration: StackExpiration<P>;
          readonly stackCount: number;
      }
    : never;

export type Effect<S extends object = object, H extends object = object> =
    OrdinaryEffect<S, H> | StackEffect<S, H>;

export interface Snapshot extends Omit<Effect, "state" | "definition"> {
    readonly definition: Pick<Definition<object>, "id" | "group">;
    readonly state: unknown;
}

export function ref<E extends Effect<any, any>>(effect: E): Ref<E> {
    return { host: effect.host, id: effect.id } as Ref<E>;
}

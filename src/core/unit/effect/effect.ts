import type { Unit } from "../unit.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Card } from "../../battle/deployment/deck/card/card.js";
import type { Definition, OrdinaryDefinition, StackDefinition } from "./definition.js";
import { createRef, type Identified, type Identity, type Ref } from "../../common/ref.js";
import type { Expiration, ExpirationPolicy, StackExpiration } from "./expiration.js";

export type Id = number;

export type Lifecycle = "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";

export type GroupSource = Ref<Card> | Ref<Unit>;

export interface EffectFields<S extends object, H extends object> extends Identified<{
    readonly host: Identity<Unit> & Ref<Unit & H>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly host: Identity<Unit> & Ref<Unit & H>;
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

export { ref } from "../../common/ref.js";

export function createEffectRef(host: Ref<Unit>, id: Id): Ref<Effect> {
    return createRef<Effect>({ host, id }, getEffect);
}

function getEffect(this: object, battle: BattleState): Effect | undefined {
    const reference = this as Ref<Effect>;

    return reference.host.get(battle)?.effects.get(reference);
}

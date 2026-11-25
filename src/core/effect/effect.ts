import type { Unit } from "../unit/unit.js";
import type { State as BattleState } from "../battle/state.js";
import type { Definition, StackDefinition } from "./definition.js";
import { createRef, type Ref } from "../common/ref.js";
import type { Config, Lifetime } from "../lifetime/index.js";
import type { Expiration } from "./expiration.js";
import type { GroupSource } from "./group.js";

export type Id = number;

export type Lifecycle = "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";

export type HostRef<H extends Lifetime | null = Lifetime | null> =
    Ref<Extract<H, Lifetime>> | Extract<H, null>;

export interface Effect<
    S extends object = object,
    H extends Lifetime | null = Lifetime | null,
> extends Lifetime<{ readonly host: HostRef<H> }> {
    readonly config: Config<Effect, string>;
    readonly id: Id;
    readonly definition: Definition<S, H, never>;
    readonly state: S;
    readonly source: Ref<Unit> | null;
    readonly groupSource: GroupSource;
    readonly expiration: Expiration;
    readonly enabled: boolean;
    readonly lifecycle: Lifecycle;
}

export interface StackEffect<
    S extends object = object,
    H extends Lifetime | null = Lifetime | null,
> extends Effect<S, H> {
    readonly definition: StackDefinition<S, H, never>;
    readonly stackCount: number;
}

export interface Initial<S extends object> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly Ref<Lifetime>[];
    readonly expiration?: Expiration;
    readonly state?: S;
    readonly enabled?: boolean;
}

export { ref } from "../common/ref.js";

export function createEffectRef(host: HostRef): Ref<Effect> {
    return createRef<Effect>({ host }, getEffect);
}

function getEffect(this: object, battle: BattleState): Effect | undefined {
    return battle.effects.get(this as Ref<Effect>);
}

import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { EndReason } from "./definition.js";
import type { Eliminatable, Projectile } from "./projectile.js";
import { get, ref } from "./query.js";
import { create as createLifetime } from "../lifetime/operations.js";
import type { State as BattleState } from "../battle/state.js";

export function add<S extends object, T extends object>(
    battle: BattleState,
    self: Projectile<S, T> & NoInfer<T>,
): BattleState {
    const projectiles = battle.battlefield.projectiles.add(self.id, self);
    battle = replaceIn(battle, ["battlefield", "projectiles"], projectiles);

    return self.definition.onEnter?.(battle, self) ?? battle;
}

export function update<S extends object, T extends object>(
    battle: BattleState,
    reference: Ref<Projectile<S, T>>,
    changes: {
        readonly position?: WorldPosition;
        readonly state?: NoInfer<S>;
    },
): BattleState {
    const current = get(battle, reference);
    if (current === undefined) {
        throw new RangeError("unknown projectile");
    }

    const position = changes.position ?? current.position;
    const state = changes.state ?? current.state;
    if (position === current.position && state === current.state) {
        return battle;
    }

    return replace(battle, reference, { ...current, position, state });
}

export function replace<P extends Projectile<object, any>>(
    battle: BattleState,
    reference: Ref<P>,
    self: NoInfer<P>,
): BattleState {
    const projectiles = battle.battlefield.projectiles.replace(reference.id, self);

    return replaceIn(battle, ["battlefield", "projectiles"], projectiles);
}

export const lifetime = createLifetime<Projectile, Projectile<object, any>, EndReason>({
    kind: "PROJECTILE",
    address: (ref) => [ref.id],
    get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, _reference, next) => replace(battle, ref(next), next),
    finalize: (battle, reference, reason) => {
        const self = get(battle, reference)!;
        battle = self.definition.onEnd?.(battle, self, reason) ?? battle;

        const projectiles = battle.battlefield.projectiles.remove(reference.id);

        return replaceIn(battle, ["battlefield", "projectiles"], projectiles);
    },
    reason: (reason) => reason,
});

export function remove<P extends Projectile<object, any>>(
    battle: BattleState,
    reference: Ref<P>,
    reason: Exclude<EndReason, "ELIMINATED">,
): BattleState;
export function remove<P extends Projectile<object, any> & Eliminatable>(
    battle: BattleState,
    reference: Ref<P>,
    reason: "ELIMINATED",
): BattleState;
export function remove<P extends Projectile<object, any>>(
    battle: BattleState,
    reference: Ref<P>,
    reason: EndReason,
): BattleState {
    return lifetime.end(battle, reference, reason);
}

export function advance<P extends Projectile<object, any>>(
    battle: BattleState,
    candidates: Iterable<Ref<P>>,
): BattleState {
    for (const reference of candidates) {
        const self = get(battle, reference);
        if (self?.lifecycle === "ACTIVE") {
            battle = self.definition.onTick?.(battle, self) ?? battle;
        }
    }

    return battle;
}

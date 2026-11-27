import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Definition, EndReason } from "./definition.js";
import type { Eliminatable, Projectile } from "./projectile.js";
import { ref } from "./query.js";
import { end, register } from "../lifetime/operations.js";
import type { State as BattleState } from "../battle/state.js";

export function add<S extends object, T extends object>(
    battle: BattleState,
    self: Projectile<NoInfer<S>, T> & NoInfer<T> & { readonly definition: Definition<S, T> },
): BattleState {
    const projectiles = battle.battlefield.projectiles.add(ref(self), self);
    battle = replaceIn(battle, ["battlefield", "projectiles"], projectiles);
    battle = register(battle, ref(self), []);

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
    const current = reference.get(battle);
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

export function replace<P extends Projectile>(
    battle: BattleState,
    reference: Ref<P>,
    self: NoInfer<P>,
): BattleState {
    const projectiles = battle.battlefield.projectiles.replace(reference, self);

    return replaceIn(battle, ["battlefield", "projectiles"], projectiles);
}

export const config: Projectile["config"] = {
    end: {
        dependencyEnd: null,
        prepare: (battle, reference, initial) =>
            replace(battle, reference, { ...initial, lifecycle: "ENDING" }),
        finalize: (battle, reference, _initial, reason) => {
            const self = reference.get(battle)!;
            battle = (self.definition as Definition).onEnd?.(battle, self, reason) ?? battle;

            const projectiles = battle.battlefield.projectiles.remove(reference);

            return replaceIn(battle, ["battlefield", "projectiles"], projectiles);
        },
    },
};

export function remove(
    battle: BattleState,
    reference: Ref<Projectile>,
    reason: Exclude<EndReason, "ELIMINATED">,
): BattleState;
export function remove(
    battle: BattleState,
    reference: Ref<Projectile & Eliminatable>,
    reason: "ELIMINATED",
): BattleState;
export function remove(
    battle: BattleState,
    reference: Ref<Projectile>,
    reason: EndReason,
): BattleState {
    return end(battle, reference, reason);
}

export function advance(battle: BattleState, candidates: Iterable<Ref<Projectile>>): BattleState {
    for (const reference of candidates) {
        const self = reference.get(battle);
        if (self?.lifecycle === "ACTIVE") {
            battle = (self.definition as Definition).onTick?.(battle, self) ?? battle;
        }
    }

    return battle;
}

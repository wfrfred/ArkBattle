import type { Ref } from "../../../common/ref.js";
import { create, type Query } from "../../../common/query.js";
import type { State as BattleState } from "../../state.js";
import type { Card, Definition, StatefulDefinition } from "./card.js";
import type { Purpose } from "./rule.js";

export function get<T extends Card<any>>(battle: BattleState, reference: Ref<T>): T | undefined;
export function get<S extends object>(
    battle: BattleState,
    reference: Ref<Card>,
    definition: StatefulDefinition<S>,
): Card<S> | undefined;
export function get(
    battle: BattleState,
    reference: Ref<Card>,
    definition: Definition,
): Card | undefined;
export function get<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    definition?: Definition<any>,
): Card<any> | undefined {
    const self = battle.deployment.cards.find((current) => current.id === reference.id);

    return definition === undefined || self?.definition === definition ? self : undefined;
}

export function all(battle: BattleState): Query<Card> {
    return create(() => battle.deployment.cards.values());
}

export function allows(battle: BattleState, reference: Ref<Card<any>>, purpose: Purpose): boolean {
    const self = get(battle, reference);

    return self?.rules.every((rule) => rule.allows(battle, reference, purpose)) ?? false;
}

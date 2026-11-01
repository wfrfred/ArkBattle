import type { Ref } from "../../../common/ref.js";
import { create, type Query } from "../../../common/query.js";
import type { State as BattleState } from "../../state.js";
import type { Card, UnitDefinition } from "./card.js";
import type { RuleContext } from "./rule.js";

export function get<T extends Card<any>>(battle: BattleState, reference: Ref<T>): T | undefined;
export function get<S extends object>(
    battle: BattleState,
    reference: Ref<Card>,
    definition: UnitDefinition<S>,
): Card<S> | undefined;
export function get<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    definition?: UnitDefinition<any>,
): Card<any> | undefined {
    const self = battle.deployment.cards.find((current) => current.id === reference.id);

    return definition === undefined || self?.definition === definition ? self : undefined;
}

export function all(battle: BattleState): Query<Card> {
    return create(() => battle.deployment.cards.values());
}

export function allows<T extends Card<any>>(battle: BattleState, context: RuleContext<T>): boolean {
    const self = get(battle, context.purpose === "DEPLOY" ? context.request.card : context.ref);

    return self?.rules.every((rule) => rule.allows(battle, context as RuleContext)) ?? false;
}

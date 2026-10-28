import { assertFiniteNumber } from "../../common/assert.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import type { Skill } from "../capability/skill/capability.js";

export interface Modifier {
    readonly priority: number;
    readonly apply: (battle: BattleState, self: Unit & Skill, current: number) => number;
}

export function apply(
    battle: BattleState,
    self: Unit & Skill,
    base: number,
    modifiers: readonly Modifier[],
): number {
    let value = base;

    for (const modifier of [...modifiers].sort((left, right) => left.priority - right.priority)) {
        value = modifier.apply(battle, self, value);
        assertFiniteNumber(value, "skill modified parameter");
    }

    return value;
}

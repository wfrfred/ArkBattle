import { activate, advance, operate } from "../../unit/capability/skill/operations.js";
import { ref as activationRef } from "../../unit/capability/skill/activation.js";
import { ref as skillRef } from "../../unit/capability/skill/skill.js";
import { hasSkill } from "../../unit/capability/skill/capability.js";
import * as units from "../../unit/query.js";
import type { Command } from "../contract.js";
import { type State as BattleState } from "../state.js";

export function advanceSkills(state: BattleState, commands: readonly Command[]): BattleState {
    const candidates = units.all(state).filter(hasSkill);

    for (const unit of candidates) {
        state = advance(state, units.ref(unit));
    }

    for (const command of commands) {
        if (command.type !== "SKILL") {
            continue;
        }

        const unit = command.ref.get(state);
        if (unit === undefined) {
            continue;
        }

        if (command.operation === "ACTIVATE") {
            if (unit.skill.definition.activation?.trigger === "MANUAL") {
                state = activate(state, skillRef(command.ref)).state;
            }
        } else if (unit.skill.activation !== null) {
            state = operate(
                state,
                activationRef(command.ref, unit.skill.activation),
                command.operation,
            ).state;
        }
    }

    return state;
}

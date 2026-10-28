import { activate, advance, operate } from "../../unit/skill/operations.js";
import { ref as activationRef, type View as ActivationView } from "../../unit/skill/activation.js";
import { ref as skillRef } from "../../unit/skill/skill.js";
import { getCurrent } from "../../unit/skill/query.js";
import { hasSkill } from "../../unit/capability/skill/capability.js";
import * as units from "../../unit/query.js";
import type { Command } from "../contract.js";
import { type State as BattleState } from "../state.js";

export function advanceSkills(state: BattleState, commands: readonly Command[]): BattleState {
    const candidates = units.all(state).filter(hasSkill).map(units.ref).toArray();

    for (const ref of candidates) {
        state = advance(state, ref);
    }

    for (const command of commands) {
        if (command.type !== "ACTIVATE_SKILL" && command.type !== "FINISH_SKILL") {
            continue;
        }

        const unit = state.battlefield.units.get(command.unitId);
        if (unit === undefined || !hasSkill(unit)) {
            continue;
        }

        if (command.type === "ACTIVATE_SKILL") {
            state = activate(
                state,
                skillRef(units.ref(unit), getCurrent(state, units.ref(unit))!.definition),
            ).state;
        } else if (unit.skill.activation !== null) {
            state = operate(
                state,
                activationRef(units.ref(unit), unit.skill as ActivationView),
                "STOP",
            ).state;
        }
    }

    return state;
}

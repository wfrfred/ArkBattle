import { activate, advance, operate } from "../../unit/skill/operations.js";
import { ref as activationRef, type Activation } from "../../unit/skill/activation.js";
import { ref as skillRef } from "../../unit/skill/skill.js";
import type { Identified } from "../../common/ref.js";
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
        if (command.type !== "ACTIVATE_SKILL" && command.type !== "FINISH_SKILL") {
            continue;
        }

        const unit = state.battlefield.units.get(command.unitId);
        if (unit === undefined || !hasSkill(unit)) {
            continue;
        }

        if (command.type === "ACTIVATE_SKILL") {
            state = activate(state, skillRef(units.ref(unit), unit.skill.definition)).state;
        } else if (unit.skill.activation !== null) {
            state = operate(
                state,
                activationRef<Activation>(
                    units.ref(unit),
                    unit.skill as Identified<never, typeof unit.skill> as Activation,
                ),
                "STOP",
            ).state;
        }
    }

    return state;
}

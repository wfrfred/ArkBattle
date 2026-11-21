import * as actions from "../../unit/capability/action/operations.js";
import { forUnit } from "../../unit/capability/action/query.js";
import { ref as actionRef } from "../../unit/capability/action/action.js";
import type { Definition } from "../../unit/capability/action/definition.js";
import * as units from "../../unit/query.js";
import {
    hasAction,
    type Definition as CapabilityDefinition,
} from "../../unit/capability/action/capability.js";
import * as presence from "../../unit/capability/presence/capability.js";
import type { State as BattleState } from "../state.js";
import type { Command } from "../contract.js";

export function prepare(battle: BattleState, commands: readonly Command[]): BattleState {
    for (const command of commands) {
        if (command.type === "CANCEL_ACTION_EXECUTION") {
            battle = actions.cancel(battle, command.ref, "CANCELLED");
        }
    }

    return battle;
}

export function advance(battle: BattleState): BattleState {
    const initial = battle;
    const candidates = units.all(initial);

    for (const candidate of candidates.filter(hasAction)) {
        const source = units.ref(candidate);

        for (const reference of forUnit(initial, source)) {
            battle = actions.advance(battle, reference);
        }

        const unit = units.get(battle, source);
        if (unit?.lifecycle !== "ACTIVE" || !presence.isPresent(unit)) {
            continue;
        }

        const reference = units.ref(unit);
        // This configuration is attached to this unit.
        const configuration = unit.definition.action as CapabilityDefinition<object>;
        const selected = configuration.select?.(battle, unit) ?? {
            state: battle,
            value: unit.action.actions.keys(),
        };
        battle = selected.state;

        for (const id of new Set(selected.value)) {
            const latest = units.get(battle, reference);
            if (latest?.lifecycle !== "ACTIVE") {
                break;
            }

            const self = latest.action.actions.get(id);
            if (self === undefined) {
                throw new RangeError(`unknown selected action definition ${id}`);
            }

            const started = actions.start(
                battle,
                actionRef(reference, self.definition as Definition<any, any>),
            );
            battle =
                started.value !== null
                    ? actions.advance(started.state, started.value)
                    : started.state;
        }
    }

    return battle;
}

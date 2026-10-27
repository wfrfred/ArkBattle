import * as actions from "../../unit/action/operations.js";
import { forUnit } from "../../unit/action/query.js";
import { advance as advanceAction } from "../../unit/action/advance.js";
import { ref as actionRef } from "../../unit/action/action.js";
import * as units from "../../unit/query.js";
import { hasAction } from "../../unit/capability/action/capability.js";
import { isSpatiallyPresent } from "../../unit/capability/presence/capability.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";
import { remove } from "../unit.js";
import type { State as BattleState } from "../state.js";
import type { Command } from "../contract.js";
import { sort } from "../../common/collection.js";

export function prepare(battle: BattleState, commands: readonly Command[]): BattleState {
    for (const command of commands) {
        if (command.type === "CANCEL_ACTION_EXECUTION") {
            battle = actions.cancel(battle, command.ref, "CANCELLED");
        }
    }

    return battle;
}

export function advance(battle: BattleState): BattleState {
    const candidates = sort(
        units.all(battle).map(units.ref),
        (left, right) => left.id - right.id,
    ).map((source) => ({ source, instances: forUnit(battle, source) }));

    for (const { source } of candidates) {
        const unit = units.get(battle, source);

        if (unit !== undefined && hasVitality(unit) && unit.vitality.hp <= 0) {
            battle = remove(battle, source.id, "DEATH");
        }
    }

    for (const { source, instances } of candidates) {
        for (const reference of instances) {
            battle = advanceAction(battle, reference);
        }

        const unit = units.get(battle, source);

        if (
            unit === undefined ||
            !hasAction(unit) ||
            unit.lifecycle !== "PRESENT" ||
            !isSpatiallyPresent(unit)
        ) {
            continue;
        }

        const reference = units.ref(unit);
        battle = actions.refreshCooldowns(battle, reference);
        const current = units.get(battle, reference)!;
        const selected = current.definition.action.select?.(battle, current) ?? {
            state: battle,
            value: current.action.actions.keys().toArray(),
        };
        battle = selected.state;

        for (const id of new Set(selected.value)) {
            const latest = units.get(battle, reference);

            if (latest?.lifecycle !== "PRESENT") {
                break;
            }

            const advanced = latest.action.actions.read(id, (self) => {
                const started = actions.start(battle, actionRef(reference, self.definition));

                return started.value.type === "STARTED"
                    ? advanceAction(started.state, started.value.ref)
                    : started.state;
            });

            if (advanced === undefined) {
                throw new RangeError(`unknown selected action definition ${id}`);
            }

            battle = advanced;
        }
    }

    return battle;
}

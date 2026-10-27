import { update as updateUnit } from "../../../battle/unit.js";
import type { Ref } from "../../../common/ref.js";
import { closeLifetime } from "../../../battle/execution/lifetime.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import * as units from "../../query.js";
import type { Executing, ExecutingView } from "../action.js";
import type { End } from "../definition.js";

export function end(
    battle: BattleState,
    reference: Ref<ExecutingView>,
    result: End,
    lifetimeReason = result.type === "FINISHED" ? "ACTION_FINISHED" : result.reason,
): BattleState {
    const host = units.get(battle, reference.host);

    if (host === undefined) {
        return battle;
    }

    return (
        host.action.actions.readExecution(reference.id, (self) => {
            if (self.execution.status === "ENDING") {
                return battle;
            }

            const ending: Executing<typeof self.state, typeof self.execution.state> = {
                ...self,
                execution: { ...self.execution, status: "ENDING" },
            };
            battle = updateUnit(battle, [
                {
                    ...host,
                    action: {
                        ...host.action,
                        actions: host.action.actions.replace(self.definition, ending),
                    },
                },
            ]);
            battle = closeLifetime(battle, { type: "ACTION", ref: reference }, lifetimeReason);

            if (self.definition.onEnd !== undefined) {
                const current = units
                    .get(battle, reference.host)
                    ?.action.actions.get(self.definition.id, self.definition);
                const latest =
                    current?.execution?.id === reference.id
                        ? { ...current, execution: current.execution }
                        : ending;
                battle = self.definition.onEnd(battle, reference.host, latest, result);
            }

            const latestHost = units.get(battle, reference.host);
            const latestAction = latestHost?.action.actions.get(
                self.definition.id,
                self.definition,
            );

            if (latestHost !== undefined && latestAction?.execution?.id === reference.id) {
                battle = updateUnit(battle, [
                    {
                        ...latestHost,
                        action: {
                            ...latestHost.action,
                            actions: latestHost.action.actions.replace(self.definition, {
                                ...latestAction,
                                execution: null,
                            }),
                        },
                    },
                ]);
            }

            return appendEvents(battle, [
                {
                    executionId: self.execution.id,
                    sourceUnitId: reference.host.id,
                    tick: battle.tick,
                    ...(result.type === "FINISHED"
                        ? { type: "ACTION_FINISHED" as const }
                        : { type: "ACTION_CANCELLED" as const, reason: result.reason }),
                },
            ]);
        }) ?? battle
    );
}

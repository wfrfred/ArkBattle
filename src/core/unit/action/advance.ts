import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import { get as getUnit } from "../query.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import type { ExecutingView } from "./action.js";
import { end } from "./operations.js";

export function advance(battle: BattleState, reference: Ref<ExecutingView>): BattleState {
    const source = getUnit(battle, reference.host);

    if (source === undefined) {
        return battle;
    }

    return (
        source.action.actions.readExecution(reference.id, (self) => {
            if (self.execution.status !== "RUNNING") {
                return battle;
            }
            if (source.lifecycle !== "PRESENT" || !isSpatiallyPresent(source)) {
                return end(battle, reference, { type: "CANCELLED", reason: "SOURCE_ABSENT" });
            }

            const advanced = self.definition.step(battle, reference.host, self);

            return advanced.value
                ? end(advanced.state, reference, { type: "FINISHED" })
                : advanced.state;
        }) ?? battle
    );
}

import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import { get as getUnit } from "../query.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import type { View as ExecutionView } from "./execution.js";
import { end } from "./operations.js";

export function advance(battle: BattleState, reference: Ref<ExecutionView>): BattleState {
    const source = getUnit(battle, reference.host);
    if (source === undefined) {
        return battle;
    }

    const self = source.action.actions.getExecution(reference.id);
    if (self?.execution.status !== "RUNNING") {
        return battle;
    }
    if (source.lifecycle !== "PRESENT" || !isSpatiallyPresent(source)) {
        return end(battle, reference, { type: "CANCELLED", reason: "SOURCE_ABSENT" });
    }

    const advanced = self.definition.onTick(battle, reference.host, self);

    return advanced.value ? end(advanced.state, reference, { type: "FINISHED" }) : advanced.state;
}

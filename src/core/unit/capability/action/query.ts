import type { State as BattleState } from "../../../battle/state.js";
import { mergeApplyWays, type ApplyWay } from "../../../battle/resource/damage.js";
import { sort } from "../../../common/collection/order.js";
import { ref, type Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import { hasAction, type Action as ActionCapability } from "./capability.js";
import type { ExecutionRef } from "./execution.js";
import type { Id as DefinitionId } from "./definition.js";

export function getApplyWay(unit: Unit): ApplyWay {
    return hasAction(unit)
        ? mergeApplyWays(unit.action.actions.values().map(({ definition }) => definition.applyWay))
        : "NONE";
}

export function forUnit(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
): readonly ExecutionRef[] {
    const unit = source.get(battle);

    return unit === undefined ? [] : executionRefs(unit);
}

export function executionRefs(self: Unit & ActionCapability): readonly ExecutionRef[] {
    return sort(
        self.action.actions
            .values()
            .flatMap(({ execution }) => (execution === null ? [] : [execution])),
        (left, right) => left.id - right.id,
    ).map((execution) => ref(execution));
}

export function hasExecution(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId: DefinitionId | null,
): boolean {
    const unit = source.get(battle);

    return (
        unit !== undefined &&
        (definitionId === null
            ? unit.action.actions.values().some((self) => self.execution !== null)
            : unit.action.actions.get(definitionId)?.execution != null)
    );
}

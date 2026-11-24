import type { State as BattleState } from "../../../battle/state.js";
import { mergeApplyWays, type ApplyWay } from "../../../battle/resource/damage.js";
import { sort } from "../../../common/collection/order.js";
import type { Ref } from "../../../common/ref.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasAction, type Action as ActionCapability } from "./capability.js";
import { refForId, type ExecutionRef } from "./execution.js";
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
    const host = units.ref(self);

    return sort(
        self.action.actions
            .values()
            .flatMap(({ execution }) => (execution === null ? [] : [refForId(host, execution.id)])),
        (left, right) => left.id - right.id,
    );
}

export function hasExecution(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId?: DefinitionId,
): boolean {
    const unit = source.get(battle);

    return (
        unit !== undefined &&
        (definitionId === undefined
            ? unit.action.actions.values().some((self) => self.execution !== null)
            : unit.action.actions.get(definitionId)?.execution != null)
    );
}

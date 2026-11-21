import type { State as BattleState } from "../../../battle/state.js";
import { mergeApplyWays, type ApplyWay } from "../../../battle/resource/damage.js";
import { sort } from "../../../common/collection/order.js";
import type { Ref } from "../../../common/ref.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasAction, type Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";
import type { Actions } from "./actions.js";
import type { Execution, ExecutionRef } from "./execution.js";
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
    const unit = units.get(battle, source);

    return unit === undefined ? [] : executionRefs(unit);
}

export function executionRefs(self: Unit & ActionCapability): readonly ExecutionRef[] {
    const host = units.ref(self);

    return sort(
        self.action.actions
            .values()
            .flatMap(({ execution }) =>
                execution === null ? [] : [{ host, id: execution.id } as ExecutionRef],
            ),
        (left, right) => left.id - right.id,
    );
}

export function getExecution<P extends object, E extends object, H extends object>(
    battle: BattleState,
    reference: Ref<Execution<P, E, H>> & ExecutionRef,
): Execution<P, E, H> | undefined;
export function getExecution(
    battle: BattleState,
    reference: ExecutionRef,
): ReturnType<Actions["getExecution"]>;
export function getExecution(
    battle: BattleState,
    reference: ExecutionRef,
): ReturnType<Actions["getExecution"]> {
    return units.get(battle, reference.host)?.action.actions.getExecution(reference.id);
}

export function getAction<P extends object, E extends object, H extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E, H>>,
): Action<P, E, H> | undefined {
    return units
        .get(battle, reference.host)
        ?.action.actions.get(reference.definition.id, reference.definition);
}

export function hasExecution(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId?: DefinitionId,
): boolean {
    const unit = units.get(battle, source);

    return (
        unit !== undefined &&
        (definitionId === undefined
            ? unit.action.actions.values().some((self) => self.execution !== null)
            : unit.action.actions.get(definitionId)?.execution != null)
    );
}

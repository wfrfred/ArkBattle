import type { State as BattleState } from "../../../battle/state.js";
import { mergeApplyWays, type ApplyWay } from "../../../battle/resource/damage.js";
import { sort } from "../../../common/collection/order.js";
import type { Identified, Ref } from "../../../common/ref.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasAction, type Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";
import { ref, type Execution } from "./execution.js";
import type { Id as DefinitionId } from "./definition.js";

export function getApplyWay(unit: Unit): ApplyWay {
    return hasAction(unit)
        ? mergeApplyWays(unit.action.actions.values().map(({ definition }) => definition.applyWay))
        : "NONE";
}

export function forUnit(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
): readonly Ref<Execution>[] {
    const unit = units.get(battle, source);

    return unit === undefined ? [] : executionRefs(unit);
}

export function executionRefs(self: Unit & ActionCapability): readonly Ref<Execution>[] {
    return sort(
        self.action.actions
            .values()
            .filter((action): action is Identified<never, Execution> => action.execution !== null)
            .map((action) => ref<Execution>(units.ref(self), action)),
        (left, right) => left.id - right.id,
    );
}

export function getExecution<X extends Execution<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    return units.get(battle, reference.host)?.action.actions.getExecution(reference.id) as
        X | undefined;
}

export function getAction<X extends Action<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    return units
        .get(battle, reference.host)
        ?.action.actions.get(reference.definition.id, reference.definition) as X | undefined;
}

export function isCasting(
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

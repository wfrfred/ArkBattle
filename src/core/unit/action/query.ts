import type { State as BattleState } from "../../battle/state.js";
import { sort } from "../../common/collection.js";
import type { Ref } from "../../common/ref.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import { hasAction } from "../capability/action/capability.js";
import type { Action } from "./action.js";
import { ref, type View as ExecutionView } from "./execution.js";
import type { Id as DefinitionId } from "./definition.js";

export function all(battle: BattleState): readonly Ref<ExecutionView>[] {
    return units
        .all(battle)
        .filter(hasAction)
        .flatMap((host) =>
            sort(
                host.action.actions
                    .values()
                    .filter((self): self is ExecutionView => self.execution !== null)
                    .map((self) => ref(units.ref(host), self)),
                (left, right) => left.id - right.id,
            ),
        )
        .toArray();
}

export function forUnit(battle: BattleState, source: Ref<Unit>): readonly Ref<ExecutionView>[] {
    const unit = units.get(battle, source);

    return unit !== undefined && hasAction(unit)
        ? sort(
              unit.action.actions
                  .values()
                  .filter((self): self is ExecutionView => self.execution !== null)
                  .map((self) => ref(units.ref(unit), self)),
              (left, right) => left.id - right.id,
          )
        : [];
}

export function getExecution<X extends ExecutionView>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    return units
        .get(battle, reference.host)
        ?.action.actions.readExecution(reference.id, (self) => self as unknown as X);
}

export function getAction<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
): Action<P, E> | undefined {
    return units
        .get(battle, reference.host)
        ?.action.actions.get(reference.definition.id, reference.definition);
}

export function isCasting(
    battle: BattleState,
    source: Ref<Unit>,
    definitionId?: DefinitionId,
): boolean {
    const unit = units.get(battle, source);

    return (
        unit !== undefined &&
        hasAction(unit) &&
        (definitionId === undefined
            ? unit.action.actions.values().some((self) => self.execution !== null)
            : unit.action.actions.get(definitionId)?.execution != null)
    );
}

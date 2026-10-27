import { update as updateUnit } from "../../battle/unit.js";
import type { Ref } from "../../common/ref.js";
import { sort } from "../../common/collection.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import { hasAction, type Action as ActionCapability } from "../capability/action/capability.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import { hasVitality } from "../capability/vitality/capability.js";
import { resolveInterval } from "../capability/action/timing.js";
import { ref, type Action, type Executing, type ExecutingView } from "./action.js";
import type { Definition, Id as DefinitionId } from "./definition.js";
import * as cooldown from "./cooldown.js";
import { advance } from "./advance.js";
import { end } from "./internal/end.js";

export type StartOutcome<P extends object, E extends object> =
    | { readonly type: "STARTED"; readonly ref: Ref<Executing<P, E>> }
    | {
          readonly type: "REJECTED";
          readonly reason: "SOURCE_UNAVAILABLE" | "RULE" | "COOLDOWN" | "CASTING" | "CONDITION";
      };

export function all(battle: BattleState): readonly Ref<ExecutingView>[] {
    return units
        .all(battle)
        .filter(hasAction)
        .flatMap((host) =>
            sort(
                host.action.actions
                    .values()
                    .filter((self): self is ExecutingView => self.execution !== null)
                    .map((self) => ref(units.ref(host), self)),
                (left, right) => left.id - right.id,
            ),
        )
        .toArray();
}

export function forUnit(battle: BattleState, source: Ref<Unit>): readonly Ref<ExecutingView>[] {
    const unit = units.get(battle, source);

    return unit !== undefined && hasAction(unit)
        ? sort(
              unit.action.actions
                  .values()
                  .filter((self): self is ExecutingView => self.execution !== null)
                  .map((self) => ref(units.ref(unit), self)),
              (left, right) => left.id - right.id,
          )
        : [];
}

export function get<A extends ExecutingView>(
    battle: BattleState,
    reference: Ref<A>,
): A | undefined {
    return units
        .get(battle, reference.host)
        ?.action.actions.readExecution(reference.id, (self) => self as unknown as A);
}

export function getAction<P extends object, E extends object>(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Action<P, E> | undefined {
    return units.get(battle, source)?.action.actions.get(definition.id, definition);
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

export function updateState<P extends object, E extends object>(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
    transform: (current: NoInfer<P>) => NoInfer<P>,
): BattleState {
    const unit = units.get(battle, source);

    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${source.id}`);
    }

    const current = unit.action.actions.get(definition.id, definition);

    if (current === undefined) {
        throw new TypeError("action definition is not configured for its source");
    }

    const state = transform(current.state);

    return state === current.state
        ? battle
        : updateUnit(battle, [
              {
                  ...unit,
                  action: {
                      ...unit.action,
                      actions: unit.action.actions.replace(definition, { ...current, state }),
                  },
              },
          ]);
}

export function updateCooldown(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId: DefinitionId,
    transform: (current: cooldown.State) => cooldown.State,
): BattleState {
    const unit = units.get(battle, source);

    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${source.id}`);
    }

    const updated = unit.action.actions.read(definitionId, (self) => {
        const next = transform(self.cooldown);

        return next === self.cooldown
            ? battle
            : updateUnit(battle, [
                  {
                      ...unit,
                      action: {
                          ...unit.action,
                          actions: unit.action.actions.replace(self.definition, {
                              ...self,
                              cooldown: next,
                          }),
                      },
                  },
              ]);
    });

    if (updated === undefined) {
        throw new RangeError(`unknown configured action ${definitionId}`);
    }

    return updated;
}

export function start<P extends object, E extends object>(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Result<StartOutcome<P, E>> {
    const unit = units.get(battle, source);
    const reject = (
        reason: Extract<StartOutcome<P, E>, { type: "REJECTED" }>["reason"],
    ): Result<StartOutcome<P, E>> => ({ state: battle, value: { type: "REJECTED", reason } });

    if (
        unit?.lifecycle !== "PRESENT" ||
        !isSpatiallyPresent(unit) ||
        (hasVitality(unit) && unit.vitality.hp <= 0)
    ) {
        return reject("SOURCE_UNAVAILABLE");
    }

    const current = unit.action.actions.get(definition.id, definition);

    if (current === undefined) {
        throw new TypeError("action definition is not configured for its source");
    }
    if (current.execution !== null) {
        return reject("CASTING");
    }
    if (!unit.action.rules.every((rule) => rule.allows(battle, unit, definition.id))) {
        return reject("RULE");
    }

    const period = resolveInterval(battle, source, definition)!;
    const resized = cooldown.resizeKeepingProgress(current.cooldown, period, battle.tick);

    if (cooldown.remaining(resized, battle.tick) > 0) {
        return reject("COOLDOWN");
    }

    const initialized = definition.start(battle, source, current);
    battle = initialized.state;

    if (initialized.value === null) {
        return reject("CONDITION");
    }

    const latest = units.get(battle, source);

    if (
        latest?.lifecycle !== "PRESENT" ||
        !isSpatiallyPresent(latest) ||
        (hasVitality(latest) && latest.vitality.hp <= 0)
    ) {
        return reject("SOURCE_UNAVAILABLE");
    }

    const latestAction = latest.action.actions.get(definition.id, definition)!;

    if (latestAction.execution !== null) {
        return reject("CASTING");
    }
    if (!latest.action.rules.every((rule) => rule.allows(battle, latest, definition.id))) {
        return reject("RULE");
    }

    const latestPeriod = resolveInterval(battle, source, definition)!;
    const acceptedCooldown = cooldown.resizeKeepingProgress(
        latestAction.cooldown,
        latestPeriod,
        battle.tick,
    );

    if (cooldown.remaining(acceptedCooldown, battle.tick) > 0) {
        return reject("COOLDOWN");
    }

    const self: Executing<P, E> = {
        ...latestAction,
        cooldown: cooldown.reset(acceptedCooldown, battle.tick),
        execution: {
            id: latest.action.nextExecutionId,
            startedAtTick: battle.tick,
            status: "RUNNING",
            state: initialized.value,
        },
    };
    battle = updateUnit(battle, [
        {
            ...latest,
            action: {
                ...latest.action,
                actions: latest.action.actions.replace(definition, self),
                nextExecutionId: latest.action.nextExecutionId + 1,
            },
        },
    ]);
    const reference = ref(source, self);

    return { state: advance(battle, reference), value: { type: "STARTED", ref: reference } };
}

export function update<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Executing<P, E>>,
    transform: (current: NoInfer<E>) => NoInfer<E>,
): BattleState {
    const unit = units.get(battle, reference.host);
    const current = get(battle, reference);

    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }
    if (current === undefined) {
        throw new RangeError(`unknown action execution: ${reference.id}`);
    }
    if (current.execution.status === "ENDING") {
        throw new TypeError("cannot update an ending action");
    }

    const state = transform(current.execution.state);

    return state === current.execution.state
        ? battle
        : updateUnit(battle, [
              {
                  ...unit,
                  action: {
                      ...unit.action,
                      actions: unit.action.actions.replace(current.definition, {
                          ...current,
                          execution: { ...current.execution, state },
                      }),
                  },
              },
          ]);
}

export function cancel(
    battle: BattleState,
    reference: Ref<ExecutingView>,
    reason = "CANCELLED",
): BattleState {
    return end(battle, reference, { type: "CANCELLED", reason });
}

export function cancelForUnit(
    battle: BattleState,
    source: Ref<Unit>,
    reason: string,
    lifetimeReason = reason,
): BattleState {
    const candidates = forUnit(battle, source);

    for (const reference of candidates) {
        battle = end(battle, reference, { type: "CANCELLED", reason }, lifetimeReason);
    }

    return battle;
}

export function refreshCooldowns(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
): BattleState {
    const unit = units.get(battle, source);

    if (unit === undefined) {
        return battle;
    }

    let actions = unit.action.actions;

    for (const id of actions.keys()) {
        actions.read(id, (self) => {
            const period = resolveInterval(battle, source, self.definition)!;
            const next = cooldown.resizeKeepingProgress(self.cooldown, period, battle.tick);

            if (next !== self.cooldown) {
                actions = actions.replace(self.definition, { ...self, cooldown: next });
            }
        });
    }

    return actions === unit.action.actions
        ? battle
        : updateUnit(battle, [{ ...unit, action: { ...unit.action, actions } }]);
}

export function resetCooldown(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId: DefinitionId,
): BattleState {
    battle = refreshCooldowns(battle, source);

    return updateCooldown(battle, source, definitionId, (current) =>
        cooldown.reset(current, battle.tick),
    );
}

export function clearCooldown(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definitionId: DefinitionId,
): BattleState {
    battle = refreshCooldowns(battle, source);

    return updateCooldown(battle, source, definitionId, (current) =>
        cooldown.clear(current, battle.tick),
    );
}

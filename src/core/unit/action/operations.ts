import { update as updateUnit } from "../../battle/unit.js";
import { closeLifetime } from "../../battle/execution/lifetime.js";
import type { Ref } from "../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../battle/state.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import { hasVitality } from "../capability/vitality/capability.js";
import { resolveInterval } from "../capability/action/timing.js";
import { ref, type Action, type Executing, type ExecutingView } from "./action.js";
import type { Definition, Id as DefinitionId, End } from "./definition.js";
import * as cooldown from "./cooldown.js";
import { forUnit } from "./query.js";

export type StartOutcome<P extends object, E extends object> =
    | { readonly type: "STARTED"; readonly ref: Ref<Executing<P, E>> }
    | {
          readonly type: "REJECTED";
          readonly reason: "SOURCE_UNAVAILABLE" | "RULE" | "COOLDOWN" | "CASTING" | "CONDITION";
      };

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

    return state === current.state ? battle : replaceAction(battle, unit, { ...current, state });
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
            : replaceAction(battle, unit, { ...self, cooldown: next });
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
    const reject = (reason: Extract<StartOutcome<P, E>, { type: "REJECTED" }>["reason"]) => ({
        type: "REJECTED" as const,
        reason,
    });

    function check(battle: BattleState) {
        const unit = units.get(battle, source);

        if (
            unit?.lifecycle !== "PRESENT" ||
            !isSpatiallyPresent(unit) ||
            (hasVitality(unit) && unit.vitality.hp <= 0)
        ) {
            return reject("SOURCE_UNAVAILABLE");
        }

        const action = unit.action.actions.get(definition.id, definition);

        if (action === undefined) {
            throw new TypeError("action definition is not configured for its source");
        }
        if (action.execution !== null) {
            return reject("CASTING");
        }
        if (!unit.action.rules.every((rule) => rule.allows(battle, unit, definition.id))) {
            return reject("RULE");
        }

        const period = resolveInterval(battle, source, definition)!;
        const resized = cooldown.resizeKeepingProgress(action.cooldown, period, battle.tick);

        if (cooldown.remaining(resized, battle.tick) > 0) {
            return reject("COOLDOWN");
        }

        return { type: "READY" as const, unit, action, cooldown: resized };
    }

    const initial = check(battle);

    if (initial.type === "REJECTED") {
        return { state: battle, value: initial };
    }

    const initialized = definition.prepare(battle, source, initial.action);
    battle = initialized.state;

    if (initialized.value === null) {
        return { state: battle, value: reject("CONDITION") };
    }

    const latest = check(battle);

    if (latest.type === "REJECTED") {
        return { state: battle, value: latest };
    }

    const { unit, action, cooldown: acceptedCooldown } = latest;
    const self: Executing<P, E> = {
        ...action,
        cooldown: cooldown.reset(acceptedCooldown, battle.tick),
        execution: {
            id: unit.action.nextExecutionId,
            startedAtTick: battle.tick,
            status: "RUNNING",
            state: initialized.value,
        },
    };
    battle = updateUnit(battle, [
        {
            ...unit,
            action: {
                ...unit.action,
                actions: unit.action.actions.replace(definition, self),
                nextExecutionId: unit.action.nextExecutionId + 1,
            },
        },
    ]);
    const reference = ref(source, self);

    return { state: battle, value: { type: "STARTED", ref: reference } };
}

export function update<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Executing<P, E>>,
    transform: (current: NoInfer<E>) => NoInfer<E>,
): BattleState {
    const unit = units.get(battle, reference.host);

    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const current = unit.action.actions.readExecution(
        reference.id,
        (self) => self as unknown as Executing<P, E>,
    );

    if (current === undefined) {
        throw new RangeError(`unknown action execution: ${reference.id}`);
    }
    if (current.execution.status === "ENDING") {
        throw new TypeError("cannot update an ending action");
    }

    const state = transform(current.execution.state);

    return state === current.execution.state
        ? battle
        : replaceAction(battle, unit, {
              ...current,
              execution: { ...current.execution, state },
          });
}

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
            battle = replaceAction(battle, host, ending);
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
                battle = replaceAction(battle, latestHost, {
                    ...latestAction,
                    execution: null,
                });
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

function replaceAction<P extends object, E extends object>(
    battle: BattleState,
    unit: Unit & ActionCapability,
    self: Action<P, E>,
): BattleState {
    return updateUnit(battle, [
        {
            ...unit,
            action: {
                ...unit.action,
                actions: unit.action.actions.replace(self.definition, self),
            },
        },
    ]);
}

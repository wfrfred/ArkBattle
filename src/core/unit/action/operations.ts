import { update as updateUnit } from "../../battle/unit.js";
import type { Ref } from "../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../battle/state.js";
import * as lifetimes from "../../lifetime/index.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import { hasVitality } from "../capability/vitality/capability.js";
import { resolveInterval } from "../capability/action/timing.js";
import type { Action } from "./action.js";
import { ref, type Execution } from "./execution.js";
import type { End } from "./definition.js";
import * as cooldown from "./cooldown.js";
import { forUnit } from "./query.js";

export type StartOutcome<P extends object, E extends object> =
    | { readonly type: "STARTED"; readonly ref: Ref<Execution<P, E>> }
    | {
          readonly type: "REJECTED";
          readonly reason: "SOURCE_UNAVAILABLE" | "RULE" | "COOLDOWN" | "CASTING" | "CONDITION";
      };

export function setState<X extends Action<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    state: NoInfer<X["state"]>,
): BattleState {
    const { unit, action } = getAction(battle, reference);

    return state === action.state ? battle : replaceAction(battle, unit, { ...action, state });
}

export function setCooldown<X extends Action<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    next: cooldown.State,
): BattleState {
    const { unit, action } = getAction(battle, reference);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

export function start<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
): Result<StartOutcome<P, E>> {
    const { host: source, definition } = reference;
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
    const self: Execution<P, E> = {
        definition: action.definition,
        state: action.state,
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
    const execution = ref(source, self);

    return { state: battle, value: { type: "STARTED", ref: execution } };
}

export function setExecutionState<X extends Execution<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    state: NoInfer<X["execution"]["state"]>,
): BattleState {
    const unit = units.get(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const current = unit.action.actions.getExecution(reference.id);
    if (current === undefined) {
        throw new RangeError(`unknown action execution: ${reference.id}`);
    }
    if (current.execution.status === "ENDING") {
        throw new TypeError("cannot update an ending action");
    }

    return state === current.execution.state
        ? battle
        : replaceAction(battle, unit, {
              ...current,
              execution: { ...current.execution, state },
          });
}

export const lifetime = lifetimes.create<Execution, Execution<any, any>, End>({
    kind: "ACTION",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) =>
        units.get(battle, reference.host)?.action.actions.getExecution(reference.id),
    isEnding: (self) => self.execution.status === "ENDING",
    begin: (self) => ({ ...self, execution: { ...self.execution, status: "ENDING" } }),
    replace: (battle, reference, next) =>
        replaceAction(battle, units.get(battle, reference.host)!, next),
    finalize(battle, reference, result) {
        const self = units.get(battle, reference.host)!.action.actions.getExecution(reference.id)!;

        if (self.definition.onEnd !== undefined) {
            battle = self.definition.onEnd(battle, reference.host, self, result);
        }

        const host = units.get(battle, reference.host)!;
        const action = host.action.actions.get(self.definition.id, self.definition)!;
        battle = replaceAction(battle, host, { ...action, execution: null });

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
    },
    reason: (result) => (result.type === "FINISHED" ? "ACTION_FINISHED" : result.reason),
    fromDependency: () => ({ type: "CANCELLED", reason: "SOURCE_ABSENT" }),
});

function end<X extends Execution<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    result: End,
    lifetimeReason?: string,
): BattleState {
    return lifetime.end(battle, reference, result, lifetimeReason);
}

export function cancel<X extends Execution<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
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

export function advance<X extends Execution<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): BattleState {
    const source = units.get(battle, reference.host);
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
        const self = actions.getAction(id)!;
        const period = resolveInterval(battle, source, self.definition)!;
        const next = cooldown.resizeKeepingProgress(self.cooldown, period, battle.tick);
        if (next !== self.cooldown) {
            actions = actions.replace(self.definition, { ...self, cooldown: next });
        }
    }

    return actions === unit.action.actions
        ? battle
        : updateUnit(battle, [{ ...unit, action: { ...unit.action, actions } }]);
}

export function resetCooldown<X extends Action<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): BattleState {
    battle = refreshCooldowns(battle, reference.host);

    const { unit, action } = getAction(battle, reference);
    const next = cooldown.reset(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

export function clearCooldown<X extends Action<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): BattleState {
    battle = refreshCooldowns(battle, reference.host);

    const { unit, action } = getAction(battle, reference);
    const next = cooldown.clear(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

function getAction<X extends Action<any, any>>(battle: BattleState, reference: Ref<X>) {
    const unit = units.get(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const action = unit.action.actions.get(reference.definition.id, reference.definition);
    if (action === undefined) {
        throw new TypeError("action definition is not configured for its source");
    }

    return { unit, action };
}

function replaceAction<P extends object, E extends object>(
    battle: BattleState,
    unit: Unit & ActionCapability,
    self: Action<P, E> | Execution<P, E>,
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

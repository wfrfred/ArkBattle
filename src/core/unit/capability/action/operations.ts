import { replace as replaceUnits } from "../../operations.js";
import { ref, type Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import { end } from "../../../lifetime/index.js";
import { register } from "../../../lifetime/operations.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import { resolvePeriod } from "./timing.js";
import type { Action } from "./action.js";
import { create as createExecution, type Execution, type ExecutionRef } from "./execution.js";
import type { Definition, Id as DefinitionId } from "./definition.js";
import * as cooldown from "./cooldown.js";
import { executionRefs } from "./query.js";
import { allows } from "../../../restriction.js";
import { replaceIn } from "../../../common/object.js";

export function setState<P extends object>(
    battle: BattleState,
    reference: Ref<Action<P>>,
    state: NoInfer<P>,
): BattleState {
    const { unit, action } = getAction(battle, reference);

    return state === action.state ? battle : replaceAction(battle, unit, { ...action, state });
}

export function setCooldown(
    battle: BattleState,
    reference: Ref<Action>,
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
): Result<Ref<Execution<E>> | null> {
    const source = reference.host;

    function check(battle: BattleState) {
        const unit = source.get(battle);
        if (unit?.lifecycle !== "ACTIVE" || (hasVitality(unit) && !isAlive(unit))) {
            return null;
        }

        const action = reference.get(battle);
        if (action === undefined) {
            return null;
        }
        if (action.execution !== null) {
            return null;
        }
        if (
            !allows(
                battle,
                { self: unit, definitionId: action.definition.id },
                unit.action.restrictions,
            )
        ) {
            return null;
        }

        if (cooldown.remaining(action.cooldown, battle.tick) > 0) {
            return null;
        }

        return { unit, action };
    }

    const initial = check(battle);
    if (initial === null) {
        return { state: battle, value: null };
    }

    const initialized = (initial.action.definition as Definition<P, E>).prepare(
        battle,
        source,
        initial.action,
    );
    battle = initialized.state;

    if (initialized.value === null) {
        return { state: battle, value: null };
    }

    const latest = check(battle);
    if (latest === null) {
        return { state: battle, value: null };
    }

    const { unit, action } = latest;
    const execution = createExecution(
        source,
        unit.action.nextExecutionId,
        battle.tick,
        initialized.value,
    );
    battle = replaceUnits(battle, [
        {
            ...unit,
            action: {
                ...unit.action,
                actions: unit.action.actions.replace({
                    ...action,
                    cooldown: cooldown.reset(action.cooldown, battle.tick),
                    execution,
                }),
                nextExecutionId: unit.action.nextExecutionId + 1,
            },
        },
    ]);
    const started = ref(execution);
    battle = register(battle, started, [source]);

    return { state: battle, value: started };
}

export function startConfigured(
    battle: BattleState,
    unit: Unit & ActionCapability,
    id: DefinitionId,
): Result<ExecutionRef | null> {
    const action = unit.action.actions.get(id);
    if (action === undefined) {
        throw new RangeError(`unknown selected action definition ${id}`);
    }

    return start(battle, ref(action));
}

export function setExecutionState<E extends object>(
    battle: BattleState,
    reference: Ref<Execution<E>>,
    state: NoInfer<E>,
): BattleState {
    const unit = reference.host.get(battle);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const action = unit.action.actions.getByExecution(reference);
    if (action === undefined) {
        throw new RangeError("unknown action execution");
    }

    return state === action.execution.state
        ? battle
        : replaceAction(battle, unit, replaceIn(action, ["execution", "state"], state));
}

export const config: Execution["config"] = {
    end: {
        prepare(battle, reference) {
            const host = reference.host.get(battle)!;
            const action = host.action.actions.getByExecution(reference)!;

            return replaceAction(
                battle,
                host,
                replaceIn(action, ["execution", "lifecycle"], "ENDING"),
            );
        },
        finalize(battle, reference, _initial, result) {
            const host = reference.host.get(battle)!;
            const current = host.action.actions.getByExecution(reference)!;
            const definition = current.definition as Definition;
            const action = ref(current);
            battle =
                definition.onEnd?.(battle, reference.host, current.execution, action, result) ??
                battle;

            const latest = reference.host.get(battle)!;
            const previous = latest.action.actions.get(action)!;
            battle = replaceAction(battle, latest, { ...previous, execution: null });

            return appendEvents(battle, [
                {
                    sourceUnitId: reference.host.id,
                    tick: battle.tick,
                    type: result.type === "FINISHED" ? "ACTION_FINISHED" : "ACTION_CANCELLED",
                },
            ]);
        },
        dependencyEnd: { type: "CANCELLED", reason: "SOURCE_ABSENT" },
    },
};

export function finish(battle: BattleState, reference: ExecutionRef): BattleState {
    return end(battle, reference, { type: "FINISHED" });
}

export function cancel(
    battle: BattleState,
    reference: ExecutionRef,
    reason = "CANCELLED",
): BattleState {
    return end(battle, reference, { type: "CANCELLED", reason });
}

export function cancelForUnit(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    reason: string,
): BattleState {
    const unit = source.get(battle);
    if (unit === undefined) {
        return battle;
    }

    for (const reference of executionRefs(unit)) {
        battle = cancel(battle, reference, reason);
    }

    return battle;
}

export function advance(battle: BattleState, reference: ExecutionRef): BattleState {
    const source = reference.host.get(battle);
    if (source === undefined) {
        return battle;
    }

    const current = source.action.actions.getByExecution(reference);
    if (current?.execution.lifecycle !== "ACTIVE") {
        return battle;
    }
    if (source.lifecycle !== "ACTIVE") {
        return cancel(battle, reference, "SOURCE_ABSENT");
    }

    return (current.definition as Definition).onTick(
        battle,
        reference.host,
        current.execution,
        ref(current),
    );
}

export function refreshCooldowns(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
): BattleState {
    const unit = source.get(battle);
    if (unit === undefined) {
        return battle;
    }

    let actions = unit.action.actions;

    for (const self of actions.values()) {
        if (self.definition.period.type !== "ATTACK_SPEED") {
            continue;
        }

        const period = resolvePeriod(unit, self.definition);
        const next = cooldown.resizeKeepingProgress(self.cooldown, period, battle.tick);
        if (next !== self.cooldown) {
            actions = actions.replace({ ...self, cooldown: next });
        }
    }

    return actions === unit.action.actions
        ? battle
        : replaceUnits(battle, [replaceIn(unit, ["action", "actions"], actions)]);
}

export function resetCooldown(battle: BattleState, reference: Ref<Action>): BattleState {
    const { unit, action } = getAction(battle, reference);
    const next = cooldown.reset(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

export function clearCooldown(battle: BattleState, reference: Ref<Action>): BattleState {
    const { unit, action } = getAction(battle, reference);
    const next = cooldown.clear(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

function getAction<P extends object>(battle: BattleState, reference: Ref<Action<P>>) {
    const unit = reference.host.get(battle);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const action = reference.get(battle);
    if (action === undefined) {
        throw new TypeError("action definition is not configured for its source");
    }

    return { unit, action };
}

function replaceAction(
    battle: BattleState,
    unit: Unit & ActionCapability,
    self: Action,
): BattleState {
    return replaceUnits(battle, [
        replaceIn(unit, ["action", "actions"], unit.action.actions.replace(self)),
    ]);
}

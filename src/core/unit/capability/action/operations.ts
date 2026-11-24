import { lifetime as unitLifetime, replace as replaceUnits } from "../../operations.js";
import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import * as lifetimes from "../../../lifetime/index.js";
import { register } from "../../../lifetime/operations.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import { resolvePeriod } from "./timing.js";
import { ref as actionRef, type Action } from "./action.js";
import { ref, type Execution, type ExecutionIdentity, type ExecutionRef } from "./execution.js";
import type { Definition, End, Id as DefinitionId } from "./definition.js";
import * as cooldown from "./cooldown.js";
import { executionRefs } from "./query.js";
import { allows } from "../../../restriction.js";
import { replaceIn } from "../../../common/object.js";

export function setState<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
    state: NoInfer<P>,
): BattleState {
    const { unit, action } = getAction(battle, reference);

    return state === action.state ? battle : replaceAction(battle, unit, { ...action, state });
}

export function setCooldown<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
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
    const { host: source, definitionId } = reference;

    function check(battle: BattleState) {
        const unit = source.get(battle);
        if (unit?.lifecycle !== "ACTIVE" || (hasVitality(unit) && !isAlive(unit))) {
            return null;
        }

        const action = reference.get(battle);
        if (action === undefined) {
            throw new TypeError("action definition is not configured for its source");
        }
        if (action.execution !== null) {
            return null;
        }
        if (!allows(battle, { self: unit, definitionId }, unit.action.restrictions)) {
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
    const execution: Execution<E> = {
        id: unit.action.nextExecutionId,
        startedAtTick: battle.tick,
        lifecycle: "ACTIVE",
        state: initialized.value,
    };
    battle = replaceUnits(battle, [
        {
            ...unit,
            action: {
                ...unit.action,
                actions: unit.action.actions.replace(action.definition, {
                    ...action,
                    cooldown: cooldown.reset(action.cooldown, battle.tick),
                    execution,
                }),
                nextExecutionId: unit.action.nextExecutionId + 1,
            },
        },
    ]);
    const started = ref(source, execution);
    battle = register(battle, lifetime, started, [lifetimes.scope(unitLifetime, source)]);

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

    return start(battle, actionRef(units.ref(unit), action.definition));
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

    const action = unit.action.actions.getByExecution(reference.id);
    if (action === undefined) {
        throw new RangeError(`unknown action execution: ${reference.id}`);
    }

    return state === action.execution.state
        ? battle
        : replaceAction(battle, unit, replaceIn(action, ["execution", "state"], state));
}

export const lifetime = lifetimes.create<ExecutionIdentity, End>({
    kind: "ACTION",
    address: (reference) => `${reference.host.id}:${reference.id}`,
    end: {
        prepare(battle, reference) {
            const host = reference.host.get(battle)!;
            const action = host.action.actions.getByExecution(reference.id)!;

            return replaceAction(
                battle,
                host,
                replaceIn(action, ["execution", "lifecycle"], "ENDING"),
            );
        },
        finalize(battle, reference, _initial, result) {
            const host = reference.host.get(battle)!;
            const current = host.action.actions.getByExecution(reference.id)!;
            const definition = current.definition as Definition;
            const action = actionRef(reference.host, current.definition);
            battle =
                definition.onEnd?.(battle, reference.host, current.execution, result, action) ??
                battle;

            const latest = reference.host.get(battle)!;
            const previous = latest.action.actions.get(action.definitionId)!;
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
});

export function finish(battle: BattleState, reference: ExecutionRef): BattleState {
    return lifetime.end(battle, reference, { type: "FINISHED" });
}

export function cancel(
    battle: BattleState,
    reference: ExecutionRef,
    reason = "CANCELLED",
): BattleState {
    return lifetime.end(battle, reference, { type: "CANCELLED", reason });
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

    const current = source.action.actions.getByExecution(reference.id);
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
        actionRef(reference.host, current.definition),
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

    for (const id of actions.keys()) {
        const self = actions.get(id)!;
        if (self.definition.period.type !== "ATTACK_SPEED") {
            continue;
        }

        const period = resolvePeriod(unit, self.definition);
        const next = cooldown.resizeKeepingProgress(self.cooldown, period, battle.tick);
        if (next !== self.cooldown) {
            actions = actions.replace(self.definition, { ...self, cooldown: next });
        }
    }

    return actions === unit.action.actions
        ? battle
        : replaceUnits(battle, [replaceIn(unit, ["action", "actions"], actions)]);
}

export function resetCooldown<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
): BattleState {
    const { unit, action } = getAction(battle, reference);
    const next = cooldown.reset(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

export function clearCooldown<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
): BattleState {
    const { unit, action } = getAction(battle, reference);
    const next = cooldown.clear(action.cooldown, battle.tick);

    return next === action.cooldown
        ? battle
        : replaceAction(battle, unit, { ...action, cooldown: next });
}

function getAction<P extends object, E extends object>(
    battle: BattleState,
    reference: Ref<Action<P, E>>,
) {
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

function replaceAction<P extends object, E extends object>(
    battle: BattleState,
    unit: Unit & ActionCapability,
    self: Action<P, E>,
): BattleState {
    return replaceUnits(battle, [
        replaceIn(unit, ["action", "actions"], unit.action.actions.replace(self.definition, self)),
    ]);
}

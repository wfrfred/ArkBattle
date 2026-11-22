import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertPositiveSafeInteger,
} from "../../../common/assert.js";
import * as entries from "../../../common/collection/entries.js";
import type { Contribution } from "../../../common/contribution.js";
import type { Modifier } from "../../../common/modifier.js";
import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { resolveMax, resolveMin } from "./query.js";

export interface Definition {
    readonly initial: number;
    readonly min: number;
    readonly max: number;
    readonly recoveryInterval: number | null;
}

export interface State {
    readonly definition: Definition;
    readonly balance: number;
    readonly progress: number;
    readonly min: readonly Contribution<Modifier>[];
    readonly max: readonly Contribution<Modifier>[];
    readonly recoverySpeed: readonly Contribution<Modifier>[];
}

const emptyDefinition: Definition = {
    initial: 0,
    min: 0,
    max: 99,
    recoveryInterval: null,
};

export function initialize(definition: Definition = emptyDefinition): State {
    const { initial, min, max, recoveryInterval } = definition;
    assertFiniteNumber(initial, "initial deployment points");
    assertFiniteNumber(min, "deployment point minimum");
    assertNonnegativeNumber(max, "deployment point limit");
    validateLimits(min, max);

    if (initial < min || initial > max) {
        throw new RangeError("initial deployment points are outside the account limits");
    }
    if (recoveryInterval !== null) {
        assertPositiveSafeInteger(recoveryInterval, "deployment point recovery interval");
    }

    return {
        definition,
        balance: initial,
        progress: 0,
        min: [],
        max: [],
        recoverySpeed: [],
    };
}

export function setMinContribution(
    battle: BattleState,
    entry: Contribution<Modifier>,
): BattleState {
    const { dp } = battle.deployment;
    const next = replaceIn(dp, ["min"], entries.set(dp.min, entry));
    if (next === dp) {
        return battle;
    }

    const min = resolveMin(next);
    validateLimits(min, resolveMax(next));

    return replaceIn(
        battle,
        ["deployment", "dp"],
        next.balance < min ? replaceIn(next, ["balance"], min) : next,
    );
}

export function removeMinContribution(battle: BattleState, id: string): BattleState {
    const { dp } = battle.deployment;
    const next = replaceIn(dp, ["min"], entries.remove(dp.min, id));
    if (next === dp) {
        return battle;
    }

    const min = resolveMin(next);
    validateLimits(min, resolveMax(next));

    return replaceIn(
        battle,
        ["deployment", "dp"],
        next.balance < min ? replaceIn(next, ["balance"], min) : next,
    );
}

export function setMaxContribution(
    battle: BattleState,
    entry: Contribution<Modifier>,
    clamp = false,
): BattleState {
    const { dp } = battle.deployment;
    const next = replaceIn(dp, ["max"], entries.set(dp.max, entry));
    const max = resolveMax(next);
    validateLimits(resolveMin(next), max);

    return replaceIn(
        battle,
        ["deployment", "dp"],
        clamp && next.balance > max ? replaceIn(next, ["balance"], max) : next,
    );
}

export function removeMaxContribution(battle: BattleState, id: string): BattleState {
    const { dp } = battle.deployment;
    const next = replaceIn(dp, ["max"], entries.remove(dp.max, id));
    if (next === dp) {
        return battle;
    }

    validateLimits(resolveMin(next), resolveMax(next));

    return replaceIn(battle, ["deployment", "dp"], next);
}

export function setRecoverySpeedContribution(
    battle: BattleState,
    entry: Contribution<Modifier>,
): BattleState {
    const { dp } = battle.deployment;

    return replaceIn(
        battle,
        ["deployment", "dp", "recoverySpeed"],
        entries.set(dp.recoverySpeed, entry),
    );
}

export function removeRecoverySpeedContribution(battle: BattleState, id: string): BattleState {
    const { dp } = battle.deployment;

    return replaceIn(
        battle,
        ["deployment", "dp", "recoverySpeed"],
        entries.remove(dp.recoverySpeed, id),
    );
}

function validateLimits(min: number, max: number): void {
    if (min > max) {
        throw new RangeError("deployment point minimum exceeds the limit");
    }
}

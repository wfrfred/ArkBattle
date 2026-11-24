import {
    assertFiniteNumber,
    assertPositiveSafeInteger,
    assertSafeInteger,
} from "../../../common/assert.js";
import { roundToEven } from "../../../common/math.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { ActivationRef } from "./activation.js";
import type { Skill } from "./capability.js";
import { dispatch, ammoConsumed, ammoReplenished } from "./hook.js";
import { finish } from "./operations.js";
import { replace as replaceUnits } from "../../operations.js";
import type { Ammo } from "./duration.js";

export interface Modifier {
    readonly addition: number;
    readonly ratio: number;
}

export type Input =
    readonly Modifier[] | ((battle: BattleState, self: Unit & Skill) => readonly Modifier[]);

export function resolveCapacity(base: number, modifiers: Iterable<Modifier>): number {
    let addition = 0;
    let ratio = 0;

    for (const modifier of modifiers) {
        assertSafeInteger(modifier.addition, "skill ammunition capacity addition");
        assertFiniteNumber(modifier.ratio, "skill ammunition capacity ratio");
        addition += modifier.addition;
        ratio += modifier.ratio;
    }

    const rounded = roundToEven(base * ratio);
    const capacity = Math.max(1, base + addition + rounded);

    return capacity;
}

export interface Consumed {
    readonly ref: ActivationRef;
    readonly amount: number;
    readonly previous: Ammo;
    readonly current: Ammo;
}

export interface Replenished {
    readonly ref: ActivationRef;
    readonly requested: number;
    readonly amount: number;
    readonly previous: Ammo;
    readonly current: Ammo;
}

export type Outcome =
    | { readonly type: "APPLIED"; readonly amount: number; readonly remaining: number }
    | { readonly type: "REJECTED"; readonly reason: "UNAVAILABLE" | "NO_AMMO" };

export function consume(
    battle: BattleState,
    reference: ActivationRef,
    amount = 1,
): Result<Outcome> {
    assertPositiveSafeInteger(amount, "skill ammunition consumption");

    const self = reference.host.get(battle);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    const active = reference.get(battle);
    if (self.lifecycle !== "ACTIVE" || active?.lifecycle !== "ACTIVE") {
        return rejected(battle, "UNAVAILABLE");
    }
    if (active.duration.type !== "AMMO") {
        return rejected(battle, "NO_AMMO");
    }

    const previous = active.duration;
    const current = { ...previous, remaining: previous.remaining - amount };

    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, activation: { ...active, duration: current } },
        },
    ]);
    battle = dispatch(battle, units.ref(self), ammoConsumed, {
        ref: reference,
        amount,
        previous,
        current,
    });

    return {
        state: battle,
        value: { type: "APPLIED", amount, remaining: current.remaining },
    };
}

export function replenish(
    battle: BattleState,
    reference: ActivationRef,
    amount = 1,
): Result<Outcome> {
    return add(battle, reference, amount, true);
}

export function grant(battle: BattleState, reference: ActivationRef, amount = 1): Result<Outcome> {
    return add(battle, reference, amount, false);
}

export function check(battle: BattleState, reference: ActivationRef): BattleState {
    const active = reference.get(battle);

    return active?.lifecycle === "ACTIVE" &&
        active.duration.type === "AMMO" &&
        active.duration.remaining <= 0
        ? finish(battle, reference)
        : battle;
}

function add(
    battle: BattleState,
    reference: ActivationRef,
    requested: number,
    replenishing: boolean,
): Result<Outcome> {
    assertPositiveSafeInteger(requested, "skill ammunition replenishment");

    const self = reference.host.get(battle);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    const active = reference.get(battle);
    if (self.lifecycle !== "ACTIVE" || active?.lifecycle !== "ACTIVE") {
        return rejected(battle, "UNAVAILABLE");
    }
    if (active.duration.type !== "AMMO") {
        return rejected(battle, "NO_AMMO");
    }

    const previous = active.duration;
    const amount = Math.max(
        0,
        Math.min(
            requested,
            previous.initial - previous.remaining,
            replenishing ? previous.initial - previous.replenished : requested,
        ),
    );
    if (amount === 0) {
        return {
            state: battle,
            value: { type: "APPLIED", amount, remaining: previous.remaining },
        };
    }

    const current = {
        ...previous,
        remaining: previous.remaining + amount,
        replenished: previous.replenished + (replenishing ? amount : 0),
    };
    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, activation: { ...active, duration: current } },
        },
    ]);

    if (replenishing) {
        battle = dispatch(battle, units.ref(self), ammoReplenished, {
            ref: reference,
            requested,
            amount,
            previous,
            current,
        });
    }

    return {
        state: battle,
        value: { type: "APPLIED", amount, remaining: current.remaining },
    };
}

function rejected(state: BattleState, reason: "UNAVAILABLE" | "NO_AMMO"): Result<Outcome> {
    return { state, value: { type: "REJECTED", reason } };
}

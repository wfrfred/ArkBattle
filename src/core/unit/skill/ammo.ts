import {
    assertFiniteNumber,
    assertPositiveSafeInteger,
    assertSafeInteger,
} from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { State as BattleState, Result } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import * as units from "../query.js";
import type * as contribution from "../contribution/contribution.js";
import type { Activation } from "./activation.js";
import type { Skill } from "../capability/skill/capability.js";
import { dispatch } from "../capability/skill/hook.js";
import { finish } from "./operations.js";
import * as query from "./query.js";
import { replace as replaceUnits } from "../../battle/unit.js";
import type { Ammo } from "./sustain.js";

export interface Modifier {
    readonly addition: number;
    readonly ratio: number;
}

export type Input = contribution.Input<Modifier, Unit & Skill>;

export function resolveCapacity(base: number, modifiers: Iterable<Modifier>): number {
    let addition = 0;
    let ratio = 0;

    for (const modifier of modifiers) {
        assertSafeInteger(modifier.addition, "skill ammunition capacity addition");
        assertFiniteNumber(modifier.ratio, "skill ammunition capacity ratio");
        addition += modifier.addition;
        ratio += modifier.ratio;
    }

    const scaled = base * ratio;
    const lower = Math.floor(scaled);
    const rounded = scaled - lower === 0.5 ? lower + Math.abs(lower % 2) : Math.round(scaled);
    const capacity = Math.max(1, base + addition + rounded);

    return capacity;
}

export interface Consumed {
    readonly ref: Ref<Activation>;
    readonly amount: number;
    readonly previous: Ammo;
    readonly current: Ammo;
}

export interface Replenished {
    readonly ref: Ref<Activation>;
    readonly requested: number;
    readonly amount: number;
    readonly previous: Ammo;
    readonly current: Ammo;
}

export type Outcome =
    | { readonly type: "APPLIED"; readonly amount: number; readonly remaining: number }
    | { readonly type: "REJECTED"; readonly reason: "UNAVAILABLE" | "NO_AMMO" };

export function consume<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    amount = 1,
): Result<Outcome> {
    assertPositiveSafeInteger(amount, "skill ammunition consumption");

    const self = units.get(battle, reference.host);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    const active = self.skill.activation;
    if (self.lifecycle !== "PRESENT" || active?.id !== reference.id || active.status !== "ACTIVE") {
        return rejected(battle, "UNAVAILABLE");
    }
    if (active.sustain.type !== "AMMO") {
        return rejected(battle, "NO_AMMO");
    }

    const previous = active.sustain;
    const current = { ...previous, remaining: previous.remaining - amount };

    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, activation: { ...active, sustain: current } },
        },
    ]);
    battle = dispatch(battle, units.ref(self), "ammoConsumed", {
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

export function replenish<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    amount = 1,
): Result<Outcome> {
    return add(battle, reference, amount, true);
}

export function grant<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    amount = 1,
): Result<Outcome> {
    return add(battle, reference, amount, false);
}

export function check<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): BattleState {
    const active = query.getActivation(battle, reference)?.activation;

    return active?.status === "ACTIVE" &&
        active.sustain.type === "AMMO" &&
        active.sustain.remaining <= 0
        ? finish(battle, reference)
        : battle;
}

function add<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    requested: number,
    replenishing: boolean,
): Result<Outcome> {
    assertPositiveSafeInteger(requested, "skill ammunition replenishment");

    const self = units.get(battle, reference.host);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    const active = self.skill.activation;
    if (self.lifecycle !== "PRESENT" || active?.id !== reference.id || active.status !== "ACTIVE") {
        return rejected(battle, "UNAVAILABLE");
    }
    if (active.sustain.type !== "AMMO") {
        return rejected(battle, "NO_AMMO");
    }

    const previous = active.sustain;
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
            skill: { ...self.skill, activation: { ...active, sustain: current } },
        },
    ]);

    if (replenishing) {
        battle = dispatch(battle, units.ref(self), "ammoReplenished", {
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

import { assertNonnegativeSafeInteger, assertSafeInteger } from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { Result, State as BattleState } from "../../battle/state.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import type { Unit } from "../unit.js";
import * as units from "../query.js";
import * as contribution from "../../common/contribution.js";
import * as attribute from "../attribute.js";
import { hasVitality } from "../capability/vitality/capability.js";
import { isAlive } from "../capability/vitality/query.js";
import type { Skill } from "../capability/skill/capability.js";
import { replace as replaceUnits } from "../../battle/unit.js";
import { dispatch, spRecovered, spPaid, spModified } from "../capability/skill/hook.js";
import { allows } from "../../restriction.js";
import { createChange, type Change } from "../change.js";

export type Source = "TIME" | "ACTION" | "HIT" | "EXTERNAL";

export type Input = attribute.Input<Unit & Skill>;

export type Parameter = "recoverySpeed" | "recoveryMultiplier";

export type Recovery =
    | { readonly type: "TIME" }
    | { readonly type: "ACTION" | "HIT"; readonly amount: number }
    | { readonly type: "NONE" };

export interface Definition {
    readonly initial: number;
    readonly capacity: number;
    readonly recovery: Recovery;
    readonly recoverySpeed: attribute.Definition;
    readonly recoveryMultiplier: attribute.Definition;
}

export interface Timer {
    readonly periodTicks: number;
    readonly remainingTicks: number;
}

export interface State {
    readonly value: number;
    readonly recovery: Timer | null;
    readonly lastTick: number;
    readonly recoverySpeed: attribute.State<Input>;
    readonly recoveryMultiplier: attribute.State<Input>;
}

type WithSp = Unit &
    Skill & {
        readonly skill: {
            readonly sp: State;
            readonly definition: { readonly sp: Definition };
        };
    };

export function hasSp<U extends Unit & Skill>(self: U): self is U & WithSp {
    return self.skill.sp !== null;
}

export interface Recovered {
    readonly source: Source;
    readonly amount: number;
    readonly previous: number;
    readonly current: number;
}

export interface Paid {
    readonly amount: number;
    readonly previous: number;
    readonly current: number;
}

export interface Modified {
    readonly delta: number;
    readonly amount: number;
    readonly forced: boolean;
    readonly previous: number;
    readonly current: number;
}

export type Outcome =
    | { readonly type: "APPLIED"; readonly amount: number }
    | {
          readonly type: "REJECTED";
          readonly reason:
              "UNAVAILABLE" | "NO_SP" | "RULE" | "WRONG_SOURCE" | "FULL" | "INSUFFICIENT_SP";
      };

export function setContribution(
    key: Parameter,
    entry: contribution.Contribution<Input>,
): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        const sp = self.skill.sp;
        if (sp === null) {
            return self;
        }

        const updated = attribute.setContribution(sp[key], entry);

        return updated === sp[key]
            ? self
            : { ...self, skill: { ...self.skill, sp: { ...sp, [key]: updated } } };
    });
}

export function removeContribution(key: Parameter, id: string): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        const sp = self.skill.sp;
        if (sp === null) {
            return self;
        }

        const updated = attribute.removeContribution(sp[key], id);

        return updated === sp[key]
            ? self
            : { ...self, skill: { ...self.skill, sp: { ...sp, [key]: updated } } };
    });
}

export function setRange(key: Parameter, range: attribute.Range): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        if (!hasSp(self)) {
            return self;
        }

        const sp = self.skill.sp;
        const updated = attribute.setRange(self.skill.definition.sp[key], sp[key], range);

        return updated === sp[key]
            ? self
            : { ...self, skill: { ...self.skill, sp: { ...sp, [key]: updated } } };
    });
}

export function clearRange(key: Parameter): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        if (!hasSp(self)) {
            return self;
        }

        const sp = self.skill.sp;
        const updated = attribute.clearRange(self.skill.definition.sp[key], sp[key]);

        return updated === sp[key]
            ? self
            : { ...self, skill: { ...self.skill, sp: { ...sp, [key]: updated } } };
    });
}

export function validateDefinition(definition: Definition): void {
    assertNonnegativeSafeInteger(definition.initial, "skill initial SP");
    assertNonnegativeSafeInteger(definition.capacity, "skill SP capacity");

    if (definition.initial > definition.capacity) {
        throw new RangeError("skill initial SP exceeds capacity");
    }

    const recovery = definition.recovery;
    if (recovery.type === "ACTION" || recovery.type === "HIT") {
        assertNonnegativeSafeInteger(recovery.amount, "skill SP recovery amount");
    }
}

export function initialize(definition: Definition, tick = 0): State {
    const recoverySpeed = attribute.initialize(definition.recoverySpeed);
    const recoveryMultiplier = attribute.initialize(definition.recoveryMultiplier);
    const rate =
        attribute.resolve(definition.recoverySpeed, recoverySpeed) *
        attribute.resolve(definition.recoveryMultiplier, recoveryMultiplier);
    const periodTicks = rate > 0 ? TICKS_PER_SECOND / rate : null;

    return {
        value: definition.initial,
        recovery:
            definition.recovery.type === "TIME" && periodTicks !== null
                ? { periodTicks, remainingTicks: periodTicks }
                : null,
        lastTick: tick,
        recoverySpeed,
        recoveryMultiplier,
    };
}

export function resolveRecoverySpeed(battle: BattleState, self: WithSp): number {
    return resolve(battle, self, "recoverySpeed");
}

export function resolveRecoveryMultiplier(battle: BattleState, self: WithSp): number {
    return resolve(battle, self, "recoveryMultiplier");
}

export function recover(
    battle: BattleState,
    ref: Ref<Unit & Skill>,
    source: Source,
    amount?: number,
): Result<Outcome> {
    if (amount !== undefined) {
        assertNonnegativeSafeInteger(amount, "skill SP recovery amount");
    }

    const self = units.get(battle, ref);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!available(self)) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!hasSp(self)) {
        return rejected(battle, "NO_SP");
    }

    const state = self.skill.sp;
    const definition = self.skill.definition.sp;
    if (source !== "EXTERNAL" && definition.recovery.type !== source) {
        return rejected(battle, "WRONG_SOURCE");
    }
    if (!allowsRecovery(battle, self, source)) {
        return rejected(battle, "RULE");
    }

    const requested =
        amount ??
        ((source === "ACTION" || source === "HIT") && definition.recovery.type === source
            ? definition.recovery.amount
            : 1);
    const capacity = definition.capacity;
    const gained = Math.min(requested, Math.max(0, capacity - state.value));
    if (gained === 0 && requested !== 0) {
        return rejected(battle, "FULL");
    }
    if (gained === 0) {
        return applied(battle, 0);
    }

    const event: Recovered = {
        source,
        amount: gained,
        previous: state.value,
        current: state.value + gained,
    };
    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, sp: { ...state, value: event.current } },
        },
    ]);

    return applied(dispatch(battle, units.ref(self), spRecovered, event), gained);
}

export function pay(battle: BattleState, ref: Ref<Unit & Skill>, amount: number): Result<Outcome> {
    assertNonnegativeSafeInteger(amount, "skill SP payment amount");

    const self = units.get(battle, ref);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!available(self)) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!hasSp(self)) {
        return rejected(battle, "NO_SP");
    }

    const state = self.skill.sp;
    if (state.value < amount) {
        return rejected(battle, "INSUFFICIENT_SP");
    }

    const event: Paid = {
        amount,
        previous: state.value,
        current: state.value - amount,
    };
    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, sp: { ...state, value: event.current } },
        },
    ]);

    return applied(dispatch(battle, units.ref(self), spPaid, event), amount);
}

export function modify(
    battle: BattleState,
    ref: Ref<Unit & Skill>,
    delta: number,
    forced = false,
): Result<Outcome> {
    assertSafeInteger(delta, "skill SP modification");

    const self = units.get(battle, ref);
    if (self === undefined) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!available(self)) {
        return rejected(battle, "UNAVAILABLE");
    }

    if (!hasSp(self)) {
        return rejected(battle, "NO_SP");
    }

    const state = self.skill.sp;
    const definition = self.skill.definition.sp;
    if (delta > 0 && !forced && !allowsRecovery(battle, self, "EXTERNAL")) {
        return rejected(battle, "RULE");
    }

    const current = Math.min(definition.capacity, Math.max(0, state.value + delta));
    const amount = current - state.value;
    if (amount === 0) {
        return applied(battle, 0);
    }

    const event: Modified = { delta, amount, forced, previous: state.value, current };
    battle = replaceUnits(battle, [
        {
            ...self,
            skill: { ...self.skill, sp: { ...state, value: current } },
        },
    ]);

    return applied(dispatch(battle, units.ref(self), spModified, event), amount);
}

export function advance(battle: BattleState, ref: Ref<Unit & Skill>): BattleState {
    const self = units.get(battle, ref);
    if (self === undefined) {
        return battle;
    }
    if (self.lifecycle !== "PRESENT" || !hasSp(self)) {
        return battle;
    }

    const state = self.skill.sp;
    const definition = self.skill.definition.sp;
    if (definition.recovery.type !== "TIME") {
        return battle;
    }

    if (battle.tick < state.lastTick) {
        throw new RangeError("skill SP cannot advance to an earlier tick");
    }

    const rate = resolveRecoverySpeed(battle, self) * resolveRecoveryMultiplier(battle, self);
    let recovery: Timer | null = null;
    let pulses = 0;

    if (rate > 0) {
        const periodTicks = TICKS_PER_SECOND / rate;
        const previous = state.recovery;
        let remainingTicks =
            previous === null
                ? periodTicks
                : Math.max(0, periodTicks - (previous.periodTicks - previous.remainingTicks));

        const capacity = definition.capacity;
        if (
            previous !== null &&
            available(self) &&
            state.value < capacity &&
            allowsRecovery(battle, self, "TIME")
        ) {
            remainingTicks -= battle.tick - state.lastTick;

            if (remainingTicks <= 1e-8) {
                const available = Math.floor((-remainingTicks + 1e-8) / periodTicks) + 1;
                const capacityRemaining = capacity - state.value;
                pulses = Math.min(available, capacityRemaining);
                remainingTicks =
                    pulses === capacityRemaining
                        ? periodTicks
                        : Math.max(0, remainingTicks + pulses * periodTicks);
            }
        }

        recovery = { periodTicks, remainingTicks };
    }

    const next = { ...state, recovery, lastTick: battle.tick };
    battle = replaceUnits(battle, [{ ...self, skill: { ...self.skill, sp: next } }]);

    return pulses === 0 ? battle : recover(battle, ref, "TIME", pulses).state;
}

function resolve(battle: BattleState, self: WithSp, key: Parameter): number {
    return attribute.resolve(self.skill.definition.sp[key], self.skill.sp[key], battle, self);
}

function allowsRecovery(battle: BattleState, self: Unit & Skill, source: Source): boolean {
    return allows(battle, { self, source }, self.skill.recoveryRestrictions);
}

function available(self: Unit): boolean {
    return self.lifecycle === "PRESENT" && (!hasVitality(self) || isAlive(self));
}
function applied(state: BattleState, amount: number): Result<Outcome> {
    return { state, value: { type: "APPLIED", amount } };
}
function rejected(
    state: BattleState,
    reason: Extract<Outcome, { readonly type: "REJECTED" }>["reason"],
): Result<Outcome> {
    return { state, value: { type: "REJECTED", reason } };
}

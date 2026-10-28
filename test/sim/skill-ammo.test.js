import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit } from "../helpers/unit.js";
import * as skills from "../../dist/core/unit/skill/operations.js";
import * as ammo from "../../dist/core/unit/skill/ammo.js";
import * as query from "../../dist/core/unit/skill/index.js";
import { setAmmoContribution, removeAmmoContribution } from "../../dist/core/unit/capability/skill/capability.js";
import { fixture, at, setSkill, currentRef } from "../helpers/skill.js";

function loaded(amount = 3, overrides = {}) {
    const f = fixture({ sp: null, activation: {
        trigger: "MANUAL", sustain: { type: "AMMO", amount }, initialize: () => ({}), ...overrides,
    } });
    const started = skills.activate(f.state, f.skillRef);
    return { ...f, state: started.state, activation: started.value.ref };
}
const remaining = (battle) => getUnit(battle, 1).skill.activation.sustain.remaining;
const observe = (id, invoke) => ({ id, invoke });

test("ammunition spending preserves input versions and consumes the full requested amount", () => {
    const f = loaded(3);
    const first = ammo.consume(f.state, f.activation, 2);
    assert.equal(first.value.amount, 2);
    assert.equal(remaining(first.state), 1);
    assert.equal(remaining(f.state), 3);
    const final = ammo.consume(first.state, f.activation, 2);
    assert.equal(final.value.amount, 2);
    assert.equal(remaining(final.state), -1);
    assert.equal(query.getActivation(final.state, f.activation).activation.status, "ACTIVE");
    assert.throws(() => ammo.consume(first.state, f.activation, 0), /positive.*integer/);
    assert.throws(() => ammo.consume(first.state, f.activation, 0.5), /integer/);
});

test("ammunition depletion does not end an activation until an explicit check", () => {
    const f = loaded(1);
    let state = ammo.consume(f.state, f.activation, 3).state;
    assert.equal(remaining(state), -2);
    assert.equal(state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 0);
    state = skills.advance(at(state, 10000), f.ref);
    assert.equal(remaining(state), -2);
    state = ammo.check(state, f.activation);
    assert.equal(getUnit(state, 1).skill.activation, null);
    assert.equal(state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
    assert.equal(ammo.check(state, f.activation), state);
});

test("an ammunition skill remains active indefinitely when no content consumes or checks ammunition", () => {
    const f = loaded(31);
    const state = skills.advance(at(f.state, 10000), f.ref);
    assert.equal(remaining(state), 31);
    assert.deepEqual(query.getActivation(state, f.activation).activation.sustain, { type: "AMMO", initial: 31, remaining: 31, replenished: 0 });
});

test("ordinary replenishment tracks a cumulative allowance independently of current ammunition", () => {
    const reports = [];
    const f = loaded(3);
    const currentSkill = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill, ammoReplenished: [observe("allowance", (battle, { event }) => {
        reports.push(event);
        return { state: battle, value: undefined };
    })] });
    state = ammo.consume(state, f.activation, 3).state;
    state = ammo.replenish(state, f.activation, 2).state;
    assert.deepEqual(query.getActivation(state, f.activation).activation.sustain, { type: "AMMO", initial: 3, remaining: 2, replenished: 2 });
    state = ammo.consume(state, f.activation, 2).state;
    const limited = ammo.replenish(state, f.activation, 5);
    assert.equal(limited.value.amount, 1);
    assert.equal(remaining(limited.state), 1);
    assert.equal(query.getActivation(limited.state, f.activation).activation.sustain.replenished, 3);
    assert.deepEqual(reports[1], {
        ref: f.activation, requested: 5, amount: 1,
        previous: { type: "AMMO", initial: 3, remaining: 0, replenished: 2 },
        current: { type: "AMMO", initial: 3, remaining: 1, replenished: 3 },
    });
    state = ammo.consume(limited.state, f.activation, 1).state;
    assert.equal(ammo.replenish(state, f.activation, 1).state, state);
    assert.equal(reports.length, 2, "an exhausted allowance does not report ammunition replenished");
});

test("replenishment reports requested and actual quantities when current capacity truncates it", () => {
    const reports = [];
    const f = loaded(5);
    const currentSkill2 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill2, ammoReplenished: [observe("capacity", (battle, { event }) => {
        reports.push(event);
        return { state: battle, value: undefined };
    })] });
    state = ammo.consume(state, f.activation, 2).state;
    const replenished = ammo.replenish(state, f.activation, 10);
    assert.equal(replenished.value.amount, 2);
    assert.deepEqual(reports, [{
        ref: f.activation, requested: 10, amount: 2,
        previous: { type: "AMMO", initial: 5, remaining: 3, replenished: 0 },
        current: { type: "AMMO", initial: 5, remaining: 5, replenished: 2 },
    }]);
    assert.equal(remaining(state), 3);
    const full = ammo.replenish(replenished.state, f.activation, 4);
    assert.equal(full.value.amount, 0);
    assert.equal(full.state, replenished.state);
    assert.equal(reports.length, 1, "full ammunition does not report a replenishment");
});

test("content ammunition grants respect current capacity without consuming ordinary replenishment allowance", () => {
    const reports = [];
    const f = loaded(3);
    const currentSkill3 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill3, ammoReplenished: [observe("ordinary", (battle, { event }) => {
        reports.push(event);
        return { state: battle, value: undefined };
    })] });
    state = ammo.consume(state, f.activation, 2).state;
    const grant = ammo.grant(state, f.activation, 5);
    assert.equal(grant.value.amount, 2);
    state = grant.state;
    assert.equal(remaining(state), 3);
    assert.equal(query.getActivation(state, f.activation).activation.sustain.replenished, 0);
    assert.deepEqual(reports, []);
    state = ammo.consume(state, f.activation, 3).state;
    state = ammo.replenish(state, f.activation, 3).state;
    assert.equal(remaining(state), 3);
    assert.equal(query.getActivation(state, f.activation).activation.sustain.replenished, 3);
    assert.equal(reports.length, 1);
    assert.equal(reports[0].requested, 3);
    state = ammo.consume(state, f.activation, 3).state;
    state = ammo.grant(state, f.activation, 2).state;
    assert.equal(remaining(state), 2);
    assert.equal(query.getActivation(state, f.activation).activation.sustain.replenished, 3);
    assert.equal(reports.length, 1, "a grant after ordinary allowance exhaustion is still a distinct operation");
});

test("ammunition capacity contributions are sampled for each new activation", () => {
    const f = loaded(3);
    const currentSkill4 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, setAmmoContribution(currentSkill4, {
        id: "bonus", value: { addition: 2, ratio: 0 },
    }));
    assert.equal(remaining(state), 3);
    assert.equal(query.getActivation(state, f.activation).activation.sustain.initial, 3);
    state = skills.finish(state, f.activation);
    state = skills.activate(state, f.skillRef).state;
    assert.equal(remaining(state), 5);
    assert.equal(query.getActivation(state, currentRef(state)).activation.sustain.initial, 5);
});

test("ammunition capacity adds fixed counts after rounding only the original proportional bonus", () => {
    assert.equal(ammo.resolveCapacity(10, [
        { addition: 2, ratio: 0 },
        { addition: 0, ratio: 0.5 },
    ]), 17);
    assert.equal(ammo.resolveCapacity(10, [
        { addition: 0, ratio: 0.15 },
        { addition: 0, ratio: 0.1 },
    ]), 12);
    assert.equal(ammo.resolveCapacity(10, [{ addition: 0, ratio: 0.35 }]), 14);
    assert.equal(ammo.resolveCapacity(10, [{ addition: 0, ratio: -0.25 }]), 8);
    assert.equal(ammo.resolveCapacity(10, [{ addition: 0, ratio: -0.35 }]), 6);
    assert.equal(ammo.resolveCapacity(10, [{ addition: -20, ratio: 0 }]), 1);
    assert.equal(ammo.resolveCapacity(0, []), 1);
});

test("ammunition modifiers resolve live inputs and exclusive sources only when the next activation starts", () => {
    const f = loaded(10);
    const weak = { id: "weak", group: { id: "capacity", priority: 1 },
        value: { addition: 0, ratio: 0.2 } };
    const strong = { id: "strong", group: { id: "capacity", priority: 2 },
        value: (battle) => ({ addition: battle.tick, ratio: 0.5 }) };
    const currentSkill5 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, setAmmoContribution(setAmmoContribution(currentSkill5, weak), strong));
    state = at(state, 2);
    assert.equal(remaining(state), 10);
    state = skills.activate(skills.finish(state, f.activation), f.skillRef).state;
    assert.equal(remaining(state), 17);
    const current = currentRef(state);
    const currentSkill6 = getUnit(state, 1).skill;
    state = setSkill(state, removeAmmoContribution(currentSkill6, "strong"));
    assert.equal(remaining(state), 17);
    state = skills.activate(skills.finish(state, current), f.skillRef).state;
    assert.equal(remaining(state), 12);
    const before = getUnit(state, 1).skill;
    assert.equal(removeAmmoContribution(before, "missing"), before);
    assert.equal(setAmmoContribution(before, weak), before);
});

test("consumption Hooks report the complete consumed amount and settled negative remainder", () => {
    const seen = [];
    const f = loaded(1);
    const currentSkill7 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill7, ammoConsumed: [observe("consumer", (battle, { event }) => {
        seen.push(event);
        return { state: battle, value: undefined };
    })] });
    state = ammo.consume(state, f.activation, 3).state;
    assert.equal(seen.length, 1);
    assert.deepEqual(seen[0].ref, f.activation);
    assert.equal(seen[0].amount, 3);
    assert.equal(seen[0].previous.remaining, 1);
    assert.equal(seen[0].current.remaining, -2);
    state = skills.finish(state, f.activation);
    assert.equal(seen.length, 1);
});

test("nested replenishment produces its own report and a later depletion check reads latest ammunition", () => {
    const seen = [];
    const f = loaded(1);
    const currentSkill8 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill8,
        ammoConsumed: [
            observe("refill", (battle, { event }) => {
                seen.push(["consume", event.previous.remaining, event.current.remaining]);
                return { state: ammo.replenish(battle, event.ref, 1).state, value: undefined };
            }),
            observe("after", (battle, { event }) => {
                seen.push(["after", event.previous.remaining, event.current.remaining, remaining(battle)]);
                return { state: battle, value: undefined };
            }),
        ],
        ammoReplenished: [observe("replenished", (battle, { event }) => {
            seen.push(["replenish", event.amount, event.previous.remaining, event.current.remaining]);
            return { state: battle, value: undefined };
        })],
    });
    state = ammo.consume(state, f.activation, 1).state;
    assert.deepEqual(seen, [["consume", 1, 0], ["replenish", 1, 0, 1], ["after", 1, 0, 1]]);
    state = ammo.check(state, f.activation);
    assert.equal(query.getActivation(state, f.activation).activation.status, "ACTIVE");
});

test("nested replenishment retains each settled request and snapshot for later outer observers", () => {
    const entered = [];
    const observed = [];
    const f = loaded(5);
    const currentSkill9 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill9, ammoReplenished: [
        observe("nested", (battle, { event }) => {
            entered.push(event);
            if (event.requested !== 10) return { state: battle, value: undefined };
            battle = ammo.consume(battle, event.ref, 3).state;
            return { state: ammo.replenish(battle, event.ref, 8).state, value: undefined };
        }),
        observe("after", (battle, { event }) => {
            observed.push({ event, remaining: remaining(battle) });
            return { state: battle, value: undefined };
        }),
    ] });
    state = ammo.consume(state, f.activation, 4).state;
    state = ammo.replenish(state, f.activation, 10).state;
    assert.deepEqual(entered, [{
        ref: f.activation, requested: 10, amount: 4,
        previous: { type: "AMMO", initial: 5, remaining: 1, replenished: 0 },
        current: { type: "AMMO", initial: 5, remaining: 5, replenished: 4 },
    }, {
        ref: f.activation, requested: 8, amount: 1,
        previous: { type: "AMMO", initial: 5, remaining: 2, replenished: 4 },
        current: { type: "AMMO", initial: 5, remaining: 3, replenished: 5 },
    }]);
    assert.equal(observed[0].event, entered[1]);
    assert.equal(observed[1].event, entered[0]);
    assert.deepEqual(observed.map(({ remaining }) => remaining), [3, 3]);
    assert.equal(remaining(state), 3);
});

test("old activation references cannot consume or replenish a newly started activation", () => {
    const f = loaded(3);
    let state = skills.finish(f.state, f.activation);
    const started = skills.activate(state, f.skillRef);
    state = started.state;
    assert.equal(started.value.ref.id, f.activation.id + 1);
    assert.equal(query.getActivation(state, f.activation), undefined);
    assert.equal(ammo.consume(state, f.activation, 1).state, state);
    assert.equal(ammo.replenish(state, f.activation, 1).state, state);
    assert.equal(ammo.check(state, f.activation), state);
    assert.equal(remaining(state), 3);
});

test("consumption remains settled when its Hook ends the observed activation", () => {
    let report;
    const f = loaded(1);
    const currentSkill10 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill10, ammoConsumed: [observe("end", (battle, { event }) => {
        report = event;
        return { state: skills.finish(battle, event.ref), value: undefined };
    })] });
    const consumed = ammo.consume(state, f.activation, 3);
    assert.equal(consumed.value.amount, 3);
    assert.equal(report.current.remaining, -2);
    assert.equal(getUnit(consumed.state, 1).skill.activation, null);
    assert.equal(consumed.state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
});

test("a consumption Hook can replace its activation without a later check ending the replacement", () => {
    const f = loaded(3);
    const currentSkill11 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill11, ammoConsumed: [observe("restart", (battle, { event }) => {
        battle = skills.finish(battle, event.ref);
        return { state: skills.activate(battle, f.skillRef).state, value: undefined };
    })] });
    state = ammo.consume(state, f.activation, 3).state;
    assert.equal(getUnit(state, 1).skill.activation.id, 1);
    assert.equal(remaining(state), 3);
    assert.equal(ammo.check(state, f.activation), state);
});

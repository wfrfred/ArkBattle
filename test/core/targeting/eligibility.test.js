// Contract: [targeting](../../../docs/architecture/targeting.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../../dist/core/hook.js";
import { topK } from "../../../dist/core/common/collection/order.js";
import { battle, get } from "../../helpers/battle.js";
import { step } from "../../../dist/core/battle/runtime.js";
import { update } from "../../../dist/core/unit/operations.js";
import * as units from "../../../dist/core/unit/query.js";
import * as targeting from "../../../dist/core/battle/targeting/index.js";
import * as targetable from "../../../dist/core/unit/capability/targetable/capability.js";
import * as vitality from "../../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../../dist/core/unit/capability/elemental/index.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as epDamage from "../../../dist/core/battle/resource/ep/damage/index.js";
import * as effects from "../../../dist/core/unit/effect/index.js";
import { hasLayer, setType } from "../../../dist/core/unit/capability/layer/index.js";
import { disappear } from "../../../dist/core/unit/capability/presence/index.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";
import { healFree } from "../../../dist/core/effects/protection.js";
import { create as createElementalDefinition } from "../../../dist/content/elemental.js";

const living = {
    id: "target", hooks: Hooks.empty(),
    targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] },
    vitality: defineVitality(100),
    classification: { type: "DEVICE", side: "ENEMY", filterTags: [], groupTags: [] }, layer: { type: "GROUND" },
};
const ids = candidates => Array.from(candidates, target => target.ref.id);
const candidates = state => units.all(state).filter(targetable.hasTargetable);
function wound(state, target, power) {
    const request = {
        source: null, target,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power, multiplier: 1, addition: 0 } },
    };
    return hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request)).state;
}
function injure(state, target, power) {
    const request = { source: null, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power } };
    return epDamage.applyDamage(request, epDamage.calculateDamage(state, request));
}

test("standard HP eligibility is independent of the chosen range origin and uses current spatial facts", () => {
    const hitbox = { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.7 } };
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] } }, position: [0, 0] },
        { definition: { ...living, hitbox }, position: [2.6, 1] },
        { definition: { ...living, hitbox }, position: [2.6, 1] },
        { definition: { ...living, presence: {} }, position: [2.6, 1] },
        { definition: { ...living, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] }, hitbox }, position: [1, 1] },
    ]);
    state = update(state, units.ref(get(state, 2)), setType("AIR"));
    const source = get(state, 0);
    const within = targeting.inRange([1, 1], [{ type: "CIRCLE", offset: [0, 0], radius: 1 }]);
    const damageFilter = targeting.damage(source);
    const eligible = state => candidates(state).filter(damageFilter(state));

    assert.deepEqual(ids(eligible(state)), [1, 2, 3]);
    assert.deepEqual(ids(eligible(state).filter(within)), [1, 2]);
    assert.deepEqual(ids(eligible(state).filter(within)
        .filter(target => hasLayer(target) && target.layer.type === "GROUND")), [1]);
    state = update(state, units.ref(get(state, 1)), targetable.setCategory("OBSTACLE"));
    const inRange = eligible(state).filter(within);
    assert.deepEqual(ids(inRange.filter(targeting.inCategories(["DEFAULT"]))), [2]);
    assert.deepEqual(ids(inRange.filter(targeting.inCategories(["OBSTACLE"]))), [1]);
    state = update(state, units.ref(get(state, 3)), disappear());
    assert.deepEqual(ids(eligible(state)), [1, 2]);
    assert.equal(targetable.allowsRestrictions(state, source)(get(state, 3)), true);
});

test("a stored damage filter evaluates restrictions with the supplied battle state", () => {
    const initial = battle([
        { definition: { id: "source", hooks: Hooks.empty(), classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] } }, position: [0, 0] },
        { definition: living, position: [1, 0] },
    ]);
    const enabledAt = initial.tick + 1;
    const launched = update(initial, units.ref(get(initial, 1)), targetable.setRestriction({
        id: "delayed-selection", value: { allows: state => state.tick >= enabledAt },
    }));
    const eligible = targeting.damage(get(launched, 0));
    const impact = step(launched, []);

    assert.deepEqual(ids(candidates(launched).filter(eligible(launched))), []);
    assert.deepEqual(ids(candidates(impact).filter(eligible(impact))), [1]);
});

test("mixed healing keeps HP or EP demand while only an ACTIVE healFree marker restricts HP selection", () => {
    const patient = {
        ...living, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
        elemental: createElementalDefinition({ receiver: "ENEMY" }),
    };
    let state = battle([
        ...[0, 1, 2, 3].map(x => ({ definition: patient, position: [x, 1] })),
        { definition: { ...patient, vitality: { ...patient.vitality, maxHp: defineAttribute(10000, 1) } }, position: [4, 1] },
    ]);
    const enlarged = units.ref(get(state, 1));
    state = update(state, enlarged, vitality.setMaxHpContribution({
        id: "larger-hp", value: [modifier({ finalAddition: 300 })],
    }));
    state = wound(state, enlarged, 300);
    state = injure(state, units.ref(get(state, 2)), 200).state;
    state = injure(state, units.ref(get(state, 4)), 1000).state;
    state = update(state, enlarged, elemental.setRestriction("healingRestrictions", {
        id: "no-ep-healing", value: { allows: () => false },
    }));
    const source = get(state, 0);
    const healing = targeting.healing(source);
    const elementHealing = targeting.elementHealing(source);
    const hpRecipients = state => candidates(state).filter(healing(state));
    const epRecipients = state => candidates(state).filter(elementHealing(state));
    const recipients = state => {
        const hp = healing(state);
        const ep = elementHealing(state);
        return candidates(state).filter(target => hp(target) || ep(target));
    };

    assert.ok(get(state, 4).elemental.burst);
    assert.equal(vitality.hpRatio(get(state, 1)), 0.25);
    assert.deepEqual(ids(topK(hpRecipients(state), 3, targeting.hpRatio)), [1, 4]);
    assert.deepEqual(ids(recipients(state)), [1, 2, 4]);

    const patientRef = units.ref(get(state, 2));
    state = wound(state, patientRef, 50);
    const marker = effects.install(state, patientRef, healFree, { enabled: false });
    state = marker.state;
    assert.deepEqual(ids(hpRecipients(state)), [1, 2, 4]);
    state = effects.setEnabled(state, marker.value, true);
    assert.deepEqual(ids(hpRecipients(state)), [1, 4]);
    assert.deepEqual(ids(epRecipients(state)), [2]);
    assert.deepEqual(ids(recipients(state)), [1, 2, 4]);
});

test("EP selection checks current resource eligibility without executing reception Restrictions", () => {
    const receiver = {
        id: "ep-receiver", hooks: Hooks.empty(), targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] },
        classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
        elemental: createElementalDefinition({ receiver: "ENEMY" }),
    };
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), classification: { type: "DEVICE", side: "ENEMY", filterTags: [], groupTags: [] } }, position: [0, 0] },
        { definition: receiver, position: [1, 0] },
        { definition: { ...receiver, classification: { type: "DEVICE", side: "NEUTRAL", filterTags: [], groupTags: [] } }, position: [2, 0] },
    ]);
    const target = units.ref(get(state, 1));
    let damageChecks = 0;
    let healingChecks = 0;
    state = update(state, target, elemental.setRestriction("damageRestrictions", {
        id: "receive-damage", value: { allows() { damageChecks++; return false; } },
    }));
    state = update(state, target, elemental.setRestriction("healingRestrictions", {
        id: "receive-healing", value: { allows() { healingChecks++; return false; } },
    }));
    const damageCandidates = state => candidates(state).filter(targeting.elementDamage(get(state, 0))(state));
    const healingCandidates = state => candidates(state).filter(targeting.elementHealing(get(state, 1))(state));

    assert.deepEqual(ids(damageCandidates(state)), [1]);
    assert.deepEqual(ids(healingCandidates(state)), []);
    assert.equal(damageChecks, 0);
    assert.equal(healingChecks, 0);
    assert.equal(injure(state, target, 200).value.type, "REJECTED");
    assert.ok(damageChecks > 0);
    state = update(state, target, elemental.removeRestriction("damageRestrictions", "receive-damage"));
    state = injure(state, target, 200).state;
    assert.deepEqual(ids(healingCandidates(state)), [1]);
    assert.equal(healingChecks, 0);
    state = injure(state, target, 1000).state;
    assert.ok(get(state, 1).elemental.burst);
    assert.deepEqual(ids(damageCandidates(state)), []);
    assert.deepEqual(ids(healingCandidates(state)), []);
});

import { Hooks } from "../../dist/core/hook.js";
import { battle as createBattle, get } from "../helpers/battle.js";
import { update } from "../../dist/core/battle/unit.js";
import * as damage from "../../dist/core/battle/damage/hp/index.js";
import { setMaxHpContribution } from "../../dist/core/unit/capability/vitality/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { search as searchBlocking } from "../../dist/core/battle/blocking/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { hasCandidate, select } from "../../dist/core/battle/targeting/index.js";
import * as filters from "../../dist/core/battle/targeting/filter.js";
import * as selectors from "../../dist/core/battle/targeting/selector.js";
import * as compare from "../../dist/core/battle/targeting/compare.js";
import { ref } from "../../dist/core/unit/query.js";
import { setType } from "../../dist/core/unit/capability/layer/index.js";
import { disappear } from "../../dist/core/unit/capability/presence/index.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { initialize } from "../helpers/unit.js";

const unit = (id, definitions = {}) => initialize({
    id,
    position: [id, 0],
    definition: { hooks: Hooks.empty(), id: `targeting-${id}`, ...definitions },
});
const target = (id, definitions = {}) => unit(id, {
    targetable: { restrictions: [] }, ...definitions,
});
const battle = (...units) => createBattleState(fixtureBattlefieldState(units));
const request = (source, options = {}) => ({
    source: ref(source),
    purposes: [],
    filter: () => true,
    selector: selectors.first(100, () => 0),
    ...options,
});

test("select enumerates Targetable and performs only the request's explicit filter", () => {
    const source = target(9);
    const ordinary = target(2);
    const configured = target(7, {
        targetable: { restrictions: [{
            id: "always-refuse", value: { kind: Symbol("untargetable"), allows: () => false },
        }] },
    });
    const initial = battle(source, unit(4), ordinary, configured);
    const selected = select(initial, request(source));

    assert.deepEqual(selected.value, [{ id: 9 }, { id: 2 }, { id: 7 }]);
    assert.deepEqual(select(initial, request(source, {
        filter: (_battle, _request, candidate) => candidate.id === 7,
    })).value, [{ id: 7 }]);
});

test("hasCandidate checks eligibility without performing target selection", () => {
    const source = unit(0);
    const initial = battle(source, target(3), target(4), target(5));
    const query = request(source, {
        filter(_battle, _request, candidate) {
            return candidate.id === 4;
        },
        selector() {
            assert.fail("a candidate query must not invoke the selector");
        },
    });

    assert.equal(hasCandidate(initial, query), true);
    assert.equal(hasCandidate(initial, request(source, { filter: () => false })), false);
});

test("first keeps stable ties and honors the requested comparator", () => {
    const source = unit(0);
    const initial = battle(source, target(8), target(2), target(5));
    const query = request(source, {
        selector: selectors.first(2, compare.combine(() => 0, () => 0)),
    });

    assert.deepEqual(select(initial, query).value, [{ id: 8 }, { id: 2 }]);
    assert.deepEqual(select(initial, request(source, {
        selector: selectors.first(2, compare.distance),
    })).value, [{ id: 2 }, { id: 5 }]);
});

test("random selection is deterministic, samples without replacement, and advances RNG only for a draw", () => {
    const source = unit(0);
    const initial = battle(source, target(8), target(2), target(5));
    const seeded = { ...initial, execution: { ...initial.execution, rngState: 37 } };
    const query = request(source, { selector: selectors.random(2) });
    const selected = select(seeded, query);
    const ids = selected.value.map(value => value.id);

    assert.equal(new Set(ids).size, 2);
    assert.ok(ids.every(id => [8, 2, 5].includes(id)));
    assert.notEqual(selected.state.execution.rngState, seeded.execution.rngState);
    assert.deepEqual(select(seeded, query), selected);
    assert.deepEqual(select(seeded, request(source, {
        selector: selectors.random(10),
    })).value.map(value => value.id).sort(), [2, 5, 8]);
    assert.equal(select(seeded, request(source, {
        selector: selectors.random(0),
    })).state.execution.rngState, seeded.execution.rngState);
    assert.deepEqual(select(battle(source), query).value, []);
});

test("blocked targets outrank nearer candidates and remain selectable outside ordinary range", () => {
    const living = {
        id: "target", hooks: Hooks.empty(), targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
        allegiance: { side: "ENEMY" }, layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.01 } },
    };
    let state = createBattle([
        { definition: {
            id: "blocker", hooks: Hooks.empty(), allegiance: { side: "ALLY" },
            blocker: { layer: "GROUND", rules: [], capacity: 2, radius: 1 },
        }, position: [2, 1] },
        { definition: living, position: [1.95, 1] },
        { definition: { ...living, blockable: { volume: 1, rules: [] } }, position: [2.5, 1] },
        { definition: { ...living, blockable: { volume: 1, rules: [] } }, position: [2.25, 1] },
    ]);
    const source = ref(get(state, 0));
    state = searchBlocking(state, source);
    const nearby = filters.range([{ type: "CIRCLE", offset: [0, 0], radius: 0.1 }]);
    const query = {
        source, purposes: ["DAMAGE"],
        filter: filters.and(filters.damage, nearby),
        selector: selectors.first(1, compare.distance),
    };
    assert.deepEqual(select(state, query).value.map(target => target.id), [1]);
    assert.deepEqual(select(state, {
        ...query,
        filter: filters.and(filters.damage, filters.or(nearby, filters.blocking)),
        selector: selectors.first(1, compare.combine(compare.blockedFirst, compare.distance)),
    }).value.map(target => target.id), [3]);
});

test("explicit geometry uses hitboxes while ground eligibility reads current layer", () => {
    const living = {
        id: "target", hooks: Hooks.empty(), targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" },
    };
    const hitbox = { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.7 } };
    let state = createBattle([
        { definition: { id: "source", hooks: Hooks.empty(), allegiance: { side: "ALLY" } }, position: [1, 1] },
        { definition: { ...living, hitbox }, position: [2.6, 1] },
        { definition: { ...living, hitbox }, position: [2.6, 1] },
        { definition: { ...living, spatialPresence: {} }, position: [2.6, 1] },
    ]);
    state = update(state, ref(get(state, 2)), setType("AIR"));
    const source = ref(get(state, 0));
    const inRange = filters.and(filters.damage, filters.range([{ type: "CIRCLE", offset: [0, 0], radius: 1 }]));
    const query = { source, purposes: ["DAMAGE"], filter: inRange, selector: selectors.first(3, compare.distance) };
    assert.deepEqual(select(state, { ...query, filter: filters.damage }).value.map(target => target.id), [1, 2, 3]);
    assert.deepEqual(select(state, query).value.map(target => target.id), [1, 2]);
    assert.deepEqual(select(state, { ...query, filter: filters.and(inRange, filters.ground) }).value.map(target => target.id), [1]);
    state = update(state, ref(get(state, 3)), disappear());
    assert.deepEqual(select(state, { ...query, filter: filters.damage }).value.map(target => target.id), [1, 2]);
});

test("healing eligibility and priority use effective MaxHP after real resource changes", () => {
    const patient = {
        id: "patient", hooks: Hooks.empty(), targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: "ALLY" },
    };
    let state = createBattle([
        { definition: patient, position: [1, 1] },
        { definition: patient, position: [2, 1] },
        { definition: patient, position: [3, 1] },
    ]);
    const source = ref(get(state, 0));
    const enlarged = ref(get(state, 1));
    state = update(state, enlarged, setMaxHpContribution({
        id: "larger-hp", value: [modifier({ finalAddition: 300 })],
    }));
    for (const [id, amount] of [[1, 300], [2, 60]]) {
        const request = { source: null, target: ref(get(state, id)), parameters: { type: "TRUE", attack: { power: amount, multiplier: 1, addition: 0 } } };
        state = damage.applyDamage(request, damage.calculateDamage(state, request)).state;
    }
    assert.equal(get(state, 1).vitality.hp, 100);
    assert.equal(get(state, 2).vitality.hp, 40);
    assert.deepEqual(select(state, {
        source, purposes: ["HEAL"], filter: filters.healing,
        selector: selectors.first(3, compare.hpRatio),
    }).value.map(target => target.id), [1, 2]);
});

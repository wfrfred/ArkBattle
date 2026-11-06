import { Hooks } from "../../dist/core/hook.js";
import { battle as createBattle, get } from "../helpers/battle.js";
import { update } from "../../dist/core/battle/unit.js";
import * as damage from "../../dist/core/battle/damage/hp/index.js";
import { setMaxHpContribution } from "../../dist/core/unit/capability/vitality/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { createInput, normalize } from "../../dist/core/battle/creation/route.js";
import { search as searchBlocking } from "../../dist/core/battle/blocking/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRng } from "../../dist/core/common/rng.js";
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

    assert.strictEqual(selected.state, initial);
    assert.deepEqual(selected.value, [{ id: 9 }, { id: 2 }, { id: 7 }]);
    assert.deepEqual(select(initial, request(source, {
        filter: (_battle, _request, candidate) => candidate.id === 7,
    })).value, [{ id: 7 }]);
});

test("filter and selector receive the same request, battle and filtered Unit snapshots", () => {
    const source = unit(0);
    const first = target(6);
    const second = target(3);
    const initial = battle(source, first, second);
    const seen = [];
    const query = request(source, {
        filter(current, input, candidate) {
            assert.strictEqual(current, initial);
            assert.strictEqual(input, query);
            seen.push(candidate);
            return candidate.id === 3;
        },
        selector(current, input, candidates) {
            assert.strictEqual(current, initial);
            assert.strictEqual(input, query);
            assert.deepEqual(candidates, [second]);
            assert.strictEqual(candidates[0], second);
            return { state: current, value: candidates.map(ref) };
        },
    });

    assert.deepEqual(select(initial, query).value, [{ id: 3 }]);
    assert.deepEqual(seen, [first, second]);
});

test("select still delegates an empty candidate collection to the selector", () => {
    const source = unit(0);
    const initial = battle(source);
    let calls = 0;
    const query = request(source, {
        selector(current, input, candidates) {
            calls++;
            assert.strictEqual(input, query);
            assert.deepEqual(candidates, []);
            return { state: current, value: [] };
        },
    });

    assert.deepEqual(select(initial, query), { state: initial, value: [] });
    assert.equal(calls, 1);
});

test("hasCandidate short-circuits explicit eligibility without invoking the selector or drawing RNG", () => {
    const source = unit(0);
    const initial = battle(source, target(3), target(4), target(5));
    const visited = [];
    const query = request(source, {
        filter(_battle, _request, candidate) {
            visited.push(candidate.id);
            return candidate.id === 4;
        },
        selector() {
            assert.fail("a candidate query must not invoke the selector");
        },
    });

    assert.equal(hasCandidate(initial, query), true);
    assert.deepEqual(visited, [3, 4]);
    assert.equal(initial.execution.rngState, 0);
    assert.equal(hasCandidate(initial, request(source, { filter: () => false })), false);
    assert.equal(hasCandidate(battle(source), query), false);
});

test("having an eligible candidate does not guarantee the selector returns a target", () => {
    const source = unit(0);
    const initial = battle(source, target(2));
    const query = request(source, { selector: selectors.random(0) });

    assert.equal(hasCandidate(initial, query), true);
    assert.deepEqual(select(initial, query).value, []);
    assert.strictEqual(select(initial, query).state, initial);
});

test("first performs stable multi-level sorting without consuming RNG", () => {
    const source = unit(0);
    const initial = battle(source, target(8), target(2), target(5));
    const query = request(source, {
        selector: selectors.first(2, compare.combine(() => 0, () => 0)),
    });

    assert.deepEqual(select(initial, query).value, [{ id: 8 }, { id: 2 }]);
    assert.strictEqual(select(initial, query).state, initial);
    assert.deepEqual(select(initial, request(source, {
        selector: selectors.first(2, compare.distance),
    })).value, [{ id: 2 }, { id: 5 }]);
});

test("random samples without replacement, consumes battle RNG and preserves the input", () => {
    const source = unit(0);
    const initial = battle(source, target(8), target(2), target(5));
    const seeded = { ...initial, execution: { ...initial.execution, rngState: 37 } };
    const query = request(source, { selector: selectors.random(2) });
    const selected = select(seeded, query);
    const expectedRng = createRng(37);
    const pool = [8, 2, 5];

    for (let index = 0; index < 2; index++) {
        const chosen = index + expectedRng.int(pool.length - index);
        [pool[index], pool[chosen]] = [pool[chosen], pool[index]];
    }

    assert.deepEqual(selected.value.map(value => value.id), pool.slice(0, 2));
    assert.equal(new Set(selected.value.map(value => value.id)).size, 2);
    assert.equal(selected.state.execution.rngState, expectedRng.state());
    assert.equal(seeded.execution.rngState, 37);
    assert.strictEqual(selected.state.battlefield, seeded.battlefield);
    assert.deepEqual(select(seeded, query), selected);
    assert.notEqual(select(selected.state, query).state.execution.rngState, selected.state.execution.rngState);
});

test("random returns every candidate at most once and does not draw from an empty sample", () => {
    const source = unit(0);
    const initial = battle(source, target(4), target(5));
    const full = select(initial, request(source, { selector: selectors.random(10) }));

    assert.deepEqual(full.value.map(value => value.id).sort(), [4, 5]);
    assert.strictEqual(select(initial, request(source, { selector: selectors.random(0) })).state, initial);
    const empty = battle(source);
    assert.strictEqual(select(empty, request(source, { selector: selectors.random(2) })).state, empty);
});

test("standard filters compose eligibility and source exclusion explicitly", () => {
    const source = target(0, { allegiance: { side: "ALLY" } });
    const alive = target(1, { allegiance: { side: "ENEMY" }, vitality: { maxHp: 10, defense: 0, resistance: 0 } });
    const ally = target(2, { allegiance: { side: "ALLY" }, vitality: { maxHp: 10, defense: 0, resistance: 0 } });
    const initial = battle(source, alive, ally);

    assert.deepEqual(select(initial, request(source, {
        filter: filters.and(filters.present, filters.alive, filters.hostile, filters.notSelf),
    })).value, [{ id: 1 }]);
    assert.deepEqual(select(initial, request(source, {
        filter: filters.not(filters.or(filters.hostile, filters.notSelf)),
    })).value, [{ id: 0 }]);
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

test("explicit geometry uses hitboxes while ground eligibility reads current layer rather than route motion", () => {
    const route = pathMotionMode => normalize(createInput({
        pathMotionMode, startPosition: [1, 2], endPosition: [1, 6],
        spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], visitEveryCheckPoint: true,
    }), { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, [0, 0], true);
    const living = {
        id: "target", hooks: Hooks.empty(), targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" },
    };
    const hitbox = { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.7 } };
    let state = createBattle([
        { definition: { id: "source", hooks: Hooks.empty(), allegiance: { side: "ALLY" } }, position: [1, 1] },
        { definition: { ...living, hitbox, route: route("FLY") }, position: [2.6, 1] },
        { definition: { ...living, hitbox, route: route("WALK") }, position: [2.6, 1] },
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

import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal } from "../../dist/content/terrain/definition.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { baseUnit, fixtureBattle } from "../helpers/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
    initialize as initializeBattle,
    step as stepBattle,
} from "../../dist/core/battle/runtime.js";

import { createBattleState } from "../../dist/core/battle/state.js";
import { getUnit } from "../helpers/unit.js";
import { deploy, retreat } from "../../dist/core/battle/deployment/operations.js";
import {
    addCard,
    advance,
    changeDp,
    initialize as initializeDeployment,
} from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import * as programs from "../../dist/core/battle/deployment/normal.js";
import { remove } from "../../dist/core/battle/unit.js";
import {
    createDefinition as createDeployable,
    initialize as initializeDeployable,
} from "../helpers/deployable.js";
import { initialize as initializeUnit } from "../helpers/unit.js";
import { create as createBattlefield } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";

const tile = createTile({
    heightType: "LOWLAND",
    meleeBlockable: true,
    buildableType: "ALL",
    passableMask: "ALL",
    terrain: normal.create({}),
    walkCost: 1,
    advancedBuildableMask: 1,
});
const map = createMap(1, 8, tileEntries(Array(8).fill(tile)));

const definition = (fields = {}) => ({
    hooks: [],
    id: "operator",
    vitality: { maxHp: 100, defense: 0, resistance: 0 },
    occupancy: { slot: "OCCUPANT" },
    deployable: createDeployable({
        card: {},
        cost: 10,
        redeployTicks: 3,
        slots: 1,
        buildableType: "ALL",
    }),
    ...fields,
});
const budget = (fields = {}) => ({
    initialDp: 100,
    maxDp: 100,
    dpRecoveryTicks: null,
    slotLimit: null,
    ...fields,
});
const ordinary = (fields = {}) => ({
    stock: 1,
    stockLimit: 1,
    activeLimit: 1,
    program: programs.operator,
    ...fields,
});
const inventory = (fields = {}) => ({
    stock: 3,
    stockLimit: 3,
    activeLimit: null,
    ...fields,
});
const fixture = (inputs, fields = {}) => {
    let state = createBattleState(
        createBattlefield(map),
        undefined,
        0,
        initializeDeployment(budget(fields)),
    );
    for (const { definition, ...options } of inputs)
        state = addCard(state, definition, ordinary(options)).state;
    return state;
};
const getCard = (state, id) => cards.get(state, cards.ref({ id }));
const request = (cardId = 0, column = 0) => ({
    card: cards.ref({ id: cardId }),
    tilePosition: [0, column],
});
const at = (state, tick) => advance({ ...state, tick }, tick);
const retreatUnit = (state, id) => retreat(state, unitQueries.ref(getUnit(state, id)));
const deployUnit = (state, cardId = 0, column = 0) => {
    const result = deploy(state, request(cardId, column));
    assert.equal(result.value.type, "DEPLOYED");
    return result;
};
const reject = (state, input, reason) => {
    const result = deploy(state, input);
    assert.deepEqual(result.value, { type: "REJECTED", reason });
    assert.equal(result.state.execution, state.execution);
    assert.equal(result.state.deployment.dp, state.deployment.dp);
    assert.equal(result.state.deployment.cards, state.deployment.cards);
    assert.equal(result.state.battlefield, state.battlefield);
};

test("deployment binds its Card and snapshots field COST independently of later Card discounts", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 20,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const previous = fixture([{ definition: unit }]);
    const deployed = deployUnit(previous);
    let state = deployed.state;
    const field = getUnit(state, deployed.value.unitId);
    assert.equal(field.deployable.card.id, 0);
    assert.equal(field.deployable.cost, 20);
    assert.equal(field.deployable.refund.limit, 20);
    assert.equal(state.deployment.dp, 80);
    assert.equal(state.execution.nextUnitId, 1);
    assert.equal(previous.execution.nextUnitId, 0);
    assert.equal(previous.deployment.dp, 100);

    state = cards.setCostContribution(state, cards.ref(getCard(state, 0)), {
        id: "later-discount",
        value: [modifier({ finalAddition: -18 })],
    });
    assert.equal(cards.resolveCost(getCard(state, 0)), 2);
    state = retreatUnit(state, field.id);
    assert.equal(state.deployment.dp, 90);
    assert.equal(getCard(state, 0).costStage, 1);
    assert.equal(getCard(state, 0).cooldown, null);
    assert.equal(field.deployable.cost, 20);
    assert.equal(getUnit(state, field.id), undefined);

    const redeployed = deployUnit(state, 0, 1);
    assert.equal(getUnit(redeployed.state, redeployed.value.unitId).deployable.cost, 12);
    assert.equal(redeployed.state.deployment.dp, 78);
});

test("ordinary deployment consumes its stock and restores it after departure recovery", () => {
    const initial = fixture([{ definition: definition() }]);
    assert.equal(getCard(initial, 0).stock, 1);
    let { state, value } = deployUnit(initial);
    assert.equal(getCard(state, 0).stock, 0);
    assert.equal(getCard(state, 0).cooldown, null);
    assert.equal(getCard(state, 0).recovery, null);
    state = retreatUnit(at(state, 5), value.unitId);
    assert.equal(state.deployment.dp, 95);
    assert.equal(getCard(state, 0).stock, 0);
    assert.equal(getCard(state, 0).cooldown, null);
    assert.equal(getCard(state, 0).recovery.pending, 1);
    assert.deepEqual(getCard(state, 0).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 8,
        durationTicks: 3,
    });
    reject(state, request(), "NO_STOCK");
    state = at(state, 8);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery, null);
    ({ state, value } = deployUnit(state));
    assert.equal(getCard(state, 0).stock, 0);
    assert.equal(state.deployment.dp, 80);
    assert.equal(getUnit(state, value.unitId).deployable.cost, 15);

    state = remove(at(state, 10), value.unitId, "DEATH");
    assert.equal(state.deployment.dp, 80);
    assert.equal(getCard(state, 0).costStage, 2);
    assert.deepEqual(getCard(state, 0).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 13,
        durationTicks: 3,
    });
    ({ state, value } = deployUnit(at(state, 13)));
    assert.equal(getUnit(state, value.unitId).deployable.cost, 20);
    state = retreatUnit(state, value.unitId);
    assert.equal(getCard(state, 0).costStage, 2);
});

test("two Cards of the same definition restore their stock on independent clocks", () => {
    const unit = definition();
    let state = fixture([{ definition: unit }, { definition: unit }]);
    const first = deployUnit(state, 0, 0);
    const second = deployUnit(first.state, 1, 1);
    state = retreatUnit(at(second.state, 2), first.value.unitId);
    assert.equal(getCard(state, 0).definition, getCard(state, 1).definition);
    assert.equal(getCard(state, 0).costStage, 1);
    assert.equal(getCard(state, 1).costStage, 0);
    assert.equal(getCard(state, 1).cooldown, null);
    assert.equal(getCard(state, 1).recovery, null);
    assert.equal(getUnit(state, second.value.unitId).deployable.card.id, 1);
    reject(state, request(1, 2), "NO_STOCK");
    const replenished = cards.recharge(state, cards.ref(getCard(state, 1)), 1);
    reject(replenished, request(1, 2), "ACTIVE_LIMIT");
    assert.equal(cards.resolveCost(getCard(state, 0)), 15);
    assert.equal(cards.resolveCost(getCard(state, 1)), 10);

    state = retreatUnit(at(state, 3), second.value.unitId);
    assert.equal(getCard(state, 0).recovery.clock.readyAtTick, 5);
    assert.equal(getCard(state, 1).recovery.clock.readyAtTick, 6);
    state = at(state, 5);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery, null);
    assert.equal(getCard(state, 1).stock, 0);
    assert.equal(getCard(state, 1).recovery.clock.readyAtTick, 6);
    const next = deployUnit(state, 0, 2);
    state = at(next.state, 6);
    assert.equal(getCard(state, 0).stock, 0);
    assert.equal(getCard(state, 1).stock, 1);
    assert.equal(getCard(state, 1).recovery, null);
});

test("deployment rejection leaves stock, DP, Unit allocation and battlefield unchanged", () => {
    const unit = definition();
    reject(fixture([{ definition: unit }]), request(99), "UNKNOWN_CARD");
    reject(fixture([{ definition: unit }], { initialDp: 9 }), request(), "INSUFFICIENT_DP");
    reject(fixture([{ definition: unit }], { slotLimit: 0 }), request(), "SLOT_LIMIT");
    reject(fixture([{ definition: unit }]), request(0, 8), "OUTSIDE_MAP");

    const occupied = deployUnit(fixture([{ definition: unit }, { definition: unit }])).state;
    reject(occupied, request(1), "OCCUPIED");
    reject(occupied, request(0, 1), "NO_STOCK");

    const slotted = deployUnit(
        fixture([{ definition: unit }, { definition: unit }], { slotLimit: 1 }),
    ).state;
    reject(slotted, request(1, 1), "SLOT_LIMIT");

    const finite = deployUnit(
        fixture([
            {
                definition: unit,
                ...inventory({ stock: 1, stockLimit: 1 }),
                program: programs.consumable,
            },
        ]),
    ).state;
    assert.equal(getCard(finite, 0).stock, 0);
    reject(finite, request(0, 1), "NO_STOCK");

    const waiting = deployUnit(
        fixture([{ definition: unit, ...inventory(), program: programs.consumable }]),
    ).state;
    assert.equal(getCard(waiting, 0).stock, 2);
    reject(waiting, request(0, 1), "COOLDOWN");
});

test("a consumable departure does not restore stock when its deployment interval expires", () => {
    const deployed = deployUnit(
        fixture([
            {
                definition: definition(),
                ...inventory({ stock: 1, stockLimit: 1 }),
                program: programs.consumable,
            },
        ]),
    );
    let state = retreatUnit(deployed.state, deployed.value.unitId);
    assert.equal(getCard(state, 0).stock, 0);
    assert.equal(getCard(state, 0).recovery, null);
    state = at(state, 3);
    assert.equal(getCard(state, 0).cooldown, null);
    assert.equal(getCard(state, 0).stock, 0);
    reject(state, request(0, 1), "NO_STOCK");
});

test("DP recovery stops at its cap and starts a fresh interval after spending", () => {
    let state = fixture([], { initialDp: 1, maxDp: 3, dpRecoveryTicks: 2 });
    state = at(state, 2);
    assert.equal(state.deployment.dp, 2);
    assert.equal(state.deployment.dpRecoveryProgress, 0);
    state = at(state, 100);
    assert.equal(state.deployment.dp, 3);
    assert.equal(state.deployment.dpRecoveryProgress, 0);
    state = { ...state, tick: 101, deployment: changeDp(state.deployment, -1, 101) };
    assert.equal(state.deployment.lastDpRecoveryTick, 101);
    assert.equal(at(state, 102).deployment.dp, 2);
    state = at(state, 103);
    assert.equal(state.deployment.dp, 3);
    assert.equal(state.deployment.dpRecoveryProgress, 0);
});

test("queued recovery permits deploying remaining stock while returned Units recharge serially", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 0,
            redeployTicks: 4,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const first = deployUnit(
        fixture([{ definition: unit, ...inventory(), program: programs.queued }]),
        0,
        0,
    );
    const second = deployUnit(first.state, 0, 1);
    let state = retreatUnit(at(second.state, 1), first.value.unitId);
    state = retreatUnit(at(state, 2), second.value.unitId);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery.pending, 2);
    assert.equal(getCard(state, 0).recovery.clock.readyAtTick, 5);

    const third = deployUnit(state, 0, 2);
    state = third.state;
    assert.equal(getCard(state, 0).stock, 0);
    reject(state, request(0, 3), "NO_STOCK");
    state = at(state, 5);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery.pending, 1);
    assert.equal(getCard(state, 0).recovery.clock.readyAtTick, 9);
    assert.equal(getCard(at(state, 8), 0).stock, 1);
    state = at(state, 9);
    assert.equal(getCard(state, 0).stock, 2);
    assert.equal(getCard(state, 0).recovery, null);
    assert.equal(getCard(state, 0).cooldown, null);
    assert.notEqual(getUnit(state, third.value.unitId), undefined);
});

test("ordinary deployment can use remaining stock while earlier returns recover", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 0,
            redeployTicks: 4,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const first = deployUnit(
        fixture([{ definition: unit, ...inventory(), program: programs.operator }]),
    );
    const second = deployUnit(first.state, 0, 1);
    let state = retreatUnit(at(second.state, 1), first.value.unitId);
    state = retreatUnit(at(state, 2), second.value.unitId);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery.pending, 2);
    state = deployUnit(state, 0, 2).state;
    assert.equal(getCard(state, 0).stock, 0);
    state = at(state, 5);
    assert.equal(getCard(state, 0).stock, 1);
    assert.equal(getCard(state, 0).recovery.pending, 1);
    state = at(state, 9);
    assert.equal(getCard(state, 0).stock, 2);
    assert.equal(getCard(state, 0).recovery, null);
});

test("scripted and expired departures do not add the operator cost penalty", () => {
    for (const reason of ["SCRIPT", "EXPIRED"]) {
        const deployed = deployUnit(fixture([{ definition: definition() }]));
        const state = remove(deployed.state, deployed.value.unitId, reason);
        assert.equal(getCard(state, 0).costStage, 0);
        assert.equal(state.deployment.dp, 90);
    }
});

test("preset Units without a Card do not recycle; refund eligibility is a separate fact", () => {
    const unit = definition();
    const ordinary = initializeUnit({ id: 10, definition: unit, position: [0, 0] });
    const refundable = initializeUnit({
        id: 11,
        definition: unit,
        position: [1, 0],
        states: {
            deployable: {
                ...initializeDeployable(fixtureBattle(0), baseUnit(unit)).value.deployable,
                refund: { rate: 0.5, limit: 10 },
            },
        },
    });
    let state = createBattleState(
        fixtureBattlefieldState([ordinary, refundable]),
        undefined,
        0,
        initializeDeployment(budget({ initialDp: 20 })),
    );
    state = retreatUnit(state, ordinary.id);
    assert.equal(state.deployment.dp, 20);
    state = retreatUnit(state, refundable.id);
    assert.equal(state.deployment.dp, 25);
    assert.deepEqual(state.deployment.cards, []);
    assert.equal(state.execution.nextCardId, 0);
});

test("entry-triggered death recycles its Card before the Unit departure callback", () => {
    const calls = [];
    const unit = definition({
        hooks: [
            {
                id: "test/enter",
                stage: "enter",
                invoke(state, self) {
                    calls.push("entered");
                    return { state: remove(state, self.id, "DEATH"), value: undefined };
                },
            },
            {
                id: "test/leave",
                stage: "leave",
                invoke(state, departure) {
                    calls.push("left");
                    assert.equal(getUnit(state, departure.unit.id), undefined);
                    assert.equal(getCard(state, 0).costStage, 1);
                    assert.equal(getCard(state, 0).stock, 0);
                    assert.equal(getCard(state, 0).cooldown, null);
                    assert.equal(getCard(state, 0).recovery.clock.readyAtTick, 3);
                    assert.equal(state.deployment.dp, 90);
                    return { state: state, value: undefined };
                },
            },
        ],
    });
    const previous = fixture([{ definition: unit }]);
    const result = deployUnit(previous);
    assert.deepEqual(calls, ["entered", "left"]);
    assert.equal(getUnit(result.state, result.value.unitId), undefined);
    assert.equal(result.state.removedUnits.length, 1);
    assert.equal(result.state.events.filter((event) => event.type === "UNIT_DEPLOYED").length, 1);
    assert.equal(getCard(previous, 0).costStage, 0);
});

test("zero-cooldown departure can redeploy synchronously without overwriting the nested result", () => {
    let replacementId;
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 10,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
        }),
        hooks: [
            {
                id: "test/leave",
                stage: "leave",
                invoke(state, departure) {
                    assert.equal(getCard(state, 0).cooldown, null);
                    assert.equal(getCard(state, 0).recovery, null);
                    assert.equal(getCard(state, 0).stock, 1);
                    assert.equal(getCard(state, 0).costStage, 1);
                    const replacement = deployUnit(state, departure.unit.deployable.card.id, 1);
                    replacementId = replacement.value.unitId;
                    return { state: replacement.state, value: undefined };
                },
            },
        ],
    });
    const first = deployUnit(fixture([{ definition: unit }]));
    const next = retreatUnit(first.state, first.value.unitId);
    assert.equal(replacementId, 1);
    assert.equal(getUnit(next, first.value.unitId), undefined);
    assert.equal(getUnit(next, replacementId).deployable.cost, 15);
    assert.equal(next.execution.nextUnitId, 2);
    assert.equal(next.deployment.dp, 80);
    assert.equal(getCard(next, 0).costStage, 1);
    assert.equal(next.events.filter((event) => event.type === "UNIT_DEPLOYED").length, 2);
    assert.notEqual(getUnit(first.state, first.value.unitId), undefined);
});

test("a failed Tick publishes neither preceding deployments nor Card, DP and identity changes", () => {
    const failure = new Error("entry failed");
    let runtime = initializeBattle({
        map,
        schedule: { type: "TIMELINE", spawns: [] },
        initialUnits: [],
        predefines: [],
        initialMechanisms: [],
        maxTicks: 3,
        routeMoveMultiplier: 1,
        rngState: 1,
        deployment: {
            definition: budget(),
            cards: [
                { definition: definition(), ...ordinary() },
                {
                    ...ordinary(),
                    definition: definition({
                        hooks: [
                            {
                                id: "test/enter",
                                stage: "enter",
                                invoke() {
                                    throw failure;
                                },
                            },
                        ],
                    }),
                },
            ],
        },
    });
    const before = runtime;
    assert.throws(
        () =>
            (runtime = stepBattle(runtime, [
                { type: "DEPLOY_UNIT", cardId: 0, tilePosition: [0, 0] },
                { type: "DEPLOY_UNIT", cardId: 1, tilePosition: [0, 1] },
            ])),
        (error) => error === failure,
    );
    const after = runtime;
    assert.equal(after.deployment, before.deployment);
    assert.equal(after.execution, before.execution);
    assert.equal(after.deployment.dp, 100);
    assert.equal(after.execution.nextCardId, 2);
    assert.equal(after.execution.nextUnitId, 0);
    assert.equal(after.tick, 0);
    assert.deepEqual(unitQueries.all(after).toArray(), []);
    assert.equal(after.result, null);
});

test("Card programs keep private state across field instances and tick independently of deployment", () => {
    const entered = [];
    const unit = definition({
        deployable: createDeployable({
            cost: 0,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
            card: {
                initialize: (state) => ({ state, value: { entries: 0, ticks: 0 } }),
                onTick(state, self) {
                    return cards.setState(state, cards.ref(self), {
                        ...self.state,
                        ticks: self.state.ticks + 1,
                    });
                },
            },
        }),
        hooks: [
            {
                id: "test/card-state",
                stage: "enter",
                invoke(state, self) {
                    const card = cards.get(state, self.deployable.card, unit);
                    entered.push([self.id, card.state.entries, self.vitality.hp]);
                    return {
                        state: cards.setState(state, self.deployable.card, {
                            ...card.state,
                            entries: card.state.entries + 1,
                        }),
                        value: undefined,
                    };
                },
            },
        ],
    });
    const first = addCard(fixture([]), unit, ordinary());
    const second = addCard(first.state, unit, ordinary());
    assert.equal(cards.get(second.state, first.value).definition, unit);
    assert.equal(cards.get(second.state, first.value, { ...unit }), undefined);
    assert.equal(
        cards.setState(second.state, first.value, cards.get(second.state, first.value).state),
        second.state,
    );
    assert.notEqual(
        cards.get(second.state, first.value).state,
        cards.get(second.state, second.value).state,
    );
    let state = at(second.state, 1);
    assert.deepEqual(cards.get(state, first.value).state, { entries: 0, ticks: 1 });
    const deployed = deploy(state, { card: first.value, tilePosition: [0, 0] });
    state = at(deployed.state, 2);
    assert.deepEqual(cards.get(state, first.value).state, { entries: 1, ticks: 2 });
    state = retreatUnit(state, deployed.value.unitId);
    const next = deploy(state, { card: first.value, tilePosition: [0, 1] });
    assert.equal(next.value.type, "DEPLOYED");
    assert.deepEqual(entered, [
        [0, 0, 100],
        [1, 1, 100],
    ]);
    assert.deepEqual(cards.get(next.state, first.value).state, { entries: 2, ticks: 2 });
    assert.deepEqual(cards.get(next.state, second.value).state, { entries: 0, ticks: 2 });
    assert.deepEqual(cards.get(first.state, first.value).state, { entries: 0, ticks: 0 });
});

test("Card ticks fix candidates and read changes made by preceding Card programs", () => {
    const trace = [];
    let second;
    const late = definition({
        id: "late-card",
        deployable: createDeployable({
            cost: 0,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
            card: {
                initialize: (state) => ({ state, value: {} }),
                onTick(state) {
                    trace.push("late");
                    return state;
                },
            },
        }),
    });
    const firstDefinition = definition({
        deployable: createDeployable({
            cost: 0,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
            card: {
                initialize: (state) => ({ state, value: { spawned: false } }),
                onTick(state, self) {
                    trace.push("first");
                    if (self.state.spawned) return state;
                    state = cards.setState(state, second, { count: 20 });
                    state = addCard(state, late, ordinary()).state;
                    return cards.setState(state, cards.ref(self), { spawned: true });
                },
            },
        }),
    });
    const secondDefinition = definition({
        deployable: createDeployable({
            cost: 0,
            redeployTicks: 0,
            slots: 1,
            buildableType: "ALL",
            card: {
                initialize: (state) => ({ state, value: { count: 0 } }),
                onTick(state, self) {
                    trace.push(self.state.count);
                    return state;
                },
            },
        }),
    });
    const a = addCard(fixture([]), firstDefinition, ordinary());
    const b = addCard(a.state, secondDefinition, ordinary());
    second = b.value;
    let state = at(b.state, 1);
    assert.deepEqual(trace, ["first", 20]);
    assert.deepEqual(
        cards
            .all(state)
            .map((self) => self.id)
            .toArray(),
        [0, 1, 2],
    );
    assert.deepEqual(
        cards
            .all(b.state)
            .map((self) => self.id)
            .toArray(),
        [0, 1],
    );
    state = at(state, 2);
    assert.deepEqual(trace, ["first", 20, "first", 20, "late"]);
});

test("complete Card resource operations preserve a running timer and sample changes for the next return", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 0,
            redeployTicks: 30,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const created = addCard(fixture([]), unit, ordinary());
    const deployed = deploy(created.state, { card: created.value, tilePosition: [0, 0] });
    const returned = retreatUnit({ ...deployed.state, tick: 5 }, deployed.value.unitId);
    const timer = cards.get(returned, created.value).recovery.clock;
    let state = cards.setRedeployTimeContribution(returned, created.value, {
        id: "shorter",
        value: [modifier({ multiplier: -0.5 })],
    });
    assert.equal(cards.get(state, created.value).recovery.clock, timer);
    assert.equal(cards.resolveRedeployTicks(cards.get(state, created.value)), 15);
    state = cards.reduceCooldown({ ...state, tick: 10 }, created.value, 10, "RECOVERY");
    assert.deepEqual(cards.get(state, created.value).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 25,
        durationTicks: 30,
    });
    state = cards.clearCooldown(state, created.value, "RECOVERY");
    assert.equal(cards.get(state, created.value).recovery, null);
    assert.equal(cards.get(state, created.value).stock, 1);
    assert.equal(cards.clearCooldown(state, created.value, "RECOVERY"), state);
    const next = deploy(state, { card: created.value, tilePosition: [0, 1] });
    state = retreatUnit({ ...next.state, tick: 50 }, next.value.unitId);
    assert.deepEqual(cards.get(state, created.value).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 65,
        durationTicks: 15,
    });
    assert.deepEqual(cards.get(returned, created.value).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 35,
        durationTicks: 30,
    });
});

test("explicit Card recharge caps available stock without replacing its running timer", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 0,
            redeployTicks: 30,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const created = addCard(fixture([]), unit, {
        ...inventory(),
        stock: 1,
        program: programs.consumable,
    });
    const deployed = deploy(created.state, { card: created.value, tilePosition: [0, 0] });
    const timer = cards.get(deployed.state, created.value).cooldown;
    const replenished = cards.recharge(deployed.state, created.value, 10);
    assert.equal(cards.get(replenished, created.value).stock, 3);
    assert.equal(cards.get(replenished, created.value).cooldown, timer);
    assert.equal(cards.get(deployed.state, created.value).stock, 0);
    assert.equal(cards.recharge(replenished, created.value, 1), replenished);
    for (const count of [-1, 0.5]) {
        assert.throws(() => cards.recharge(replenished, created.value, count), RangeError);
        assert.throws(
            () => cards.reduceCooldown(replenished, created.value, count, "COOLDOWN"),
            RangeError,
        );
    }
});

test("clearing a queued Card cooldown completes the current return and starts the next full period", () => {
    const unit = definition({
        deployable: createDeployable({
            card: {},
            cost: 0,
            redeployTicks: 30,
            slots: 1,
            buildableType: "ALL",
        }),
    });
    const created = addCard(fixture([]), unit, { ...inventory(), program: programs.queued });
    const first = deploy(created.state, { card: created.value, tilePosition: [0, 0] });
    const second = deploy(first.state, { card: created.value, tilePosition: [0, 1] });
    let state = retreatUnit(second.state, first.value.unitId);
    state = retreatUnit(state, second.value.unitId);
    const original = state;
    state = cards.clearCooldown({ ...state, tick: 20 }, created.value, "RECOVERY");
    const current = cards.get(state, created.value);
    assert.equal(current.stock, 2);
    assert.equal(current.recovery.pending, 1);
    assert.deepEqual(current.recovery.clock, {
        type: "RUNNING",
        readyAtTick: 50,
        durationTicks: 30,
    });
    assert.equal(cards.get(original, created.value).stock, 1);
    assert.deepEqual(cards.get(original, created.value).recovery.clock, {
        type: "RUNNING",
        readyAtTick: 30,
        durationTicks: 30,
    });
});

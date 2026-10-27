import { changeTile, tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { fixtureBattlefieldState as fixtureBattlefield } from "../helpers/battlefield.js";
import { actionCapability } from "../helpers/actions.js";
import * as actions from "../../dist/core/unit/action/operations.js";
import { create as createBattlefield } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createDefinition as createDeployableDefinition } from "../helpers/deployable.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { addCard } from "../../dist/core/battle/deployment/deployment.js";
import { resolveDeploymentCommands } from "../../dist/core/battle/deployment/operations.js";
import {
    advancePredefined,
    createPredefinedDefinition,
} from "../../dist/core/battle/steps/predefined.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { getUnit, transitionUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { createDefinition as createSkillDefinition } from "../../dist/core/unit/capability/skill/capability.js";
import { activate } from "../../dist/core/unit/capability/skill/operations.js";
import { ref as activationRef } from "../../dist/core/unit/capability/skill/activation.js";
import * as effects from "../../dist/core/unit/effect/operations.js";
import { get } from "../../dist/core/unit/effect/operations.js";
import { definition } from "../helpers/effects.js";
import {
    setHook,
    removeHook,
} from "../../dist/core/battle/damage/hook.js";

function fixture() {
    const skill = createSkillDefinition({
        id: "departing-counter-skill",
        initialize: () => ({}),
        sp: null,
        activation: {
            trigger: "MANUAL",
            sustain: { type: "INFINITE" },
            initialize: () => ({}),
            onEnd: state => dealDamage(state, { source: null, target: { id: 2 }, parameters: parameters(1, "TRUE") }).state,
        },
    });
    const counter = definition(
        "consume-on-damage",
        { consumed: 0 },
        {
            onInstall(state, self) {
                const ref = effectRef(self);
                return transitionUnit(state, ref.host.id, (unit) =>
                    ({ ...unit, vitality: setHook(unit.vitality, {
                        id: "consume",
                        stage: "receiving",
                        priority: 0,
                        accepts: (battle, context) => getUnit(battle, context.request.target.id)?.effects.values().toArray().find(effect => effect.id === ref.id)?.status === "ACTIVE",
                        invoke(state, context, value) {
                            const current = get(state, ref);
                            state = effects.update(state, ref, data => ({ consumed: data.consumed + 1 }));
                            return { state, value };
                        },
                    }) }),
                );
            },
            onEnd(state, self) {
                return transitionUnit(state, self.host.id, (unit) => ({ ...unit, vitality: removeHook(unit.vitality, "consume") }));
            },
        },
    );
    const units = Array.from({ length: 3 }, (_, id) =>
        initialize({
            id,
            position: [id, 0],
            definition: { hooks: [],
                id: `departure-${id}`,
                vitality: { maxHp: 100, defense: 0, resistance: 0 },
                ...(id < 2 ? { skill } : {}),
            },
        }),
    );
    let work = createBattleState(fixtureBattlefield(units), undefined);
    for (const id of [0, 1]) work = activate(work, unitRef(getUnit(work, id))).state;
    work = effects.install(work, unitRef(getUnit(work, 2)), counter).state;
    return { battlefield: work.battlefield, execution: work.execution };
}

for (const domain of ["deployment", "predefined"]) {
    test(`${domain}: successive departures share effect updates from skill finish damage`, () => {
        const { battlefield, execution } = fixture();
        const before = createBattleState(battlefield);
        let state = createBattleState(battlefield, execution, 1);
        if (domain === "deployment") {
            state = resolveDeploymentCommands(
                state,
                [
                    { type: "RETREAT_UNIT", unitId: 0 },
                    { type: "RETREAT_UNIT", unitId: 1 },
                ],
            );
        } else {
            state = advancePredefined(
                { ...state, predefinedPresence: [
                    { definitionId: 10, source: { type: "UNIT", unitId: 0 } },
                    { definitionId: 11, source: { type: "UNIT", unitId: 1 } },
                ] },
                [{ id: 10 }, { id: 11 }],
                [
                    { type: "REMOVE_PREDEFINED", definitionId: 10, reason: "SCRIPT" },
                    { type: "REMOVE_PREDEFINED", definitionId: 11, reason: "SCRIPT" },
                ],
                1,
            );
        }

        assert.equal(getUnit(state, 2).effects.values().toArray()[0].data.consumed, 2);
        assert.equal(unitQueries.get(before, { id: 2 }).effects.values().toArray()[0].data.consumed, 0);
        assert.deepEqual(
            state.removedUnits.map((unit) => unit.unitId),
            [0, 1],
        );
        assert.equal(state.events.filter((event) => event.type === "SKILL_FINISHED").length, 2);
        assert.equal(getUnit(state, 2).vitality.hp, 98);
    });
}

for (const domain of ["deployment", "predefined"]) {
    test(`${domain}: creation then departure preserves removal facts and restores only its tile cost`, () => {
        const map = createMap(
            1,
            2,
            tileEntries(Array.from({ length: 2 }, () => ({
                heightType: "LOWLAND", meleeBlockable: true,
                buildableType: "ALL",
                passableMask: "ALL",
                terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
            }))),
        );
        const battlefield = createBattlefield(map);
        const departures = [];
        const definition = Object.freeze({
            id: "transient-placement", occupancy: { slot: "OCCUPANT" },
            hooks: [{ id: "test/enter", stage: "enter", invoke(battle, self) {
                return { state: changeTile(battle, self.occupancy.tile, { walkCost: 10 }), value: undefined };
            } }, { id: "test/leave", stage: "leave", invoke(battle, { unit }) {
                assert.equal(getUnit(battle, unit.id), undefined);
                const position = unit.occupancy.tile;
                const tile = battle.battlefield.map.tiles.get(position[1]);
                departures.push([unit.id, tile.state.walkCost]);
                return { state: changeTile(battle, position, { walkCost: tile.definition.initial.walkCost }), value: undefined };
            } }],

            deployable: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: "ALL" }),
            vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }),
        });
        const before = createBattleState(battlefield);
        let state = changeTile(before, [0, 0], { passability: "WALK_ONLY" });
        if (domain === "deployment") {
            state = addCard(state, { unit: definition }).state;
            state = addCard(state, { unit: definition }).state;
            state = resolveDeploymentCommands(
                state,
                [
                    {
                        type: "DEPLOY_UNIT",
                        cardId: 0,
                        tilePosition: [0, 0],
                    },
                    { type: "RETREAT_UNIT", unitId: 0 },
                    { type: "DEPLOY_UNIT", cardId: 1, tilePosition: [0, 0] },
                ],
            );
        } else {
            state = advancePredefined(
                state,
                [
                    createPredefinedDefinition({
                        id: 10,
                        alias: null,
                        initiallyPresent: false,
                        creation: {
                            type: "UNIT",
                            definition,
                            position: [0, 0],
                            tile: [0, 0],
                        },
                    }),
                ],
                [
                    { type: "APPEAR_PREDEFINED", definitionId: 10 },
                    { type: "REMOVE_PREDEFINED", definitionId: 10, reason: "SCRIPT" },
                ],
                0,
            );
        }

        assert.deepEqual(
            state.removedUnits.map((unit) => unit.unitId),
            [0],
        );
        assert.deepEqual(departures, [[0, 10]]);
        const currentTile = state.battlefield.map.tiles.get(0);
        assert.equal(currentTile.state.walkCost, domain === "deployment" ? 10 : 1);
        assert.equal(currentTile.state.passability, "WALK_ONLY");
        assert.equal(currentTile.definition, map.tiles.get(0).definition);
        assert.equal(currentTile.definition.initial.walkCost, 1);
        assert.equal(currentTile.definition.initial.passability, "ALL");
        assert.equal(state.battlefield.navigation.baseline.WALK.cells[0].cost, currentTile.state.walkCost);
        assert.equal(state.battlefield.navigation.baseline.FLY.cells[0].passable, false);
        assert.deepEqual(state.battlefield.navigation.overlays.WALK, []);
        assert.equal(before.battlefield.map.tiles.get(0).state.walkCost, 1);
        assert.equal(before.battlefield.map.tiles.get(0).state.passability, "ALL");
        assert.equal(before.battlefield.navigation.baseline.FLY.cells[0].passable, true);
        assert.deepEqual(unitQueries.all(state).map(unit => unit.id).toArray(), domain === "deployment" ? [1] : []);
    });
}

test("effect terminal callback can retire its host and settle remote Action and Skill dependencies immediately", () => {
    const trace = [];
    const skill = createSkillDefinition({
        id: "nested-skill",
        initialize: () => ({}),
        sp: null,
        activation: {
            trigger: "MANUAL",
            sustain: { type: "INFINITE" },
            initialize: () => ({}),
            onEnd: state => {
                trace.push("skill");
                return state;
            },
        },
    });
    const action = {
        id: "owned-action", intervalTicks: 1, speed: 100,
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick: state => ({ state, value: false }),
    };
    const units = [
        initialize({
            id: 0,
            position: [0, 0],
            definition: { hooks: [], id: "source", vitality: { maxHp: 100, defense: 0, resistance: 0 }, skill, action: actionCapability(action) },
        }),
        initialize({
            id: 1,
            position: [1, 0],
            definition: { hooks: [], id: "receiver", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
        }),
    ];
    let battle = createBattleState(fixtureBattlefield(units));
    battle = activate(battle, unitRef(getUnit(battle, 0))).state;
    const started = actions.start(battle, unitRef(getUnit(battle, 0)), action);
    battle = started.state;
    assert.equal(started.value.type, "STARTED");
    const actionDependent = definition(
        "action-dependent",
        {},
        {
            onEnd: (state, self, reason) => {
                assert.equal(reason, "DEATH");
                trace.push("action-effect");
                return state;
            },
        },
    );
    const skillDependent = definition(
        "skill-dependent",
        {},
        {
            onEnd: state => {
                trace.push("skill-effect");
                return state;
            },
        },
    );
    battle = effects.install(battle, unitRef(getUnit(battle, 1)), actionDependent, {
        scopes: [{ type: "ACTION", ref: started.value.ref }],
    }).state;
    battle = effects.install(battle, unitRef(getUnit(battle, 1)), skillDependent, {
        scopes: [{ type: "SKILL", ref: activationRef(getUnit(battle, 0).skill.active) }],
    }).state;
    const content = definition(
        "nested-death",
        {},
        {
            onEnd(state) {
                trace.push("effect");
                state = dealDamage({ ...state, tick: 1 }, { source: null, target: { id: 0 }, parameters: parameters(100, "TRUE") }).state;
                trace.push("after-damage");
                assert.equal(getUnit(state, 0), undefined);
                assert.equal(actions.get(state, started.value.ref), undefined);
                return state;
            },
        },
    );
    const installed = effects.install(battle, unitRef(getUnit(battle, 0)), content);
    battle = effects.end(installed.state, installed.value);
    assert.equal(getUnit(battle, 0), undefined);
    assert.deepEqual(getUnit(battle, 1).effects.values().toArray(), []);
    assert.ok(trace.indexOf("action-effect") < trace.indexOf("after-damage"));
    assert.ok(trace.indexOf("skill-effect") < trace.indexOf("after-damage"));
    assert.ok(trace.indexOf("skill") < trace.indexOf("after-damage"));
    assert.equal(battle.events.filter((event) => event.type === "ACTION_CANCELLED").length, 1);
    assert.equal(battle.events.filter((event) => event.type === "SKILL_FINISHED").length, 1);
});

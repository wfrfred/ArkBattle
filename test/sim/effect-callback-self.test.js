import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as effects from "../../dist/core/unit/effect/index.js";
import { ref } from "../../dist/core/unit/effect/effect.js";
import * as units from "../../dist/core/unit/query.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as projectiles from "../../dist/core/battle/projectile.js";
import * as projectilesQuery from "../../dist/core/projectile/query.js";
import { fixtureBattle, initialize } from "../helpers/unit.js";

function fixture() {
    let battle = fixtureBattle(5);
    for (const id of [1, 2]) {
        battle = addUnit(battle, initialize({
            id, position: [id, 0], definition: { hooks: [], id: `effect-host-${id}` },
        }));
    }
    return battle;
}

test("Effect onEnd receives private data updated by disable and dependent cleanup", () => {
    let parent;
    const seen = [];
    const program = {
        id: "parent-data",
        initialize: () => ({ count: 0 }),
        onDisable: (battle, self) => {
            const currentData = effects.get(battle, ref(self)).data;
            return effects.setData(battle, ref(self), { count: currentData.count + 1 });
        },
        onEnd(battle, self, reason) {
            assert.equal(self, effects.get(battle, ref(self)));
            seen.push([self.data.count, reason]);
            return battle;
        },
    };
    const installed = effects.install(fixture(), { id: 1 }, program);
    parent = installed.value;
    const child = effects.install(installed.state, { id: 2 }, {
        id: "child-data",
        initialize: () => ({}),
        onEnd(battle, self, reason) {
            assert.equal(self.status, "ENDING");
            assert.equal(reason, "PARENT_END");
            const currentData = effects.get(battle, parent).data;
            return effects.setData(battle, parent, { count: currentData.count + 10 });
        },
    }, { scopes: [lifetimeScope(effectLifetime, parent)] });
    const battle = effects.end(child.state, parent, "PARENT_END");
    assert.deepEqual(seen, [[11, "PARENT_END"]]);
    assert.equal(effects.get(battle, parent), undefined);
    assert.equal(effects.get(battle, child.value), undefined);
});

test("Effect Finalize retains its current owner and cleans a preexisting independent resource once", () => {
    const ended = [];
    const created = projectiles.create(fixture(), { id: "owned-resource" }, {
        position: [0, 0], state: {},
    });
    const owned = created.value;
    const installed = effects.install(created.state, { id: 1 }, {
        id: "resource-owner",
        initialize: () => ({ cleaned: false, resource: owned }),
        onDisable: (battle, self) => {
            const currentData = effects.get(battle, ref(self)).data;
            return effects.setData(battle, ref(self), { ...currentData, cleaned: true });
        },
        onEnd(battle, self, reason) {
            assert.equal(units.get(battle, self.host).lifecycle, "LEAVING");
            assert.equal(effects.get(battle, ref(self)), self);
            assert.equal(self.status, "ENDING");
            assert.equal(self.data.cleaned, true);
            assert.equal(self.data.resource, owned);
            ended.push(reason);
            return projectiles.stop(battle, self.data.resource);
        },
    });
    const child = effects.install(installed.state, { id: 2 }, {
        id: "removes-parent-host",
        initialize: () => ({}),
        onEnd(battle) {
            battle = remove(battle, 1, "SCRIPT");
            assert.equal(units.get(battle, { id: 1 }).lifecycle, "LEAVING");
            assert.equal(effects.get(battle, installed.value).status, "ENDING");
            return battle;
        },
    }, { scopes: [lifetimeScope(effectLifetime, installed.value)] });
    const battle = effects.end(child.state, installed.value, "OUTER_END");
    assert.deepEqual(ended, ["OUTER_END"]);
    assert.equal(units.get(battle, { id: 1 }), undefined);
    assert.equal(projectilesQuery.get(battle, owned), undefined);
    assert.equal(effects.get(battle, child.value), undefined);
    assert.equal(battle.events.filter(event => event.type === "PROJECTILE_STOPPED").length, 1);
    assert.equal(effects.end(battle, installed.value), battle);
});

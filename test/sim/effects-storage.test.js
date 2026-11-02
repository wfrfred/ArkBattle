import assert from "node:assert/strict";
import { test } from "node:test";
import { Effects } from "../../dist/core/unit/effect/effects.js";


const instance = (id, definition, data) => ({
    id,
    host: { id: 0 },
    definition,
    data,
    source: null,
    deadline: null,
    enabled: true,
    status: "INACTIVE",
});

test("Effects restores generic data through Definition identity rather than its string ID", () => {
    const definition = { id: "shield", initialize: () => ({ charges: 2 }) };
    const otherDefinition = { id: "shield", initialize: () => ({ charges: 10 }) };
    const effect = instance(0, definition, definition.initialize());
    const effects = Effects.empty().add(effect);

    assert.equal(effects.get(0, definition), effect);
    assert.equal(effects.get(0, otherDefinition), undefined);
    assert.equal(effects.get(1, definition), undefined);
    assert.equal(effects.nextId, 1);
});

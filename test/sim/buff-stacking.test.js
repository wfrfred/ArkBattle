import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compileBuffStacking, parseBuffStacking } from "../../dist/data/buff-stacking.js";

const fixture = JSON.parse(readFileSync(new URL("../fixtures/arknights/buff_stacking.json", import.meta.url), "utf8"));
const native = (key) => fixture.fixtures.find(({ buff }) => buff.buffKey === key).buff;
const compileNative = (key) => compileBuffStacking(parseBuffStacking(native(key)));
const description = (overrideType, patch = {}) => ({
    overrideType, maxStackCnt: 1, maxValidStackCnt: -1,
    refreshRemainingTimeWhenStackMax: false, clearAllStackCntWhenTimeUp: false,
    takeSnapshotWhenExtend: false, ...patch,
});
const application = (stackCount, expiresAtTick) => ({ stackCount, expiresAtTick });
const refresh = (stackCount, expiresAtTick, takeSnapshot = false, reloadModifiers = false) => ({ type: "REFRESH", stackCount, expiresAtTick, takeSnapshot, reloadModifiers });

test("buff stacking: complete native descriptors normalize numeric and named policies", () => {
    for (const raw of fixture.fixtures.map(({ buff }) => buff)) {
        const parsed = parseBuffStacking(raw);
        const numeric = ["DEFAULT", "STACK", "UNIQUE", "EXTEND", "EXTEND_TIME"].indexOf(raw.overrideType);
        assert.deepEqual(parsed, parseBuffStacking({ ...raw, overrideType: numeric }));
    }
    assert.throws(() => parseBuffStacking(description("UNKNOWN")), /overrideType/);
});

test("buff stacking: new applications install without clipping counts and DEFAULT keeps independent instances", () => {
    const incoming = application(1, 30);
    for (const overrideType of ["DEFAULT", "STACK", "UNIQUE", "EXTEND", "EXTEND_TIME"]) {
        const rule = compileBuffStacking(description(overrideType, { maxStackCnt: 0, maxValidStackCnt: 0 }));
        assert.deepEqual(rule.plan(undefined, incoming, 10), { type: "INSTALL" });
        assert.equal(incoming.stackCount, 1);
        assert.equal(rule.validStackCount(1), 0);
    }
    const rule = compileNative("skadi2_t_2[atk][2]");
    assert.deepEqual(rule.plan(application(1, 100), incoming, 10), { type: "INSTALL" });
});

test("buff stacking: actual native layers grow independently of the effective contribution cap", () => {
    const unlimited = compileNative("sbell2_e_002_trait[interval]");
    assert.deepEqual(unlimited.plan(application(5, 20), application(100, 30), 10), refresh(6, 30));
    assert.equal(unlimited.validStackCount(6), 5);
    const bounded = compileNative("enemy_shushu_support");
    assert.deepEqual(bounded.plan(application(19, 40), application(1, 30), 10), refresh(20, 40));
    assert.equal(bounded.validStackCount(20), 1);
    assert.deepEqual(bounded.plan(application(20, 40), application(1, 100), 10), { type: "REJECT" });
});

test("buff stacking: native capped STACK rejects the next layer", () => {
    const rule = compileNative("astesi_t_1[Stack]");
    const current = application(5, 20);
    const incoming = application(1, 30);
    assert.deepEqual(rule.plan(current, incoming, 10), { type: "REJECT" });
    assert.deepEqual(rule.plan(application(4, 20), incoming, 10), refresh(5, 30, false, true));
});

test("buff stacking: native refresh at the actual cap extends time without a new layer or snapshot", () => {
    const rule = compileNative("ascln_t_1[debuff]");
    assert.deepEqual(rule.plan(application(1, 20), application(99, 30), 10), refresh(1, 30));
    assert.deepEqual(rule.plan(application(1, 40), application(1, 30), 10), refresh(1, 40));
});

test("buff stacking: native UNIQUE rejects repeated applications including a snapshot flag", () => {
    const rule = compileNative("sophia_e_shield_physical_kxml");
    assert.deepEqual(rule.plan(application(1, 20), application(1, 100), 10), { type: "REJECT" });
});

test("buff stacking: native EXTEND fills the longest deadline and EXTEND_TIME adds remaining time", () => {
    const current = application(3, 20);
    const incoming = application(7, 30);
    const fill = compileNative("nothin_s_2[a][attack_speed_down]");
    const extend = compileNative("enemu_nstmom[weak_attr]");
    assert.deepEqual(fill.plan(current, incoming, 10), refresh(3, 30));
    assert.deepEqual(fill.plan(application(3, 40), incoming, 10), refresh(3, 40));
    assert.deepEqual(extend.plan(current, incoming, 10), refresh(3, 40));
});

test("buff stacking: growing effective layers reload retained-source samples without an EXTEND snapshot request", () => {
    const rule = compileNative("sbell2_e_002_trait[interval]");
    assert.deepEqual(rule.plan(application(4, 20), application(1, 30), 10), refresh(5, 30, false, true));
    assert.deepEqual(rule.plan(application(5, 20), application(1, 30), 10), refresh(6, 30));
});

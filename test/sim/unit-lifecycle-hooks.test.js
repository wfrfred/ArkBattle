import assert from "node:assert/strict";
import { test } from "node:test";
import { add, advance, remove, update } from "../../dist/core/battle/unit.js";
import { fixtureBattle, getUnit, initialize } from "../helpers/unit.js";

test("Unit entry hooks retain their context while passing the latest BattleState", () => {
    const calls = [];
    let context;
    const unit = initialize({
        id: 1, position: [0, 0],
        definition: {
            id: "entry-hooks", vitality: { maxHp: 100, defense: 0, resistance: 0 },
            hooks: [
                {
                    id: "change-hp", stage: "enter",
                    invoke(battle, self) {
                        context = self;
                        calls.push("changed");
                        return { state: update(battle, [{ ...self, vitality: { ...self.vitality, hp: 75 } }]), value: undefined };
                    },
                },
                {
                    id: "observe", stage: "enter",
                    accepts: (battle, self) => getUnit(battle, self.id).vitality.hp === 75,
                    invoke(battle, self) {
                        assert.equal(self, context);
                        assert.equal(self.vitality.hp, 100);
                        assert.equal(getUnit(battle, self.id).vitality.hp, 75);
                        calls.push("observed");
                        return { state: battle, value: undefined };
                    },
                },
            ],
        },
    });
    const before = fixtureBattle();
    const after = add(before, unit);
    assert.deepEqual(calls, ["changed", "observed"]);
    assert.equal(getUnit(after, 1).vitality.hp, 75);
    assert.equal(getUnit(before, 1), undefined);
    assert.equal(unit.vitality.hp, 100);
});

test("removing a Unit in an entry hook completes leave hooks and stops later entry or tick hooks", () => {
    const calls = [];
    const unit = initialize({
        id: 1, position: [0, 0],
        definition: {
            id: "departing-entry",
            hooks: [
                {
                    id: "remove", stage: "enter",
                    invoke(battle, self) {
                        calls.push("enter");
                        return { state: remove(battle, self.id, "SCRIPT"), value: undefined };
                    },
                },
                {
                    id: "later-enter", stage: "enter",
                    invoke() { assert.fail("removed Unit must not receive more entry hooks"); },
                },
                {
                    id: "tick", stage: "tick",
                    invoke() { assert.fail("removed Unit must not tick"); },
                },
                {
                    id: "leave", stage: "leave",
                    invoke(battle, departure) {
                        assert.equal(departure.unit, unit);
                        assert.equal(departure.reason, "SCRIPT");
                        assert.equal(getUnit(battle, unit.id), undefined);
                        calls.push("leave");
                        return { state: battle, value: undefined };
                    },
                },
            ],
        },
    });
    const after = add(fixtureBattle(), unit);
    assert.equal(advance(after), after);
    assert.deepEqual(calls, ["enter", "leave"]);
    assert.equal(getUnit(after, 1), undefined);
});

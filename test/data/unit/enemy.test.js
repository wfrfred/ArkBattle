// Contract: [data](../../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { prepare } from "../../../dist/data/unit/enemy.js";

const fixture = JSON.parse(readFileSync(
    new URL("../../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8",
));
const rawEnemy = id => fixture.enemies.find(entry => entry.Key === id);
const profile = (id, level = 0, overwrittenData) => prepare(rawEnemy(id), { level, overwrittenData });

test("main-mode enemy levels inherit individual defined fields and apply stage overrides last", () => {
    const base = profile("enemy_1000_gopro");
    const advanced = profile("enemy_1000_gopro", 1, {
        enemyTags: { m_defined: true, m_value: ["sarkaz"] },
        levelType: { m_defined: true, m_value: "BOSS" },
        attributes: {
            maxHp: { m_defined: true, m_value: 4000 },
            atk: { m_defined: false, m_value: 9999 },
            moveSpeed: { m_defined: true, m_value: 1.1 },
            hpRecoveryPerSec: { m_defined: true, m_value: 20 },
        },
    });
    assert.equal(base.maxHp, 820);
    assert.deepEqual(base.filterTags, ["infection"]);
    assert.equal(base.rank, "NORMAL");
    assert.equal(base.attack, 190);
    assert.equal(advanced.maxHp, 4000);
    assert.equal(advanced.attack, 400);
    assert.equal(advanced.moveSpeedPerSecond, 1.1);
    assert.equal(advanced.recoverySpeed, 20);
    assert.deepEqual(advanced.filterTags, ["sarkaz"]);
    assert.equal(advanced.rank, "BOSS");
    const bow = profile("enemy_1003_ncbow", 1);
    assert.equal(bow.attackSpeed, 0);
    assert.throws(() => profile("enemy_1000_gopro", 2));
});

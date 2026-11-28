// Contract: [data](../../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseEnemyDatabase } from "../../../dist/data/enemy-database.js";
import { readEnemyParameters, resolveEnemy } from "../../../dist/data/unit/enemy.js";

const fixture = JSON.parse(readFileSync(
    new URL("../../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8",
));
const database = parseEnemyDatabase(fixture);
const rawEnemy = id => database.get(id);
const parameters = (id, level = 0, overwrittenData) =>
    readEnemyParameters(resolveEnemy(rawEnemy(id), { level, overwrittenData }));

test("main-mode enemy levels inherit individual defined fields and apply stage overrides last", () => {
    const base = parameters("enemy_1000_gopro");
    const advanced = parameters("enemy_1000_gopro", 1, {
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
    const bow = parameters("enemy_1003_ncbow", 1, {
        applyWay: { m_defined: true, m_value: "ALL" },
    });
    assert.equal(bow.attackSpeed, 0);
    assert.throws(() => parameters("enemy_1000_gopro", 2));
    const harmless = resolveEnemy(rawEnemy("enemy_1000_gopro"), {
        level: 1,
        overwrittenData: { lifePointReduce: { m_defined: true, m_value: 0 } },
    });
    assert.equal(harmless.lifePointLoss, 0);
});

test("enemy merging retains native skill, talent and SP data for their consumers", () => {
    const raw = structuredClone(rawEnemy("enemy_1000_gopro"));
    const [base, advanced] = raw.Value;
    base.enemyData.skills = [{ prefabKey: "gopro-base-skill" }];
    advanced.enemyData.talentBlackboard = [{ key: "atk_scale", value: 1.5 }];
    advanced.enemyData.spData = { maxSp: 15, initSp: 1 };
    const overwrittenData = {
        attributes: { maxHp: { m_defined: true, m_value: 4000 } },
        skills: [{ prefabKey: "gopro-stage-skill" }],
        talentBlackboard: [{ key: "atk_scale", value: 2 }],
        spData: { maxSp: 25, initSp: 5 },
    };

    const enemy = resolveEnemy(raw, { level: 1, overwrittenData });
    assert.deepEqual(enemy.layers[0].skills, base.enemyData.skills);
    assert.deepEqual(enemy.layers[1].talentBlackboard, advanced.enemyData.talentBlackboard);
    assert.deepEqual(enemy.layers[1].spData, advanced.enemyData.spData);
    assert.deepEqual(enemy.layers[2], overwrittenData);
    const parameters = readEnemyParameters(enemy);
    assert.equal(parameters.attack, 400);
    assert.equal(parameters.maxHp, 4000);
});

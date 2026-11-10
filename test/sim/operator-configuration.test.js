import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { prepare } from "../../dist/data/arknights/operator.js";

const fixture = JSON.parse(readFileSync(new URL("../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8"));
const mudrock = "char_311_mudrok";
const melantha = "char_208_melan";
const base = { elite: 2, level: 90, potential: 1, skillIndex: 1, skillLevel: 7, trust: 0 };

function profile(id = mudrock, configuration = base, overrides = {}) {
    const record = overrides.character ?? fixture.characters[id];
    const selected = record.skills[configuration.skillIndex];
    const module = configuration.module?.id;
    return prepare(
        { id, record },
        overrides.skill ?? fixture.skills[selected?.skillId],
        configuration,
        {
            ranges: fixture.ranges,
            favor: fixture.favor,
            ...(module === undefined ? {} : {
                equipment: fixture.equipment[module],
                battleEquipment: fixture.battleEquipment[module],
            }),
            ...overrides.tables,
        },
    );
}

const blackboard = entries => Object.fromEntries(entries.map(entry => [entry.key, entry.value]));
const talent = (profile, key) => blackboard(profile.talents.find(talent => talent.key === key).blackboard);

test("operator profiles use selected phase attributes, explicit table identity and canonical ranges", () => {
    const configuration = { ...base };
    const prepared = profile(mudrock, configuration);
    assert.equal(prepared.attributes.maxHp, 3928);
    assert.equal(prepared.attributes.attack, 882);
    assert.deepEqual(prepared.range, [[0, 0], [0, 1]]);
    assert.equal(prepared.skill.definition.id, "skchr_mudrok_2");
    assert.equal(prepared.skill.definition.sp.requirement, 5);
    assert.equal(blackboard(prepared.skill.blackboard).atk_scale, 2.1);
    assert.equal(prepared.skillRange.length, fixture.ranges["x-4"].grids.length);
});

test("phase interpolation rounds integer fields and preserves floating attributes", () => {
    const interpolated = profile(mudrock, { ...base, elite: 1, level: 2 });
    assert.equal(interpolated.attributes.attack, 517);
    assert.equal(interpolated.attributes.baseAttackTime, 1.6);
    assert.equal(interpolated.attributes.cost, 34);
    assert.throws(() => profile(mudrock, { ...base, elite: 1, level: 81 }), /phase maximum/);
});

test("UI potential maps to cumulative raw ranks and selects the unlocked talent candidate", () => {
    const one = profile();
    const four = profile(mudrock, { ...base, potential: 4 });
    const six = profile(mudrock, { ...base, potential: 6 });
    assert.equal(four.attributes.defense, 631);
    assert.equal(six.attributes.cost, 34);
    assert.equal(six.attributes.respawnTime, 66);
    assert.equal(talent(one, "1").hp_ratio, 0.2);
    assert.equal(talent(six, "1").hp_ratio, 0.22);
    const eliteOne = profile(mudrock, { ...base, elite: 1, level: 80, potential: 6 });
    assert.equal(talent(eliteOne, "1").max_times, 2);
    assert.deepEqual(eliteOne.talents.map(talent => talent.key), ["1"]);
});

test("trust rounds its increment separately and saturates at 100 percent", () => {
    const values = [0, 49, 100, 200].map(trust => profile(mudrock, { ...base, trust }).attributes);
    assert.deepEqual(values.map(attributes => attributes.maxHp), [3928, 4168, 4428, 4428]);
    assert.equal(values[1].defense, 631);
    assert.deepEqual(values[2], values[3]);
    const interpolated = profile(melantha, {
        elite: 1, level: 28, potential: 1, skillIndex: 0, skillLevel: 7, trust: 10,
    });
    assert.equal(interpolated.attributes.attack, 666);
});

test("selected skills enforce unlocks, mastery gates and matching data", () => {
    assert.throws(() => profile(mudrock, { ...base, elite: 0, level: 50, skillLevel: 1 }), /skill is locked/);
    assert.throws(() => profile(mudrock, { ...base, elite: 1, level: 80, skillLevel: 8 }), /higher elite/);
    const mastery = profile(mudrock, { ...base, skillLevel: 10 });
    assert.equal(mastery.skill.definition.sp.requirement, 4);
    assert.equal(blackboard(mastery.skill.blackboard).atk_scale, 2.7);
    assert.throws(() => profile(mudrock, base, { skill: fixture.skills["skcom_atk_up[1]"] }), /does not match/);

});

test("same-phase talent upgrades remain separate from static attributes", () => {
    const configuration = { elite: 1, level: 54, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 };
    const lower = profile(melantha, configuration);
    const maximum = profile(melantha, { ...configuration, level: 55 });
    assert.equal(talent(lower, "1").atk, 0.04);
    assert.equal(talent(maximum, "1").atk, 0.08);
    assert.equal(maximum.attributes.attack, 828);
});

test("module stages use their total attributes, trust gates and potential-aware talent replacement", () => {
    const moduleId = "uniequip_002_mudrok";
    const configured = level => ({ ...base, trust: 100, potential: 6, module: { id: moduleId, level } });
    const stages = [1, 2, 3].map(level => profile(mudrock, configured(level)));
    assert.deepEqual(stages.map(profile => profile.attributes.maxHp), [4673, 4753, 4828]);
    assert.deepEqual(stages.map(profile => profile.attributes.attack), [937, 952, 962]);
    assert.deepEqual(stages.map(profile => talent(profile, "1").hp_ratio), [0.22, 0.24, 0.25]);
    assert.equal(talent(stages[2], "1").sp, 2);
    assert.equal(stages[2].talents.length, 2);
    assert.deepEqual(blackboard(stages[2].moduleTrait), { damage_scale: 0.85 });
    assert.equal(profile(mudrock, { ...configured(3), potential: 1 }).talents[0].blackboard.find(entry => entry.key === "hp_ratio").value, 0.23);
    assert.throws(() => profile(mudrock, { ...configured(1), level: 59 }), /module requires/);
    assert.throws(() => profile(mudrock, { ...configured(2), trust: 49 }), /more trust/);
    assert.equal(profile(mudrock, { ...configured(2), trust: 50 }).configuration.module.level, 2);
    assert.throws(() => profile(mudrock, { ...configured(3), trust: 99 }), /more trust/);
    assert.throws(() => profile(melantha, { elite: 1, level: 55, potential: 1, skillIndex: 0, skillLevel: 7, trust: 100, module: { id: moduleId, level: 1 } }), /does not match/);
    const y = profile(mudrock, { ...base, trust: 100, module: { id: "uniequip_003_mudrok", level: 3 } });
    assert.deepEqual(blackboard(y.moduleTrait), { atk: 0.08, def: 0.08 });
    assert.equal(y.attributes.attack, 967);
    assert.equal(y.attributes.defense, 732);
    assert.equal(talent(y, "2").damage_resistance, 0.35);
});

test("module data-only replacements preserve talent keys and string blackboards", () => {
    const moduleId = "uniequip_002_mudrok";
    const battle = structuredClone(fixture.battleEquipment[moduleId]);
    const phase = battle.phases[2];
    phase.parts[1].target = "TALENT_DATA_ONLY";
    const addition = structuredClone(phase.parts[1]);
    addition.addOrOverrideTalentDataBundle.candidates = [{
        ...addition.addOrOverrideTalentDataBundle.candidates[0],
        talentIndex: -1, prefabKey: "extra", blackboard: [{ key: "description_key", value: 0, valueStr: "preserved" }],
    }];
    phase.parts.push(addition);
    const configuration = { ...base, trust: 100, module: { id: moduleId, level: 3 } };
    const prepared = profile(mudrock, configuration, { tables: { battleEquipment: battle } });
    assert.deepEqual(prepared.talents.map(talent => talent.key), ["1", "2", "extra"]);
    assert.equal(prepared.talents[2].blackboard[0].valueStr, "preserved");
});

test("unsupported potential formulas are rejected at the data boundary", () => {
    const character = structuredClone(fixture.characters[mudrock]);
    character.potentialRanks[0].buff.attributes.attributeModifiers[0].formulaItem = "MULTIPLIER";
    assert.throws(() => profile(mudrock, { ...base, potential: 2 }, { character }), /unsupported.*modifier/);

});

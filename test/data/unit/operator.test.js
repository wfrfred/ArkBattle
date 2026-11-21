// Contract: [data](../../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { extract, extractFavor } from "../../../dist/data/unit/operator.js";
import {
    resolveAttributes,
    selectModule,
    selectPhase,
    selectSkill,
    selectTalents,
    selectTrait,
} from "../../../dist/content/operators/parameters.js";

const fixture = JSON.parse(readFileSync(new URL("../../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8"));
const favor = extractFavor(fixture.favor);
const mudrock = "char_311_mudrok";
const melantha = "char_208_melan";
const moduleX = "uniequip_002_mudrok";
const moduleY = "uniequip_003_mudrok";
const base = { elite: 2, level: 90, potential: 1, skillIndex: 1, skillLevel: 7, trust: 0 };

function parameters(id, overrides = {}) {
    return extract(
        { id, record: overrides.character ?? fixture.characters[id] },
        {
            ranges: fixture.ranges,
            skills: fixture.skills,
            equipment: fixture.equipment,
            battleEquipment: fixture.battleEquipment,
            ...overrides.tables,
        },
        {
            skillIndices: id === mudrock ? [1] : [0],
            moduleIds: overrides.moduleIds ?? (id === mudrock ? [moduleX, moduleY] : []),
        },
    );
}

const mudrockParameters = parameters(mudrock);
const melanthaParameters = parameters(melantha);

function select(input = mudrockParameters, configuration = base) {
    const phase = selectPhase(input.phases, configuration);
    const stage = selectModule(input.modules, configuration, favor);

    return {
        attributes: resolveAttributes(input, phase, configuration, stage, favor),
        range: phase.range,
        skill: selectSkill(input.skills, configuration),
        talents: selectTalents(input.talents, configuration, stage),
        moduleTrait: selectTrait(configuration, stage),
    };
}

const blackboard = entries => Object.fromEntries(entries.map(entry => [entry.key, entry.value]));
const talent = (selected, key) => blackboard(selected.talents.find(talent => talent.key === key).blackboard);

test("operator extraction preserves table identity and selection uses canonical ranges", () => {
    const selected = select();
    assert.equal(mudrockParameters.id, mudrock);
    assert.deepEqual(mudrockParameters.groupTags, ["rhodes"]);
    assert.deepEqual(mudrockParameters.skills.map(({ index, id }) => [index, id]), [[1, "skchr_mudrok_2"]]);
    assert.equal(selected.attributes.maxHp, 3928);
    assert.equal(selected.attributes.attack, 882);
    assert.equal(selected.attributes.recoverySpeed, 0);
    assert.deepEqual(selected.range, [[0, 0], [0, 1]]);
    assert.equal(selected.skill.id, "skchr_mudrok_2");
    assert.equal(selected.skill.level.cost, 5);
    assert.equal(blackboard(selected.skill.level.blackboard).atk_scale, 2.1);
    assert.equal(selected.skill.level.range.length, fixture.ranges["x-4"].grids.length);
    const character = {
        ...fixture.characters[melantha],
        nationId: "laterano", groupId: "abyssal", teamId: "followers",
        subPower: [
            ...fixture.characters[melantha].subPower,
            fixture.characters[melantha].mainPower,
        ],
    };
    const other = parameters(melantha, { character });
    assert.deepEqual(other.groupTags, ["rhodes", "reserve4", "victoria"]);
});

test("phase interpolation rounds integer fields and preserves floating attributes", () => {
    const interpolated = select(mudrockParameters, { ...base, elite: 1, level: 2 });
    assert.equal(interpolated.attributes.attack, 517);
    assert.equal(interpolated.attributes.baseAttackTime, 1.6);
    assert.equal(interpolated.attributes.cost, 34);
    assert.throws(() => select(mudrockParameters, { ...base, elite: 1, level: 81 }), /phase maximum/);
});

test("UI potential maps to cumulative raw ranks and selects the unlocked talent candidate", () => {
    const one = select();
    const four = select(mudrockParameters, { ...base, potential: 4 });
    const six = select(mudrockParameters, { ...base, potential: 6 });
    assert.equal(four.attributes.defense, 631);
    assert.equal(six.attributes.cost, 34);
    assert.equal(six.attributes.respawnTime, 66);
    assert.equal(talent(one, "1").hp_ratio, 0.2);
    assert.equal(talent(six, "1").hp_ratio, 0.22);
    const eliteOne = select(mudrockParameters, { ...base, elite: 1, level: 80, potential: 6 });
    assert.equal(talent(eliteOne, "1").max_times, 2);
    assert.deepEqual(eliteOne.talents.map(talent => talent.key), ["1"]);
});

test("trust rounds its increment separately and saturates at 100 percent", () => {
    const favor = extractFavor(fixture.favor);
    assert.deepEqual(favor.find(frame => frame.percent === 49), {
        percent: 49, battlePhase: 24, favorPoint: 2637,
    });
    const values = [0, 49, 100, 200].map(trust => select(mudrockParameters, { ...base, trust }).attributes);
    assert.deepEqual(values.map(attributes => attributes.maxHp), [3928, 4168, 4428, 4428]);
    assert.equal(values[1].defense, 631);
    assert.deepEqual(values[2], values[3]);
    const interpolated = select(melanthaParameters, {
        elite: 1, level: 28, potential: 1, skillIndex: 0, skillLevel: 7, trust: 10,
    });
    assert.equal(interpolated.attributes.attack, 666);
});

test("selected skills enforce unlocks, mastery gates and matching data", () => {
    assert.throws(() => select(mudrockParameters, { ...base, elite: 0, level: 50, skillLevel: 1 }), /skill is locked/);
    assert.throws(() => select(mudrockParameters, { ...base, elite: 1, level: 80, skillLevel: 8 }), /higher elite/);
    const mastery = select(mudrockParameters, { ...base, skillLevel: 10 });
    assert.equal(mastery.skill.level.cost, 4);
    assert.equal(blackboard(mastery.skill.level.blackboard).atk_scale, 2.7);
    assert.throws(() => parameters(mudrock, {
        tables: { skills: { ...fixture.skills, skchr_mudrok_2: fixture.skills["skcom_atk_up[1]"] } },
    }), /does not match/);
});

test("same-phase talent upgrades remain separate from static attributes", () => {
    const configuration = { elite: 1, level: 54, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 };
    const lower = select(melanthaParameters, configuration);
    const maximum = select(melanthaParameters, { ...configuration, level: 55 });
    assert.equal(talent(lower, "1").atk, 0.04);
    assert.equal(talent(maximum, "1").atk, 0.08);
    assert.equal(maximum.attributes.attack, 828);
});

test("module stages use their total attributes, trust gates and potential-aware talent replacement", () => {
    const configured = level => ({ ...base, trust: 100, potential: 6, module: { id: moduleX, level } });
    const stages = [1, 2, 3].map(level => select(mudrockParameters, configured(level)));
    assert.deepEqual(stages.map(selected => selected.attributes.maxHp), [4673, 4753, 4828]);
    assert.deepEqual(stages.map(selected => selected.attributes.attack), [937, 952, 962]);
    assert.deepEqual(stages.map(selected => talent(selected, "1").hp_ratio), [0.22, 0.24, 0.25]);
    assert.equal(talent(stages[2], "1").sp, 2);
    assert.equal(stages[2].talents.length, 2);
    assert.deepEqual(blackboard(stages[2].moduleTrait), { damage_scale: 0.85 });
    assert.equal(talent(select(mudrockParameters, { ...configured(3), potential: 1 }), "1").hp_ratio, 0.23);
    assert.throws(() => select(mudrockParameters, { ...configured(1), level: 59 }), /module requires/);
    assert.throws(() => select(mudrockParameters, { ...configured(2), trust: 49 }), /more trust/);
    assert.equal(selectModule(mudrockParameters.modules, { ...configured(2), trust: 50 }, favor).level, 2);
    assert.throws(() => select(mudrockParameters, { ...configured(3), trust: 99 }), /more trust/);
    assert.throws(() => parameters(melantha, { moduleIds: [moduleX] }), /does not match/);
    const y = select(mudrockParameters, { ...base, trust: 100, module: { id: moduleY, level: 3 } });
    assert.deepEqual(blackboard(y.moduleTrait), { atk: 0.08, def: 0.08 });
    assert.equal(y.attributes.attack, 967);
    assert.equal(y.attributes.defense, 732);
    assert.equal(talent(y, "2").damage_resistance, 0.35);
});

test("module data-only replacements preserve talent keys and string blackboards", () => {
    const battle = structuredClone(fixture.battleEquipment[moduleX]);
    const phase = battle.phases[2];
    phase.parts[1].target = "TALENT_DATA_ONLY";
    const addition = structuredClone(phase.parts[1]);
    addition.addOrOverrideTalentDataBundle.candidates = [{
        ...addition.addOrOverrideTalentDataBundle.candidates[0],
        talentIndex: -1, prefabKey: "extra", blackboard: [{ key: "description_key", value: 0, valueStr: "preserved" }],
    }];
    phase.parts.push(addition);
    const configuration = { ...base, trust: 100, module: { id: moduleX, level: 3 } };
    const input = parameters(mudrock, {
        tables: { battleEquipment: { ...fixture.battleEquipment, [moduleX]: battle } },
    });
    const selected = select(input, configuration);
    assert.deepEqual(selected.talents.map(talent => talent.key), ["1", "2", "extra"]);
    assert.equal(selected.talents[2].blackboard[0].valueStr, "preserved");
});

test("unsupported potential formulas are rejected at the data boundary", () => {
    const character = structuredClone(fixture.characters[mudrock]);
    character.potentialRanks[0].buff.attributes.attributeModifiers[0].formulaItem = "MULTIPLIER";
    assert.throws(() => parameters(mudrock, { character }), /unsupported.*modifier/);
});

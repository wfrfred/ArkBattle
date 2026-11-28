// Contract: [data](../../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { fromTables, record } from "../../../dist/data/unit/operator.js";
import { parseGroupTags } from "../../../dist/data/unit/tags.js";
import { resolve as resolveMudrock } from "../../../dist/content/operators/mudrock/parameters.js";
import {
    favorFrame,
    growth,
    resolveAttributes,
    selectModule,
    selectSkill,
    selectTalents,
    selectTrait,
} from "../../../dist/content/operators/parameters.js";
import { rawTables, tables } from "../../helpers/operator.js";

const mudrock = "char_311_mudrok";
const melantha = "char_208_melan";
const moduleX = "uniequip_002_mudrok";
const moduleY = "uniequip_003_mudrok";
const base = { module: null, elite: 2, level: 90, potential: 1, skillIndex: 1, skillLevel: 7, trust: 0 };

function select(id = mudrock, configuration = base, source = tables) {
    const character = record(source.characters[id], "operator character record");
    const input = growth(character, source.ranges, configuration);
    const favor = favorFrame(source.favor, configuration.trust);
    const stage = selectModule(id, source, configuration, favor);

    return {
        attributes: resolveAttributes(input, configuration, stage, favor),
        range: input.phase.range,
        skill: selectSkill(character, source, configuration),
        talents: selectTalents(character, configuration, stage),
        moduleTrait: selectTrait(configuration, stage),
    };
}

const blackboard = entries => Object.fromEntries(entries.map(entry => [entry.key, entry.value]));
const talent = (selected, key) => blackboard(selected.talents.find(talent => talent.key === key).blackboard);

test("operator selection uses table identity, group tags and canonical ranges", () => {
    const selected = select();
    const resolved = resolveMudrock(base, tables);
    assert.equal(resolved.id, mudrock);
    assert.deepEqual(resolved.groupTags, ["rhodes"]);
    assert.equal(selected.attributes.maxHp, 3928);
    assert.equal(selected.attributes.attack, 882);
    assert.equal(selected.attributes.recoverySpeed, 0);
    assert.deepEqual(selected.range, [[0, 0], [1, 0]]);
    assert.equal(selected.skill.id, "skchr_mudrok_2");
    assert.equal(selected.skill.level.cost, 5);
    assert.equal(blackboard(selected.skill.level.blackboard).atk_scale, 2.1);
    assert.equal(selected.skill.level.range.length, rawTables.ranges["x-4"].grids.length);
    const character = {
        ...rawTables.characters[melantha],
        nationId: "laterano", groupId: "abyssal", teamId: "followers",
        subPower: [
            ...rawTables.characters[melantha].subPower,
            rawTables.characters[melantha].mainPower,
        ],
    };
    assert.deepEqual(parseGroupTags(character), ["rhodes", "reserve4", "victoria"]);
});

test("operator tables retain native fields and default content ignores unselected variants", () => {
    const character = structuredClone(rawTables.characters[mudrock]);
    character.appellation = "Mudrock";
    const candidates = character.talents[0].candidates;
    const modeTalent = structuredClone(candidates.at(-1));
    modeTalent.validModeIndices = [1];
    modeTalent.unlockCondition.level = 90;
    modeTalent.blackboard.find(entry => entry.key === "hp_ratio").value = 0.5;
    candidates.push(modeTalent);

    const xBattle = structuredClone(rawTables.battleEquipment[moduleX]);
    const parts = xBattle.phases[2].parts;
    const modeTrait = structuredClone(parts[0]);
    modeTrait.validInGameTag = "roguelike";
    modeTrait.overrideTraitDataBundle.candidates[0].blackboard[0].value = 0.5;
    parts.push(modeTrait);
    const skill = structuredClone(rawTables.skills.skchr_mudrok_2);
    skill.levels.at(-1).durationType = "AMMO";
    const charEquip = { [mudrock]: [moduleX, moduleY] };
    const source = fromTables({
        ...rawTables,
        characters: { ...rawTables.characters, [mudrock]: character },
        skills: { ...rawTables.skills, [skill.skillId]: skill },
        equipment: { ...rawTables.equipment, charEquip },
        battleEquipment: {
            ...rawTables.battleEquipment,
            [moduleX]: xBattle,
            [moduleY]: { ...rawTables.battleEquipment[moduleY], phases: null },
        },
    });

    assert.equal(source.characters[mudrock].appellation, "Mudrock");
    assert.deepEqual(source.characters[mudrock].talents[0].candidates.at(-1), modeTalent);
    assert.equal(source.skills[skill.skillId].levels.at(-1).durationType, "AMMO");
    assert.deepEqual(source.equipment.charEquip, charEquip);
    assert.deepEqual(source.battleEquipment[moduleX].phases[2].parts.at(-1), modeTrait);
    assert.equal(source.battleEquipment[moduleY].phases, null);

    const configuration = { ...base, potential: 6, trust: 100 };
    assert.equal(resolveMudrock(configuration, source).shield.healRatio, 0.22);
    const withModule = resolveMudrock({ ...configuration, module: { id: moduleX, level: 3 } }, source);
    assert.equal(withModule.shield.healRatio, 0.25);
    assert.equal(withModule.shield.blockedDamageScale, 0.85);
});

test("phase interpolation rounds integer fields and preserves floating attributes", () => {
    const interpolated = select(mudrock, { ...base, elite: 1, level: 2 });
    assert.equal(interpolated.attributes.attack, 517);
    assert.equal(interpolated.attributes.baseAttackTime, 1.6);
    assert.equal(interpolated.attributes.cost, 34);
    assert.throws(() => select(mudrock, { ...base, elite: 1, level: 81 }), /phase maximum/);
});

test("UI potential maps to cumulative raw ranks and selects the unlocked talent candidate", () => {
    const one = select();
    const four = select(mudrock, { ...base, potential: 4 });
    const six = select(mudrock, { ...base, potential: 6 });
    assert.equal(four.attributes.defense, 631);
    assert.equal(six.attributes.cost, 34);
    assert.equal(six.attributes.respawnTime, 66);
    assert.equal(talent(one, "1").hp_ratio, 0.2);
    assert.equal(talent(six, "1").hp_ratio, 0.22);
    const eliteOne = select(mudrock, { ...base, elite: 1, level: 80, potential: 6 });
    assert.equal(talent(eliteOne, "1").max_times, 2);
    assert.deepEqual(eliteOne.talents.map(talent => talent.key), ["1"]);
});

test("trust rounds its increment separately and saturates at 100 percent", () => {
    assert.deepEqual(favorFrame(tables.favor, 49), {
        percent: 49, battlePhase: 24, favorPoint: 2637,
    });
    const values = [0, 49, 100, 200].map(trust => select(mudrock, { ...base, trust }).attributes);
    assert.deepEqual(values.map(attributes => attributes.maxHp), [3928, 4168, 4428, 4428]);
    assert.equal(values[1].defense, 631);
    assert.deepEqual(values[2], values[3]);
    const interpolated = select(melantha, {
        module: null, elite: 1, level: 28, potential: 1, skillIndex: 0, skillLevel: 7, trust: 10,
    });
    assert.equal(interpolated.attributes.attack, 666);
});

test("selected skills enforce unlocks, mastery gates and matching data", () => {
    assert.throws(() => select(mudrock, { ...base, elite: 0, level: 50, skillLevel: 1 }), /skill is locked/);
    assert.throws(() => select(mudrock, { ...base, elite: 1, level: 80, skillLevel: 8 }), /higher elite/);
    const mastery = select(mudrock, { ...base, skillLevel: 10 });
    assert.equal(mastery.skill.level.cost, 4);
    assert.equal(blackboard(mastery.skill.level.blackboard).atk_scale, 2.7);
    const wrongSkill = fromTables({
        ...rawTables,
        skills: { ...rawTables.skills, skchr_mudrok_2: rawTables.skills["skcom_atk_up[1]"] },
    });
    assert.throws(() => select(mudrock, base, wrongSkill), /does not match/);
});

test("same-phase talent upgrades remain separate from static attributes", () => {
    const configuration = { module: null, elite: 1, level: 54, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 };
    const lower = select(melantha, configuration);
    const maximum = select(melantha, { ...configuration, level: 55 });
    assert.equal(talent(lower, "1").atk, 0.04);
    assert.equal(talent(maximum, "1").atk, 0.08);
    assert.equal(maximum.attributes.attack, 828);
});

test("module stages use their total attributes, trust gates and potential-aware talent replacement", () => {
    const configured = level => ({ ...base, trust: 100, potential: 6, module: { id: moduleX, level } });
    const stages = [1, 2, 3].map(level => select(mudrock, configured(level)));
    assert.deepEqual(stages.map(selected => selected.attributes.maxHp), [4673, 4753, 4828]);
    assert.deepEqual(stages.map(selected => selected.attributes.attack), [937, 952, 962]);
    assert.deepEqual(stages.map(selected => talent(selected, "1").hp_ratio), [0.22, 0.24, 0.25]);
    assert.equal(talent(stages[2], "1").sp, 2);
    assert.equal(stages[2].talents.length, 2);
    assert.deepEqual(blackboard(stages[2].moduleTrait), { damage_scale: 0.85 });
    assert.equal(talent(select(mudrock, { ...configured(3), potential: 1 }), "1").hp_ratio, 0.23);
    assert.throws(() => select(mudrock, { ...configured(1), level: 59 }), /module requires/);
    assert.throws(() => select(mudrock, { ...configured(2), trust: 49 }), /more trust/);
    assert.equal(selectModule(mudrock, tables, { ...configured(2), trust: 50 }, favorFrame(tables.favor, 50)).level, 2);
    assert.throws(() => select(mudrock, { ...configured(3), trust: 99 }), /more trust/);
    assert.throws(() => selectModule(melantha, tables, configured(1), favorFrame(tables.favor, 100)), /does not match/);
    const y = select(mudrock, { ...base, trust: 100, module: { id: moduleY, level: 3 } });
    assert.deepEqual(blackboard(y.moduleTrait), { atk: 0.08, def: 0.08 });
    assert.equal(y.attributes.attack, 967);
    assert.equal(y.attributes.defense, 732);
    assert.equal(talent(y, "2").damage_resistance, 0.35);
});

test("module data-only replacements preserve talent keys and string blackboards", () => {
    const battle = structuredClone(rawTables.battleEquipment[moduleX]);
    const phase = battle.phases[2];
    phase.parts[1].target = "TALENT_DATA_ONLY";
    const addition = structuredClone(phase.parts[1]);
    addition.addOrOverrideTalentDataBundle.candidates = [{
        ...addition.addOrOverrideTalentDataBundle.candidates[0],
        talentIndex: -1, prefabKey: "extra", blackboard: [{ key: "description_key", value: 0, valueStr: "preserved" }],
    }];
    phase.parts.push(addition);
    const configuration = { ...base, trust: 100, module: { id: moduleX, level: 3 } };
    const source = fromTables({
        ...rawTables,
        battleEquipment: { ...rawTables.battleEquipment, [moduleX]: battle },
    });
    const selected = select(mudrock, configuration, source);
    assert.deepEqual(selected.talents.map(talent => talent.key), ["1", "2", "extra"]);
    assert.equal(selected.talents[2].blackboard[0].valueStr, "preserved");
});

test("unsupported potential formulas are rejected when selected", () => {
    const character = structuredClone(rawTables.characters[mudrock]);
    character.potentialRanks[0].buff.attributes.attributeModifiers[0].formulaItem = "MULTIPLIER";
    const source = fromTables({ ...rawTables, characters: { ...rawTables.characters, [mudrock]: character } });
    assert.equal(select(mudrock, base, source).attributes.cost, 36);
    assert.throws(() => select(mudrock, { ...base, potential: 2 }, source), /unsupported.*modifier/);
});

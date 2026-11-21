import { readFile, writeFile } from "node:fs/promises";
import { secondsToTicks } from "../dist/core/tick.js";
import { parseAttackTiming } from "../dist/data/action/timing.js";
import { extract, extractFavor } from "../dist/data/unit/operator.js";

const fixtures = new URL("../test/fixtures/arknights/", import.meta.url);
const operators = new URL("../src/content/operators/", import.meta.url);

async function readJson(name) {
    return JSON.parse(await readFile(new URL(name, fixtures), "utf8"));
}

function value(blackboard, key) {
    const entry = blackboard.find((entry) => entry.key === key);
    if (entry === undefined) {
        throw new TypeError(`operator parameters require blackboard key ${key}`);
    }

    return entry.value;
}

function projectCandidates(candidates, project) {
    return candidates.map(({ unlock, potentialRank, value }) => ({
        unlock,
        potentialRank,
        value: project(value),
    }));
}

function projectSkill({ index, id, unlock, upgrades, levels }, project) {
    return { index, id, unlock, upgrades, levels: levels.map(project) };
}

function melantha({ skills: [skill], talents: [talent] }) {
    return {
        s1: projectSkill(skill, ({ sp, trigger, cost, durationTicks, blackboard }) => {
            if (durationTicks === null) {
                throw new TypeError("Melantha's first skill requires a duration");
            }

            return { sp, trigger, cost, durationTicks, attackBonus: value(blackboard, "atk") };
        }),
        talent: projectCandidates(talent, ({ blackboard }) => value(blackboard, "atk")),
    };
}

function shieldParameters({ blackboard }) {
    return {
        interval: secondsToTicks(value(blackboard, "interval")),
        initialLayers: value(blackboard, "times"),
        capacity: value(blackboard, "max_times"),
        healRatio: value(blackboard, "hp_ratio"),
        extraSp: blackboard.find((entry) => entry.key === "sp")?.value ?? 0,
    };
}

function mudrock({ skills: [skill], talents: [shield, sarkaz], modules: [module] }) {
    return {
        s2: projectSkill(skill, ({ range, sp, trigger, cost, blackboard }) => {
            if (range === null) {
                throw new TypeError("Mudrock's second skill requires a range");
            }

            return {
                range,
                sp,
                trigger,
                cost,
                attackScale: value(blackboard, "atk_scale"),
                healRatio: value(blackboard, "hp_ratio"),
                stunChance: value(blackboard, "buff_prob"),
                stunTicks: secondsToTicks(value(blackboard, "stun")),
            };
        }),
        shield: projectCandidates(shield, shieldParameters),
        sarkazResistance: projectCandidates(sarkaz, ({ blackboard }) =>
            value(blackboard, "damage_resistance"),
        ),
        moduleX: {
            id: module.id,
            unlock: module.unlock,
            stages: module.stages.map(({ level, minFavor, attributes, parts }) => {
                const trait = parts.find(
                    ({ target }) => target === "TRAIT" || target === "TRAIT_DATA_ONLY",
                );
                const talent = parts.find(
                    ({ target }) => target === "TALENT" || target === "TALENT_DATA_ONLY",
                );

                return {
                    level,
                    minFavor,
                    attributes,
                    shield: projectCandidates(
                        talent?.candidates.filter(({ value }) => value.index === 0) ?? [],
                        shieldParameters,
                    ),
                    blockedDamageScale: projectCandidates(trait?.candidates ?? [], (blackboard) =>
                        value(blackboard, "damage_scale"),
                    ),
                };
            }),
        },
    };
}

const [tables, timing] = await Promise.all([
    readJson("main-mode-units.json"),
    readJson("action_timing.json"),
]);

const entries = [
    {
        directory: "melantha",
        id: "char_208_melan",
        skillIndices: [0],
        moduleIds: [],
        timing: timing.melantha,
        project: melantha,
    },
    {
        directory: "mudrock",
        id: "char_311_mudrok",
        skillIndices: [1],
        moduleIds: ["uniequip_002_mudrok"],
        timing: timing.mudrockNormal,
        project: mudrock,
    },
];

const files = entries.map(({ directory, id, skillIndices, moduleIds, timing, project }) => {
    const source = extract({ id, record: tables.characters[id] }, tables, {
        skillIndices,
        moduleIds,
    });
    const { groupTags, phases, favorKeyFrames, potential } = source;

    return [
        `${directory}/parameters.json`,
        {
            id,
            groupTags,
            phases,
            favorKeyFrames,
            potential,
            timing: parseAttackTiming(timing),
            ...project(source),
        },
    ];
});
files.push(["favor.json", extractFavor(tables.favor)]);

await Promise.all(
    files.map(([file, value]) =>
        writeFile(new URL(file, operators), `${JSON.stringify(value, null, 2)}\n`),
    ),
);

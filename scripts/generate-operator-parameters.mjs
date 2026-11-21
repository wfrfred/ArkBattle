import { readFile, writeFile } from "node:fs/promises";
import { parseAttackTiming } from "../dist/data/action/timing.js";
import { extract, extractFavor } from "../dist/data/unit/operator.js";

const fixtures = new URL("../test/fixtures/arknights/", import.meta.url);
const operators = new URL("../src/content/operators/", import.meta.url);

async function readJson(name) {
    return JSON.parse(await readFile(new URL(name, fixtures), "utf8"));
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
    },
    {
        directory: "mudrock",
        id: "char_311_mudrok",
        skillIndices: [1],
        moduleIds: ["uniequip_002_mudrok", "uniequip_003_mudrok"],
        timing: timing.mudrockNormal,
    },
];

const files = entries.map(({ directory, id, skillIndices, moduleIds, timing }) => [
    `${directory}/parameters.json`,
    {
        ...extract({ id, record: tables.characters[id] }, tables, { skillIndices, moduleIds }),
        timing: parseAttackTiming(timing),
    },
]);
files.push(["favor.json", extractFavor(tables.favor)]);

await Promise.all(
    files.map(([file, value]) =>
        writeFile(new URL(file, operators), `${JSON.stringify(value, null, 2)}\n`),
    ),
);

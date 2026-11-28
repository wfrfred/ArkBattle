import { readFile } from "node:fs/promises";
import { fromTables, type Tables } from "./tables.js";
import { parseLevel } from "./level.js";
import { parseEnemyDatabase } from "./enemy-database.js";

const gamedata = new URL("../../assets/arknights-game-data/zh_CN/gamedata/", import.meta.url);

export async function readJson(file: string | URL): Promise<unknown> {
    return JSON.parse(await readFile(file, "utf8"));
}

export async function loadTables(excel = new URL("excel/", gamedata)): Promise<Tables> {
    const [characters, skills, ranges, equipment, battleEquipment, favor] = await Promise.all([
        readJson(new URL("character_table.json", excel)),
        readJson(new URL("skill_table.json", excel)),
        readJson(new URL("range_table.json", excel)),
        readJson(new URL("uniequip_table.json", excel)),
        readJson(new URL("battle_equip_table.json", excel)),
        readJson(new URL("favor_table.json", excel)),
    ]);

    return fromTables({ characters, skills, ranges, equipment, battleEquipment, favor });
}

export async function loadEnemyDatabase(
    file: string | URL = new URL("levels/enemydata/enemy_database.json", gamedata),
) {
    return parseEnemyDatabase(await readJson(file));
}

export async function loadLevel(file: string | URL) {
    return parseLevel(await readJson(file));
}

import { readFile } from "node:fs/promises";
import type { Tables } from "../../content/operators/parameters.js";
import { fromTables } from "./operator.js";

const excel = new URL("../../../assets/arknights-game-data/zh_CN/gamedata/excel/", import.meta.url);

export async function load(): Promise<Tables> {
    const read = async (filename: string): Promise<unknown> =>
        JSON.parse(await readFile(new URL(filename, excel), "utf8"));
    const [characters, skills, ranges, equipment, battleEquipment, favor] = await Promise.all([
        read("character_table.json"),
        read("skill_table.json"),
        read("range_table.json"),
        read("uniequip_table.json"),
        read("battle_equip_table.json"),
        read("favor_table.json"),
    ]);
    if (equipment === null || typeof equipment !== "object" || !("equipDict" in equipment)) {
        throw new TypeError("uniequip table requires equipDict");
    }

    return fromTables({
        characters,
        skills,
        ranges,
        equipment: equipment.equipDict,
        battleEquipment,
        favor,
    });
}

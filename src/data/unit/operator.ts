export type Table = Readonly<Record<string, unknown>>;

export interface Tables {
    readonly characters: Table;
    readonly skills: Table;
    readonly ranges: Table;
    readonly equipment: Table;
    readonly battleEquipment: Table;
    readonly favor: Table;
}

export function record(value: unknown, name: string): Table {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Table;
}

export function fromTables(tables: Readonly<Record<keyof Tables, unknown>>): Tables {
    return {
        characters: record(tables.characters, "character table"),
        skills: record(tables.skills, "skill table"),
        ranges: record(tables.ranges, "range table"),
        equipment: record(tables.equipment, "equipment table"),
        battleEquipment: record(tables.battleEquipment, "battle equipment table"),
        favor: record(tables.favor, "favor table"),
    };
}

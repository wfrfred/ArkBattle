function record(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

export function parseTags(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
        throw new TypeError("tags must be an array");
    }

    const tags = new Set<string>();

    for (let index = 0; index < value.length; index++) {
        const tag: unknown = value[index];
        if (!Object.hasOwn(value, index) || typeof tag !== "string" || tag.length === 0) {
            throw new TypeError("tags must contain nonempty strings");
        }

        tags.add(tag);
    }

    return [...tags];
}

export function parseGroupTags(value: unknown): readonly string[] {
    const character = record(value, "character group data");
    const subPowers = character.subPower;
    if (subPowers !== null && !Array.isArray(subPowers)) {
        throw new TypeError("character subPower must be an array or null");
    }

    const additionalPowers: readonly unknown[] = subPowers ?? [];
    const tags: unknown[] = [];

    for (const value of [character.mainPower, ...additionalPowers]) {
        const power = record(value, "character power");

        for (const key of ["nationId", "groupId", "teamId"] as const) {
            if (power[key] !== null) {
                tags.push(power[key]);
            }
        }
    }

    return parseTags(tags);
}

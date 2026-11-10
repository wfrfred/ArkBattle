export interface PrefabExtraction {
    readonly prefabKey: string;
    readonly components: readonly Record<string, unknown>[];
    readonly objects: ReadonlyMap<string, Record<string, unknown>>;
}

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

export function parsePrefabExtraction(value: unknown): PrefabExtraction {
    const source = object(value, "prefab extraction");
    if (typeof source.prefabKey !== "string" || source.prefabKey.length === 0) {
        throw new TypeError("prefab extraction prefabKey must be nonempty");
    }
    if (!Array.isArray(source.components)) {
        throw new TypeError("prefab components must be an array");
    }

    const components: Record<string, unknown>[] = [];
    const objects = new Map<string, Record<string, unknown>>();

    for (let index = 0; index < source.components.length; index++) {
        if (!Object.hasOwn(source.components, index)) {
            throw new TypeError("prefab components must be dense");
        }

        const component = object(source.components[index], `prefab component ${index}`);
        const fields = object(component.fields, `prefab component ${index} fields`);
        components.push(fields);

        if (component.object !== undefined) {
            const record = object(component.object, `prefab component ${index} object`);
            if (typeof record.id !== "string" || record.id.length === 0 || objects.has(record.id)) {
                throw new TypeError(`invalid prefab component object id at index ${index}`);
            }

            objects.set(record.id, fields);
        }
    }

    return { prefabKey: source.prefabKey, components, objects };
}

export function getPrefabComponent(
    source: PrefabExtraction,
    field: string,
): Record<string, unknown> {
    const matches = source.components.filter((value) => Object.hasOwn(value, field));
    if (matches.length !== 1) {
        throw new TypeError(`${source.prefabKey} requires one component with ${field}`);
    }

    return matches[0]!;
}

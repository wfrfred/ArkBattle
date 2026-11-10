import { assertFiniteNumber } from "../../core/common/assert.js";

const attributes = {
    MAX_HP: 0,
    ATK: 1,
    DEF: 2,
    MAGIC_RESISTANCE: 3,
    BLOCK_CNT: 5,
    MOVE_SPEED: 6,
    ATTACK_SPEED: 7,
    BASE_ATTACK_TIME: 8,
} as const;

const formulas = { ADDITION: 0, MULTIPLIER: 1, FINAL_ADDITION: 2, FINAL_SCALER: 3 } as const;
const fields = new Set([
    "attributeType",
    "formulaItem",
    "value",
    "loadFromBlackboard",
    "fetchBaseValueFromSourceEntity",
]);

export type ModifierAttribute = keyof typeof attributes;

export type ModifierFormula = keyof typeof formulas;

export interface AttributeModifier {
    readonly attributeType: ModifierAttribute;
    readonly formulaItem: ModifierFormula;
    readonly value: number;
    readonly loadFromBlackboard: boolean;
    readonly fetchBaseValueFromSourceEntity: boolean;
}

function enumKey<T extends Record<string, number>>(
    value: unknown,
    values: T,
    name: string,
): keyof T {
    for (const key in values) {
        if (value === key || value === values[key]) {
            return key;
        }
    }

    throw new TypeError(`unsupported modifier ${name}: ${String(value)}`);
}

export function parseAttributeModifiers(value: unknown): readonly AttributeModifier[] {
    if (!Array.isArray(value)) {
        throw new TypeError("attributeModifiers must be an array");
    }

    const definitions: AttributeModifier[] = [];

    for (let index = 0; index < value.length; index++) {
        const entry: unknown = value[index];
        if (
            !Object.hasOwn(value, index) ||
            entry === null ||
            typeof entry !== "object" ||
            Array.isArray(entry)
        ) {
            throw new TypeError(`invalid attribute modifier at index ${index}`);
        }

        const source = entry as Record<string, unknown>;

        for (const key of Object.keys(source)) {
            if (!fields.has(key)) {
                throw new TypeError(`unsupported modifier field ${key}`);
            }
        }

        assertFiniteNumber(source.value, "modifier value");

        if (
            typeof source.loadFromBlackboard !== "boolean" ||
            typeof source.fetchBaseValueFromSourceEntity !== "boolean"
        ) {
            throw new TypeError("modifier loading flags must be boolean");
        }

        definitions.push({
            attributeType: enumKey(source.attributeType, attributes, "attributeType"),
            formulaItem: enumKey(source.formulaItem, formulas, "formulaItem"),
            value: source.value,
            loadFromBlackboard: source.loadFromBlackboard,
            fetchBaseValueFromSourceEntity: source.fetchBaseValueFromSourceEntity,
        });
    }

    return definitions;
}

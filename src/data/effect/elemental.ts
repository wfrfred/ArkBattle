import { Type } from "../../core/unit/capability/elemental/index.js";

const elements = {
    SANITY: Type.NEURAL,
    WATER: Type.EROSION,
    FIRE: Type.BURN,
    DARK: Type.NECROSIS,
    ANGER: Type.MANIA,
} as const;

export function parseElementType(value: unknown): Type {
    for (const [index, key] of Object.keys(elements).entries()) {
        if (value === key || value === index + 1) {
            return elements[key as keyof typeof elements];
        }
    }

    throw new TypeError(`unsupported element type: ${String(value)}`);
}

import type { SiteCondition } from "../../core/battlefield/map/tile.js";
import * as conditions from "../../content/terrain/condition.js";

const CONDITIONS: readonly (readonly [number, SiteCondition])[] = [
    [1, conditions.normal],
    [2, conditions.deepsea],
    [4, conditions.tide],
    [8, conditions.night],
    [32, conditions.brokenWalkway],
];

const SUPPORTED_MASK = CONDITIONS.reduce((result, [bit]) => result | bit, 0);

function mask(value: unknown, name: string): number {
    if (
        typeof value !== "number" ||
        !Number.isSafeInteger(value) ||
        value < 0 ||
        value > 0xffff_ffff ||
        (value & ~SUPPORTED_MASK) !== 0
    ) {
        throw new RangeError(`${name} contains an unsupported advanced buildable mask`);
    }

    return value;
}

export function parseSiteCondition(value: unknown, name: string): SiteCondition | null {
    const raw = mask(value, name);

    if (raw === 0) {
        return null;
    }

    const condition = CONDITIONS.find(([bit]) => bit === raw)?.[1];

    if (condition === undefined) {
        throw new TypeError(`${name} requires multiple site conditions`);
    }

    return condition;
}

export function parseAllowedSiteConditions(value: unknown, name: string): readonly SiteCondition[] {
    const raw = mask(value, name);

    return CONDITIONS.filter(([bit]) => (raw & bit) !== 0).map(([, condition]) => condition);
}

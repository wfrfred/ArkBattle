const overrideTypes = { DEFAULT: 0, STACK: 1, UNIQUE: 2, EXTEND: 3, EXTEND_TIME: 4 } as const;

export type BuffOverrideType = keyof typeof overrideTypes;

export interface BuffStacking {
    readonly overrideType: BuffOverrideType;
    readonly maxStackCnt: number;
    readonly maxValidStackCnt: number;
    readonly refreshRemainingTimeWhenStackMax: boolean;
    readonly clearAllStackCntWhenTimeUp: boolean;
    readonly takeSnapshotWhenExtend: boolean;
}

function overrideType(value: unknown): BuffOverrideType {
    for (const key in overrideTypes) {
        const type = key as BuffOverrideType;
        if (value === type || value === overrideTypes[type]) {
            return type;
        }
    }

    throw new TypeError(`unsupported buff overrideType: ${String(value)}`);
}

function stackLimit(value: unknown, name: string): number {
    if (typeof value !== "number" || !Number.isSafeInteger(value)) {
        throw new RangeError(`${name} must be a safe integer`);
    }

    return value;
}

export function parseBuffStacking(value: unknown): BuffStacking {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError("buff stacking must be an object");
    }

    const source = value as Record<string, unknown>;
    const refreshRemainingTimeWhenStackMax = source.refreshRemainingTimeWhenStackMax;
    const clearAllStackCntWhenTimeUp = source.clearAllStackCntWhenTimeUp;
    const takeSnapshotWhenExtend = source.takeSnapshotWhenExtend;
    if (
        typeof refreshRemainingTimeWhenStackMax !== "boolean" ||
        typeof clearAllStackCntWhenTimeUp !== "boolean" ||
        typeof takeSnapshotWhenExtend !== "boolean"
    ) {
        throw new TypeError("buff stacking refresh and snapshot flags must be boolean");
    }

    return {
        overrideType: overrideType(source.overrideType),
        maxStackCnt: stackLimit(source.maxStackCnt, "maxStackCnt"),
        maxValidStackCnt: stackLimit(source.maxValidStackCnt, "maxValidStackCnt"),
        refreshRemainingTimeWhenStackMax,
        clearAllStackCntWhenTimeUp,
        takeSnapshotWhenExtend,
    };
}

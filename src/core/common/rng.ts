import {
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "./assert.js";

export type Seed = number;

const UINT32_RANGE = 2 ** 32;

export type NonEmptyArray<T> = readonly [T, ...T[]];

export interface Rng {
    /** @returns [0, 1). */
    next(): number;

    int(upperExclusive: number): number;
    int(lowerInclusive: number, upperExclusive: number): number;

    chance(probability: number): boolean;

    pick<T>(items: NonEmptyArray<T>): T;
    weighted<T>(items: NonEmptyArray<readonly [T, number]>): T;

    shuffle<T>(items: readonly T[]): T[];

    sample<T>(items: Iterable<T>, count: number): readonly T[];

    state(): Seed;
}

export function createRng(seed: Seed): Rng {
    if (!Number.isInteger(seed) || seed < 0 || seed >= UINT32_RANGE) {
        throw new RangeError("seed must be an unsigned 32-bit integer");
    }

    let rngState = seed >>> 0;

    function next(): number {
        rngState = (rngState + 0x6d2b79f5) >>> 0;
        let t = rngState;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE;
    }

    function int(lowerOrUpper: number, upperExclusive?: number): number {
        const lower = upperExclusive === undefined ? 0 : lowerOrUpper;
        const upper = upperExclusive ?? lowerOrUpper;

        if (!Number.isSafeInteger(lower) || !Number.isSafeInteger(upper) || lower >= upper) {
            throw new RangeError(`invalid integer range [${lower}, ${upper})`);
        }

        const width = upper - lower;
        if (width > UINT32_RANGE) {
            throw new RangeError("integer range width must not exceed 2 ** 32");
        }

        return lower + Math.floor(next() * width);
    }

    function chance(probability: number): boolean {
        if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
            throw new RangeError("probability must be a finite number in [0, 1]");
        }

        return next() < probability;
    }

    function pick<T>(items: NonEmptyArray<T>): T {
        return items[int(items.length)]!;
    }

    function weighted<T>(items: NonEmptyArray<readonly [T, number]>): T {
        let total = 0;
        let lastPositive: T | undefined;

        for (const [item, weight] of items) {
            assertNonnegativeNumber(weight, "weight");

            if (weight > 0) {
                lastPositive = item;
            }

            total += weight;
        }

        assertPositiveNumber(total, "total weight");

        let target = next() * total;

        for (const [item, weight] of items) {
            target -= weight;

            if (target < 0) {
                return item;
            }
        }

        return lastPositive!;
    }

    function shuffle<T>(items: readonly T[]): T[] {
        const result = [...items];

        for (let i = result.length - 1; i > 0; i--) {
            const j = int(i + 1);
            const tmp = result[i]!;

            result[i] = result[j]!;
            result[j] = tmp;
        }

        return result;
    }

    function sample<T>(items: Iterable<T>, count: number): readonly T[] {
        assertNonnegativeSafeInteger(count, "sample count");

        if (count === 0) {
            return [];
        }

        const pool = [...items];
        const size = Math.min(count, pool.length);

        for (let index = 0; index < size; index++) {
            const selected = index + int(pool.length - index);

            [pool[index], pool[selected]] = [pool[selected]!, pool[index]!];
        }

        return pool.slice(0, size);
    }

    return {
        next,
        int,
        chance,
        pick,
        weighted,
        shuffle,
        sample,
        state() {
            return rngState;
        },
    };
}

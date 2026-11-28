import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../core/common/assert.js";
import { roundToEven } from "../../core/common/math.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";

export interface FixedTiming {
    readonly type: "FIXED";
    readonly windupTicks: number;
    readonly recoveryTicks: number;
}

export interface AttackSpeedTiming {
    readonly type: "ATTACK_SPEED";
    readonly beginTicks: number;
    readonly durationTicks: number;
    readonly releaseTicks: number;
    readonly minScale: number;
    readonly maxScale: number | null;
}

export type Timing = FixedTiming | AttackSpeedTiming;

export interface Sample {
    readonly definition: Timing;
    readonly durationTicks: number;
    readonly beginUntilTick: number | null;
    readonly releaseAtTick: number | null;
    readonly finishAtTick: number | null;
}

export function validate(definition: Timing): void {
    if (definition.type === "FIXED") {
        assertNonnegativeSafeInteger(definition.windupTicks, "attack windup");
        assertNonnegativeSafeInteger(definition.recoveryTicks, "attack recovery");

        return;
    }

    assertNonnegativeNumber(definition.beginTicks, "attack beginning length");
    assertPositiveNumber(definition.durationTicks, "attack duration");
    assertNonnegativeNumber(definition.releaseTicks, "attack release time");
    assertNonnegativeNumber(definition.minScale, "attack minimum scale");

    if (definition.releaseTicks > definition.durationTicks) {
        throw new RangeError("attack release exceeds its duration");
    }
    if (definition.maxScale !== null) {
        assertNonnegativeNumber(definition.maxScale, "attack maximum scale");
    }
}

function scale(definition: AttackSpeedTiming, periodTicks: number): number {
    const factor = Math.max(
        definition.minScale,
        periodTicks / (definition.beginTicks + definition.durationTicks),
    );

    return definition.maxScale === null ? factor : Math.min(factor, definition.maxScale);
}

function wait(ticks: number): number {
    return Math.max(1, roundToEven(ticks));
}

export function sample(definition: Timing, periodTicks: number, tick: number): Sample {
    if (definition.type === "FIXED") {
        const releaseAtTick = tick + definition.windupTicks;

        return {
            definition,
            durationTicks: definition.windupTicks + definition.recoveryTicks,
            beginUntilTick: null,
            releaseAtTick,
            finishAtTick: releaseAtTick + definition.recoveryTicks,
        };
    }

    const factor = scale(definition, periodTicks);
    const beginUntilTick =
        definition.beginTicks === 0 ? null : tick + wait(definition.beginTicks * factor);

    return {
        definition,
        durationTicks: (definition.beginTicks + definition.durationTicks) * factor,
        beginUntilTick,
        releaseAtTick:
            beginUntilTick === null
                ? tick +
                  Math.min(
                      definition.releaseTicks * factor,
                      wait((definition.beginTicks + definition.durationTicks) * factor),
                  )
                : null,
        finishAtTick: null,
    };
}

export function advance(
    current: Sample,
    periodTicks: number,
    startedAtTick: number,
    tick: number,
): Sample {
    if (
        current.definition.type === "FIXED" ||
        current.beginUntilTick === null ||
        tick < current.beginUntilTick
    ) {
        return current;
    }

    return {
        ...current,
        beginUntilTick: null,
        releaseAtTick: Math.min(
            tick + current.definition.releaseTicks * scale(current.definition, periodTicks),
            startedAtTick + wait(current.durationTicks),
        ),
    };
}

export function release(current: Sample, startedAtTick: number, tick: number): Sample {
    return current.definition.type === "FIXED"
        ? current
        : {
              ...current,
              finishAtTick:
                  tick + wait(Math.max(0, current.durationTicks - (tick - startedAtTick))),
          };
}

export function parseAttackTiming(value: unknown): AttackSpeedTiming {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError("attack timing must be an object");
    }

    const source = value as Record<string, unknown>;
    const framesPerSecond = source.framesPerSecond;
    const beginFrames = source.beginFrames;
    const durationFrames = source.durationFrames;
    const releaseFrame = source.releaseFrame;
    const authoredSpeed = source.authoredSpeed;
    const minScale = source.minScale;
    const maxScale = source.maxScale;

    assertPositiveNumber(framesPerSecond, "attack timing frames per second");
    assertNonnegativeNumber(beginFrames, "attack begin frames");
    assertPositiveNumber(durationFrames, "attack duration frames");
    assertNonnegativeNumber(releaseFrame, "attack release frame");
    assertPositiveNumber(authoredSpeed, "attack authored speed");
    assertFiniteNumber(minScale, "attack minimum scale");
    assertFiniteNumber(maxScale, "attack maximum scale");

    const ticksPerFrame = TICKS_PER_SECOND / framesPerSecond / authoredSpeed;

    return {
        type: "ATTACK_SPEED",
        beginTicks: beginFrames * ticksPerFrame,
        durationTicks: durationFrames * ticksPerFrame,
        releaseTicks: releaseFrame * ticksPerFrame,
        minScale: Math.max(0, minScale),
        maxScale: maxScale < 0 ? null : maxScale,
    };
}

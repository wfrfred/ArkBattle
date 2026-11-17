import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertPositiveNumber,
} from "../../core/common/assert.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type { AttackSpeedTiming } from "../../content/actions/timing.js";

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

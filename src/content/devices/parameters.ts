import {
    assertNonnegativeNumber,
    assertPositiveNumber,
    assertPositiveSafeInteger,
    assertSafeInteger,
} from "../../core/common/assert.js";
import type { ArknightsCharacterInstanceConfig } from "../../data/level/definition.js";
import { parseGroupTags } from "../../data/unit/tags.js";

export interface Parameters {
    readonly maxHp: number;
    readonly recoverySpeed: number;
    readonly taunt: number;
    readonly groupTags: readonly string[];
}

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function characterPhase(
    configuration: ArknightsCharacterInstanceConfig,
    characterValue: unknown,
): Record<string, unknown> {
    const character = object(characterValue, "predefined character record");
    if (!Array.isArray(character.phases)) {
        throw new TypeError("predefined character phases must be an array");
    }

    const phaseIndex = Number(configuration.phase.slice(-1));

    return object(character.phases[phaseIndex], "predefined character phase");
}

export function resolveParameters(
    configuration: ArknightsCharacterInstanceConfig,
    characterValue: unknown,
    characterKey: string,
): Parameters {
    if (configuration.characterKey !== characterKey) {
        throw new TypeError(`expected predefined character ${characterKey}`);
    }

    const phase = characterPhase(configuration, characterValue);
    if (phase.characterPrefabKey !== characterKey) {
        throw new TypeError(`predefined character prefab does not match ${characterKey}`);
    }
    if (configuration.potentialRank !== 0 || configuration.favorPoint !== 0) {
        throw new TypeError("predefined unit potential and favor modifiers are not supported");
    }
    if (!Array.isArray(phase.attributesKeyFrames) || phase.attributesKeyFrames.length === 0) {
        throw new TypeError("predefined unit requires attribute keyframes");
    }

    let maxHp: number | undefined;
    let recoverySpeed: number | undefined;
    let taunt: number | undefined;
    let minimumLevel = Infinity;
    let maximumLevel = -Infinity;

    for (const value of phase.attributesKeyFrames) {
        const frame = object(value, "predefined attribute keyframe");
        const attributes = object(frame.data, "predefined keyframe attributes");

        assertPositiveSafeInteger(frame.level, "predefined keyframe level");

        const hp = attributes.maxHp;
        const frameRecoverySpeed = attributes.hpRecoveryPerSec;
        const frameTaunt = attributes.tauntLevel;

        assertPositiveNumber(hp, "predefined maxHp");
        assertNonnegativeNumber(frameRecoverySpeed, "predefined HP recovery speed");
        assertSafeInteger(frameTaunt, "predefined taunt level");

        if (
            (maxHp !== undefined && maxHp !== hp) ||
            (recoverySpeed !== undefined && recoverySpeed !== frameRecoverySpeed) ||
            (taunt !== undefined && taunt !== frameTaunt)
        ) {
            throw new TypeError("varying predefined unit attributes are not supported");
        }

        maxHp = hp;
        recoverySpeed = frameRecoverySpeed;
        taunt = frameTaunt;
        minimumLevel = Math.min(minimumLevel, frame.level);
        maximumLevel = Math.max(maximumLevel, frame.level);
    }

    if (configuration.level < minimumLevel || configuration.level > maximumLevel) {
        throw new RangeError("predefined unit level is outside attribute keyframes");
    }

    return {
        maxHp: maxHp!,
        recoverySpeed: recoverySpeed!,
        taunt: taunt!,
        groupTags: parseGroupTags(characterValue),
    };
}

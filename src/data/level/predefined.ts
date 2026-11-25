import {
    assertNonnegativeNumber,
    assertPositiveNumber,
    assertPositiveSafeInteger,
    assertSafeInteger,
} from "../../core/common/assert.js";
import type {
    Definition as EffectDefinition,
    Initial as EffectInitial,
} from "../../core/effect/index.js";
import type { Input as UnitInput } from "../../core/unit/index.js";
import { createTerrainEffect, type ContactState } from "../../content/terrain/controller.js";
import { mire, deepsea } from "../../content/terrain/definition.js";
import {
    create as createCrate,
    type Parameters as CrateParameters,
} from "../../content/devices/crate.js";
import {
    create as createShootingPlatform,
    type Parameters as ShootingPlatformParameters,
} from "../../content/devices/shooting-platform.js";
import { Tile } from "../../core/geometry/coordinate.js";
import type { ArknightsPredefinedInstance } from "./definition.js";
import type { PredefinedPrefab } from "./prefab.js";
import { parseGroupTags } from "../unit/tags.js";

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function characterPhase(
    instance: ArknightsPredefinedInstance,
    characterValue: unknown,
): Record<string, unknown> {
    const character = object(characterValue, "predefined character record");
    if (!Array.isArray(character.phases)) {
        throw new TypeError("predefined character phases must be an array");
    }

    const phaseIndex = Number(instance.inst.phase.slice(-1));

    return object(character.phases[phaseIndex], "predefined character phase");
}

function phasePrefabKey(phase: Record<string, unknown>): string {
    const key = phase.characterPrefabKey;
    if (typeof key !== "string" || key.length === 0) {
        throw new TypeError("predefined character prefab key must be nonempty");
    }

    return key;
}

export function resolvePredefinedPrefabKey(
    instance: ArknightsPredefinedInstance,
    characterValue: unknown,
): string {
    return phasePrefabKey(characterPhase(instance, characterValue));
}

function predefinedCharacter(
    instance: ArknightsPredefinedInstance,
    profile: PredefinedPrefab,
    characterValue: unknown,
): Record<string, unknown> {
    if (
        instance.uniEquipIds !== null ||
        instance.masterInfos !== null ||
        instance.overrideTalents !== null ||
        instance.tmplId !== null ||
        (instance.skinId !== null && instance.skinId !== "")
    ) {
        throw new TypeError(
            `unsupported predefined character customization for ${instance.inst.characterKey}`,
        );
    }

    const phase = characterPhase(instance, characterValue);
    if (phasePrefabKey(phase) !== profile.prefabKey) {
        throw new TypeError(`predefined character prefab does not match ${profile.prefabKey}`);
    }

    return phase;
}

function unitDefinition(
    instance: ArknightsPredefinedInstance,
    phase: Record<string, unknown>,
    profile: Extract<PredefinedPrefab, { readonly type: "UNIT" }>,
    groupTags: readonly string[],
) {
    if (instance.inst.potentialRank !== 0 || instance.inst.favorPoint !== 0) {
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

    if (instance.inst.level < minimumLevel || instance.inst.level > maximumLevel) {
        throw new RangeError("predefined unit level is outside attribute keyframes");
    }

    const parameters = {
        id: instance.inst.characterKey,
        classification: {
            type: "DEVICE",
            side: profile.side,
            filterTags: profile.filterTags,
            groupTags,
        },
        taunt: taunt!,
        vitality: {
            defense: { default: 0, min: 0, max: null },
            resistance: { default: 0, min: 0, max: 100 },
            maxHp: { default: maxHp!, min: 1, max: null },
            recoverySpeed: { default: recoverySpeed!, min: 0, max: null },
            recoveryRatio: { default: 0, min: 0, max: 1 },
        },
        deployable: { retreatRestrictions: [], refund: null },
        tileChanges: profile.tileChanges,
    } satisfies CrateParameters & ShootingPlatformParameters;

    switch (profile.prefabKey) {
        case "trap_1105_accrate":
            return createCrate(parameters);

        case "trap_1106_achplat":
            return createShootingPlatform(parameters);

        default:
            throw new TypeError(`unsupported predefined unit content ${profile.prefabKey}`);
    }
}

export type PredefinedCreation =
    | ({ readonly type: "UNIT" } & UnitInput<ReturnType<typeof unitDefinition>>)
    | {
          readonly type: "EFFECT";
          readonly definition: EffectDefinition<ContactState, null>;
          readonly initial: EffectInitial;
      };

export function parsePredefinedCreation(
    instance: ArknightsPredefinedInstance,
    profile: PredefinedPrefab,
    characterValue: unknown,
): PredefinedCreation {
    const phase = predefinedCharacter(instance, profile, characterValue);

    if (profile.type === "EFFECT") {
        return {
            type: "EFFECT",
            definition: {
                ...createTerrainEffect(profile.terrain === "MIRE" ? mire : deepsea),
                id: instance.inst.characterKey,
            },
            initial: {
                source: null,
                scopes: [],
                expiration: { type: "INFINITE" },
                enabled: true,
            },
        };
    }

    return {
        type: "UNIT",
        definition: unitDefinition(instance, phase, profile, parseGroupTags(characterValue)),
        position: Tile.center(instance.position),
        initial: { occupancy: { tile: instance.position } },
    };
}

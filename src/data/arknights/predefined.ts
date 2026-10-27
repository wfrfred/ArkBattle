import {
    assertNonnegativeNumber,
    assertPositiveNumber,
    assertPositiveSafeInteger,
} from "../../core/common/assert.js";
import {
    createPredefinedDefinition,
    type PredefinedDefinition,
} from "../../core/battle/steps/predefined.js";
import { createMechanismDefinition } from "../../core/battle/mechanism.js";
import { createTerrainMechanism } from "../../content/terrain/mechanism.js";
import { mire, deepsea } from "../../content/terrain/definition.js";
import { create as createCrate } from "../../content/devices/crate.js";
import { create as createShootingPlatform } from "../../content/devices/shooting-platform.js";
import type { Definition as DeviceDefinition } from "../../content/devices/tile.js";
import { Tile } from "../../core/geometry/coordinate.js";
import { createDefinition as createDeployableDefinition } from "../../core/unit/capability/deployable/index.js";
import type { ArknightsPredefinedInstance } from "./level.js";
import type { PredefinedPrefab } from "./prefab.js";
import { secondsToTicks } from "./tick.js";

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
): DeviceDefinition {
    if (instance.inst.potentialRank !== 0 || instance.inst.favorPoint !== 0) {
        throw new TypeError("predefined unit potential and favor modifiers are not supported");
    }
    if (!Array.isArray(phase.attributesKeyFrames) || phase.attributesKeyFrames.length === 0) {
        throw new TypeError("predefined unit requires attribute keyframes");
    }

    let maxHp: number | undefined;
    let cost: number | undefined;
    let respawnTime: number | undefined;
    let minimumLevel = Infinity;
    let maximumLevel = -Infinity;

    for (const value of phase.attributesKeyFrames) {
        const frame = object(value, "predefined attribute keyframe");
        const attributes = object(frame.data, "predefined keyframe attributes");

        assertPositiveSafeInteger(frame.level, "predefined keyframe level");

        const hp = attributes.maxHp;
        const frameCost = attributes.cost;
        const frameRespawnTime = attributes.respawnTime;

        assertPositiveNumber(hp, "predefined maxHp");
        assertNonnegativeNumber(frameCost, "predefined deployment cost");
        assertNonnegativeNumber(frameRespawnTime, "predefined respawn time");

        if (
            (maxHp !== undefined && maxHp !== hp) ||
            (cost !== undefined && cost !== frameCost) ||
            (respawnTime !== undefined && respawnTime !== frameRespawnTime)
        ) {
            throw new TypeError("varying predefined unit attributes are not supported");
        }

        maxHp = hp;
        cost = frameCost;
        respawnTime = frameRespawnTime;
        minimumLevel = Math.min(minimumLevel, frame.level);
        maximumLevel = Math.max(maximumLevel, frame.level);
    }

    if (instance.inst.level < minimumLevel || instance.inst.level > maximumLevel) {
        throw new RangeError("predefined unit level is outside attribute keyframes");
    }

    const configuration = {
        id: instance.inst.characterKey,
        vitality: { defense: 0, resistance: 0, maxHp: maxHp! },
        deployable: createDeployableDefinition({
            ...profile.deployable,
            cost: cost!,
            redeployTicks: secondsToTicks(respawnTime!),
            slots: 0,
        }),
        tileChanges: profile.tileChanges,
    };

    switch (profile.prefabKey) {
        case "trap_1105_accrate":
            return createCrate(configuration);

        case "trap_1106_achplat":
            return createShootingPlatform(configuration);

        default:
            throw new TypeError(`unsupported predefined unit content ${profile.prefabKey}`);
    }
}

export function parsePredefinedDefinition(
    id: number,
    instance: ArknightsPredefinedInstance,
    profile: PredefinedPrefab,
    characterValue: unknown,
): PredefinedDefinition {
    const phase = predefinedCharacter(instance, profile, characterValue);

    if (profile.type === "MECHANISM") {
        return createPredefinedDefinition({
            id,
            alias: instance.alias,
            initiallyPresent: !instance.hidden,
            creation: {
                type: "MECHANISM",
                definition: createMechanismDefinition({
                    ...createTerrainMechanism(profile.terrain === "MIRE" ? mire : deepsea),
                    id: instance.inst.characterKey,
                }),
            },
        });
    }

    const definition = unitDefinition(instance, phase, profile);
    const position = Tile.center(instance.position);

    return createPredefinedDefinition({
        id,
        alias: instance.alias,
        initiallyPresent: !instance.hidden,
        creation: {
            type: "UNIT",
            definition,
            position,
            tile: instance.position,
        },
    });
}

import { Hooks } from "../../core/hook.js";
import type {
    Definition as EffectDefinition,
    Initial as EffectInitial,
} from "../../core/effect/index.js";
import type { Input as UnitInput } from "../../core/unit/index.js";
import { createTerrainEffect, type ContactState } from "../../content/terrain/controller.js";
import { mire, deepsea } from "../../content/terrain/definition.js";
import { create as createCrate, resolve as resolveCrate } from "../../content/devices/crate.js";
import {
    create as createShootingPlatform,
    resolve as resolveShootingPlatform,
} from "../../content/devices/shooting-platform.js";
import { Tile } from "../../core/geometry/coordinate.js";
import type { ArknightsPredefinedInstance } from "./definition.js";
import type { PredefinedPrefab } from "./prefab.js";

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

function validateCustomization(instance: ArknightsPredefinedInstance): void {
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
}

function unitDefinition(
    instance: ArknightsPredefinedInstance,
    profile: Extract<PredefinedPrefab, { readonly type: "UNIT" }>,
    characterValue: unknown,
) {
    // Legacy prefab profiles only select supported content. Its fixed behavior
    // belongs to the concrete device definition, not to extracted fields.
    switch (profile.prefabKey) {
        case "trap_1105_accrate":
            return createCrate(resolveCrate(instance.inst, characterValue));

        case "trap_1106_achplat":
            return createShootingPlatform(resolveShootingPlatform(instance.inst, characterValue));

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
    validateCustomization(instance);

    if (profile.type === "EFFECT") {
        if (resolvePredefinedPrefabKey(instance, characterValue) !== profile.prefabKey) {
            throw new TypeError(`predefined character prefab does not match ${profile.prefabKey}`);
        }

        return {
            type: "EFFECT",
            definition: {
                ...createTerrainEffect(profile.terrain === "MIRE" ? mire : deepsea, null),
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
        definition: unitDefinition(instance, profile, characterValue),
        position: Tile.center(instance.position),
        hooks: Hooks.empty(),
        initial: { occupancy: { tile: instance.position, direction: null } },
    };
}

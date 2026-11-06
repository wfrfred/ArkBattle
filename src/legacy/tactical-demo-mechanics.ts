import { createPredefinedDefinition } from "../core/battle/steps/predefined.js";
import { create as createAction, createActions } from "../core/unit/action/index.js";
import { create as createSkill } from "../core/unit/skill/index.js";
import type { Definitions as CapabilityDefinitions } from "../core/unit/capability/catalog.js";
import { create as createAttack } from "../content/actions/attack.js";

import type { Map } from "../core/battlefield/map/map.js";
import { TICKS_PER_SECOND } from "../core/tick.js";
import { Type as ElementType } from "../core/unit/capability/elemental/index.js";
import { createInput, type Input as RouteInput } from "../core/battle/creation/route.js";
import { createArknightsElementalDefinition } from "../data/arknights/elemental.js";
import { compileArknightsAttackBuffSkill } from "../data/arknights/skill-buff.js";
import { createTacticalCombatDemoSpec } from "./tactical-demo-combat.js";
import type { LegacyData } from "./tactical-demo-presentation.js";

const ELEMENT_SCENARIOS = {
    ELEMENT_NEURAL: ElementType.NEURAL,
    ELEMENT_EROSION: ElementType.EROSION,
    ELEMENT_BURN: ElementType.BURN,
    ELEMENT_NECROSIS: ElementType.NECROSIS,
} as const;

export type TacticalMechanicsScenario = "SKILL" | keyof typeof ELEMENT_SCENARIOS;

export function isTacticalMechanicsScenario(
    value: string | undefined,
): value is TacticalMechanicsScenario {
    return value === "SKILL" || (value !== undefined && Object.hasOwn(ELEMENT_SCENARIOS, value));
}

export function createTacticalMechanicsDemo(
    map: Map,
    route: RouteInput,
    data: LegacyData,
    seed: number,
    scenario: TacticalMechanicsScenario,
    rawSkill?: unknown,
) {
    const base = createTacticalCombatDemoSpec(map, route, data, seed, "PROJECTILE");
    const predefined = base.predefines[0]!;
    const source = predefined.creation;
    const spawn = base.schedule.spawns[0]!;
    const maxTicks = (scenario === "SKILL" ? 120 : 60) * TICKS_PER_SECOND;
    const elementType = scenario === "SKILL" ? null : ELEMENT_SCENARIOS[scenario];
    const sourceDefinition = source.definition;
    const action = sourceDefinition.attack.attack;
    const group = action.targetGroups[0];
    let definition: typeof sourceDefinition & {
        readonly skill?: CapabilityDefinitions["skill"];
    };

    if (scenario === "SKILL") {
        const skill = compileArknightsAttackBuffSkill(rawSkill, 4);
        definition = {
            ...sourceDefinition,
            skill: { initialize: (battle) => createSkill(battle, skill) },
        };
    } else {
        const attack = createAttack({
            ...action,
            targetGroups: [
                {
                    ...group,
                    operations: [
                        ...group.operations,
                        {
                            type: "ELEMENTAL_INJURY",
                            elementType: ELEMENT_SCENARIOS[scenario],
                            power: 400,
                        },
                    ],
                },
            ],
        });
        const initializeAttack = createAction(attack);
        definition = {
            ...sourceDefinition,
            attack,
            action: {
                ...sourceDefinition.action,
                initialize: (battle) => createActions(battle, initializeAttack),
            },
        };
    }

    const target = {
        ...spawn.definition,
        vitality: { ...spawn.definition.vitality, maxHp: 200_000 },
        locomotion: {
            ...spawn.definition.locomotion,
            speed: 0,
            minSpeed: 0,
        },
        ...(elementType === null
            ? {}
            : { elemental: createArknightsElementalDefinition({ receiver: "ENEMY" }) }),
    };
    const targetRoute = createInput({
        ...route,
        startPosition: [5, 6],
        endPosition: [5, 7],
        spawnOffset: [0, 0],
        spawnRandomRange: [0, 0],
        checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: maxTicks + 1 }],
    });

    return {
        input: {
            ...base,
            predefines: [
                createPredefinedDefinition({
                    ...predefined,
                    creation: { ...source, definition },
                }),
            ],
            schedule: {
                type: "TIMELINE" as const,
                spawns: [{ ...spawn, definition: target, route: targetRoute, tick: 0 }],
            },
            maxTicks,
        },
        elementType,
    };
}

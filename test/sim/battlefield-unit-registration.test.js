import * as conditions from "../../dist/content/terrain/condition.js";
import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { unitsAt } from "../helpers/battlefield.js";
import { damage as damageTargeting, healing as healingTargeting } from "../helpers/targeting.js";
import { definition as skillDefinition } from "../helpers/skill.js";
import { actionCapability } from "../helpers/actions.js";
import { create as createAttack } from '../../dist/content/actions/attack.js';
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { create as createFieldState } from '../../dist/core/battlefield/state.js';
import { add as addUnit, update as updateUnit } from '../../dist/core/battlefield/unit.js';
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { initialize } from "../helpers/unit.js";

const map = () =>
    createMap(
        1,
        3,
        tileEntries(Array.from({ length: 3 }, () =>
            createTile({
                heightType: "LOWLAND", meleeBlockable: true,
                buildableType: "ALL",
                passableMask: "ALL",
                terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
            }),
        )),
    );

const definition = () => ({ hooks: [],
    id: "paired-capabilities",
    targetable: { restrictions: [] }, spatialPresence: {}, occupancy: { slot: "OCCUPANT" },
    deployable: {
        cost: 10,
        redeployTicks: 30,
        slots: 1,
        placement: "MELEE",
        allowedSiteConditions: [conditions.normal],
        refund: { rate: 0.5, limit: "BASE_COST" },
    },
    vitality: { maxHp: 100, defense: 20, resistance: 10 },
    offense: { attack: 10 },
    action: actionCapability(createAttack({ id: 'normal', speed: 100,
            triggerBindingId: "primary",
            intervalTicks: 3,
            recoveryTicks: 0,
            followUps: [],
            targetGroups: [
                {
                    id: "primary",
                    operations: [{ type: "DAMAGE", power: 10, damageType: "PHYSICAL" }],
                    targeting: damageTargeting({
                        type: "DAMAGE",
                        scope: {
                            type: "RANGE",
                            geometry: [{ type: "CIRCLE", offset: [0, 0], radius: 1 }],
                        },
                        canTargetAir: false,
                        includeBlockingRelations: false,
                        preferBlockingRelations: false,
                        ignoreTargetFree: false,
                        ignoreInvisible: false,
                        maxTargets: 1,
                    }),
                },
            ],
         })),
    elemental: {
        maxEp: 1000,
        recoveryPerSecond: 0,
        elementResistance: 0,
        damageResistance: 0,
        burstRecoverySpeed: 1,
        bursts: Object.fromEntries(["NEURAL", "EROSION", "BURN", "NECROSIS"].map(type => [type, { durationTicks: 300, onStart: battle => battle }])),
    },
    skill: skillDefinition({
        id: "paired-skill",
        sp: { initial: 0, capacity: 10, requirement: 10, recovery: { type: "TIME", intervalTicks: 30 } },
    }),
    allegiance: { side: "ALLY" },
    layer: { type: "GROUND" },
    hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.25 } },
    blocker: { capacity: 1, geometry: { radius: 0.5 } },
    blockable: { volume: 1 },
    locomotion: {
        halfBodyWidth: 0, minSpeed: 0, speed: 0.1,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    },
});

test("battlefield registration retains initialized capabilities and shared definitions", () => {
    let runtime = createFieldState(map());
    const unit = initialize({ id: 1, definition: definition(), position: [0, 0] });
    runtime = addUnit(runtime, unit);
    assert.equal(runtime.units.get(1), unit);
    assert.deepEqual(
        unitsAt(runtime, [0, 0])
            .map((value) => value.id),
        [1],
    );
});

test("battlefield replacement preserves configured capability composition on update", () => {
    let runtime = createFieldState(map());
    const unit = initialize({ id: 1, definition: definition(), position: [0, 0] });
    const bare = initialize({ id: 2, definition: { hooks: [], id: "bare" }, position: [2, 0] });
    runtime = [unit, bare].reduce((field, unit) => addUnit(field, unit), runtime);
    const currentAction = unit.action.actions.get("normal");
    const updated = {
        ...unit,
        action: { ...unit.action, actions: unit.action.actions.replace(currentAction.definition, { ...currentAction, cooldown: { periodTicks: 3, readyAtTick: 7 } }) },
        spatialPresence: { present: false },
        occupancy: { tile: null },
    };
    runtime = updateUnit(runtime, [updated]);
    assert.deepEqual(runtime.units.get(1).action, updated.action);
    assert.deepEqual(unitsAt(runtime, [0, 0]), []);
    const restored = { ...updated, spatialPresence: { present: true }, occupancy: { tile: null } };
    runtime = updateUnit(runtime, [restored]);
    assert.deepEqual(
        unitsAt(runtime, [0, 0])
            .map((value) => value.id),
        [1],
    );
});

test("Unit with an acting definition and no action state remains statically legal", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-registration-types-"));
    const sourceModule = (name) =>
        JSON.stringify(
            fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)),
        );
    const path = join(directory, "missing-action.mts");
    try {
        writeFileSync(
            path,
            `
import type { Unit, Definition } from ${sourceModule("unit/unit")};
import { Effects } from ${sourceModule("unit/effect/effects")};
import type { Action } from ${sourceModule("unit/capability/action/capability")};
import type { ImmutableData } from ${sourceModule("common/immutable-data")};
import type { Map as TileMap } from ${sourceModule("battlefield/map/map")};
import { create } from ${sourceModule("battlefield/state")};
import { add as addUnit } from ${sourceModule("battlefield/unit")};
type ActingDefinition = Definition & Action['definition'];
declare const definition: ImmutableData<ActingDefinition>;
declare const map: TileMap;
const unit = { id: 1, definition, position: [0, 0], effects: Effects.empty(), lifecycle: 'PRESENT' } satisfies Unit;
const baseUnit: Unit = unit;
const battlefield = create(map);
addUnit(battlefield, baseUnit);
declare const other: Unit & { readonly marker: 17 };
const populated = addUnit(addUnit(battlefield, unit), other);
const current: Unit | undefined = populated.units.get(unit.id);
// @ts-expect-error heterogeneous storage does not promise every Unit has marker.
current?.marker;
`,
        );
        const program = ts.createProgram([path], {
            noEmit: true,
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            strict: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            skipLibCheck: true,
            types: [],
        });
        const diagnostics = ts
            .getPreEmitDiagnostics(program)
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        assert.deepEqual(diagnostics, []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

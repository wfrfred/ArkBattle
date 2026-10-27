import { hash as navigationHash } from "../core/battlefield/navigation/map.js";
import { apply as applyOverlays } from "../core/battlefield/navigation/overlay.js";
import {
    initialize,
    step as stepBattle,
    type Command,
    type Event,
} from "../core/battle/runtime.js";
import { getSpawnScheduleCounts } from "../core/battle/schedule/runtime.js";
import * as units from "../core/unit/query.js";
import { relations as blockingRelations } from "../core/battle/blocking/query.js";
import * as projectiles from "../core/projectile/query.js";
import type { Map as TileMap } from "../core/battlefield/map/map.js";
import { infection, mire, deepsea, smog } from "../content/terrain/definition.js";
import { TICKS_PER_SECOND } from "../core/tick.js";
import {
    loadMovementScenario,
    type ArknightsMovementCatalog,
    type ArknightsMovementSelection,
} from "../data/arknights/movement-scenario.js";
import {
    createTacticalCombatDemoSpec,
    type TacticalCombatScenario,
} from "./tactical-demo-combat.js";
import {
    TacticalDemoPresentation,
    type LegacyData,
    type LegacyElementGauge,
    type LegacyUnitInfo,
    type LegacyVisualEvent,
} from "./tactical-demo-presentation.js";
import { createTacticalProjectileDemo } from "./projectile-demo.js";
import { project as projectTrackingProjectile } from "../content/projectiles/tracking.js";
import { hasAllegiance } from "../core/unit/capability/allegiance/capability.js";
import { hasAction } from "../core/unit/capability/action/capability.js";
import { hasSkill } from "../core/unit/capability/skill/capability.js";
import {
    createTacticalMechanicsDemo,
    isTacticalMechanicsScenario,
    type TacticalMechanicsScenario,
} from "./tactical-demo-mechanics.js";
import { hasElemental } from "../core/unit/capability/elemental/capability.js";
import {
    createTacticalContentDemo,
    defaults as contentDefaults,
    type Tables as ContentTables,
    type ConfigurationInput as ContentConfiguration,
} from "./tactical-demo-content.js";
import { readShield } from "../content/operators/mudrock.js";
import { hasVitality, resolveMaxHp } from "../core/unit/capability/vitality/capability.js";

interface LegacyView {
    setStage(stage: Record<string, unknown>): unknown;
    enterBattle(field: {
        fieldId: string;
        kind: string;
        stageId: string;
        rect: Record<string, number>;
        units: readonly LegacyUnitInfo[];
    }): unknown;
    setCamera(kind: string, options: { rect: Record<string, number>; instant: boolean }): unknown;
    setLocalFeed(options: { on: boolean; speed?: number }): unknown;
    pushSnapshot(state: {
        fieldId: string;
        gt: number;
        units: readonly number[][];
        elem: readonly LegacyElementGauge[];
        dp: number;
        killed: number;
        total: number;
    }): unknown;
    pushEvents(events: {
        fieldId: string;
        gt: number;
        ev: readonly (LegacyVisualEvent | readonly ["spawn", LegacyUnitInfo])[];
    }): unknown;
    setProjectiles?(
        projectiles: readonly {
            readonly id: number;
            readonly source: number | null;
            readonly position: readonly [number, number];
            readonly destination: readonly [number, number];
        }[],
    ): unknown;
    debug: { interp: { snapToNewest(): unknown; maxExtrapolate: number } };
}

export interface TacticalDemoOptions {
    readonly stageId: string;
    readonly data: LegacyData;
    readonly seed?: number;
    readonly mode?: "MOVEMENT" | "COMBAT";
    readonly combatScenario?:
        TacticalCombatScenario | TacticalMechanicsScenario | "PROJECTILE_CACHED" | "CONTENT";
    readonly contentConfiguration?: Pick<ContentConfiguration, "mudrock">;
    readonly onEvent?: (event: unknown) => void;
}

export type TacticalDemoCommand =
    | "APPEAR_CRATES"
    | "REMOVE_CRATES"
    | "TRIGGER_DRAGON"
    | "RETREAT_SOURCE"
    | "STOP_PROJECTILES"
    | "ACTIVATE_SKILL"
    | "FINISH_SKILL";

const STAGE_IDS = new Set([
    "act1autochess_01",
    "act1autochess_m01",
    "act1autochess_m02",
    "act2autochess_m02",
    "act2autochess_m04",
]);
const FIXTURES = [
    "enemy_1007_slime",
    "enemy_1000_gopro",
    "enemy_9012_acloon",
    "character_trap_1105_accrate",
    "character_trap_098_mire",
    "character_trap_042_tidectrl",
    "skill_sktok_accrate",
    "skill_sktok_mire",
    "skill_sktok_tidectrl_3",
    "prefab_enemy_1007_slime",
    "prefab_enemy_1000_gopro",
    "prefab_enemy_9012_acloon",
    "prefab_trap_1105_accrate",
    "prefab_trap_098_mire",
    "prefab_trap_042_tidectrl",
    "prefab_tile_deepsea",
    "prefab_sktok_mire",
    "prefab_sktok_tidectrl_3",
];
const fixtureCache = new Map<string, Promise<unknown>>();

function fixture(name: string): Promise<unknown> {
    let loaded = fixtureCache.get(name);

    if (loaded === undefined) {
        loaded = fetch(`/fixtures/${name}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`cannot load ${name}: HTTP ${response.status}`);
                }

                return response.json() as Promise<unknown>;
            })
            .catch((error: unknown) => {
                fixtureCache.delete(name);
                throw error;
            });
        fixtureCache.set(name, loaded);
    }

    return loaded;
}

function record(value: unknown): Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function stageRows(map: TileMap): string[] {
    const rows: string[][] = [];
    const terrains = new Map([
        [mire.id, "m"],
        [deepsea.id, "d"],
        [smog.id, "g"],
        [infection.id, "i"],
    ]);

    for (let row = 0; row < map.rows; row++) {
        rows.push(
            Array.from({ length: map.columns }, (_, col) => {
                const tile = map.tiles.get(row * map.columns + col)!;
                const terrain = terrains.get(tile.definition.terrain.definition.id);

                if (terrain !== undefined) {
                    return terrain;
                }
                if (tile.state.passability === "NONE" && tile.state.placement === "NONE") {
                    return "#";
                }
                if (tile.state.elevation === "HIGHLAND") {
                    return tile.state.placement === "NONE" ? "#" : "h";
                }

                return tile.state.placement === "NONE" ? "r" : "f";
            }),
        );
    }

    const glyph = { START: "S", END: "E", TELEPORT_IN: "I", TELEPORT_OUT: "O" } as const;

    for (const marker of map.markers) {
        rows[marker.position[0]]![marker.position[1]] = glyph[marker.type];
    }

    return rows.map((row) => row.join(""));
}

export async function createTacticalDemo(view: LegacyView, options: TacticalDemoOptions) {
    const { stageId, data, seed = 123, mode = "MOVEMENT" } = options;
    const projectileActions =
        mode === "COMBAT" &&
        (options.combatScenario === "PROJECTILE" ||
            options.combatScenario === "PROJECTILE_CACHED" ||
            options.combatScenario === "CONTENT");
    const contentScene = mode === "COMBAT" && options.combatScenario === "CONTENT";
    const combatScenario =
        options.combatScenario === "PROJECTILE_CACHED" ? "PROJECTILE" : options.combatScenario;
    const mechanicsScenario =
        mode === "COMBAT" && isTacticalMechanicsScenario(combatScenario) ? combatScenario : null;

    if (!STAGE_IDS.has(stageId)) {
        throw new RangeError(`unsupported demo stage: ${stageId}`);
    }

    if (mode === "COMBAT" && stageId !== "act1autochess_m01") {
        throw new RangeError(`unsupported combat demo stage: ${stageId}`);
    }

    const [rawLevel, entries] = await Promise.all([
        fixture(`level_${stageId}`),
        Promise.all(FIXTURES.map(async (name) => [name, await fixture(name)] as const)),
    ]);
    const records = new Map(entries);
    const catalog: ArknightsMovementCatalog = {
        character: (key) => records.get(`character_${key}`),
        skill: (key) => records.get(`skill_${key}`),
        prefab: (key) => records.get(`prefab_${key}`),
        enemy: (key) => records.get(key === "enemy_1000_gopro_2" ? "enemy_1000_gopro" : key),
    };

    const rawPredefines = record(record(rawLevel).predefines).tokenInsts;
    const supported = new Set(["trap_1105_accrate", "trap_098_mire", "trap_042_tidectrl"]);
    let predefines: ArknightsMovementSelection["predefines"] = [];

    if (Array.isArray(rawPredefines)) {
        predefines = rawPredefines.flatMap((value, index) => {
            const characterKey = String(record(record(value).inst).characterKey);

            if (!supported.has(characterKey)) {
                return [];
            }

            return [{ source: "predefines" as const, collection: "tokenInsts" as const, index }];
        });
    }

    const selection: ArknightsMovementSelection = {
        actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }],
        branches: stageId === "act1autochess_01" ? ["dragon"] : [],
        predefines,
    };
    const scenario = loadMovementScenario(rawLevel, selection, catalog, seed);

    const route = scenario.level.routes[0]!;
    const content = contentScene
        ? createTacticalContentDemo(
              scenario.spec.map,
              route,
              (await fixture("main-mode-units")) as ContentTables,
              {
                  ...contentDefaults,
                  ...options.contentConfiguration,
                  seed,
              },
          )
        : null;
    const mechanics =
        mechanicsScenario === null
            ? null
            : createTacticalMechanicsDemo(
                  scenario.spec.map,
                  route,
                  data,
                  seed,
                  mechanicsScenario,
                  mechanicsScenario === "SKILL" ? await fixture("skill_skcom_atk_up_2") : undefined,
              );
    const spec =
        content?.input ??
        mechanics?.input ??
        (mode === "COMBAT"
            ? createTacticalCombatDemoSpec(
                  scenario.spec.map,
                  route,
                  data,
                  seed,
                  isTacticalMechanicsScenario(combatScenario) || combatScenario === "CONTENT"
                      ? undefined
                      : combatScenario,
              )
            : scenario.spec);
    const presentation = new TacticalDemoPresentation(data, {
        projectileActions,
        ...(content === null ? {} : { unitMetadata: content.unitMetadata }),
    });

    const legacyStage = record(data.lookup("stages", stageId));
    const renderedStageId = `ts-demo:${stageId}`;
    const stage = {
        ...legacyStage,
        id: renderedStageId,
        rows: Array.isArray(legacyStage.rows) ? legacyStage.rows : stageRows(spec.map),
        devices: [],
    };
    const kind = route.startPosition[0] <= 6 ? "boss" : "normal";
    const rect =
        kind === "boss" ? { r0: 0, r1: 6, c0: 0, c1: 20 } : { r0: 6, r1: 13, c0: 0, c1: 20 };
    const fieldId = "ts-tactical-demo";

    const commands = new Map<number, readonly Command[]>();
    const crateIds = spec.predefines
        .filter((definition) => definition.creation.type === "UNIT")
        .map((definition) => definition.id);

    const projectile =
        projectileActions && !contentScene
            ? createTacticalProjectileDemo(spec, options.combatScenario === "PROJECTILE_CACHED")
            : null;
    const input = projectile?.input ?? spec;
    let state = initialize(input);
    let knownUnits = new Set<number>();
    let accumulatedTicks = 0;
    let stopped = false;
    const previousExtrapolate = view.debug.interp.maxExtrapolate;

    function publish(
        events: readonly Event[] = [],
        visuals: readonly LegacyVisualEvent[] = [],
    ): void {
        const visible = presentation.units(state);
        const fresh = visible.filter((unit) => !knownUnits.has(unit.info.id));

        if (fresh.length > 0 || visuals.length > 0) {
            view.pushEvents({
                fieldId,
                gt: state.tick / TICKS_PER_SECOND,
                ev: [...fresh.map((unit) => ["spawn", unit.info] as const), ...visuals],
            });
        }

        knownUnits = new Set(visible.map((unit) => unit.info.id));
        const counts = getSpawnScheduleCounts(state.schedule);
        view.pushSnapshot({
            fieldId,
            gt: state.tick / TICKS_PER_SECOND,
            units: visible.map((unit) => unit.tuple),
            elem: presentation.elements(state),
            dp: 0,
            killed: presentation.stats().killedCount,
            total: counts.spawnedCount + counts.unspawnedCount,
        });
        view.setProjectiles?.(
            projectiles
                .all(state)
                .flatMap((projectile) => {
                    const presented = projectTrackingProjectile(state, projectiles.ref(projectile));

                    return presented === undefined ? [] : [presented];
                })
                .toArray(),
        );

        for (const event of events) {
            if (event.type === "UNIT_REMOVED") {
                options.onEvent?.({
                    type: event.type,
                    unitId: event.unitId,
                    reason: event.reason,
                    tick: event.tick,
                });
                continue;
            }

            if (
                event.type === "ENEMY_SPAWNED" ||
                event.type === "ROUTE_COMPLETED" ||
                event.type === "ACTION" ||
                event.type === "ACTION_RELEASED" ||
                event.type === "ACTION_FINISHED" ||
                event.type === "ACTION_CANCELLED" ||
                event.type === "PROJECTILE_REACHED" ||
                event.type === "PROJECTILE_HIT" ||
                event.type === "PROJECTILE_STOPPED" ||
                event.type === "DAMAGE" ||
                event.type === "HEAL" ||
                event.type === "SKILL_ACTIVATED" ||
                event.type === "SKILL_FINISHED" ||
                event.type === "ELEMENT_DAMAGE" ||
                event.type === "ELEMENT_HEAL" ||
                event.type === "ELEMENT_BURST" ||
                event.type === "ELEMENT_RECOVERED"
            ) {
                options.onEvent?.(event);
            }
        }
    }

    function enter(): void {
        const visible = presentation.units(state);
        view.setStage(stage);
        view.enterBattle({
            fieldId,
            kind,
            rect,
            stageId: renderedStageId,
            units: visible.map((unit) => unit.info),
        });
        view.setCamera(kind, { rect, instant: true });
        view.setLocalFeed({ on: true, speed: 1 });
        view.debug.interp.maxExtrapolate = 0;
        knownUnits = new Set(visible.map((unit) => unit.info.id));
        publish([], presentation.replayEvents(state));
        view.debug.interp.snapToNewest();
    }

    function advance(requested: readonly Command[] = commands.get(state.tick) ?? []) {
        state = stepBattle(state, requested);
        const visuals = presentation.advance(state, state.events);

        return { events: state.events, visuals, result: state.result };
    }

    function step(): void {
        if (stopped || state.result !== null) {
            return;
        }

        const result = advance();
        publish(result.events, result.visuals);
    }

    function seek(seconds: number): void {
        if (stopped) {
            return;
        }

        const target = Math.max(0, Math.min(spec.maxTicks, Math.round(seconds * TICKS_PER_SECOND)));
        state = initialize(input);
        accumulatedTicks = 0;
        presentation.reset();

        while (state.tick < target && state.result === null) {
            advance();
        }

        enter();
    }

    function skillStats() {
        const source = manualSkillUnit();

        if (source === undefined) {
            return null;
        }

        const { skill } = source;
        const spCost = source.definition.skill.sp?.requirement ?? 0;
        const active = skill.active;

        return {
            sp: skill.sp?.value ?? 0,
            maxSp: spCost,
            active: active !== null,
            remainingTicks:
                active?.sustain.type === "TIME"
                    ? Math.max(0, active.sustain.endsAtTick - state.tick)
                    : 0,
            remainingAmmo: active?.sustain.type === "AMMO" ? active.sustain.remaining : undefined,
            ready: active === null && (skill.sp?.value ?? 0) >= spCost && state.result === null,
        };
    }

    function manualSkillUnit() {
        return units
            .all(state)
            .filter(hasSkill)
            .find((unit) => unit.definition.skill.activation?.trigger === "MANUAL");
    }

    function contentStats() {
        if (!contentScene) {
            return null;
        }

        const stats = (definitionId: string) => {
            const unit = units.all(state).find((unit) => unit.definition.id === definitionId);

            if (unit === undefined || !hasVitality(unit) || !hasSkill(unit)) {
                return null;
            }

            const shield = readShield(unit);

            return {
                hp: unit.vitality.hp,
                maxHp: resolveMaxHp(unit.vitality, unit.definition.vitality),
                sp: unit.skill.sp?.value ?? 0,
                maxSp: unit.definition.skill.sp?.requirement ?? 0,
                ...(shield === undefined
                    ? {}
                    : { shieldLayers: shield.layers, shieldTimerTicks: shield.timer }),
            };
        };

        return { mudrock: stats("char_311_mudrok"), melantha: stats("char_208_melan") };
    }

    function elementStats() {
        const target = units
            .all(state)
            .filter(hasElemental)
            .find((unit) => hasAllegiance(unit) && unit.allegiance.side === "ENEMY");
        const type = mechanics?.elementType;

        if (target === undefined || type == null) {
            return null;
        }

        return {
            remainingEp: target.elemental.ep[type],
            maxEp: target.definition.elemental.maxEp,
            recoveryTicks: target.elemental.burst?.remainingTicks ?? 0,
        };
    }

    enter();

    return {
        stageId,
        seed,
        duration: spec.maxTicks / TICKS_PER_SECOND,

        get time() {
            return state.tick / TICKS_PER_SECOND;
        },

        get state() {
            return state;
        },
        stats: () => ({
            mode,
            combatScenario: options.combatScenario ?? "MIXED",
            ...presentation.stats(),
            skill: skillStats(),
            content: contentStats(),
            elementType: mechanics?.elementType ?? null,
            element: elementStats(),
            blockingCount: blockingRelations(state).length,
            activeActionCount: units
                .all(state)
                .reduce(
                    (total, unit) => total + (hasAction(unit) ? unit.action.instances.size : 0),
                    0,
                ),
            projectileCount: state.battlefield.projectiles.size,
            projectileActions,
            sourcePresent: units
                .all(state)
                .some((unit) => hasAllegiance(unit) && unit.allegiance.side === "ALLY"),
            tickIndex: state.tick,
            units: state.battlefield.units.size,
            mechanisms: state.mechanisms.size,
            spawnedCount: state.schedule.spawnedCount,
            completedRouteCount: state.completedRouteCount,
            walkHash: navigationHash(
                applyOverlays(
                    state.battlefield.navigation.baseline.WALK,
                    state.battlefield.navigation.overlays.WALK,
                ),
            ),
            result: state.result,
            seed,
        }),

        step() {
            step();
            view.debug.interp.snapToNewest();
        },

        nextRelease(): void {
            if (!projectileActions || stopped || state.result !== null) {
                return;
            }

            const events: Event[] = [];
            const visuals: LegacyVisualEvent[] = [];

            while (state.tick < spec.maxTicks) {
                const advanced = advance();
                events.push(...advanced.events);
                visuals.push(...advanced.visuals);

                if (
                    advanced.result !== null ||
                    advanced.events.some((event) => event.type === "ACTION_RELEASED")
                ) {
                    break;
                }
            }

            publish(events, visuals);
            view.debug.interp.snapToNewest();
        },

        nextSkillReady(): void {
            if (
                (mechanicsScenario !== "SKILL" && !contentScene) ||
                stopped ||
                state.result !== null
            ) {
                return;
            }

            const events: Event[] = [];

            while (skillStats()?.ready !== true) {
                const advanced = advance();
                events.push(...advanced.events);

                if (advanced.result !== null) {
                    break;
                }
            }

            publish(events, presentation.replayEvents(state));
            view.debug.interp.snapToNewest();
        },

        tick(seconds: number): void {
            if (stopped) {
                return;
            }
            if (seconds <= 0) {
                view.debug.interp.snapToNewest();

                return;
            }

            accumulatedTicks += seconds * TICKS_PER_SECOND;

            while (accumulatedTicks >= 1 && state.result === null) {
                step();
                accumulatedTicks -= 1;
            }

            if (state.result !== null) {
                view.debug.interp.snapToNewest();
            }
        },

        seek,
        reset(): void {
            commands.clear();
            seek(0);
        },

        command(type: TacticalDemoCommand): void {
            if (stopped || state.result !== null) {
                return;
            }

            const tick = state.tick;
            let requested: readonly Command[];

            if (type === "ACTIVATE_SKILL" || type === "FINISH_SKILL") {
                const source = manualSkillUnit();

                if (source === undefined) {
                    return;
                }

                requested = [{ type, unitId: source.id }];
            } else if (type === "RETREAT_SOURCE") {
                if (!projectileActions) {
                    return;
                }

                const source = units
                    .all(state)
                    .find((unit) => hasAllegiance(unit) && unit.allegiance.side === "ALLY");

                if (source === undefined) {
                    return;
                }

                requested = [{ type: "RETREAT_UNIT", unitId: source.id }];
            } else if (type === "STOP_PROJECTILES") {
                if (!projectileActions || state.battlefield.projectiles.size === 0) {
                    return;
                }

                requested = projectiles
                    .all(state)
                    .map<Command>((instance) => ({
                        type: "STOP_PROJECTILE",
                        projectileId: instance.id,
                    }))
                    .toArray();
            } else if (mode === "COMBAT") {
                return;
            } else if (type === "TRIGGER_DRAGON") {
                requested = [{ type: "TRIGGER_BRANCH", branchId: "dragon", isLoop: true }];
            } else {
                requested = crateIds.map((definitionId) =>
                    type === "APPEAR_CRATES"
                        ? { type: "APPEAR_PREDEFINED", definitionId }
                        : { type: "REMOVE_PREDEFINED", definitionId, reason: "SCRIPT" },
                );
            }

            const result = advance(requested);

            for (const future of commands.keys()) {
                if (future >= tick) {
                    commands.delete(future);
                }
            }

            commands.set(tick, requested);
            publish(result.events, result.visuals);
            view.debug.interp.snapToNewest();
        },

        stop(): void {
            stopped = true;
            view.setLocalFeed({ on: false });
            view.debug.interp.maxExtrapolate = previousExtrapolate;
        },
    };
}

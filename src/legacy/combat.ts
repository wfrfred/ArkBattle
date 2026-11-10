import { createPredefinedDefinition } from "../core/battle/steps/predefined.js";
import { Hooks } from "../core/hook.js";
import { createArknightsElementalDefinition } from "../data/elemental.js";
import { create as createAction, createActions } from "../core/unit/action/index.js";
import { create as createAttack, type Attack } from "../content/actions/attack.js";
import * as targeting from "../core/battle/targeting/index.js";
import * as units from "../core/unit/index.js";
import { hasTargetable } from "../core/unit/capability/targetable/capability.js";
import { hasAllegiance } from "../core/unit/capability/allegiance/capability.js";
import { hasVitality } from "../core/unit/capability/vitality/index.js";
import { hasBlockable, hasBlocker, sides } from "../core/unit/capability/blocking/index.js";
import { hasDirection } from "../core/unit/capability/occupancy/index.js";
import { hasLayer } from "../core/unit/capability/layer/index.js";
import { fromTiles } from "../core/geometry/range.js";
import { topK } from "../core/common/collection.js";

import { assertFiniteNumber, assertPositiveSafeInteger } from "../core/common/assert.js";
import { create as createMap, type Map } from "../core/battlefield/map/map.js";
import { create as createTile } from "../core/battlefield/map/tile.js";
import { Tiles } from "../core/battlefield/map/tiles.js";
import { normal } from "../content/terrain/definition.js";
import { normal as normalCondition } from "../content/terrain/condition.js";
import type { DamageType } from "../core/battle/damage/hp/index.js";
import { Tile, type TilePosition } from "../core/geometry/coordinate.js";
import type { Direction } from "../core/geometry/direction.js";
import type { Route as RouteInput } from "../data/route.js";
import { TICKS_PER_SECOND } from "../core/tick.js";
import type { Definitions as CapabilityDefinitions } from "../core/unit/capability/catalog.js";
import type { Definition as UnitDefinition } from "../core/unit/index.js";

interface LegacyCombatContent {
    readonly operators: readonly {
        readonly definition: unknown;
        readonly position: TilePosition;
        readonly direction?: Direction;
    }[];
    readonly enemies: readonly {
        readonly definition: unknown;
        readonly route: RouteInput;
        readonly tick?: number;
    }[];
    readonly maxTicks?: number;
    readonly seed?: number;
}

export type LegacyCombatOptions = LegacyCombatContent &
    ({ readonly map: Map } | { readonly rows: number; readonly columns: number });

const LEGACY_OPERATOR_HIT_RADIUS = 0.25;
const LEGACY_ENEMY_HIT_RADIUS = 0.1;
const LEGACY_ENEMY_HALF_BODY_WIDTH = 0.1;

function record(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function numberField(value: unknown, name: string): number {
    assertFiniteNumber(value, name, TypeError);

    return value;
}

function stringField(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new TypeError(`${name} must be a nonempty string`);
    }

    return value;
}

function damageType(value: unknown): DamageType {
    switch (value) {
        case undefined:
        case null:
        case "phys":
            return "PHYSICAL";

        case "arts":
            return "ARTS";

        case "true":
            return "TRUE";

        default:
            throw new RangeError("legacy combat only supports physical, arts and true damage");
    }
}

function attackTiming(stats: Record<string, unknown>) {
    const bat = numberField(stats.bat, "base attack time");
    const attackSpeed = numberField(stats.aspd, "attack speed");
    if (bat <= 0 || attackSpeed <= 0) {
        throw new RangeError("legacy attack time and attack speed must be positive");
    }

    return { baseAttackTimeTicks: bat * TICKS_PER_SECOND, attackSpeed };
}

function attackRange(value: unknown): readonly TilePosition[] {
    if (!Array.isArray(value)) {
        throw new TypeError("legacy operator attack range must be an array");
    }

    const seen = new Set<string>();

    return Array.from(value, (offset: unknown) => {
        if (!Tile.is(offset)) {
            throw new RangeError("invalid tile position");
        }

        const tile: TilePosition = [offset[0], offset[1]];
        const key = `${tile[0]},${tile[1]}`;
        if (seen.has(key)) {
            throw new RangeError("legacy attack range must not contain duplicate tiles");
        }

        seen.add(key);

        return tile;
    });
}

function rejectContent(definition: Record<string, unknown>): void {
    if (definition.skill !== undefined && definition.skill !== null) {
        throw new RangeError("legacy combat does not execute operator skills");
    }

    for (const field of ["skills", "talents", "abilities", "tokens"]) {
        const content = definition[field];
        if (Array.isArray(content) && content.length > 0) {
            throw new RangeError(`legacy combat does not execute ${field}`);
        }
    }

    if (definition.attackKind === "heal") {
        throw new RangeError("legacy combat does not execute healing attacks");
    }
    if (definition.attackKind === "none") {
        throw new RangeError("legacy combat only supports ordinary attacks");
    }
    if (definition.targetPriority != null && definition.targetPriority !== "nearest") {
        throw new RangeError("legacy combat only supports nearest targeting");
    }
    if (definition.projectile != null && definition.projectile !== "none") {
        throw new RangeError("legacy combat does not execute projectiles");
    }
}

function operatorDefinition(value: unknown) {
    const definition = record(value, "operator definition");
    const stats = record(definition.stats, "operator stats");
    rejectContent(definition);
    const timing = attackTiming(stats);

    const canTargetAir = definition.canHitFly ?? false;
    if (typeof canTargetAir !== "boolean") {
        throw new TypeError("canHitFly must be boolean when specified");
    }

    const range = attackRange(definition.rangeGrid);

    const attack = createAttack({
        id: "normal-attack",
        speed: timing.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: timing.baseAttackTimeTicks,
        recoveryTicks: 0,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const withinRange = hasDirection(self)
                        ? targeting.inRange(
                              self.position,
                              fromTiles(range, self.occupancy.direction),
                          )
                        : () => false;
                    const candidates = units
                        .all(battle)
                        .filter(hasTargetable)
                        .filter(targeting.damage(battle, self))
                        .filter(
                            (target) =>
                                canTargetAir ||
                                (hasLayer(target) && target.layer.type === "GROUND"),
                        )
                        .filter(
                            (target) =>
                                withinRange(target) ||
                                (hasBlockable(target) &&
                                    target.blockable.relation?.blocker.id === self.id),
                        );
                    const blockedFirst = hasBlocker(self) ? targeting.blockedFirst(self) : () => 0;
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates,
                            1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(units.ref),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: numberField(stats.atk, "attack"),
                        powerSource: "SOURCE_ATTACK",
                        damageType: damageType(definition.dmgType),
                    },
                ],
            },
        ],
        followUps: [],
    });
    const initializeAttack = createAction(attack);

    return {
        hooks: Hooks.empty(),
        targetable: { taunt: 0, restrictions: [] },
        elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
        id: stringField(definition.chessId, "chessId"),
        vitality: {
            maxHp: numberField(stats.maxHp, "maxHp"),
            defense: numberField(stats.def, "defense"),
            resistance: numberField(stats.res, "resistance"),
        },
        offense: { attack: numberField(stats.atk, "attack") },
        allegiance: { side: "ALLY" },
        layer: { type: "GROUND" },
        hitbox: {
            shape: { type: "CIRCLE", offset: [0, 0], radius: LEGACY_OPERATOR_HIT_RADIUS },
        },

        blocker: {
            capacity: numberField(stats.blockCnt, "block capacity"),
            layer: "GROUND",
            rules: [sides("ENEMY")],
        },
        attack,
        action: {
            initialize: (battle) => createActions(battle, initializeAttack),
        },
        occupancy: { slot: "OCCUPANT" },
    } satisfies UnitDefinition &
        Pick<
            CapabilityDefinitions,
            | "targetable"
            | "elemental"
            | "vitality"
            | "offense"
            | "allegiance"
            | "layer"
            | "hitbox"
            | "blocker"
            | "action"
            | "occupancy"
        > & { readonly attack: Attack };
}

function enemyDefinition(value: unknown) {
    const definition = record(value, "enemy definition");
    const stats = record(definition.stats, "enemy stats");
    rejectContent(definition);
    const timing = attackTiming(stats);

    const motion = stats.motion;
    const applyWay = definition.applyWay;

    if (motion !== "WALK" && motion !== "FLY") {
        throw new RangeError("legacy enemy motion must be WALK or FLY");
    }
    if (applyWay !== "MELEE" && applyWay !== "RANGED") {
        throw new RangeError("legacy enemy applyWay must be MELEE or RANGED");
    }

    const radius = numberField(stats.rangeRadius, "enemy range radius");
    const attack = createAttack({
        id: "normal-attack",
        speed: timing.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: timing.baseAttackTimeTicks,
        recoveryTicks: applyWay === "RANGED" ? Math.ceil(0.35 * TICKS_PER_SECOND) : 0,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const blocker = hasBlockable(self)
                        ? self.blockable.relation?.blocker
                        : undefined;
                    const eligible = targeting.damage(battle, self);
                    const blockerEligible = targeting.damage(battle, self, () => true);
                    const withinRange = targeting.inRange(self.position, [
                        { type: "CIRCLE", offset: [0, 0], radius },
                    ]);
                    const candidates = units
                        .all(battle)
                        .filter(hasTargetable)
                        .filter(hasVitality)
                        .filter(
                            (target) =>
                                (target.id === blocker?.id && blockerEligible(target)) ||
                                (applyWay === "RANGED" && eligible(target) && withinRange(target)),
                        );
                    const blockedFirst = hasBlockable(self)
                        ? targeting.blockedFirst(self)
                        : () => 0;
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates,
                            1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(units.ref),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: numberField(stats.atk, "attack"),
                        powerSource: "SOURCE_ATTACK",
                        damageType: damageType(stats.dmgType),
                    },
                ],
            },
        ],
        followUps: [],
    });
    const initializeAttack = createAction(attack);

    return {
        hooks: Hooks.empty(),
        presence: {},
        targetable: { taunt: 0, restrictions: [] },
        elemental: createArknightsElementalDefinition({ receiver: "ENEMY" }),
        id: stringField(definition.key, "enemy key"),
        vitality: {
            maxHp: numberField(stats.maxHp, "maxHp"),
            defense: numberField(stats.def, "defense"),
            resistance: numberField(stats.res, "resistance"),
        },
        offense: { attack: numberField(stats.atk, "attack") },
        locomotion: {
            speed: (numberField(stats.moveSpeed, "move speed") * 0.5) / TICKS_PER_SECOND,
            minSpeed: (0.1 * 0.5) / TICKS_PER_SECOND,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
            halfBodyWidth: LEGACY_ENEMY_HALF_BODY_WIDTH,
        },
        allegiance: { side: "ENEMY" },
        layer: { type: motion === "FLY" ? "AIR" : "GROUND" },
        hitbox: {
            shape: { type: "CIRCLE", offset: [0, 0], radius: LEGACY_ENEMY_HIT_RADIUS },
        },

        route: { alwaysCheckCurrentPoint: true },
        blockable: { volume: numberField(stats.blockCnt, "block volume"), rules: [] },
        attack,
        action: {
            initialize: (battle) => createActions(battle, initializeAttack),
        },
    } satisfies UnitDefinition &
        Pick<
            CapabilityDefinitions,
            | "route"
            | "presence"
            | "targetable"
            | "elemental"
            | "vitality"
            | "offense"
            | "locomotion"
            | "allegiance"
            | "layer"
            | "hitbox"
            | "blockable"
            | "action"
        > & { readonly attack: Attack };
}

function combatMap(options: LegacyCombatOptions): Map {
    if ("map" in options) {
        return options.map;
    }

    assertPositiveSafeInteger(options.rows, "legacy combat row count");
    assertPositiveSafeInteger(options.columns, "legacy combat column count");

    const tile = createTile({
        terrain: normal.create({}),
        initial: {
            elevation: "LOWLAND",
            allowsBlocking: true,
            placement: "ALL",
            passability: "ALL",
            walkCost: 1,
            siteCondition: normalCondition,
        },
    });
    let tiles = Tiles.empty();

    for (let index = 0; index < options.rows * options.columns; index++) {
        tiles = tiles.add(tile);
    }

    return createMap(options.rows, options.columns, tiles);
}

export function createLegacyCombatSpec(options: LegacyCombatOptions) {
    const predefines = options.operators.map((operator, id) => {
        const predefined = {
            id,
            alias: null,
            initiallyPresent: true,
            creation: {
                type: "UNIT" as const,
                definition: operatorDefinition(operator.definition),
                position: Tile.center(operator.position),
                initial: {
                    occupancy: {
                        tile: operator.position,
                        direction: operator.direction ?? ("RIGHT" as const),
                    },
                },
            },
        };
        createPredefinedDefinition(predefined);

        return predefined;
    });
    const spawns = options.enemies.map((enemy) => ({
        definition: enemyDefinition(enemy.definition),
        plan: enemy.route.plan,
        offset: enemy.route.spawnOffset,
        randomRange: enemy.route.spawnRandomRange,
        atTick: enemy.tick ?? 0,
        wait: "WAVE" as const,
    }));

    return {
        map: combatMap(options),
        schedule: {
            waves: [
                {
                    preDelayTicks: 0,
                    postDelayTicks: 0,
                    maxWaitingTicks: null,
                    fragments: [{ preDelayTicks: 0, spawns }],
                },
            ],
            branches: {},
        },
        predefines,
        initialMechanisms: [],
        maxTicks: options.maxTicks ?? 600,
        routeMoveMultiplier: 1,
        rngState: options.seed ?? 1,
    };
}

import type { Ref } from "../../core/common/ref.js";
import { scope, type Scope as LifetimeScope } from "../../core/lifetime/index.js";
import type { State as BattleState, OperationResult as Result } from "../../core/battle/index.js";
import * as mechanisms from "../../core/battle/mechanism.js";
import type { MechanismDefinition } from "../../core/battle/mechanism.js";
import { remove as removeUnit } from "../../core/battle/unit.js";
import type {
    Definition as TerrainDefinition,
    View as TerrainView,
} from "../../core/battlefield/map/terrain.js";
import { contains } from "../../core/battlefield/map/map.js";
import { World } from "../../core/geometry/coordinate.js";
import * as units from "../../core/unit/index.js";
import type { Id, Unit } from "../../core/unit/index.js";

import * as effects from "../../core/unit/effect/index.js";
import { ref as effectRef, type View as EffectView } from "../../core/unit/effect/index.js";

import { hasLayer } from "../../core/unit/capability/layer/capability.js";
import { isSpatiallyPresent } from "../../core/unit/capability/presence/index.js";
import { hasAllegiance } from "../../core/unit/capability/allegiance/capability.js";
import { hasTargetable } from "../../core/unit/capability/targetable/capability.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import * as terrain from "./definition.js";
import {
    createDeepseaEffect,
    createInfectionEffect,
    createMireEffect,
    smogEffect,
} from "./effects.js";

export interface Contact {
    readonly index: number;
    readonly effect: Ref<EffectView> | undefined;
}

export interface ContactState {
    readonly indices: readonly number[] | null;
    readonly scanTick: number;
    readonly contacts: ReadonlyMap<Id, Contact>;
}

interface Behaviour<P extends object> {
    readonly id: string;
    readonly intervalTicks: number;
    readonly retainOnLeave?: boolean;
    readonly accepts?: (unit: Unit) => boolean;
    readonly enter: (
        battle: BattleState,
        unit: Unit,
        params: P,
        scopes: readonly LifetimeScope[],
    ) => Result<Ref<EffectView> | undefined>;
}

function onGround(unit: Unit): boolean {
    return (
        unit.lifecycle === "PRESENT" &&
        isSpatiallyPresent(unit) &&
        (!hasLayer(unit) || unit.layer.type === "GROUND")
    );
}

function create<P extends object>(
    definition: TerrainDefinition<P>,
    indices: readonly number[] | undefined,
    behaviour: Behaviour<P>,
): MechanismDefinition<ContactState> {
    return {
        id: behaviour.id,
        initialize: () => ({ indices: indices ?? null, scanTick: 0, contacts: new Map() }),
        onTick(battle, self) {
            if (battle.tick < self.state.scanTick) {
                return battle;
            }

            const reference = mechanisms.ref(self);
            const map = battle.battlefield.map;
            const selected =
                self.state.indices ??
                Array.from({ length: map.tiles.size }, (_, index) => index).filter(
                    (index) => map.tiles.get(index, definition) !== undefined,
                );
            const selectedSet = new Set(selected);
            const candidates = units.all(battle).map(units.ref).toArray();
            battle = mechanisms.setState(battle, reference, {
                ...self.state,
                indices: selected,
                scanTick: battle.tick + behaviour.intervalTicks,
            });

            function setContact(state: BattleState, unitId: Id, contact?: Contact): BattleState {
                const current = mechanisms.get(state, reference);
                if (current === undefined) {
                    return state;
                }

                const contacts = new Map(current.state.contacts);

                if (contact === undefined) {
                    contacts.delete(unitId);
                } else {
                    contacts.set(unitId, contact);
                }

                return mechanisms.setState(state, reference, { ...current.state, contacts });
            }

            function indexOf(unit: Unit): number | undefined {
                if (!onGround(unit) || behaviour.accepts?.(unit) === false) {
                    return undefined;
                }

                const position = World.toTile(unit.position);
                const index = position[0] * map.columns + position[1];

                return contains(map, position) &&
                    selectedSet.has(index) &&
                    map.tiles.get(index, definition) !== undefined
                    ? index
                    : undefined;
            }

            for (const unitId of self.state.contacts.keys()) {
                const contact = mechanisms.get(battle, reference)?.state.contacts.get(unitId);
                const current = battle.battlefield.units.get(unitId);
                if (
                    contact !== undefined &&
                    (current === undefined || indexOf(current) === undefined)
                ) {
                    battle = setContact(battle, unitId);

                    if (!behaviour.retainOnLeave && contact.effect !== undefined) {
                        battle = effects.end(battle, contact.effect, "LEFT_TERRAIN");
                    }
                }
            }

            for (const candidate of candidates) {
                if (mechanisms.get(battle, reference)?.status !== "ACTIVE") {
                    return battle;
                }

                const unit = units.get(battle, candidate);
                const index = unit === undefined ? undefined : indexOf(unit);
                if (unit === undefined || index === undefined) {
                    continue;
                }

                const previous = mechanisms.get(battle, reference)?.state.contacts.get(unit.id);
                const tile = map.tiles.get(index, definition)!;

                if (previous !== undefined) {
                    const effect =
                        previous.effect === undefined
                            ? undefined
                            : effects.get(battle, previous.effect);
                    const effectExists = effect !== undefined && effect.status !== "ENDING";
                    if (previous.index === index && effectExists) {
                        continue;
                    }

                    const previousTile = map.tiles.get(previous.index, definition);
                    if (
                        effectExists &&
                        previousTile?.definition.terrain.params === tile.definition.terrain.params
                    ) {
                        battle = setContact(battle, unit.id, { ...previous, index });
                        continue;
                    }

                    battle = setContact(battle, unit.id);

                    if (!behaviour.retainOnLeave && previous.effect !== undefined) {
                        battle = effects.end(battle, previous.effect, "TERRAIN_CHANGED");
                    }
                }

                const latest = units.get(battle, candidate);
                if (
                    latest === undefined ||
                    indexOf(latest) !== index ||
                    mechanisms.get(battle, reference)?.status !== "ACTIVE"
                ) {
                    continue;
                }

                const installed = behaviour.enter(
                    battle,
                    latest,
                    tile.definition.terrain.params,
                    behaviour.retainOnLeave ? [] : [scope(mechanisms.lifetime, reference)],
                );
                battle = installed.state;

                if (mechanisms.get(battle, reference)?.status !== "ACTIVE") {
                    return !behaviour.retainOnLeave && installed.value !== undefined
                        ? effects.end(battle, installed.value, "TERRAIN_UNAVAILABLE")
                        : battle;
                }

                const current = units.get(battle, candidate);
                if (current !== undefined && indexOf(current) === index) {
                    battle = setContact(battle, unit.id, { index, effect: installed.value });
                } else if (!behaviour.retainOnLeave && installed.value !== undefined) {
                    battle = effects.end(battle, installed.value, "LEFT_TERRAIN");
                }
            }

            return battle;
        },
        onUnitLeave(battle, self, departure) {
            if (!self.state.contacts.has(departure.unit.id)) {
                return battle;
            }

            const contacts = new Map(self.state.contacts);
            contacts.delete(departure.unit.id);

            return mechanisms.setState(battle, mechanisms.ref(self), { ...self.state, contacts });
        },
        onDisable(battle, self) {
            const owned = [...self.state.contacts.values()];
            battle = mechanisms.setState(battle, mechanisms.ref(self), {
                ...self.state,
                contacts: new Map(),
            });

            if (!behaviour.retainOnLeave && self.status !== "ENDING") {
                for (const contact of owned) {
                    if (contact.effect !== undefined) {
                        battle = effects.end(battle, contact.effect, "TERRAIN_UNAVAILABLE");
                    }
                }
            }

            return battle;
        },
    };
}

export function createTerrainMechanism(
    definition: TerrainView["definition"],
    indices?: readonly number[],
): MechanismDefinition<ContactState> {
    if (definition === terrain.infection) {
        return create(terrain.infection, indices, {
            id: "terrain/infection",
            intervalTicks: 1,
            retainOnLeave: true,
            enter(battle, unit, params) {
                const previous = unit.effects
                    .values()
                    .find(
                        (effect) =>
                            effect.definition.id === "terrain/infection" &&
                            effect.status !== "ENDING",
                    );
                if (previous !== undefined) {
                    return { state: battle, value: effectRef(previous) };
                }

                return effects.install(battle, units.ref(unit), createInfectionEffect(params), {
                    data: { nextTick: battle.tick + TICKS_PER_SECOND },
                    scopes: [{ type: "TICK", tick: battle.tick + params.durationTicks }],
                });
            },
        });
    }
    if (definition === terrain.mire) {
        return create(terrain.mire, indices, {
            id: "terrain/mire",
            intervalTicks: 3,
            // Current native content uses one second; the older PRTS three-second report differs.
            enter: (battle, unit, params, scopes) =>
                effects.install(battle, units.ref(unit), createMireEffect(params), {
                    scopes,
                    data: { nextTick: battle.tick, stacks: 0 },
                }),
        });
    }
    if (definition === terrain.deepsea) {
        return create(terrain.deepsea, indices, {
            id: "terrain/deepsea",
            intervalTicks: 6,
            accepts: (unit) => hasAllegiance(unit) && unit.allegiance.side === "ENEMY",
            enter: (battle, unit, params, scopes) =>
                effects.install(battle, units.ref(unit), createDeepseaEffect(params), {
                    scopes,
                    data: { nextTick: battle.tick },
                }),
        });
    }
    if (definition === terrain.smog) {
        return create(terrain.smog, indices, {
            id: "terrain/smog",
            intervalTicks: 1,
            accepts: (unit) =>
                hasAllegiance(unit) && unit.allegiance.side === "ALLY" && hasTargetable(unit),
            enter: (battle, unit, _params, scopes) =>
                hasTargetable(unit)
                    ? effects.install(battle, units.ref(unit), smogEffect, { scopes })
                    : { state: battle, value: undefined },
        });
    }
    if (definition === terrain.hole) {
        return create(terrain.hole, indices, {
            id: "terrain/hole",
            intervalTicks: 1,
            accepts: (unit) => hasAllegiance(unit) && unit.allegiance.side === "ENEMY",
            enter: (battle, unit) => ({
                state: removeUnit(battle, unit.id, "DEATH"),
                value: undefined,
            }),
        });
    }

    throw new TypeError("terrain has no runtime mechanism");
}

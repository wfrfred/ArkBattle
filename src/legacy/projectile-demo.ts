import { update as updateUnit } from "../core/battle/unit.js";
import type { Input, State as BattleState } from "../core/battle/index.js";
import type { Spawn, Entry } from "../core/battle/schedule/index.js";
import {
    type Definition as UnitDefinition,
    get as getCurrentUnit,
    ref as unitRef,
} from "../core/unit/index.js";
import { create as createAction, createActions } from "../core/unit/action/index.js";
import type { Definition as ActionDefinition } from "../core/unit/capability/action/index.js";
import { create as createAttack, isAttack } from "../content/actions/attack.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../core/battle/damage/hp/index.js";

import * as tracking from "../content/projectiles/tracking.js";

import type { Projectile } from "../core/projectile/index.js";
import { create as createProjectile } from "../core/battle/projectile.js";
import * as attribute from "../core/unit/contribution/attribute.js";
import { install, type Definition } from "../core/unit/effect/index.js";

import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
    type Offense,
    resolveAttack,
} from "../core/unit/capability/offense/index.js";

import { healFree } from "../core/effects/protection.js";
import { hasVitality } from "../core/unit/capability/vitality/index.js";
import { hasTargetable } from "../core/unit/capability/targetable/capability.js";

export function createTacticalProjectileDemo<
    CardStates extends readonly object[],
    MechanismStates extends readonly object[],
>(input: Input<CardStates, MechanismStates>, cachedOnly = false) {
    const boost: Definition<object, Offense> = {
        id: "post-launch-attack-boost",
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);
            if (unit === undefined) {
                return state;
            }

            return updateUnit(
                state,
                unitRef(unit),
                setAttackContribution({
                    id: `@effect/${self.id}/attack`,
                    value: [attribute.create({ addition: 60 })],
                    group: { id: "demo-attack-boost", priority: 1 },
                }),
            );
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);
            if (unit === undefined) {
                return state;
            }

            return updateUnit(
                state,
                unitRef(unit),
                removeAttackContribution(`@effect/${self.id}/attack`),
            );
        },
    };
    const hit = (battle: BattleState, self: Projectile<tracking.State>): BattleState =>
        tracking.hit(battle, self, (state, current, target) => {
            if (hasTargetable(target)) {
                state = install(state, unitRef(target), healFree, {
                    source: current.state.source,
                    expiration: { type: "DEADLINE", tick: state.tick + 45 },
                }).state;
            }

            const receiver = getCurrentUnit(state, unitRef(target));
            if (
                receiver?.lifecycle !== "PRESENT" ||
                !hasVitality(receiver) ||
                receiver.vitality.hp <= 0
            ) {
                return state;
            }

            const source = current.state.source;
            const request: DamageRequest = {
                source:
                    source !== null && getCurrentUnit(state, source) !== undefined ? source : null,
                target: unitRef(receiver),
                parameters: {
                    type: "ARTS",
                    attack: {
                        power: cachedOnly
                            ? current.state.cachedAtk
                            : tracking.attackPower(state, current),
                        multiplier: 1,
                        addition: 0,
                    },
                    penetration: { fixed: 0, proportional: 0 },
                },
            };

            return applyDamage(request, calculateDamage(state, request)).state;
        });
    const shell: tracking.Definition = {
        id: cachedOnly ? "cached-atk-shell" : "live-atk-shell",
        tracking: true,
        onTick: (battle, self) => tracking.advance(battle, self, hit),
        onEnd: (battle, self, reason) => (reason === "DISPEL" ? battle : hit(battle, self)),
    };

    function transform<D extends UnitDefinition>(definition: D): D {
        if (
            !("action" in definition) ||
            !("attack" in definition) ||
            !isAttack(definition.attack)
        ) {
            return definition;
        }

        const attack = createAttack({
            ...definition.attack.attack,
            windupTicks: 6,
            recoveryTicks: 6,
            output: (state, host, self) => {
                const source = getCurrentUnit(state, host);
                const targetId = self.execution.state.target.id;
                const target = state.battlefield.units.get(targetId);
                if (source === undefined || target === undefined || !hasVitality(target)) {
                    return state;
                }

                if (!hasOffense(source)) {
                    throw new Error("projectile demo source requires Offense capability");
                }

                const cachedAtk = resolveAttack(state, source);

                const launched = createProjectile(state, shell, {
                    position: source.position,
                    state: {
                        source: unitRef(source),
                        target: unitRef(target),
                        destination: target.position,
                        cachedAtk,
                        speedPerTick: 0.12,
                        stopDelayTicks: 6,
                        stopAtTick: null,
                        hitAttempted: false,
                        launchedAtTick: state.tick,
                    },
                });
                state = install(launched.state, unitRef(source), boost, {
                    source: unitRef(source),
                    expiration: { type: "DEADLINE", tick: state.tick + 70 },
                }).state;

                return state;
            },
        });
        const initializeAttack = createAction(attack);

        return {
            ...definition,
            attack,
            action: {
                ...(definition.action as ActionDefinition),
                initialize: (battle: BattleState) => createActions(battle, initializeAttack),
            },
        };
    }

    const spawn = (value: Spawn): Spawn => ({ ...value, definition: transform(value.definition) });
    const entry = (value: Entry): Entry =>
        "options" in value
            ? {
                  options: value.options.map((option) => ({
                      ...option,
                      spawns: option.spawns.map(spawn),
                  })),
              }
            : value.map(spawn);
    const schedule = {
        waves: input.schedule.waves.map((wave) => ({
            ...wave,
            fragments: wave.fragments.map((fragment) => ({
                ...fragment,
                spawns: fragment.spawns.map(spawn),
            })),
        })),
        branches: Object.fromEntries(
            Object.entries(input.schedule.branches).map(([id, branch]) => [
                id,
                {
                    phases: branch.phases.map((phase) => ({
                        ...phase,
                        entries: phase.entries.map(entry),
                    })),
                },
            ]),
        ),
    };

    return {
        input: {
            ...input,
            schedule,
            predefines: input.predefines.map((predefined) =>
                predefined.creation.type === "UNIT"
                    ? {
                          ...predefined,
                          creation: {
                              ...predefined.creation,
                              definition: transform(predefined.creation.definition),
                          },
                      }
                    : predefined,
            ),
        },
    };
}

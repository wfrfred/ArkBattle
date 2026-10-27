import { update as updateUnit } from "../core/battle/unit.js";
import type { Input } from "../core/battle/contract.js";
import type { FragmentDefinition } from "../core/battle/schedule/definition.js";
import type { Definition as UnitDefinition } from "../core/unit/unit.js";
import { create as createAction, createActions } from "../core/unit/action/initialize.js";
import { hasActionDefinition } from "../core/unit/capability/action/capability.js";
import { create as createAttack, isAttack } from "../content/actions/attack.js";
import { calculateDamage } from "../core/battle/damage/calculate.js";
import { applyDamage } from "../core/battle/damage/apply.js";
import type { DamageRequest } from "../core/battle/damage/contract.js";
import { get as getCurrentUnit, ref as unitRef } from "../core/unit/query.js";
import * as tracking from "../content/projectiles/tracking.js";

import { type State as BattleState } from "../core/battle/state.js";
import type { Projectile } from "../core/projectile/projectile.js";
import { create as createProjectile } from "../core/battle/projectile.js";
import * as attribute from "../core/unit/contribution/attribute.js";
import { install } from "../core/unit/effect/operations.js";
import type { Definition } from "../core/unit/effect/definition.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
    type Offense,
} from "../core/unit/capability/offense/capability.js";
import { resolveAttack } from "../core/unit/capability/offense/query.js";
import { healFree } from "../content/effects/protection.js";
import { hasVitality } from "../core/unit/capability/vitality/capability.js";
import { hasTargetable } from "../core/unit/capability/targetable/capability.js";

export function createTacticalProjectileDemo(
    input: Input,
    cachedOnly = false,
): { readonly input: Input } {
    const marker = { ...healFree, id: "contact-mark" };
    const boost: Definition<object, Offense> = {
        id: "post-launch-attack-boost",
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            if (unit === undefined) {
                return state;
            }

            return updateUnit(state, [
                {
                    ...unit,
                    offense: setAttackContribution(unit.offense, {
                        id: `@effect/${self.id}/attack`,
                        value: [attribute.create({ addition: 60 })],
                        group: { id: "demo-attack-boost", priority: 1 },
                    }),
                },
            ]);
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            if (unit === undefined) {
                return state;
            }

            return updateUnit(state, [
                {
                    ...unit,
                    offense: removeAttackContribution(unit.offense, `@effect/${self.id}/attack`),
                },
            ]);
        },
    };
    const hit = (battle: BattleState, self: Projectile<tracking.State>): BattleState =>
        tracking.hit(battle, self, (state, current, target) => {
            if (hasTargetable(target)) {
                state = install(state, unitRef(target), marker, {
                    source: current.state.source?.id ?? null,
                    scopes: [{ type: "TICK", tick: state.tick + 45 }],
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
        onAdvance: (battle, self) => tracking.advance(battle, self, hit),
        onTerminate: (battle, self, reason) => (reason === "DISPEL" ? battle : hit(battle, self)),
    };

    function transform<D extends UnitDefinition>(definition: D): D {
        if (
            !hasActionDefinition(definition) ||
            !("attack" in definition) ||
            !isAttack(definition.attack)
        ) {
            return definition;
        }

        const attack = createAttack({
            ...definition.attack.attack,
            windupTicks: 6,
            recoveryTicks: 6,
            markerId: "demo-shell",
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

                const cachedAtk = resolveAttack(state, unitRef(source))!;

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
                    source: source.id,
                    scopes: [{ type: "TICK", tick: state.tick + 70 }],
                }).state;

                return state;
            },
        });
        const initializeAttack = createAction(attack);

        return {
            ...definition,
            attack,
            action: {
                ...definition.action,
                initialize: (battle: BattleState) => createActions(battle, initializeAttack),
            },
        };
    }

    const fragment = (value: FragmentDefinition): FragmentDefinition => ({
        ...value,
        actions: value.actions.map((action) => ({
            ...action,
            spawn: { ...action.spawn, definition: transform(action.spawn.definition) },
        })),
    });
    const schedule =
        input.schedule.type === "TIMELINE"
            ? {
                  ...input.schedule,
                  spawns: input.schedule.spawns.map((spawn) => ({
                      ...spawn,
                      definition: transform(spawn.definition),
                  })),
              }
            : {
                  ...input.schedule,
                  waves: input.schedule.waves.map((wave) => ({
                      ...wave,
                      fragments: wave.fragments.map(fragment),
                  })),
                  branches: Object.fromEntries(
                      Object.entries(input.schedule.branches).map(([id, branch]) => [
                          id,
                          { ...branch, phases: branch.phases.map(fragment) },
                      ]),
                  ),
              };

    return {
        input: {
            ...input,
            schedule,
            initialUnits: input.initialUnits.map((unit) => ({
                ...unit,
                definition: transform(unit.definition),
            })),
        },
    };
}

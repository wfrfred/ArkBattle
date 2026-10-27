import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
import { update as updateUnit } from "../../core/battle/unit.js";
import { applyDamage, calculateDamage } from "../../core/battle/damage/index.js";

import * as effects from "../../core/unit/effect/index.js";
import { type Definition, ref as effectRef, type Effect } from "../../core/unit/effect/index.js";

import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";

import * as offense from "../../core/unit/capability/offense/index.js";
import * as action from "../../core/unit/capability/action/index.js";
import * as locomotion from "../../core/unit/capability/locomotion/index.js";
import { hasLocomotion } from "../../core/unit/capability/locomotion/index.js";

import { hasVitality } from "../../core/unit/capability/vitality/index.js";
import { hasAllegiance } from "../../core/unit/capability/allegiance/capability.js";
import { hasBlocker } from "../../core/unit/capability/blocking/index.js";
import * as targetable from "../../core/unit/capability/targetable/capability.js";
import * as attribute from "../../core/unit/contribution/attribute.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type { DeepseaParams, InfectionParams, MireParams } from "./definition.js";
import { invisibleRestriction } from "../effects/visibility.js";

interface Modifiers {
    readonly attack?: attribute.Modifier;
    readonly attackSpeed?: attribute.Modifier;
    readonly movementSpeed?: attribute.Modifier;
}

interface PeriodicState {
    readonly nextTick: number;
}

interface MireState extends PeriodicState {
    readonly stacks: number;
}

interface SmogState {
    readonly wasBlocking: boolean;
    readonly restoreAt: number | null;
}

export const smogEffect: Definition<SmogState, targetable.Targetable> = {
    id: "terrain/smog",
    initialize: () => ({ wasBlocking: false, restoreAt: null }),
    onEnable: reconcileSmog,
    onTick: reconcileSmog,
    onDisable(battle, self) {
        const unit = units.get(battle, self.host);

        if (unit === undefined) {
            return battle;
        }

        const next = targetable.removeRestriction(unit.targetable, `terrain/${self.id}`);

        return next === unit.targetable
            ? battle
            : updateUnit(battle, [{ ...unit, targetable: next }]);
    },
};

function reconcileSmog(
    battle: BattleState,
    self: Effect<SmogState, targetable.Targetable>,
): BattleState {
    let unit = units.get(battle, self.host);

    if (unit === undefined) {
        return battle;
    }

    const blocked = hasBlocker(unit) && unit.blocker.blocked.length > 0;
    let restoreAt = self.data.restoreAt;

    if (blocked) {
        restoreAt = null;
    } else if (self.data.wasBlocking) {
        restoreAt = battle.tick + 3 * TICKS_PER_SECOND;
    } else if (restoreAt !== null && battle.tick >= restoreAt) {
        restoreAt = null;
    }

    if (blocked !== self.data.wasBlocking || restoreAt !== self.data.restoreAt) {
        battle = effects.update(battle, effectRef(self), () => ({
            wasBlocking: blocked,
            restoreAt,
        }));
        unit = units.get(battle, self.host)!;
    }

    const id = `terrain/${self.id}`;
    const active = !blocked && restoreAt === null;
    const exists = unit.targetable.restrictions.some((entry) => entry.id === id);

    if (active === exists) {
        return battle;
    }

    return updateUnit(battle, [
        {
            ...unit,
            targetable: active
                ? targetable.setRestriction(unit.targetable, { id, value: invisibleRestriction })
                : targetable.removeRestriction(unit.targetable, id),
        },
    ]);
}

function changeModifiers(
    battle: BattleState,
    host: Ref<Unit>,
    id: string,
    modifiers?: Modifiers,
): BattleState {
    const unit = units.get(battle, host);

    if (unit === undefined) {
        return battle;
    }

    return updateUnit(battle, [
        {
            ...unit,
            ...(offense.hasOffense(unit)
                ? {
                      offense:
                          modifiers?.attack === undefined
                              ? offense.removeAttackContribution(unit.offense, id)
                              : offense.setAttackContribution(unit.offense, {
                                    id,
                                    value: [modifiers.attack],
                                }),
                  }
                : {}),
            ...(action.hasAction(unit)
                ? {
                      action:
                          modifiers?.attackSpeed === undefined
                              ? action.removeSpeedContribution(unit.action, id)
                              : action.setSpeedContribution(unit.action, {
                                    id,
                                    value: [modifiers.attackSpeed],
                                }),
                  }
                : {}),
            ...(hasLocomotion(unit)
                ? {
                      locomotion:
                          modifiers?.movementSpeed === undefined
                              ? locomotion.removeSpeedContribution(unit.locomotion, id)
                              : locomotion.setSpeedContribution(unit.locomotion, {
                                    id,
                                    value: [modifiers.movementSpeed],
                                }),
                  }
                : {}),
        },
    ]);
}

function damage(battle: BattleState, host: Ref<Unit>, amount: number): BattleState {
    const unit = units.get(battle, host);

    if (unit === undefined || !hasVitality(unit)) {
        return battle;
    }

    const request = {
        source: null,
        target: units.ref(unit),
        parameters: {
            type: "TRUE" as const,
            attack: { power: amount, multiplier: 1, addition: 0 },
        },
    };

    return applyDamage(request, calculateDamage(battle, request)).state;
}

export function createInfectionEffect(params: InfectionParams): Definition<PeriodicState> {
    return {
        id: "terrain/infection",
        initialize: () => ({ nextTick: 0 }),
        onEnable(battle, self) {
            return changeModifiers(battle, self.host, `terrain/${self.id}`, {
                attack: attribute.create({ multiplier: params.attackBonusRatio }),
                attackSpeed: attribute.create({ addition: params.attackSpeedBonus }),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.host, `terrain/${self.id}`),
        onTick(battle, self) {
            if (battle.tick < self.data.nextTick) {
                return battle;
            }

            battle = effects.update(battle, effectRef(self), (current) => ({
                ...current,
                nextTick: battle.tick + TICKS_PER_SECOND,
            }));

            return damage(battle, self.host, params.damage);
        },
    };
}

export function createDeepseaEffect(params: DeepseaParams): Definition<PeriodicState> {
    return {
        id: "terrain/deepsea",
        initialize: () => ({ nextTick: 0 }),
        onEnable(battle, self) {
            return changeModifiers(battle, self.host, `terrain/${self.id}`, {
                attackSpeed: attribute.create({ multiplier: params.attackSpeedModifier }),
                movementSpeed: attribute.create({ finalScaler: params.moveSpeedMultiplier }),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.host, `terrain/${self.id}`),
        onTick(battle, self) {
            if (battle.tick < self.data.nextTick) {
                return battle;
            }

            battle = effects.update(battle, effectRef(self), (current) => ({
                ...current,
                nextTick: battle.tick + TICKS_PER_SECOND,
            }));

            return damage(battle, self.host, params.damage);
        },
    };
}

interface Mass {
    readonly definition: { readonly massLevel: number };
}

function hasMass(unit: Unit): unit is Unit & Mass {
    return "massLevel" in unit.definition;
}

export function createMireEffect(params: MireParams): Definition<MireState> {
    return {
        id: "terrain/mire",
        initialize: () => ({ nextTick: 0, stacks: 0 }),
        onTick(battle, self) {
            if (battle.tick < self.data.nextTick) {
                return battle;
            }

            const unit = units.get(battle, self.host);

            if (unit === undefined) {
                return battle;
            }

            const enemy = hasAllegiance(unit) && unit.allegiance.side === "ENEMY";
            const gain =
                enemy && hasMass(unit) && unit.definition.massLevel >= params.massThreshold ? 2 : 1;
            const stacks = Math.min(params.maxStacks, self.data.stacks + gain);
            battle = effects.update(battle, effectRef(self), () => ({
                stacks,
                nextTick: battle.tick + params.stackIntervalTicks,
            }));

            return changeModifiers(battle, self.host, `terrain/${self.id}`, {
                attackSpeed: attribute.create({ multiplier: stacks * params.attackSpeedPerStack }),
                ...(enemy
                    ? {
                          movementSpeed: attribute.create({
                              multiplier: stacks * params.moveSpeedRatioPerStack,
                          }),
                      }
                    : {}),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.host, `terrain/${self.id}`),
    };
}

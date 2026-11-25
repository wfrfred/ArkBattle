import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
import { roundToEven } from "../../core/common/math.js";
import {
    applyDamage,
    calculateDamage,
    type Request as DamageRequest,
} from "../../core/battle/resource/hp/damage/index.js";

import * as effects from "../../core/effect/index.js";
import { type Definition, ref as effectRef } from "../../core/effect/index.js";

import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";

import * as offense from "../../core/unit/capability/offense/index.js";
import * as action from "../../core/unit/capability/action/index.js";
import * as locomotion from "../../core/unit/capability/locomotion/index.js";
import { shiftable } from "../../core/unit/capability/shifting/index.js";

import { hasVitality } from "../../core/unit/capability/vitality/index.js";
import { hasClassification } from "../../core/unit/capability/classification/index.js";
import * as modifier from "../../core/common/modifier.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type { DeepseaParams, InfectionParams, MireParams } from "./definition.js";

interface Modifiers {
    readonly attack?: modifier.Modifier;
    readonly attackSpeed?: modifier.Modifier;
    readonly movementSpeed?: modifier.Modifier;
}

interface PeriodicState {
    readonly nextTick: number;
}

interface InfectionState {
    readonly remainingTicks: number;
}

interface MireState extends PeriodicState {
    readonly stacks: number;
}

function changeModifiers(
    battle: BattleState,
    host: Ref<Unit>,
    id: string,
    modifiers?: Modifiers,
): BattleState {
    const unit = host.get(battle);
    if (unit === undefined) {
        return battle;
    }

    return units.update(
        battle,
        units.ref(unit),
        [
            units.optional(
                offense.hasOffense,
                modifiers?.attack === undefined
                    ? offense.removeAttackContribution(id)
                    : offense.setAttackContribution({ id, value: [modifiers.attack] }),
            ),
            units.optional(
                action.hasAction,
                modifiers?.attackSpeed === undefined
                    ? action.removeSpeedContribution(id)
                    : action.setSpeedContribution({ id, value: [modifiers.attackSpeed] }),
            ),
            units.optional(
                locomotion.hasLocomotion,
                modifiers?.movementSpeed === undefined
                    ? locomotion.removeSpeedContribution(id)
                    : locomotion.setSpeedContribution({ id, value: [modifiers.movementSpeed] }),
            ),
        ].reduce(units.compose),
    );
}

function damage(
    battle: BattleState,
    host: Ref<Unit>,
    amount: number,
    nature: DamageRequest["nature"],
): BattleState {
    const unit = host.get(battle);
    if (unit === undefined || !hasVitality(unit)) {
        return battle;
    }

    const request: DamageRequest = {
        attackType: "BUFF",
        applyWay: "NONE",
        source: null,
        killer: null,
        target: units.ref(unit),
        nature,
        hitRecovery: false,
        parameters: {
            type: "TRUE",
            attack: { power: amount, multiplier: 1, addition: 0 },
        },
    };

    return applyDamage(request, calculateDamage(battle, request)).state;
}

export function createInfectionEffect(params: InfectionParams): Definition<InfectionState, Unit> {
    return {
        id: "terrain/infection",
        group: {
            type: "DEFAULT",
            independentSource: false,
            id: "terrain/infection",
            priority: roundToEven(1000 * (params.attackBonusRatio + params.attackSpeedBonus)),
        },
        initialize: () => ({ remainingTicks: TICKS_PER_SECOND }),
        onEnable(battle, self) {
            return changeModifiers(battle, self.ref.host, `terrain/${self.id}`, {
                attack: modifier.create({ multiplier: params.attackBonusRatio }),
                attackSpeed: modifier.create({ addition: params.attackSpeedBonus }),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.ref.host, `terrain/${self.id}`),
        onTick(battle, self) {
            const remainingTicks = self.state.remainingTicks - 1;

            battle = effects.setState(battle, effectRef(self), {
                remainingTicks: remainingTicks === 0 ? TICKS_PER_SECOND : remainingTicks,
            });

            return remainingTicks === 0
                ? damage(battle, self.ref.host, params.damage, "ENVIRONMENT")
                : battle;
        },
    };
}

export function createDeepseaEffect(params: DeepseaParams): Definition<PeriodicState, Unit> {
    return {
        id: "terrain/deepsea",
        initialize: () => ({ nextTick: 0 }),
        onEnable(battle, self) {
            return changeModifiers(battle, self.ref.host, `terrain/${self.id}`, {
                attackSpeed: modifier.create({ multiplier: params.attackSpeedModifier }),
                movementSpeed: modifier.create({ finalScaler: params.moveSpeedMultiplier }),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.ref.host, `terrain/${self.id}`),
        onTick(battle, self) {
            if (battle.tick < self.state.nextTick) {
                return battle;
            }

            battle = effects.setState(battle, effectRef(self), {
                ...self.state,
                nextTick: battle.tick + TICKS_PER_SECOND,
            });

            return damage(battle, self.ref.host, params.damage, "DAMAGE");
        },
    };
}

export function createMireEffect(params: MireParams): Definition<MireState, Unit> {
    return {
        id: "terrain/mire",
        initialize: () => ({ nextTick: 0, stacks: 0 }),
        onTick(battle, self) {
            if (battle.tick < self.state.nextTick) {
                return battle;
            }

            const unit = self.ref.host.get(battle);
            if (unit === undefined) {
                return battle;
            }

            const enemy =
                hasClassification(unit) && unit.definition.classification.side === "ENEMY";
            const gain =
                enemy &&
                shiftable.hasShiftable(unit) &&
                shiftable.resolveMassLevel(battle, unit) >= params.massThreshold
                    ? 2
                    : 1;
            const stacks = Math.min(params.maxStacks, self.state.stacks + gain);
            battle = effects.setState(battle, effectRef(self), {
                stacks,
                nextTick: battle.tick + params.stackIntervalTicks,
            });

            return changeModifiers(battle, self.ref.host, `terrain/${self.id}`, {
                attackSpeed: modifier.create({ multiplier: stacks * params.attackSpeedPerStack }),
                ...(enemy
                    ? {
                          movementSpeed: modifier.create({
                              multiplier: stacks * params.moveSpeedRatioPerStack,
                          }),
                      }
                    : {}),
            });
        },
        onDisable: (battle, self) => changeModifiers(battle, self.ref.host, `terrain/${self.id}`),
    };
}

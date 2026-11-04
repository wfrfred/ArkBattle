import { Hooks } from "../../../core/hook.js";
import * as unitHooks from "../../../core/unit/hook.js";
import { normal as normalSite } from "../../terrain/condition.js";
import { update as updateUnit } from "../../../core/battle/unit.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { createArknightsElementalDefinition } from "../../../data/arknights/elemental.js";
import {
    create as createAction,
    createActions,
    clearCooldown,
    ref as actionRef,
} from "../../../core/unit/action/index.js";
import type { Attack } from "../../actions/attack.js";
import type { State as SkillAttackState } from "../../actions/skill.js";
import { hasCandidate } from "../../../core/battle/targeting/index.js";
import {
    get as getCurrentUnit,
    ref as unitRef,
    type Unit,
    type Definition as UnitDefinition,
} from "../../../core/unit/index.js";
import { blocked } from "../../../core/battle/blocking/index.js";
import { hasBlocker, sides } from "../../../core/unit/capability/blocking/index.js";
import type { Profile } from "../../../data/arknights/operator.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import {
    create as createSkill,
    modify,
    type Definition as SkillDefinition,
} from "../../../core/unit/skill/index.js";
import { hasSkill } from "../../../core/unit/capability/skill/index.js";

import type { Definitions as CapabilityDefinitions } from "../../../core/unit/capability/catalog.js";
import { hasAction } from "../../../core/unit/capability/action/index.js";
import type { Definition as CardDefinition } from "../../../core/battle/deployment/card/index.js";
import { get as getTile } from "../../../core/battlefield/map/map.js";

import { healFree } from "../../../core/effects/protection.js";
import {
    hasVitality,
    setHook as setVitalityHook,
    removeHook as removeVitalityHook,
    type Vitality,
} from "../../../core/unit/capability/vitality/index.js";
import { cancel } from "../../../core/battle/damage/hp/index.js";
import {
    type Definition as EffectDefinition,
    type Effect,
    ref as effectRef,
    get,
    install,
    setData,
} from "../../../core/unit/effect/index.js";

import { createNormal, createSkill as createSkillAction } from "./action.js";
import { value, healSelf } from "./common.js";

export interface Definition
    extends
        UnitDefinition,
        Pick<
            CapabilityDefinitions,
            | "action"
            | "allegiance"
            | "blocker"
            | "deployable"
            | "elemental"
            | "hitbox"
            | "layer"
            | "occupancy"
            | "offense"
            | "skill"
            | "targetable"
            | "vitality"
        > {
    readonly profile: Profile;
    readonly card: CardDefinition;
}

interface ShieldState {
    readonly layers: number;
    readonly timer: number;
    readonly lastTick: number;
}

const SHIELD_ID = "mudrock/shield";

export function readShield(
    unit: Unit,
): { readonly layers: number; readonly timer: number } | undefined {
    const effect = unit.effects.values().find((entry) => entry.definition.id === SHIELD_ID);
    if (effect?.status !== "ACTIVE") {
        return undefined;
    }

    const { layers, timer } = (effect as Effect<ShieldState>).data;

    return { layers, timer };
}

function hasSarkazTag(unit: Unit | undefined): boolean {
    const definition = unit?.definition;
    if (definition === undefined || !("profile" in definition)) {
        return false;
    }

    const profile = definition.profile;

    return (
        typeof profile === "object" &&
        profile !== null &&
        "tags" in profile &&
        Array.isArray(profile.tags) &&
        profile.tags.includes("sarkaz")
    );
}

function shieldEffect(profile: Profile): EffectDefinition<ShieldState, Vitality> {
    const talent = profile.talents.find((talent) => talent.key === "1");
    if (talent === undefined) {
        throw new TypeError("Mudrock content requires her shield talent");
    }

    const interval = secondsToTicks(value(talent.blackboard, "interval"));
    const initialLayers = value(talent.blackboard, "times");
    const capacity = value(talent.blackboard, "max_times");
    const healRatio = value(talent.blackboard, "hp_ratio");
    const extraSp = talent.blackboard.find((entry) => entry.key === "sp")?.value ?? 0;
    const sarkazResistance =
        profile.talents
            .find((talent) => talent.key === "2")
            ?.blackboard.find((entry) => entry.key === "damage_resistance")?.value ?? 0;
    const blockedDamageScale =
        profile.moduleTrait.find((entry) => entry.key === "damage_scale")?.value ?? 1;

    const definition: EffectDefinition<ShieldState, Vitality> = {
        id: SHIELD_ID,
        initialize: () => ({ layers: initialLayers, timer: interval, lastTick: 0 }),
        onInstall: (state, self) =>
            setData(state, effectRef(self), { ...self.data, lastTick: state.tick }),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);
            if (unit === undefined) {
                return state;
            }

            const ref = effectRef(self);

            return updateUnit(state, [
                setVitalityHook(unitRef(unit), "damageReceiving", {
                    id: `${SHIELD_ID}/${self.id}`,
                    priority: 100,
                    accepts: () => true,
                    invoke(state, context, pending) {
                        const shield = get(state, ref);
                        const host = getCurrentUnit(state, self.host);
                        if (
                            pending.cancellation !== null ||
                            pending.amount <= 0 ||
                            shield?.status !== "ACTIVE" ||
                            host === undefined
                        ) {
                            return { state, value: pending };
                        }
                        if (shield.data.layers > 0) {
                            state = setData(state, ref, {
                                ...shield.data,
                                layers: shield.data.layers - 1,
                            });
                            state = healSelf(state, self.host.id, healRatio);
                            const current = getCurrentUnit(state, self.host);
                            if (current !== undefined && hasSkill(current)) {
                                state = modify(state, unitRef(current), extraSp).state;
                            }

                            return {
                                state,
                                value: cancel(pending, "MUDROCK_SHIELD"),
                            };
                        }

                        const sourceId = context.request.source?.id ?? null;
                        const sarkazScale = hasSarkazTag(
                            sourceId === null ? undefined : state.battlefield.units.get(sourceId),
                        )
                            ? 1 - sarkazResistance
                            : 1;
                        const blockingScale =
                            sourceId !== null &&
                            hasBlocker(host) &&
                            blocked(state, unitRef(host)).some((ref) => ref.id === sourceId)
                                ? blockedDamageScale
                                : 1;

                        return {
                            state,
                            value: {
                                ...pending,
                                amount: pending.amount * sarkazScale * blockingScale,
                            },
                        };
                    },
                }),
            ]);
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(state, [
                      removeVitalityHook(
                          unitRef(unit),
                          "damageReceiving",
                          `${SHIELD_ID}/${self.id}`,
                      ),
                  ]);
        },
        onTick(state, self) {
            const elapsed = state.tick - self.data.lastTick;
            if (elapsed <= 0) {
                return state;
            }

            const remaining = self.data.timer - elapsed;
            const pulses = remaining <= 0 ? Math.floor(-remaining / interval) + 1 : 0;

            return setData(state, effectRef(self), {
                ...self.data,
                layers: Math.min(capacity, self.data.layers + pulses),
                timer: remaining + pulses * interval,
                lastTick: state.tick,
            });
        },
    };

    return definition;
}

export function create(
    profile: Profile,
    options: { readonly recoveryTicks?: number } = {},
): { readonly definition: Definition; readonly action: Attack<object, SkillAttackState> } {
    if (
        profile.id !== "char_311_mudrok" ||
        profile.skill.definition.id !== "skchr_mudrok_2" ||
        profile.skillRange === null
    ) {
        throw new TypeError("Mudrock content requires her second skill and its range");
    }
    if (
        profile.configuration.module !== undefined &&
        profile.configuration.module.id !== "uniequip_002_mudrok"
    ) {
        throw new TypeError("Mudrock content supports only module X");
    }

    const recoveryTicks = options.recoveryTicks ?? 0;

    const shield = shieldEffect(profile);
    const normalAttack = createNormal(profile, recoveryTicks);
    const action = createSkillAction(profile, recoveryTicks);
    const targeting = action.attack.targetGroups[0].targeting;
    const skill: SkillDefinition = {
        ...profile.skill.definition,
        activation: {
            ...profile.skill.definition.activation!,
            sustain: { type: "INFINITE" },
            accepts(battle, sourceRef) {
                const source = getCurrentUnit(battle, sourceRef);

                return (
                    source !== undefined &&
                    hasCandidate(battle, { ...targeting, source: unitRef(source) })
                );
            },
            onStart(state, source) {
                const unit = getCurrentUnit(state, source);
                if (unit === undefined || !hasAction(unit)) {
                    return state;
                }

                state = clearCooldown(state, actionRef(unitRef(unit), normalAttack));
                state = clearCooldown(state, actionRef(unitRef(unit), action));

                return state;
            },
        },
    };
    const initializeNormalAttack = createAction(normalAttack);
    const initializeAction = createAction(action);

    const definition: Definition = {
        elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
        id: profile.id,
        profile,
        occupancy: { slot: "OCCUPANT" },
        targetable: { restrictions: [] },
        deployable: { retreatRules: [] },
        card: {
            cost: profile.attributes.cost,
            redeployTicks: secondsToTicks(profile.attributes.respawnTime),
            slots: 1,
            stock: 1,
            stockLimit: 1,
            activeLimit: 1,
            cooldownOnDeploy: false,
            recoverOnLeave: true,
            increaseCostOnLeave: true,
            refund: { rate: 0.5, limit: "BASE_COST" },
            deploymentRules: [
                {
                    id: "deployment/site",
                    allows(battle, { request }) {
                        const tile = getTile(battle.battlefield.map, request.tilePosition);

                        return (
                            tile !== undefined &&
                            (tile.state.placement === "MELEE" || tile.state.placement === "ALL") &&
                            (tile.state.siteCondition === null ||
                                tile.state.siteCondition === normalSite)
                        );
                    },
                },
            ],
            unitHooks: Hooks.empty(),
            initialize: (battle) => ({ state: battle, value: {} }),
        },
        vitality: {
            maxHp: profile.attributes.maxHp,
            defense: profile.attributes.defense,
            resistance: profile.attributes.resistance,
        },
        offense: { attack: profile.attributes.attack },

        allegiance: { side: "ALLY" },
        layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.25 } },
        blocker: {
            capacity: profile.attributes.blockCapacity,
            layer: "GROUND",
            rules: [sides("ENEMY")],
        },
        action: {
            initialize: (battle) => createActions(battle, initializeNormalAttack, initializeAction),
            select: (battle, self) => ({
                state: battle,
                value: [
                    hasSkill(self) && self.skill.activation !== null ? action.id : normalAttack.id,
                ],
            }),
        },
        skill: { initialize: (battle) => createSkill(battle, skill) },
        hooks: Hooks.empty().set(unitHooks.enter, {
            id: "mudrock/install-initial-effects",
            invoke(state, self) {
                if (!hasVitality(self) || !hasTargetable(self)) {
                    return { state, value: undefined };
                }

                const host = unitRef(self);
                state = install(state, host, shield).state;

                return { state: install(state, host, healFree).state, value: undefined };
            },
        }),
    };

    return { definition, action };
}

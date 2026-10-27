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
import { hasBlocker } from "../../../core/unit/capability/blocking/index.js";
import type { Profile } from "../../../data/arknights/operator.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import {
    modify,
    hasSkill,
    type Definition as SkillDefinition,
} from "../../../core/unit/capability/skill/index.js";
import type { Direction } from "../../../core/geometry/direction.js";

import type { Definitions as CapabilityDefinitions } from "../../../core/unit/capability/catalog.js";
import { hasAction } from "../../../core/unit/capability/action/index.js";
import { createDefinition as createDeployableDefinition } from "../../../core/unit/capability/deployable/index.js";

import { healFree } from "../../effects/protection.js";
import { hasVitality, type Vitality } from "../../../core/unit/capability/vitality/index.js";
import { removeHook, setHook } from "../../../core/battle/damage/index.js";
import {
    type Definition as EffectDefinition,
    ref as effectRef,
    get,
    install,
    update,
} from "../../../core/unit/effect/index.js";

import { createNormal, createSkill } from "./action.js";
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
    readonly direction: Direction;
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

    return unit.effects.read(effect.id, ({ data }) =>
        "layers" in data &&
        typeof data.layers === "number" &&
        "timer" in data &&
        typeof data.timer === "number"
            ? { layers: data.layers, timer: data.timer }
            : undefined,
    );
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
            update(state, effectRef(self), (data) => ({ ...data, lastTick: state.tick })),
        onEnable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            if (unit === undefined) {
                return state;
            }

            const ref = effectRef(self);

            return updateUnit(state, [
                {
                    ...unit,
                    vitality: setHook(unit.vitality, {
                        id: `${SHIELD_ID}/${self.id}`,
                        stage: "receiving",
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
                                state = update(state, ref, (data) => ({
                                    ...data,
                                    layers: data.layers - 1,
                                }));
                                state = healSelf(state, self.host.id, healRatio);
                                const current = getCurrentUnit(state, self.host);

                                if (current !== undefined && hasSkill(current)) {
                                    state = modify(state, unitRef(current), extraSp).state;
                                }

                                return {
                                    state,
                                    value: {
                                        ...pending,
                                        cancellation: {
                                            reason: "MUDROCK_SHIELD",
                                        },
                                    },
                                };
                            }

                            const sourceId = context.request.source?.id ?? null;
                            const sarkazScale = hasSarkazTag(
                                sourceId === null
                                    ? undefined
                                    : state.battlefield.units.get(sourceId),
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
                },
            ]);
        },
        onDisable: (state, self) => {
            const unit = getCurrentUnit(state, self.host);

            return unit === undefined
                ? state
                : updateUnit(state, [
                      {
                          ...unit,
                          vitality: removeHook(unit.vitality, `${SHIELD_ID}/${self.id}`),
                      },
                  ]);
        },
        onTick(state, self) {
            const elapsed = state.tick - self.data.lastTick;

            if (elapsed <= 0) {
                return state;
            }

            const remaining = self.data.timer - elapsed;
            const pulses = remaining <= 0 ? Math.floor(-remaining / interval) + 1 : 0;

            return update(state, effectRef(self), (data) => ({
                ...data,
                layers: Math.min(capacity, data.layers + pulses),
                timer: remaining + pulses * interval,
                lastTick: state.tick,
            }));
        },
    };

    return definition;
}

export function create(
    profile: Profile,
    options: { readonly direction?: Direction; readonly recoveryTicks?: number } = {},
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

    const direction = options.direction ?? "RIGHT";
    const recoveryTicks = options.recoveryTicks ?? 0;

    const shield = shieldEffect(profile);
    const normalAttack = createNormal(profile, direction, recoveryTicks);
    const action = createSkill(profile, direction, recoveryTicks);
    const targeting = action.attack.targetGroups[0].targeting;
    const skill: SkillDefinition = {
        ...profile.skill.definition,
        activation: {
            ...profile.skill.definition.activation!,
            sustain: { type: "INFINITE" },
            accepts(battle, self) {
                const source = getCurrentUnit(battle, self.host);

                return (
                    source !== undefined &&
                    hasCandidate(battle, { ...targeting, source: unitRef(source) })
                );
            },
            onStart(state, self) {
                const unit = getCurrentUnit(state, self.host);

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
        direction,
        occupancy: { slot: "OCCUPANT" },
        targetable: { restrictions: [] },
        deployable: createDeployableDefinition({
            cost: profile.attributes.cost,
            redeployTicks: secondsToTicks(profile.attributes.respawnTime),
            slots: 1,
            placement: "MELEE",
            allowedSiteConditions: [normalSite],
        }),
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
            geometry: { radius: 0.70709997 },
        },
        action: {
            initialize: (battle) => createActions(battle, initializeNormalAttack, initializeAction),
            select: (battle, self) => ({
                state: battle,
                value: [hasSkill(self) && self.skill.active !== null ? action.id : normalAttack.id],
            }),
        },
        skill,
        hooks: [
            {
                id: "mudrock/install-initial-effects",
                stage: "enter",
                invoke(state, self) {
                    if (!hasVitality(self) || !hasTargetable(self)) {
                        return { state, value: undefined };
                    }

                    const host = unitRef(self);
                    state = install(state, host, shield).state;

                    return { state: install(state, host, healFree).state, value: undefined };
                },
            },
        ],
    };

    return { definition, action };
}

import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { select } from "../../dist/core/battle/targeting/index.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { initialize as initializeUnit } from "./unit.js";
import { getUnit } from "./unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { definition, attackBuff } from "./effects.js";

export const effectProgram = (id, initialize = () => ({})) => ({ id, initialize });
export function auraUnit(id, position = [0, 0], extra = {}) {
    return initializeUnit({
        id,
        position,
        definition: { hooks: [],
            id: `aura-unit-${id}`,
            targetable: { restrictions: [] },
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            offense: { attack: 100 },
            ...extra,
        },
    });
}
export const attackEffect = (id, callbacks = {}) => attackBuff(id, 20, callbacks);

export function auraEffect(
    receiver,
    {
        id = "aura",
        accepts = () => true,
        bindLifetime = true,
        initialState = () => undefined,
        refreshInterval = 1,
        group,
    } = {},
) {
    const selfOf = (state, self) => effects.get(state, effectRef(self));
    const refresh = (state, initial) => {
        let self = selfOf(state, initial);
        if (self?.status !== "ACTIVE") return state;
        const host = getUnit(state, self.host.id);
        const selectedResult = select(state, {
            source: unitRef(host),
            purposes: ["EFFECT"],
            filter: (_battle, request, target) =>
                target.id !== request.source.id && accepts(target, host),
            selector: (battle, _request, candidates) => ({ state: battle, value: candidates.map(unitRef) }),
        });
        state = selectedResult.state;
        const selected = selectedResult.value.map(target => target.id);
        for (const binding of self.data.bindings) {
            if (selected.includes(binding.unitId)) continue;
            const current = selfOf(state, initial);
            state = effects.setData(state, effectRef(initial), {
                ...current.data,
                bindings: current.data.bindings.filter((item) => item !== binding),
            });
            for (const ref of binding.refs)
                state = effects.end(state, ref, "AURA_LEFT");
        }
        for (const unitId of selected) {
            self = selfOf(state, initial);
            if (self?.status !== "ACTIVE") break;
            if (self.data.bindings.some((binding) => binding.unitId === unitId)) continue;
            state = effects.setData(state, effectRef(self), {
                ...self.data,
                bindings: [...self.data.bindings, { unitId, refs: [] }],
            });
            self = selfOf(state, initial);
            if (self?.status !== "ACTIVE") break;
            const value = initialState(state, self, unitId);
            const installed = effects.install(
                state,
                unitRef(getUnit(state, unitId)),
                receiver,
                {
                    source: self.host,
                    scopes: bindLifetime ? [lifetimeScope(effectLifetime, effectRef(self))] : [],
                    ...(value === undefined ? {} : { data: value }),
                },
            );
            state = installed.state;
            const ref = installed.value;
            self = selfOf(state, initial);
            if (ref === undefined || self === undefined || self.status === "ENDING") continue;
            state = effects.setData(state, effectRef(self), {
                ...self.data,
                bindings: self.data.bindings.map((binding) =>
                    binding.unitId === unitId ? { ...binding, refs: [ref] } : binding,
                ),
            });
            if (self.status !== "ACTIVE")
                state = effects.setEnabled(state, ref, false);
        }
        return state;
    };
    return definition(
        id,
        { bindings: [], nextRefreshTick: 0 },
        {
            ...(group === undefined ? {} : { group }),
            onTick(state, self) {
                if (state.tick < self.data.nextRefreshTick) return state;
                state = effects.setData(state, effectRef(self), {
                    ...self.data,
                    nextRefreshTick: state.tick + refreshInterval,
                });
                return refresh(state, self);
            },
            onEnable(state, self) {
                state = refresh(state, self);
                const current = selfOf(state, self);
                if (current?.status !== "ACTIVE") return state;
                for (const binding of current.data.bindings) {
                    for (const ref of binding.refs)
                        state = effects.setEnabled(state, ref, true);
                }
                return state;
            },
            onDisable(state, self) {
                if (self.status === "ENDING") return state;
                for (const binding of self.data.bindings) {
                    for (const ref of binding.refs)
                        state = effects.setEnabled(state, ref, false);
                }
                return state;
            },
        },
    );
}

export function effectPlacement(effect, unit = auraUnit(0), scopes = []) {
    return {
        definition: {
            ...unit.definition,
            hooks: [{
                id: "fixture/initial-effect", stage: "enter",
                invoke(battle, self) {
                    const host = unitRef(self);
                    return { state: effects.install(battle, host, effect, { source: host, scopes }).state, value: undefined };
                },
            }, ...unit.definition.hooks],
        },
        position: unit.position,
    };
}

export function attackAt(battle, unitId) {
    const unit = getUnit(battle, unitId);
    return unit === undefined ? undefined : resolveAttack(battle, unitRef(unit));
}

import type { Entry } from "../common/collection/entries.js";
import { key, type Key, type Hook as TacticalHook } from "../hook.js";
import { createChange, type Change } from "./change.js";
import type { Departure, Unit } from "./unit.js";

export type EnterHook = TacticalHook<Unit, void>;

export type TickHook = TacticalHook<Unit, void>;

export type LeaveHook = TacticalHook<Departure, void>;

export type PrepareHook = TacticalHook<Departure, void>;

export const enter = key<EnterHook>("unit.enter");

export const tick = key<TickHook>("unit.tick");

export const prepare = key<PrepareHook>("unit.prepare");

export const leave = key<LeaveHook>("unit.leave");

export function setHook<H extends Entry>(reference: Key<H>, entry: NoInfer<H>): Change<Unit> {
    return createChange<Unit>((self) => {
        const hooks = self.hooks.set(reference, entry);

        return hooks === self.hooks ? self : { ...self, hooks };
    });
}

export function removeHook<H extends Entry>(reference: Key<H>, id: string): Change<Unit> {
    return createChange<Unit>((self) => {
        const hooks = self.hooks.remove(reference, id);

        return hooks === self.hooks ? self : { ...self, hooks };
    });
}

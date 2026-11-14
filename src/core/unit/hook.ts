import type { Entry } from "../common/collection/entries.js";
import { key, type Key, type Hook as TacticalHook } from "../hook.js";
import { createChange, type Change } from "./change.js";
import type { Departure, Unit } from "./unit.js";

export type EnterHook = TacticalHook<Unit, void>;

export type TickHook = TacticalHook<Unit, void>;

export type LeaveHook = TacticalHook<Departure, void>;

export type PrepareHook = TacticalHook<Departure, void>;

export const enter = key<EnterHook, Unit>("unit.enter");

export const tick = key<TickHook, Unit>("unit.tick");

export const prepare = key<PrepareHook, Unit>("unit.prepare");

export const leave = key<LeaveHook, Unit>("unit.leave");

export function setHook<H extends Entry, Owner extends object>(
    reference: Key<H, Owner>,
    entry: NoInfer<H>,
): Change<Unit & Owner> {
    return createChange<Unit & Owner>((self) => {
        const hooks = self.hooks.set(reference, entry);

        return hooks === self.hooks ? self : { ...self, hooks };
    });
}

export function removeHook<H extends Entry, Owner extends object>(
    reference: Key<H, Owner>,
    id: string,
): Change<Unit & Owner> {
    return createChange<Unit & Owner>((self) => {
        const hooks = self.hooks.remove(reference, id);

        return hooks === self.hooks ? self : { ...self, hooks };
    });
}

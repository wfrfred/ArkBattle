import type { Entry } from "../common/collection/entries.js";
import { key, type Hook, type Key } from "../hook.js";
import { createChange, type Change } from "./change.js";
import type { Departure, Unit } from "./unit.js";

export type EnteredHook = Hook<Unit, void>;

export type TickHook = Hook<Unit, void>;

export type RemovedHook = Hook<Departure, void>;

export type RemovingHook = Hook<Departure, void>;

export const entered = key<EnteredHook, Unit>("unit.entered");

export const tick = key<TickHook, Unit>("unit.tick");

export const removing = key<RemovingHook, Unit>("unit.removing");

export const removed = key<RemovedHook, Unit>("unit.removed");

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

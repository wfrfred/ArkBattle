import { at } from "../../../battlefield/occupancy.js";
import type { Ref } from "../../../common/ref.js";
import * as units from "../../query.js";
import { replace } from "../../operations.js";
import type { State } from "../../../battle/state.js";
import type { Direction } from "../../../geometry/direction.js";
import { createChange, type Change } from "../../change.js";
import type { Unit } from "../../unit.js";
import type { Occupancy, Pair } from "./capability.js";
import { replaceIn } from "../../../common/object.js";

export function setDirection(direction: Direction): Change<Unit & Occupancy> {
    return createChange<Unit & Occupancy>((unit) =>
        unit.occupancy.direction === direction
            ? unit
            : { ...unit, occupancy: { ...unit.occupancy, direction } },
    );
}

export function enter(battle: State, reference: Ref<Unit & Occupancy>): State {
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE") {
        return battle;
    }

    const tile = self.occupancy.tile;
    const current = at(battle.battlefield, tile)!;
    if (current.support === null || current.occupant === null) {
        return battle;
    }

    const support = current.support.get(battle)! as Pair["support"];
    const occupant = current.occupant.get(battle)!;
    if (support.lifecycle !== "ACTIVE" || occupant.lifecycle !== "ACTIVE") {
        return battle;
    }

    const previous = support.occupancy.pair;
    if (previous !== null && previous.occupant.ref === occupant.ref) {
        return battle;
    }
    if (previous !== null) {
        return enter(release(battle, previous), reference);
    }
    if (occupant.occupancy.pair !== null) {
        return enter(release(battle, occupant.occupancy.pair), reference);
    }

    const pair: Pair = { tile, support, occupant };
    battle = replace(battle, [
        replaceIn(support, ["occupancy", "pair"], pair),
        replaceIn(occupant, ["occupancy", "pair"], pair),
    ]);

    return support.definition.occupancy.onOccupantAdded?.(battle, pair) ?? battle;
}

export function leave(battle: State, self: Unit & Occupancy): State {
    return self.occupancy.pair === null ? battle : release(battle, self.occupancy.pair);
}

function release(battle: State, pair: Pair): State {
    const updates: (Unit & Occupancy)[] = [];

    for (const self of [pair.support, pair.occupant]) {
        const current = units.ref(self).get(battle);
        if (current?.occupancy.pair === pair) {
            updates.push(replaceIn(current, ["occupancy", "pair"], null));
        }
    }
    if (updates.length === 0) {
        return battle;
    }

    battle = replace(battle, updates);

    return pair.support.definition.occupancy.onOccupantRemoved?.(battle, pair) ?? battle;
}

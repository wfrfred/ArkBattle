import { at } from "../battlefield/occupancy.js";
import type { State as BattlefieldState } from "../battlefield/state.js";
import type { TilePosition } from "../geometry/coordinate.js";
import { hasOccupancy, type Occupancy } from "../unit/capability/occupancy/capability.js";
import type { Context, SupportHook } from "../unit/capability/occupancy/hook.js";
import type { Id, Unit } from "../unit/unit.js";
import * as hooks from "../hook.js";
import type { State } from "./state.js";

export function notify(
    battle: State,
    previous: BattlefieldState,
    next: BattlefieldState,
    changed: readonly Id[],
): State {
    if (previous.occupancy === next.occupancy) {
        return battle;
    }

    const positions = new Map<number, TilePosition>();

    for (const id of changed) {
        for (const field of [previous, next]) {
            const unit = field.units.get(id);
            if (unit !== undefined && hasOccupancy(unit) && unit.occupancy.tile !== null) {
                const tile = unit.occupancy.tile;
                positions.set(tile[0] * field.map.columns + tile[1], tile);
            }
        }
    }

    const candidates: {
        readonly stage: SupportHook["stage"];
        readonly context: Context;
    }[] = [];

    for (const tile of positions.values()) {
        const before = at(previous, tile);
        const after = at(next, tile);
        if (
            before?.occupant?.id === after?.occupant?.id &&
            before?.support?.id === after?.support?.id
        ) {
            continue;
        }

        for (const [stage, field, occupancy] of [
            ["occupantRemoved", previous, before],
            ["occupantAdded", next, after],
        ] as const) {
            if (occupancy?.support != null && occupancy.occupant !== null) {
                candidates.push({
                    stage,
                    context: {
                        tile,
                        support: field.units.get(occupancy.support.id)! as Unit & Occupancy,
                        occupant: field.units.get(occupancy.occupant.id)! as Unit & Occupancy,
                    },
                });
            }
        }
    }

    for (const { stage, context } of candidates) {
        const definition = context.support.definition.occupancy;
        if (definition.slot === "SUPPORT") {
            const entries = definition.hooks.filter((entry) => entry.stage === stage);

            battle = hooks.dispatch(battle, context, undefined, {
                candidates: () => entries.map(({ id }) => id),
                find: (_current, id) => entries.find((entry) => entry.id === id),
                stop(current) {
                    if (stage === "occupantRemoved") {
                        return false;
                    }

                    const occupancy = at(current.battlefield, context.tile);

                    return (
                        occupancy?.support?.id !== context.support.id ||
                        occupancy.occupant?.id !== context.occupant.id
                    );
                },
            }).state;
        }
    }

    return battle;
}

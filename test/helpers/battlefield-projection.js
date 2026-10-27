import { ref } from "../../dist/core/unit/index.js";
import { add, update, remove } from "../../dist/core/battlefield/unit.js";

export function applyUnitChanges(previous, content) {
    let field = previous;

    for (const unit of previous.units.values()) {
        if (!content.units.has(unit.id)) field = remove(field, ref(unit));
    }

    const updates = [];
    const additions = [];
    for (const unit of content.units.values()) {
        if (!previous.units.has(unit.id)) additions.push(unit);
        else if (previous.units.get(unit.id) !== unit) updates.push(unit);
    }

    field = update(field, updates);
    for (const unit of additions) field = add(field, unit);
    return field;
}

function occupancyFor(map, units) {
    const occupancy = new Map();
    for (const unit of units.values()) {
        const tile = unit.occupancy?.tile;
        if (tile == null) continue;
        const [row, column] = tile;
        if (row < 0 || row >= map.rows || column < 0 || column >= map.columns) {
            throw new RangeError("occupancy tile is outside the battlefield");
        }
        const key = row * map.columns + column;
        const entry = occupancy.get(key) ?? { occupant: null, support: null };
        const slot = unit.definition.occupancy.slot === "OCCUPANT" ? "occupant" : "support";
        if (entry[slot] !== null && entry[slot].id !== unit.id) {
            throw new RangeError("occupancy slot is already occupied");
        }
        occupancy.set(key, { ...entry, [slot]: ref(unit) });
    }
    return occupancy;
}

export function maintainFully(previous, content) {
    return {
        ...previous,
        ...content,
        occupancy: occupancyFor(previous.map, content.units),
    };
}

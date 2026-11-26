import { Vec2 } from "../../common/vector.js";
import type { State as BattleState, Result } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import type { Blocker } from "../../unit/capability/blocking/blocker/blocker.js";
import type { Blockable, BlockOffset } from "../../unit/capability/blocking/blockable/blockable.js";

function normalize(vector: Vec2): Vec2 {
    const length = Vec2.length(vector);

    return length > 0.00001 ? Vec2.scale(vector, 1 / length) : [0, 0];
}

export function calculateOffset(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): Result<BlockOffset> {
    const center = blocker.position;
    let offset = Vec2.sub(target.position, center);
    if (Vec2.length(offset) < 0.5) {
        offset = Vec2.scale(normalize(offset), 0.5);
    }

    const position = Vec2.add(center, offset);
    let overlaps = false;
    let separation: Vec2 = [0, 0];

    for (const { blocked } of blocker.blocker.relations) {
        const previous = blocked.get(battle)!;
        const other = previous.blockable.offset?.to ?? previous.position;
        const delta = Vec2.sub(position, other);
        const distanceSquared = Vec2.distanceSquared(position, other);

        if (distanceSquared < 0.01) {
            overlaps = true;
            const radial = Vec2.sub(other, center);
            separation = Vec2.add(separation, normalize([radial[1], -radial[0]]));
        } else if (distanceSquared < 0.16) {
            separation = Vec2.add(
                separation,
                Vec2.scale(normalize(delta), (0.4 - Math.sqrt(distanceSquared)) * 50),
            );
        }
    }

    let to = position;
    if (overlaps) {
        const direction = normalize(Vec2.add(offset, Vec2.scale(normalize(separation), 0.2)));
        to = Vec2.add(center, Vec2.scale(direction, Vec2.length(offset)));
    }

    return { state: battle, value: { from: target.position, to, startTick: battle.tick } };
}

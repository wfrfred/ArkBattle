import { Vec2 } from "../../../common/vector.js";
import { Tile, World, type WorldPosition } from "../../../geometry/coordinate.js";
import type { Map } from "../../../battlefield/navigation/map.js";

export function reflect(
    position: WorldPosition,
    nextPosition: WorldPosition,
    map: Map,
): WorldPosition {
    const origin = World.toTile(position);
    if (!map.contains(origin)) {
        return nextPosition;
    }

    const destination = World.toTile(nextPosition);
    if (Vec2.equal(destination, origin) || map.get(destination)?.passable === true) {
        return nextPosition;
    }

    const normal = Vec2.sub(Tile.center(destination), position);
    const magnitude = Math.hypot(normal[0], normal[1]);
    const unitNormal = Vec2.scale(normal, 1 / magnitude);
    const delta = Vec2.sub(nextPosition, position);
    const dot = delta[0] * unitNormal[0] + delta[1] * unitNormal[1];

    return Vec2.add(position, Vec2.sub(delta, Vec2.scale(unitNormal, 2 * dot)));
}

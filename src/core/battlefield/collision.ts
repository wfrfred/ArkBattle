import { Vec2 } from "../common/vector.js";
import { Tile, type TilePosition, type WorldPosition } from "../geometry/coordinate.js";
import { sweepAgainstBox } from "../geometry/intersection.js";
import type { Shape } from "../geometry/shape.js";
import type { Map } from "./map/map.js";
import type { Collision } from "./map/tile.js";

export interface Contact {
    readonly tile: TilePosition;
    readonly normal: Vec2;
}

export interface ForcedMotion {
    readonly position: WorldPosition;
    readonly velocity: Vec2;
    readonly contacts: readonly Contact[];
}

interface Collider {
    readonly tile: TilePosition;
    readonly origin: WorldPosition;
    readonly box: Collision;
}

const normalTolerance = 32 * Number.EPSILON;

function colliders(map: Map): Collider[] {
    const result: Collider[] = [];
    let index = 0;

    for (const { state } of map.tiles.values()) {
        const box = state.collision;
        if (box !== null) {
            const tile: TilePosition = [Math.floor(index / map.columns), index % map.columns];
            result.push({ tile, origin: Tile.center(tile), box });
        }

        index++;
    }

    return result;
}

function dot(left: Vec2, right: Vec2): number {
    return left[0] * right[0] + left[1] * right[1];
}

function clipVelocity(velocity: Vec2, contacts: readonly Contact[]): Vec2 {
    const speed = Vec2.length(velocity);
    let best: Vec2 = [0, 0];
    let leastLoss = speed * speed;

    // In two dimensions the closest valid velocity is a face projection or zero.
    for (const { normal } of contacts) {
        const inward = dot(velocity, normal);
        if (inward >= 0) {
            continue;
        }

        const tangent = Vec2.sub(velocity, Vec2.scale(normal, inward));
        const loss = inward * inward;
        if (
            loss < leastLoss &&
            contacts.every((contact) => dot(tangent, contact.normal) >= -speed * normalTolerance)
        ) {
            best = tangent;
            leastLoss = loss;
        }
    }

    return best;
}

export function advanceForcedMotion(
    map: Map,
    position: WorldPosition,
    velocity: Vec2,
    shape: Shape,
): ForcedMotion {
    const contacts: Contact[] = [];
    if (Vec2.length(velocity) === 0) {
        return { position, velocity, contacts };
    }

    const obstacles = colliders(map);
    const touched = new Set<TilePosition>();
    let remaining = 1;

    while (remaining > 0 && Vec2.length(velocity) > 0) {
        const destination = Vec2.add(position, Vec2.scale(velocity, remaining));
        const tolerance = Vec2.length(velocity) * normalTolerance;
        const hits: Contact[] = [];
        let firstTime = Infinity;

        for (const { tile, origin, box } of obstacles) {
            if (touched.has(tile)) {
                continue;
            }

            const hit = sweepAgainstBox(shape, position, destination, box, origin);
            if (hit === null || dot(velocity, hit.normal) >= -tolerance) {
                continue;
            }
            if (hit.time < firstTime) {
                firstTime = hit.time;
                hits.length = 0;
            }
            if (hit.time === firstTime) {
                hits.push({ tile, normal: hit.normal });
            }
        }
        if (hits.length === 0) {
            position = destination;
            break;
        }

        position = Vec2.lerp(position, destination, firstTime);
        remaining *= 1 - firstTime;

        for (const hit of hits) {
            touched.add(hit.tile);
            contacts.push(hit);
        }

        // Keep the earlier contact planes for the rest of the step. Every blocked
        // sweep adds a tile, so simultaneous and zero-time contacts finish.
        velocity = clipVelocity(velocity, contacts);
    }

    return { position, velocity, contacts };
}

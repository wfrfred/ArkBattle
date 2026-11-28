import { readFile } from "node:fs/promises";
import { deepEqual } from "node:assert/strict";
import * as battlefield from "../../../../dist/core/battlefield/state.js";
import * as navigation from "../../../../dist/core/battlefield/navigation/query.js";
import { Tile, World } from "../../../../dist/core/geometry/coordinate.js";
import { parseBattlefieldMap } from "../../../../dist/data/level/map.js";

const raw = await readFile(
    "assets/arknights-game-data/zh_CN/gamedata/levels/obt/main/level_main_05-02.json",
    "utf8",
);
const level = JSON.parse(raw);
const action = level.waves[0].fragments[4].actions[5];
const previous = level.routes[action.routeIndex].checkpoints[2];
const current = level.routes[action.routeIndex].checkpoints[3];
const state = battlefield.create(parseBattlefieldMap(level.mapData, {
    mire: null, deepsea: null, tileDeploymentPrefabs: [],
})).navigation;
const position = [
    previous.position.col + previous.reachOffset.x,
    previous.position.row + previous.reachOffset.y,
];
const originalTile = [current.position.col, current.position.row];
const originalCenter = Tile.center(originalTile);
const reachPosition = [
    originalCenter[0] + current.reachOffset.x,
    originalCenter[1] + current.reachOffset.y,
];
const roundedTile = World.toTile(reachPosition);
const fromTile = World.toTile(position);
function nextPoint(toTile) {
    const next = navigation.nextTile(state, "WALK", fromTile, toTile);
    if (next === null) return null;
    return next[0] === toTile[0] && next[1] === toTile[1] ? reachPosition : Tile.center(next);
}
const fromOriginalGridWithOffset = nextPoint(originalTile);
const fromRoundedGrid = nextPoint(roundedTile);

// Retain the historical evidence's native [row, col] output convention.
const nativeTiles = [originalTile, roundedTile].map(([x, y]) => [y, x]);
deepEqual(nativeTiles, [[1, 4], [2, 4]]);
deepEqual([fromOriginalGridWithOffset, fromRoundedGrid], [[4.25, 1.5], [4, 1]]);
console.log(JSON.stringify({ position, originalTile: nativeTiles[0], roundedTile: nativeTiles[1], reachPosition,
    fromOriginalGridWithOffset, fromRoundedGrid }, null, 2));

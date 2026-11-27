import { readFile } from "node:fs/promises";
import { deepEqual } from "node:assert/strict";
import * as battlefield from "../../../../dist/core/battlefield/state.js";
import * as navigation from "../../../../dist/core/battlefield/navigation/state.js";
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
const originalTile = [current.position.row, current.position.col];
const originalCenter = Tile.center(originalTile);
const reachPosition = [
    originalCenter[0] + current.reachOffset.x,
    originalCenter[1] + current.reachOffset.y,
];
const roundedTile = World.toTile(reachPosition);
const fromOriginalGridWithOffset = navigation.nextPoint(state, "WALK", position, { tile: originalTile, position: reachPosition });
const fromRoundedGrid = navigation.nextPoint(state, "WALK", position, { tile: roundedTile, position: reachPosition });

deepEqual([originalTile, roundedTile], [[1, 4], [2, 4]]);
deepEqual([fromOriginalGridWithOffset, fromRoundedGrid], [[4.25, 1.5], [4, 1]]);
console.log(JSON.stringify({ position, originalTile, roundedTile, reachPosition,
    fromOriginalGridWithOffset, fromRoundedGrid }, null, 2));

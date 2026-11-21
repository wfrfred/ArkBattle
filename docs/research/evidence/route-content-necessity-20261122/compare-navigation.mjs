import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = pathToFileURL(resolve(".")).href;
const [game, navState, nav, coords] = await Promise.all(
    [
        "/dist/data/level/map.js",
        "/dist/core/battlefield/state.js",
        "/dist/core/battlefield/navigation/state.js",
        "/dist/core/geometry/coordinate.js",
    ].map((path) => import(root + path)),
);
const scan = JSON.parse(await readFile(process.argv[2], "utf8"));
const seen = new Set();
let valid = 0,
    fail = 0;
const diff = [];
for (const [file, pointer, s] of scan.samples.crossing) {
    if (seen.has(file + pointer)) continue;
    seen.add(file + pointer);
    const d = JSON.parse(
        await readFile(new URL(root + "/assets/arknights-game-data/" + file), "utf8"),
    );
    const [_, field, routeId, _ck, index] = pointer.split("/");
    const route = d[field][+routeId];
    let state;
    try {
        state = navState.create(game.parseBattlefieldMap(d.mapData)).navigation;
    } catch (e) {
        fail++;
        continue;
    }
    valid++;
    const previous = route.checkpoints
        .slice(0, +index)
        .findLast(
            (ck) => ck.type === "MOVE" || ck.type === "PATROL_MOVE" || ck.type === "APPEAR_AT_POS",
        );
    const start = previous
        ? [
              previous.position.col + previous.reachOffset.x,
              previous.position.row + previous.reachOffset.y,
          ]
        : [route.startPosition.col, route.startPosition.row];
    const [row, col] = s.original;
    const target = [col + s.offset.x, row + s.offset.y];
    const fixed = nav.nextPoint(state, s.mode, start, [col, row]);
    const a = fixed?.[0] === col && fixed?.[1] === row ? target : fixed;
    const b = nav.nextPoint(state, s.mode, start, target);
    if ((a?.[0] !== b?.[0] || a?.[1] !== b?.[1]) && (!previous || !previous.randomizeReachOffset)) {
        diff.push({
            file,
            pointer,
            action: s.action,
            start,
            a,
            b,
            target,
            index: +index,
            mode: s.mode,
            id: s.id,
        });
    }
}
console.log(
    JSON.stringify(
        {
            unique: seen.size,
            valid,
            fail,
            differences: diff.length,
            samples: diff.filter((x) => x.file.includes("/obt/main/")).slice(0, 12),
            others: diff.slice(0, 3),
        },
        null,
        2,
    ),
);

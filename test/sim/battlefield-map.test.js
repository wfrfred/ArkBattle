import { infection, normal } from '../../dist/content/terrain/definition.js';
import { createTile, tiles as tileEntries } from '../helpers/tiles.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { create } from '../../dist/core/battlefield/map/map.js';
import { create as createFieldState } from '../../dist/core/battlefield/state.js';

test('battlefield maps accept structural data while keeping fields and nested collections readonly', async () => {
  const { default: ts } = await import('typescript');
  const directory = mkdtempSync(join(tmpdir(), 'stronghold-battlefield-map-types-'));
  const sourceModule = path => JSON.stringify(fileURLToPath(new URL(`../../src/core/battlefield/${path}.js`, import.meta.url)));
  const path = join(directory, 'map.mts');
  try {
    writeFileSync(path, `
import { create, contains, get, type Map, type Marker, type BlockEdge } from ${sourceModule('map/map')};
import { Tiles } from ${sourceModule('map/tiles')};
import type { Tile } from ${sourceModule('map/tile')};
import type { Definition } from ${sourceModule('map/terrain')};
declare const fields: Pick<Map, 'rows' | 'columns' | 'tiles' | 'markers' | 'blockEdges'>;
const structural: Map = fields;
const shallowFrozen: Map = Object.freeze(fields);
contains(structural, [0, 0]);
get(shallowFrozen, [0, 0]);
const marker: Marker = { type: 'START', position: [0, 0] };
const edge: BlockEdge = { position: [0, 0], direction: 'RIGHT', blockMask: 'WALK_ONLY' };
const map: Map = create(fields.rows, fields.columns, fields.tiles, [marker], [edge]);
get(map, [0, 0]);
const { tiles: omittedTiles, ...withoutTiles } = fields;
// @ts-expect-error Structural maps still require every map field.
const incomplete: Map = withoutTiles;
// @ts-expect-error Queries require all map fields.
get(withoutTiles, [0, 0]);
declare const tile: Tile<{ power: number }>;
const invalidTile = { ...tile, state: { ...tile.state, passability: 'INVALID' as const } };
// @ts-expect-error Typed tile writes require valid common fields.
fields.tiles.add(invalidTile);
// @ts-expect-error Structural maps require the Tiles container.
const invalid: Map = { ...fields, tiles: [tile] };
declare const definition: Definition<{ power: number }>;
const entries = Tiles.empty().add({ ...tile, definition: { ...tile.definition, terrain: definition.create({ power: 2 }) } });
entries.get(0, definition)?.definition.terrain.params.power;
// @ts-expect-error Terrain creation requires its own parameters.
definition.create({ damage: 2 });
// @ts-expect-error Typed retrieval preserves parameter field names.
entries.get(0, definition)?.definition.terrain.params.damage;
// @ts-expect-error General views do not expose erased parameters.
entries.get(0)?.definition.terrain.params;
// @ts-expect-error Generic readers cannot assume a particular parameter shape.
entries.read(0, tile => tile.definition.terrain.params.power);
// @ts-expect-error Map fields stay readonly.
structural.rows = 2;
// @ts-expect-error Maps expose readonly nested collections.
map.tiles.push(tile);
// @ts-expect-error Map marker coordinates stay readonly.
map.markers[0]!.position[0] = 1;
// @ts-expect-error Map block edge coordinates stay readonly.
map.blockEdges[0]!.position[0] = 1;
`);
    const program = ts.createProgram([path], {
      noEmit: true,
      strict: true,
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      skipLibCheck: true,
      types: [],
    });
    assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), []);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('battlefield versions share their map and validated internal marker and edge coordinates', () => {
  const tile = createTile({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
    walkCost: 1, advancedBuildableMask: 1,
    terrain: infection.create({
      damage: 300, attackBonusRatio: 0.2, attackSpeedBonus: 20, durationTicks: 60,
    }),
  });
  const tiles = tileEntries([tile]);
  const markers = [{ type: 'START', position: [0, 0] }];
  const blockEdges = [{ position: [0, 0], direction: 'RIGHT', blockMask: 'WALK_ONLY' }];
  const map = create(1, 1, tiles, markers, blockEdges);
  assert.equal(Object.isFrozen(map), false);
  assert.equal(map.tiles.get(0, normal), undefined);
  assert.equal(map.tiles.get(-1), undefined);
  assert.equal(map.tiles.get(1), undefined);
  const field = createFieldState(map);
  const published = field;
  const draft = field;

  for (const branch of [field, published, draft]) {
    assert.equal(branch.map, map);
    assert.equal(branch.map.tiles, tiles);
    assert.equal(branch.map.tiles.get(0), tile);
    assert.equal(branch.map.tiles.get(0).state.passability, 'ALL');
    assert.equal(branch.map.tiles.get(0, infection).definition.terrain.params.damage, 300);
    assert.equal(branch.map.markers, markers);
    assert.equal(branch.map.blockEdges, blockEdges);
    assert.equal(branch.map.markers[0].position, markers[0].position);
    assert.equal(branch.map.blockEdges[0].position, blockEdges[0].position);
    assert.equal(branch.map.blockEdges[0].blockMask, 'WALK_ONLY');
    assert.equal(branch.navigation.baseline.WALK.cells[0].passable, true);
  }
});

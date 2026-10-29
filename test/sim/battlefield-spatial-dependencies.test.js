import { snapshot } from "../helpers/snapshot.js";
import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { unitsAt } from "../helpers/battlefield.js";
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { create as createMap } from '../../dist/core/battlefield/map/map.js';
import { createTile } from '../helpers/tiles.js';
import { create as createNavigationMap } from '../../dist/core/battlefield/map/navigation.js';
import { create as createNavigation } from '../../dist/core/battlefield/navigation/state.js';
import { create as createField } from '../../dist/core/battlefield/state.js';
import { applyUnitChanges, maintainFully } from '../helpers/battlefield-projection.js';
import { initialize } from "../helpers/unit.js";

function projectionFacts(state) {
  return { ...state, navigation: { baseline: Object.fromEntries(Object.entries(state.navigation.baseline).map(([mode, map]) => [mode, { rows: map.rows, columns: map.columns, cells: map.cells }])), overlays: state.navigation.overlays }, projectiles: state.projectiles.values().toArray(), units: new Map([...state.units].map(([id, unit]) => [
    id, { ...unit, effects: unit.effects.toJSON() },
  ])) };
}

function projectionSnapshot(state) {
  const { map, ...facts } = projectionFacts(state);
  const mapFacts = {
    rows: map.rows,
    columns: map.columns,
    tiles: Array.from({ length: map.tiles.size }, (_, index) => {
      const tile = map.tiles.get(index);
      return { ...tile, terrain: { params: tile.definition.terrain.params } };
    }),
    markers: map.markers,
    blockEdges: map.blockEdges,
  };
  return { state: { ...snapshot(facts), map }, mapFacts: snapshot(mapFacts) };
}

function assertProjectionSnapshot(state, snapshot) {
  assert.equal(state.map, snapshot.state.map);
  assert.equal(state.map.tiles, snapshot.state.map.tiles);
  assert.deepEqual(projectionFacts(state), snapshot.state, 'settlement must preserve the prior state');
  assert.deepEqual(projectionSnapshot(state).mapFacts, snapshot.mapFacts);
}

function projectionHarness() {
  const map = createMap(1, 5, tileEntries(Array.from({ length: 5 }, () => createTile({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
  }))));
  const navigation = createNavigation({
    WALK: createNavigationMap(map, 'WALK'),
    FLY: createNavigationMap(map, 'FLY'),
  });
  const branches = [applyUnitChanges, maintainFully].map(settle => ({
    settle, state: { ...createField(map), navigation },
  }));
  return {
    map,
    get state() { return branches[0].state; },
    commit(content) {
      const facts = branches.map(branch => {
        const previous = branch.state;
        const snapshot = projectionSnapshot(previous);
        const settled = branch.settle(previous, content);
        assertProjectionSnapshot(previous, snapshot);
        branch.state = settled;
        return settled.occupancy;
      });
      assert.deepEqual(branches[0].state, branches[1].state);
      for (let column = 0; column < map.columns; column++) {
        assert.deepEqual(unitsAt(branches[0].state, [0, column]), unitsAt(branches[1].state, [0, column]));
      }
      assert.deepEqual(facts[0], facts[1]);
      return facts[0];
    },
  };
}

const occupancyTile = column => [0, column];
const unit = (id, position, definition = {}, states = {}) => initialize({
  id, position, definition: { hooks: [], id: `spatial_dependencies_${id}`, ...definition }, states,
});
const register = (state, units) => ({ ...state, units: new Map([...state.units, ...units.map(unit => [unit.id, unit])]) });
const update = (state, unit) => ({ ...state, units: new Map([...state.units, [unit.id, unit]]) });

const occupancyCases = [
  {
    name: 'provider leaves spatial presence', id: 1,
    occupancy: [[1, { occupant: { id: 2 }, support: { id: 1 } }]],
    mutate: unit => ({ ...unit, spatialPresence: { present: false } }),
  },
  {
    name: 'supported unit leaves spatial presence', id: 2,
    occupancy: [[1, { occupant: { id: 2 }, support: { id: 1 } }]],
    mutate: unit => ({ ...unit, spatialPresence: { present: false } }),
  },
  {
    name: 'occupant clears occupancy tile', id: 2, tileOnly: true,
    occupancy: [[1, { occupant: null, support: { id: 1 } }]],
    mutate: unit => ({ ...unit, occupancy: { tile: null } }),
  },
  {
    name: 'provider occupancy tile moves independently of its world position', id: 1, tileOnly: true,
    occupancy: [
      [1, { occupant: { id: 2 }, support: null }],
      [2, { occupant: null, support: { id: 1 } }],
    ],
    mutate: unit => ({ ...unit, occupancy: { tile: occupancyTile(2) } }),
  },
];

for (const scenario of occupancyCases) {
  test(`selective and full occupancy projections agree when ${scenario.name}`, () => {
    const h = projectionHarness();
    const provider = unit(1, [1, 0], {
      occupancy: { slot: 'SUPPORT', hooks: [] },
    }, { spatialPresence: { present: true }, occupancy: { tile: occupancyTile(1) } });
    const supported = unit(2, [1, 0], {}, {
      spatialPresence: { present: true }, occupancy: { tile: occupancyTile(1) },
    });
    assert.deepEqual(h.commit(register(h.state, [provider, supported])), new Map([
      [1, { occupant: { id: 2 }, support: { id: 1 } }],
    ]));
    const previous = h.state;
    const facts = h.commit(update(h.state, scenario.mutate(h.state.units.get(scenario.id))));
    assert.deepEqual(facts, new Map(scenario.occupancy));
    assert.deepEqual(h.state.units.get(scenario.id).position, previous.units.get(scenario.id).position);
    if (scenario.tileOnly) {
      assert.deepEqual(unitsAt(h.state, [0, 1]).map(unit => unit.id), unitsAt(previous, [0, 1]).map(unit => unit.id));
      assert.notEqual(h.state.occupancy, previous.occupancy);
    } else {
      assert.equal(h.state.occupancy, previous.occupancy);
    }
    assert.deepEqual(unitsAt(previous, [0, 1]).map(unit => unit.id), [1, 2]);
    assert.deepEqual(unitsAt(h.state, [0, 1]).map(unit => unit.id), scenario.tileOnly ? [1, 2] : [1, 2].filter(id => id !== scenario.id));
    assert.equal(h.state.navigation, previous.navigation);
  });
}

test('equivalent occupancy tile values preserve occupancy indexes and both slots', () => {
  const h = projectionHarness();
  const provider = unit(1, [1, 0], {
    occupancy: { slot: 'SUPPORT', hooks: [] },
  }, { occupancy: { tile: occupancyTile(1) } });
  const supported = unit(2, [1, 0], {}, { occupancy: { tile: occupancyTile(1) } });
  h.commit(register(h.state, [provider, supported]));
  const previous = h.state;
  const facts = h.commit(update(h.state, {
    ...h.state.units.get(1), occupancy: { tile: occupancyTile(1) },
  }));
  assert.deepEqual(facts, new Map([[1, { occupant: { id: 2 }, support: { id: 1 } }]]));
  assert.deepEqual(unitsAt(h.state, [0, 1]).map(unit => unit.id), unitsAt(previous, [0, 1]).map(unit => unit.id));
  assert.equal(h.state.occupancy, previous.occupancy);
  assert.equal(h.state.occupancy.get(1).support, previous.occupancy.get(1).support);
});

test('Field unit updates preserve spatial queries without acquiring or owning blocking relations', () => {
  const h = projectionHarness();
  const blocker = unit(1, [1, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ALLY' },
    blocker: { layer: "GROUND", rules: [], capacity: 1, geometry: { radius: 1 } },
  }, { spatialPresence: { present: true } });
  const target = unit(2, [2, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ENEMY' },
    blockable: { volume: 1 }, layer: { type: 'GROUND' },
  });
  h.commit(register(h.state, [blocker, target]));
  assert.equal('blockingRelations' in h.state, false);
  assert.deepEqual(h.state.units.get(1).blocker.blocked, []);
  assert.equal(h.state.units.get(2).blockable.blocker, null);
  h.commit(update(h.state, { ...h.state.units.get(2), position: [1.25, 0] }));
  assert.equal(h.state.units.get(2).blockable.blocker, null);
  assert.deepEqual(h.state.units.get(1).blocker.blocked, []);
  assert.deepEqual(unitsAt(h.state, [0, 1]).map(unit => unit.id), [1, 2]);
});

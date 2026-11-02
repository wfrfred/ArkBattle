import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('Unit initialization derives capability pairs directly from the supplied definition', async () => {
  const { default: ts } = await import('typescript');
  const directory = mkdtempSync(join(tmpdir(), 'stronghold-unit-definition-types-'));
  const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
  const path = join(directory, 'definition.mts');
  writeFileSync(path, `
import type { Unit, Definition as UnitDefinition } from ${source('unit/index')};
import type { Definitions, Product } from ${source('unit/capability/catalog')};
import { initialize } from ${source('unit/index')};
import type { Input as UnitInput } from ${source('unit/initialize')};
import { hasOffense, type Offense } from ${source('unit/capability/offense/index')};
import { create as createSkill, type Definition as SkillDefinition } from ${source('unit/skill/index')};
import { hasSkill, type Skill } from ${source('unit/capability/skill/index')};
import type { Vitality } from ${source('unit/capability/vitality/index')};
import type { Route, Definition as RouteDefinition } from ${source('unit/capability/route/index')};
import type { Elemental } from ${source('unit/capability/elemental/index')};
import type { Definition as EffectDefinition } from ${source('unit/effect/definition')};
import { install } from ${source('unit/effect/index')};
import { ref, get } from ${source('unit/index')};
import { initialize as initializeRoutedUnit } from ${source('battle/creation/routed-unit')};
import type { Input as RouteInput } from ${source('battle/creation/route')};
import type { State as BattleState } from ${source('battle/state')};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type Configuration = UnitDefinition & Pick<Definitions, 'vitality'> &
  Partial<Pick<Definitions, 'offense' | 'skill' | 'elemental'>>;
declare const configuration: Configuration;
declare const skill: SkillDefinition;
declare const elemental: Definitions['elemental'];
declare const battle: BattleState;
declare const route: RouteDefinition;
declare const routeInput: RouteInput;
const selected = { ...configuration, offense: { attack: 10 }, skill: { initialize: (current: BattleState) => createSkill(current, skill) }, elemental } satisfies Configuration;
const plain = initialize(battle, { id: 0, definition: configuration, position: [0, 0] }).value;
const complete = initialize(battle, { id: 1, definition: selected, position: [0, 0] }).value;
const bare = initialize(battle, { id: 2, definition: { hooks: [], id: 'bare' }, position: [0, 0] }).value;
const routed = initialize(battle, { id: 3, definition: { ...selected, route }, position: [0, 0] }).value;
const paired: Unit & Vitality & Offense & Skill & Elemental = complete;
const captured: Unit & Vitality & Offense & Skill & Elemental & Route = routed;
const generic = <D extends UnitDefinition & Partial<Definitions>>(input: UnitInput<D>): Unit & Product<D> =>
  initialize(battle, input).value;
const genericComplete: Unit & Vitality & Offense & Skill & Elemental = generic({ id: 4, definition: selected, position: [0, 0] });
type LiteralDefinition = UnitDefinition & {
  readonly label: 'literal-content';
  readonly vitality: { readonly maxHp: 100; readonly defense: 0; readonly resistance: 0 };
};
declare const literalDefinition: LiteralDefinition;
const precise = initialize(battle, { id: 6, definition: literalDefinition, position: [0, 0] }).value;
type ExactDefinition = Assert<Equal<Product<LiteralDefinition>['definition'], LiteralDefinition>>;
const contentLabel: 'literal-content' = precise.definition.label;
const maxHp: 100 = precise.definition.vitality.maxHp;
const spawned = initializeRoutedUnit(battle, {
  id: 5, definition: { hooks: [], id: 'route-only' }, route: routeInput,
  timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
}).value;
const routeOnly: Unit & Route = spawned;
const healthAttack: EffectDefinition<{ bonus: number }, Vitality & Offense> = {
  id: 'health-attack', initialize: () => ({ bonus: 0 }),
  onEnable(state, self) {
    const current = get(state, self.host)!;
    const hp: number = current.vitality.hp;
    const attack: number = current.definition.offense.attack;
    return state;
  },
};
install(battle, ref(complete), healthAttack);
if (hasOffense(plain)) install(battle, ref(plain), healthAttack);
if (hasSkill(plain)) {
  const id: string = plain.skill.definition.id;
  const sp: number = plain.skill.sp?.value ?? 0;
}
// @ts-expect-error optional configuration is not proof of an installed Capability.
plain.offense;
// @ts-expect-error optional configuration does not expose Skill State.
plain.skill;
// @ts-expect-error a plain Unit has no default Vitality.
bare.vitality;
// @ts-expect-error a plain Unit has no default Allegiance.
bare.allegiance;
// @ts-expect-error no implicit Capability is added to a route-only spawn.
spawned.locomotion;
// @ts-expect-error route initialization does not require or install Vitality.
spawned.vitality;
// @ts-expect-error spatial presence is explicit content configuration.
spawned.spatialPresence;
// @ts-expect-error the host must prove both required capabilities.
install(battle, ref(plain), healthAttack);
// @ts-expect-error arbitrary Capability values are rejected at the Unit initialization entry.
initialize(battle, { id: 6, definition: { hooks: [], id: 'invalid', vitality: { maxHp: 'wrong', defense: 0, resistance: 0 } }, position: [0, 0] });
`);
  try {
    const program = ts.createProgram([path], {
      noEmit: true, strict: true, exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, types: [],
    });
    assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), []);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

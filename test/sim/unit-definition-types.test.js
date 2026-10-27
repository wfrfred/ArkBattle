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
import { hasOffense, type Offense } from ${source('unit/capability/offense/index')};
import { hasSkill, type Definition as SkillDefinition, type Skill } from ${source('unit/capability/skill/index')};
import type { Vitality } from ${source('unit/capability/vitality/index')};
import type { Route, Definition as RouteDefinition } from ${source('unit/capability/route/index')};
import type { Elemental } from ${source('unit/capability/elemental/index')};
import type { Definition as EffectDefinition } from ${source('unit/effect/definition')};
import { install } from ${source('unit/effect/index')};
import { ref, get } from ${source('unit/index')};
import { initialize as initializeRoutedUnit } from ${source('battle/creation/routed-unit')};
import type { EnemySpawnDefinition } from ${source('battle/schedule/definition')};
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
const selected = { ...configuration, offense: { attack: 10 }, skill, elemental } satisfies Configuration;
const plain = initialize(battle, { id: 0, definition: configuration, position: [0, 0] }).value;
const complete = initialize(battle, { id: 1, definition: selected, position: [0, 0] }).value;
const bare = initialize(battle, { id: 2, definition: { hooks: [], id: 'bare' }, position: [0, 0] }).value;
const routed = initialize(battle, { id: 3, definition: { ...selected, route }, position: [0, 0] }).value;
const paired: Unit & Vitality & Offense & Skill & Elemental = complete;
const captured: Unit & Vitality & Offense & Skill & Elemental & Route = routed;
const generic = <D extends UnitDefinition & Partial<Definitions>>(definition: D): Unit & Product<D> =>
  initialize(battle, { id: 4, definition, position: [0, 0] }).value;
const genericComplete: Unit & Vitality & Offense & Skill & Elemental = generic(selected);
type LiteralDefinition = UnitDefinition & {
  readonly label: 'literal-content';
  readonly vitality: { readonly maxHp: 100; readonly defense: 0; readonly resistance: 0 };
};
declare const literalDefinition: LiteralDefinition;
const precise = initialize(battle, { id: 6, definition: literalDefinition, position: [0, 0] }).value;
type ExactDefinition = Assert<Equal<Product<LiteralDefinition>['definition'], LiteralDefinition>>;
const contentLabel: 'literal-content' = precise.definition.label;
const maxHp: 100 = precise.definition.vitality.maxHp;
type ExclusiveDefinition = UnitDefinition & (
  { readonly kind: 'vitality'; readonly vitality: Definitions['vitality'] } |
  { readonly kind: 'offense'; readonly offense: Definitions['offense'] }
);
declare const exclusiveDefinition: ExclusiveDefinition;
const exclusive = initialize(battle, { id: 7, definition: exclusiveDefinition, position: [0, 0] }).value;
type ExclusiveStates = Assert<Equal<keyof Product<ExclusiveDefinition>, 'definition'>>;
type ExactUnionDefinition = Assert<Equal<Product<ExclusiveDefinition>['definition'], ExclusiveDefinition>>;
// @ts-expect-error a capability present in one union member is not guaranteed on every instance.
exclusive.vitality;
// @ts-expect-error mutually exclusive capability states must not be combined.
exclusive.offense;
type SharedDefinition = UnitDefinition & Pick<Definitions, 'vitality'> &
  Partial<Pick<Definitions, 'elemental'>> & (
    { readonly kind: 'armed'; readonly offense: Definitions['offense'] } |
    { readonly kind: 'skilled'; readonly skill: Definitions['skill'] }
  );
declare const sharedDefinition: SharedDefinition;
const shared = initialize(battle, { id: 8, definition: sharedDefinition, position: [0, 0] }).value;
type SharedStates = Assert<Equal<keyof Product<SharedDefinition>, 'definition' | 'vitality'>>;
const sharedHp: number = shared.vitality.hp;
// @ts-expect-error the other union member does not install Offense.
shared.offense;
// @ts-expect-error optional capability definitions do not establish state presence.
shared.elemental;
const spawned = initializeRoutedUnit(battle, {
  id: 5, definition: { hooks: [], id: 'route-only' }, route: routeInput,
  timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
}).value;
const routeOnly: Unit & Route = spawned;
declare const oldRouteDefinition: UnitDefinition & {
  readonly marker: 19;
  readonly route: RouteDefinition & { readonly requireAllCheckpoints: false };
};
const replacedRoute = initializeRoutedUnit(battle, {
  id: 9, definition: oldRouteDefinition, route: routeInput,
  timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
}).value;
const retainedMarker: 19 = replacedRoute.definition.marker;
const replacementRoute: RouteDefinition = replacedRoute.definition.route;
type ReplacementRoute = Assert<Equal<typeof replacedRoute.definition.route, RouteDefinition>>;
// @ts-expect-error normalization replaces the old route rather than preserving its narrower literal.
const oldRequirement: false = replacedRoute.definition.route.requireAllCheckpoints;
const routedUnion = initializeRoutedUnit(battle, {
  id: 10, definition: exclusiveDefinition, route: routeInput,
  timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
}).value;
if (routedUnion.definition.kind === 'vitality') {
  const configuredHp: number = routedUnion.definition.vitality.maxHp;
}
// @ts-expect-error adding Route does not make a union-only capability state mandatory.
routedUnion.vitality;
const scheduled: EnemySpawnDefinition = {
  definition: { hooks: [], id: 'route-only' }, route: routeInput,
  alwaysCheckCurrentPoint: true, notCountInTotal: false,
};
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
  const id: string = plain.definition.skill.id;
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

test('base Unit has common fields while concrete content and guards provide capability pairs', async () => {
  const { default: ts } = await import('typescript');
  const directory = mkdtempSync(join(tmpdir(), 'stronghold-content-unit-types-'));
  const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/${name}.js`, import.meta.url)));
  const path = join(directory, 'content.mts');
  writeFileSync(path, `
import type { Unit } from ${source('core/unit/index')};
import { initialize } from ${source('core/unit/index')};
import type { State as BattleState } from ${source('core/battle/state')};
import { update as updateUnit } from ${source('core/battle/unit')};
import { hasVitality, type Vitality } from ${source('core/unit/capability/vitality/index')};
import type { Offense } from ${source('core/unit/capability/offense/index')};
import type { Definition as MudrockDefinition } from ${source('content/operators/mudrock/unit')};
import type { Definition as MelanthaDefinition } from ${source('content/operators/melantha/unit')};
import type { Definition as HoundDefinition } from ${source('content/enemies/hound/unit')};
import type { Definition as CrossbowmanDefinition } from ${source('content/enemies/crossbowman/unit')};
declare const mudrockDefinition: MudrockDefinition;
declare const melanthaDefinition: MelanthaDefinition;
declare const houndDefinition: HoundDefinition;
declare const crossbowmanDefinition: CrossbowmanDefinition;
declare const battle: BattleState;
declare const base: Unit;
const mudrock = initialize(battle, { id: 0, position: [0, 0], definition: mudrockDefinition }).value;
const melantha = initialize(battle, { id: 1, position: [0, 0], definition: melanthaDefinition }).value;
const hound = initialize(battle, { id: 2, position: [0, 0], definition: houndDefinition }).value;
const crossbowman = initialize(battle, { id: 3, position: [0, 0], definition: crossbowmanDefinition }).value;
const armed: readonly (Unit & Vitality & Offense)[] = [mudrock, melantha, hound, crossbowman];
const next = { ...mudrock, vitality: { ...mudrock.vitality, hp: mudrock.vitality.hp - 1 } };
updateUnit(battle, [next]);
updateUnit(battle, [{ ...mudrock, vitality: next.vitality }]);
const captured = mudrock;
const paired: Unit & Vitality & Offense = captured;
const attack: number = captured.definition.offense.attack;
const hp: number = captured.vitality.hp;
if (hasVitality(base)) {
  const maxHp: number = base.definition.vitality.maxHp;
  const currentHp: number = base.vitality.hp;
}
// @ts-expect-error base Unit does not declare optional capability state.
base.vitality;
// @ts-expect-error guards are required after heterogeneous lookup.
base.definition.vitality;
// @ts-expect-error these operators do not declare locomotion.
mudrock.locomotion;
// @ts-expect-error these enemies do not declare skill.
hound.skill;
// @ts-expect-error a selected Capability requires its configuration and state together.
const incomplete: Unit & Vitality = { ...base, vitality: mudrock.vitality };
// @ts-expect-error a selected Capability cannot omit its runtime state.
const absent: Unit & Vitality = { ...base, definition: { ...base.definition, vitality: { maxHp: 100, defense: 0, resistance: 0 } } };
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

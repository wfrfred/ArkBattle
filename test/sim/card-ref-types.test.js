import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Card references and known definitions retain private state while ordinary queries expose object", async () => {
    const { default: ts } = await import("typescript");
    const cache = fileURLToPath(new URL("../../.cache/", import.meta.url));
    mkdirSync(cache, { recursive: true });
    const directory = mkdtempSync(join(cache, "card-ref-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "refs.mts");
    try {
        writeFileSync(path, `
import type { Ref } from ${source("common/ref")};
import type { Query } from ${source("common/query")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import { hasDeployable, type Deployable } from ${source("unit/capability/deployable/index")};
import { initialize as initializeUnit } from ${source("unit/initialize")};
import { addCard, deploy } from ${source("battle/deployment/index")};
import { type Card, type Definition, ref, get, all, setState, reduceCooldown, clearCooldown } from ${source("battle/deployment/card/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type Private = { charges: number };
declare const battle: BattleState;
declare const unit: Ref<Unit>;
declare const erased: Ref<Card>;
const cardDefinition: Definition<Private> = {
    cost: 0, redeployTicks: 1, slots: 1, stock: 1, stockLimit: 1, activeLimit: 1,
    cooldownOnDeploy: false, recoverOnLeave: true, increaseCostOnLeave: true,
    refund: null, deploymentRules: [], unitHooks: [],
    initialize: current => ({ state: current, value: { charges: 2 } }),
    onTick(current, self) {
        const charges: number = self.state.charges;
        return setState(current, ref(self), { charges: charges + 1 });
    },
};
const definition = {
    id: "typed-card", hooks: [], occupancy: { slot: "OCCUPANT" as const },
    deployable: { retreatRules: [] }, card: cardDefinition,
};
const inline = {
    id: "inline-card", hooks: [], occupancy: { slot: "OCCUPANT" as const },
    deployable: { retreatRules: [] },
    card: {
        ...cardDefinition,
        onTick(current, self) {
            type InlineTickState = Assert<Equal<typeof self.state, Private>>;
            const charges: number = self.state.charges;
            return setState(current, ref(self), { charges: charges + 1 });
        },
    } satisfies Definition<Private>,
};
const inlineAdded = addCard(battle, inline);
type InlineAdded = Assert<Equal<typeof inlineAdded.value, Ref<Card<Private>>>>;
const initialized = initializeUnit(battle, {
    id: 0, position: [0, 0], definition: inline,
    initial: { occupancy: { tile: [0, 0] } },
}).value;
const initializedCard: Ref<Card> | null = initialized.deployable.card;
const fromInitialized = get(battle, erased, initialized.definition);
type InitializedState = Assert<Equal<typeof fromInitialized, Card<Private> | undefined>>;
if (hasDeployable(initialized)) {
    const retained = get(battle, erased, initialized.definition);
    type Retained = Assert<Equal<typeof retained, Card<Private> | undefined>>;
    const charges: number | undefined = retained?.state.charges;
}
declare const unknownUnit: Unit & { readonly label: string };
if (hasDeployable(unknownUnit)) {
    const guarded: Unit & Deployable = unknownUnit;
    const label: string = unknownUnit.label;
    const source: Ref<Card> | null = guarded.deployable.card;
    const tile = guarded.occupancy.tile;
}
const added = addCard(battle, definition);
type Added = Assert<Equal<typeof added.value, Ref<Card<Private>>>>;
// @ts-expect-error Card creation takes its inventory from one complete static definition.
addCard(battle, definition, { stock: 1 });
reduceCooldown(battle, added.value, 1, "RECOVERY");
clearCooldown(battle, added.value, "RECOVERY");
// @ts-expect-error Timing operations require an explicit clock target.
reduceCooldown(battle, added.value, 1);
// @ts-expect-error Clearing a clock must name the interval or inventory recovery.
clearCooldown(battle, added.value);
const precise = get(added.state, added.value)!;
type Stock = Assert<Equal<typeof precise.stock, number>>;
type State = Assert<Equal<typeof precise.state, Private>>;
const known = get(battle, erased, definition);
type Known = Assert<Equal<typeof known, Card<Private> | undefined>>;
setState(battle, added.value, { charges: 3 });
// @ts-expect-error A typed Card reference fixes the private state's field types.
setState(battle, added.value, { charges: "three" });
// @ts-expect-error Writes accept a state value rather than a transformation.
setState(battle, added.value, () => ({ charges: 3 }));
const ordinary = get(battle, erased)!;
type Ordinary = Assert<Equal<typeof ordinary.state, object>>;
// @ts-expect-error An ordinary query cannot interpret content-private fields.
ordinary.state.charges;
const every = all(battle);
type Every = Assert<Equal<typeof every, Query<Card>>>;
// @ts-expect-error Enumeration retains the default object state.
every.find(() => true)?.state.charges;
const emptyDefinition: Definition = {
    cost: 0, redeployTicks: 1, slots: 1, stock: 1, stockLimit: 1, activeLimit: 1,
    cooldownOnDeploy: false, recoverOnLeave: true, increaseCostOnLeave: true,
    refund: null, deploymentRules: [], unitHooks: [],
    initialize: current => ({ state: current, value: {} }),
};
const plain = {
    id: "plain-card", hooks: [], occupancy: { slot: "OCCUPANT" as const },
    deployable: { retreatRules: [] }, card: emptyDefinition,
};
const empty = addCard(battle, plain);
type EmptyState = Assert<Equal<typeof empty.value, Ref<Card>>>;
const unmatched = get(battle, erased, plain);
type Unmatched = Assert<Equal<typeof unmatched, Card | undefined>>;
// @ts-expect-error A Card declaration requires an explicit initializer.
const missingInitializer: Definition = { cooldownOnDeploy: false, recoverOnLeave: true, increaseCostOnLeave: true, cost: 0, redeployTicks: 1, slots: 1, stock: 1, stockLimit: 1, activeLimit: 1, refund: null, deploymentRules: [], unitHooks: [] };
// @ts-expect-error A private state type requires an initializer that constructs that state.
const invalidInitializer: Definition<Private> = { ...emptyDefinition, initialize: current => ({ state: current, value: {} }) };
// @ts-expect-error A Unit reference cannot address a Card.
get(battle, unit);
// @ts-expect-error A bare ID does not prove a Card reference.
get(battle, 1);
// @ts-expect-error Card state is written through a reference rather than a snapshot.
setState(battle, precise, { charges: 3 });
// @ts-expect-error Ref factories require a complete Card.
ref({ id: 0 });
const request = {
    card: added.value, tilePosition: [0, 0] as const,
    quote: { dp: 0, stock: 1, slots: 1 }, rules: [], hooks: [],
};
deploy(battle, request);
// @ts-expect-error Deployment accepts a Card reference, not a numeric command ID.
deploy(battle, { ...request, card: 0 });
// @ts-expect-error Unit references cannot satisfy deployment's Card identity.
deploy(battle, { ...request, card: unit });
`);
        const program = ts.createProgram([path], {
            noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => {
            const line = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0).line;
            return `${line === undefined ? "" : line + 1}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
        }), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

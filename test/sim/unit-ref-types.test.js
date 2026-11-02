import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Unit Refs preserve guard proofs, permit covariance and reject forged or stronger identities", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-unit-ref-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "refs.mts");
    try {
        writeFileSync(path, `
import type { Unit } from ${source("unit/unit")};
import type { Identified, Ref, Identity, Phantom } from ${source("common/ref")};
import type { Query } from ${source("common/query")};
import type { State as BattleState } from ${source("battle/state")};
import * as units from ${source("unit/query")};
import { hasLocomotion, type Locomotion } from ${source("unit/capability/locomotion/capability")};
import type { Vitality } from ${source("unit/capability/vitality/capability")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type EmptyIdentity = Assert<Equal<Identity<{}>, never>>;
type ObjectIdentity = Assert<Equal<Identity<object>, never>>;
type PersistentAddress = { readonly id: number; readonly definition: "persistent" };
type RoundAddress = { readonly id: string; readonly round: number };
type ModelState = { readonly state: { readonly count: number }; readonly label: string };
type Persistent = Identified<PersistentAddress, ModelState>;
type Round = Identified<RoundAddress, Persistent>;
type DefaultIdentity = Assert<Equal<Identity<Identified<PersistentAddress>>, PersistentAddress>>;
type PersistentIdentity = Assert<Equal<Identity<Persistent>, PersistentAddress>>;
type RoundIdentity = Assert<Equal<Identity<Round>, RoundAddress>>;
type RoundState = Assert<Equal<Pick<Round, keyof ModelState>, ModelState>>;
type RoundKeys = Assert<Equal<keyof Round, keyof Persistent>>;
type RoundRef = Assert<Equal<Ref<Round>, RoundAddress & Phantom<Round>>>;
declare const roundRef: Ref<Round>;
const roundId: string = roundRef.id;
// @ts-expect-error Replacing an identity does not intersect its old address fields.
const persistentId: number = roundRef.id;
// @ts-expect-error Replacing an identity removes fields belonging only to the old address.
roundRef.definition;
declare const battle: BattleState;
declare const strong: Ref<Unit & Locomotion & Vitality>;
declare const moving: Ref<Unit & Locomotion>;
declare const known: Unit & Locomotion & Vitality;
const weaker: Ref<Unit & Locomotion> = strong;
const base: Ref<Unit> = weaker;
// @ts-expect-error A weaker proof cannot satisfy a stronger requirement.
const stronger: Ref<Unit & Locomotion & Vitality> = moving;
// @ts-expect-error Unit identities require a query-generated proof.
const forged: Ref<Unit & Locomotion> = { id: 1 };
// @ts-expect-error Ref identities are immutable.
weaker.id = 2;
// @ts-expect-error A bare ID is not a typed Unit identity.
units.get(battle, 1);
// @ts-expect-error A known Unit is not itself a Ref.
units.get(battle, known);
// @ts-expect-error Ref construction requires a known Unit, not a bare ID.
units.ref(1);
const preserved = units.ref(known);
type Preserved = Assert<Equal<typeof preserved, Ref<Unit & Locomotion & Vitality>>>;
const current = units.get(battle, strong);
type Current = Assert<Equal<typeof current, (Unit & Locomotion & Vitality) | undefined>>;
const candidates = units.all(battle);
const locomotives = candidates.filter(hasLocomotion);
type Locomotives = Assert<Equal<typeof locomotives, Query<Unit & Locomotion>>>;
const movingRefs = locomotives.map(units.ref).toArray();
type MovingRefs = Assert<Equal<typeof movingRefs, readonly Ref<Unit & Locomotion>[]>>;
type Address = Assert<Equal<Identity<Unit & Locomotion>, { readonly id: number }>>;
interface HostedUnit extends Unit { readonly host: string }
declare const hosted: HostedUnit;
const hostedRef = units.ref(hosted);
type HostedAddress = Assert<Equal<Identity<HostedUnit>, { readonly id: number }>>;
// @ts-expect-error Business fields do not become identity fields.
hostedRef.host;
`);
        const program = ts.createProgram([path], {
            noEmit: true, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

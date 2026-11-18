import type { Ref } from "../../../common/ref.js";
import type { Unit, Id } from "../../../unit/unit.js";
import type { Elemental } from "../../../unit/capability/elemental/capability.js";
import type { HealingApplication } from "../../../unit/capability/elemental/operations.js";

export interface Event {
    readonly type: "ELEMENTAL_INJURY_HEALED";
    readonly targetUnitId: Id;
    readonly amount: number;
    readonly tick: number;
}

export interface Parameters {
    readonly power: number;
}

export interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Elemental>;
    readonly parameters: Parameters;
}

export interface Calculated {
    readonly amount: number;
}

export interface Pending {
    readonly amount: number;
    readonly cancellation: null;
}

export type Application = HealingApplication;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | { readonly type: "APPLIED"; readonly received: Pending; readonly application: Application };

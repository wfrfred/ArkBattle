import type { Health } from "../../../../unit/capability/vitality/health.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../../unit/unit.js";
import type * as decrease from "../decrease.js";
import type * as increase from "../increase.js";

export interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly killer: Ref<Unit> | null;
    readonly delta: number;
}

export interface Application {
    readonly before: Health;
    readonly after: Health;
}

type Pending = decrease.Pending | increase.Pending;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | {
          readonly type: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
          readonly killed: boolean;
      };

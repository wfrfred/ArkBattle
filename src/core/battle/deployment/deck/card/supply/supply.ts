import type { Contribution } from "../../../../../common/contribution.js";
import type { Modifier } from "../../../../../common/modifier.js";

export type Policy =
    | { readonly type: "DEFAULT" }
    | { readonly type: "UNIQUE" }
    | { readonly type: "QUEUED"; readonly pending: number };

export interface Definition {
    readonly policy: Policy;
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldown: number;
}

export interface State {
    readonly policy: Policy;
    readonly stock: number;
    readonly cooldown: number;
    readonly paused: boolean;
    readonly stockLimit: readonly Contribution<Modifier>[];
    readonly activeLimit: readonly Contribution<Modifier>[];
    readonly redeployTime: readonly Contribution<readonly Modifier[]>[];
}

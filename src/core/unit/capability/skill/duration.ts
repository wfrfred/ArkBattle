export type Definition =
    | { readonly type: "TIME"; readonly durationTicks: number }
    | { readonly type: "AMMO"; readonly amount: number }
    | { readonly type: "INFINITE" };

export interface Ammo {
    readonly type: "AMMO";
    readonly initial: number;
    readonly remaining: number;
    readonly replenished: number;
}

export type State =
    { readonly type: "TIME"; readonly endsAtTick: number } | Ammo | { readonly type: "INFINITE" };

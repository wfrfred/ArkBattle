import type { State as BattleState } from "../battle/state.js";
import type { Scope } from "./operations.js";

export interface Node {
    readonly target: Scope;
    readonly dependencies: readonly string[];
    readonly ending?: {
        readonly initial: unknown;
        readonly end: unknown;
    };
}

export interface State {
    readonly nodes: ReadonlyMap<string, Node>;
    readonly deferred: readonly ((battle: BattleState) => BattleState)[];
    readonly flushing: boolean;
}

export function initialize(): State {
    return { nodes: new Map(), deferred: [], flushing: false };
}

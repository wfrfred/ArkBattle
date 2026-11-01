import type { Ref } from "../../common/ref.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { Result, State as BattleState } from "../state.js";
import type { Card } from "./card/card.js";
import type { DeploymentRequest, DeploymentDecision } from "./query.js";

export interface DeployRequest<T extends Card<any> = Card> {
    readonly card: Ref<T>;
    readonly tilePosition: TilePosition;
    readonly direction?: Direction;
}

export interface Payment {
    readonly amount: number;
}

export interface Refund {
    readonly rate: number;
    readonly limit: number;
}

export type Rejection =
    | "UNKNOWN_CARD"
    | "NO_STOCK"
    | "COOLDOWN"
    | "ACTIVE_LIMIT"
    | "SLOT_LIMIT"
    | "INSUFFICIENT_DP"
    | "RULE"
    | Extract<DeploymentDecision, { readonly type: "DENIED" }>["reason"];

export interface Rejected {
    readonly type: "REJECTED";
    readonly reason: Rejection;
}

export interface Preparation {
    readonly type: "PREPARED";
    readonly card: Ref<Card> | null;
    readonly placement: DeploymentRequest;
    readonly cost: number;
    readonly slots: number;
    readonly refund: Refund | null;
    readonly retreatAllowed: boolean;
    readonly payment: Payment | null;
    readonly initialize: (battle: BattleState) => Result<Unit & Deployable>;
    readonly consume?: (battle: BattleState) => BattleState;
}

export interface Program<I> {
    readonly id: string;
    readonly prepare: (battle: BattleState, input: I) => Preparation | Rejected;
}

export type DeployOutcome =
    | { readonly type: "DEPLOYED"; readonly cardId: number | null; readonly unitId: number }
    | Rejected;

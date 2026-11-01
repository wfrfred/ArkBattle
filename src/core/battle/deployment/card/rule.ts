import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../state.js";
import type { Card } from "./card.js";

export type Purpose = "DISPLAY" | "SELECT" | "DEPLOY";

export interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, reference: Ref<Card>, purpose: Purpose) => boolean;
}

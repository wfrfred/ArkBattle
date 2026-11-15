import type { Ref } from "../../../common/ref.js";
import { key, type Hook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Vitality } from "./capability.js";

export interface CommittingContext {
    readonly target: Ref<Unit & Vitality>;
    readonly hpBefore: number;
}

export interface CommittingHook extends Hook<CommittingContext, number> {
    readonly priority?: number;
}

export const committing = key<CommittingHook, Unit & Vitality>("vitality.committing");

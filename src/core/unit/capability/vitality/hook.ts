import type { CommitContext as DecreaseContext } from "../../../battle/resource/hp/decrease.js";
import { key, type Hook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Vitality } from "./capability.js";
import type { Health } from "./health.js";
import type { DecreaseApplication } from "./operations.js";

export type LossCommittingContext = DecreaseContext & {
    readonly previous: Health;
};

export type LossCommittingHook = Hook<LossCommittingContext, Health>;

export const lossCommitting = key<LossCommittingHook, Unit & Vitality>("vitality.lossCommitting");

export type LossCommittedContext = DecreaseContext & {
    readonly application: DecreaseApplication;
};

export type LossCommittedHook = Hook<LossCommittedContext, void>;

export const lossCommitted = key<LossCommittedHook, Unit & Vitality>("vitality.lossCommitted");

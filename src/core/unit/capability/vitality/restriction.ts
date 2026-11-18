import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { ReceivingContext } from "../../../resource/hp/damage/hook.js";

export type Restriction = BaseRestriction<ReceivingContext>;

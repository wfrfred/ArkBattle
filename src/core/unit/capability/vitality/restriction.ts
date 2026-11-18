import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { ReceivingContext } from "../../../battle/resource/hp/damage/hook.js";

export type Restriction = BaseRestriction<ReceivingContext>;

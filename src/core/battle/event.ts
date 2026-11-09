import type { Event as UnitEvent } from "../unit/event.js";
import type { Event as ActionEvent } from "../unit/action/event.js";
import type { Event as SkillEvent } from "../unit/skill/event.js";
import type { Event as ElementalEvent } from "../unit/capability/elemental/event.js";
import type { Event as RouteEvent } from "../unit/capability/route/event.js";
import type { Event as HpDamageEvent } from "./damage/hp/contract.js";
import type { Event as EpDamageEvent } from "./damage/ep/contract.js";
import type { Event as HpHealingEvent } from "./healing/hp/contract.js";
import type { Event as EpHealingEvent } from "./healing/ep/contract.js";

export type Event =
    | UnitEvent
    | ActionEvent
    | SkillEvent
    | ElementalEvent
    | RouteEvent
    | HpDamageEvent
    | EpDamageEvent
    | HpHealingEvent
    | EpHealingEvent;

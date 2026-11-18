import type { Event as UnitEvent } from "../unit/event.js";
import type { Event as ActionEvent } from "../unit/capability/action/event.js";
import type { Event as SkillEvent } from "../unit/capability/skill/event.js";
import type { Event as ElementalEvent } from "../unit/capability/elemental/event.js";
import type { Event as RouteEvent } from "../unit/capability/route/event.js";
import type { Event as HpDamageEvent } from "./resource/hp/damage/contract.js";
import type { Event as EpDamageEvent } from "./resource/ep/damage/contract.js";
import type { Event as HpHealingEvent } from "./resource/hp/healing/contract.js";
import type { Event as EpHealingEvent } from "./resource/ep/healing/contract.js";

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

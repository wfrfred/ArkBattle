import type { Unit } from "../../unit/unit.js";
import {
    areHostile,
    hasAllegiance,
    type Allegiance,
} from "../../unit/capability/allegiance/capability.js";
import { hasHitbox } from "../../unit/capability/hitbox/capability.js";
import * as presence from "../../unit/capability/presence/capability.js";
import {
    allowsRestrictions,
    type Restriction,
    type Targetable,
} from "../../unit/capability/targetable/capability.js";
import {
    hasVitality,
    resolveMaxHp,
    type Vitality,
} from "../../unit/capability/vitality/capability.js";
import { hasElemental, type Elemental } from "../../unit/capability/elemental/capability.js";
import { available, resolveDamageRatio } from "../../unit/capability/elemental/query.js";
import { healFree } from "../../effects/protection.js";
import { overlaps } from "../../geometry/intersection.js";
import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Range } from "../../geometry/range.js";
import type { State as BattleState } from "../state.js";

export function damage(
    battle: BattleState,
    source: Unit & Allegiance,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality & Allegiance {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Vitality & Allegiance =>
        target.lifecycle === "PRESENT" &&
        presence.isPresent(target) &&
        hasVitality(target) &&
        target.vitality.hp > 0 &&
        hasAllegiance(target) &&
        areHostile(source, target) &&
        allows(target);
}

export function healing(
    battle: BattleState,
    source: Unit & Allegiance,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality & Allegiance {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Vitality & Allegiance =>
        target.lifecycle === "PRESENT" &&
        presence.isPresent(target) &&
        hasVitality(target) &&
        target.vitality.hp > 0 &&
        hasAllegiance(target) &&
        source.allegiance.side === target.allegiance.side &&
        target.vitality.hp < resolveMaxHp(target.definition.vitality, target.vitality) &&
        !target.effects
            .values()
            .some((effect) => effect.definition === healFree && effect.lifecycle === "ACTIVE") &&
        allows(target);
}

export function elementDamage(
    battle: BattleState,
    source: Unit & Allegiance,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Elemental & Allegiance {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Elemental & Allegiance =>
        presence.isPresent(target) &&
        hasElemental(target) &&
        available(target) &&
        target.elemental.burst === null &&
        hasAllegiance(target) &&
        target.allegiance.side !== "NEUTRAL" &&
        areHostile(source, target) &&
        allows(target);
}

export function elementHealing(
    battle: BattleState,
    source: Unit & Allegiance,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Elemental & Allegiance {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Elemental & Allegiance =>
        presence.isPresent(target) &&
        hasElemental(target) &&
        available(target) &&
        target.elemental.burst === null &&
        hasAllegiance(target) &&
        source.allegiance.side === target.allegiance.side &&
        resolveDamageRatio(battle, target) > 0 &&
        allows(target);
}

export function inRange(origin: WorldPosition, range: Range): (target: Unit) => boolean {
    return (target) =>
        hasHitbox(target) &&
        overlaps(range, origin, target.definition.hitbox.shape, target.position);
}

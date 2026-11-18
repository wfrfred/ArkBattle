import type { Unit } from "../unit/unit.js";
import {
    areHostile,
    hasClassification,
    type Classification,
} from "../unit/capability/classification/index.js";
import { hasHitbox } from "../unit/capability/hitbox/capability.js";
import * as presence from "../unit/capability/presence/capability.js";
import {
    allowsRestrictions,
    type Restriction,
    type Targetable,
} from "../unit/capability/targetable/capability.js";
import { hasVitality, type Vitality } from "../unit/capability/vitality/capability.js";
import { isAlive, hpRatio } from "../unit/capability/vitality/query.js";
import { hasElemental, type Elemental } from "../unit/capability/elemental/capability.js";
import { available, resolveDamageRatio } from "../unit/capability/elemental/query.js";
import { healFree } from "../effects/protection.js";
import { overlaps } from "../geometry/intersection.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Range } from "../geometry/range.js";
import type { State as BattleState } from "../battle/state.js";

export function damage(
    battle: BattleState,
    source: Unit & Classification,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality & Classification {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Vitality & Classification =>
        target.lifecycle === "PRESENT" &&
        presence.isPresent(target) &&
        hasVitality(target) &&
        isAlive(target) &&
        hasClassification(target) &&
        areHostile(source, target) &&
        allows(target);
}

export function healing(
    battle: BattleState,
    source: Unit & Classification,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality & Classification {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Vitality & Classification =>
        target.lifecycle === "PRESENT" &&
        presence.isPresent(target) &&
        hasVitality(target) &&
        isAlive(target) &&
        hasClassification(target) &&
        source.definition.classification.side === target.definition.classification.side &&
        hpRatio(target) < 1 &&
        !target.effects
            .values()
            .some((effect) => effect.definition === healFree && effect.lifecycle === "ACTIVE") &&
        allows(target);
}

export function elementDamage(
    battle: BattleState,
    source: Unit & Classification,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Elemental & Classification {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Elemental & Classification =>
        presence.isPresent(target) &&
        hasElemental(target) &&
        available(target) &&
        target.elemental.burst === null &&
        hasClassification(target) &&
        target.definition.classification.side !== "NEUTRAL" &&
        areHostile(source, target) &&
        allows(target);
}

export function elementHealing(
    battle: BattleState,
    source: Unit & Classification,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Elemental & Classification {
    const allows = allowsRestrictions(battle, source, ignore);

    return <U extends Unit & Targetable>(target: U): target is U & Elemental & Classification =>
        presence.isPresent(target) &&
        hasElemental(target) &&
        available(target) &&
        target.elemental.burst === null &&
        hasClassification(target) &&
        source.definition.classification.side === target.definition.classification.side &&
        resolveDamageRatio(battle, target) > 0 &&
        allows(target);
}

export function inRange(origin: WorldPosition, range: Range): (target: Unit) => boolean {
    return (target) =>
        hasHitbox(target) &&
        overlaps(range, origin, target.definition.hitbox.shape, target.position);
}

import { areHostile, hasAllegiance } from "../../unit/capability/allegiance/capability.js";
import { isSpatiallyPresent } from "../../unit/capability/presence/capability.js";
import { hasHitbox } from "../../unit/capability/hitbox/capability.js";
import { hasLayer } from "../../unit/capability/layer/capability.js";
import { hasVitality, resolveMaxHp } from "../../unit/capability/vitality/capability.js";
import { allowsRestrictions } from "../../unit/capability/targetable/capability.js";
import { hasElemental } from "../../unit/capability/elemental/capability.js";
import { hasBlockable } from "../../unit/capability/blocking/blockable.js";
import { blockerOf } from "../blocking/query.js";
import {
    canReceiveDamage,
    canReceiveHealing,
    resolveDamageRatio,
} from "../../unit/capability/elemental/query.js";
import type { Request as DamageRequest } from "../damage/ep/contract.js";
import type { Request as HealingRequest } from "../healing/ep/contract.js";
import { get, ref } from "../../unit/query.js";
import { overlaps } from "../../geometry/intersection.js";
import { fromTiles, type Range } from "../../geometry/range.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import { hasDirection } from "../../unit/capability/occupancy/capability.js";
import type { Filter } from "./contract.js";

export function and(...filters: readonly Filter[]): Filter {
    return (battle, request, target) => filters.every((filter) => filter(battle, request, target));
}

export function or(...filters: readonly Filter[]): Filter {
    return (battle, request, target) => filters.some((filter) => filter(battle, request, target));
}

export function not(filter: Filter): Filter {
    return (battle, request, target) => !filter(battle, request, target);
}

export const notSelf: Filter = (_battle, request, target) => target.id !== request.source.id;

export const present: Filter = (_battle, _request, target) =>
    target.lifecycle === "PRESENT" && isSpatiallyPresent(target);

export const alive: Filter = (_battle, _request, target) =>
    hasVitality(target) && target.vitality.hp > 0;

export const hostile: Filter = (battle, request, target) => {
    const source = get(battle, request.source);

    return (
        source !== undefined &&
        hasAllegiance(source) &&
        hasAllegiance(target) &&
        areHostile(source, target)
    );
};

export const sameSide: Filter = (battle, request, target) => {
    const source = get(battle, request.source);

    return (
        source !== undefined &&
        hasAllegiance(source) &&
        hasAllegiance(target) &&
        source.allegiance.side === target.allegiance.side
    );
};

export const ground: Filter = (_battle, _request, target) =>
    hasLayer(target) && target.layer.type === "GROUND";

export function range(range: Range): Filter {
    return (battle, request, target) => {
        const source = get(battle, request.source);

        return (
            source !== undefined &&
            hasHitbox(target) &&
            overlaps(range, source.position, target.definition.hitbox.shape, target.position)
        );
    };
}

export function directionalRange(tiles: readonly TilePosition[]): Filter {
    return (battle, request, target) => {
        const source = get(battle, request.source);

        return (
            source !== undefined &&
            hasDirection(source) &&
            hasHitbox(target) &&
            overlaps(
                fromTiles(tiles, source.occupancy.direction),
                source.position,
                target.definition.hitbox.shape,
                target.position,
            )
        );
    };
}

export const blocking: Filter = (battle, request, target) => {
    const source = get(battle, request.source);

    return (
        (source !== undefined &&
            hasBlockable(source) &&
            blockerOf(battle, ref(source))?.id === target.id) ||
        (hasBlockable(target) && blockerOf(battle, ref(target))?.id === request.source.id)
    );
};

export const blocker: Filter = (battle, request, target) => {
    const source = get(battle, request.source);

    return (
        source !== undefined &&
        hasBlockable(source) &&
        blockerOf(battle, ref(source))?.id === target.id
    );
};

export const missingHp: Filter = (_battle, _request, target) =>
    hasVitality(target) &&
    target.vitality.hp < resolveMaxHp(target.vitality, target.definition.vitality);

export const damage: Filter = and(present, alive, hostile, allowsRestrictions);

export const healing: Filter = and(present, alive, sameSide, missingHp, allowsRestrictions);

export function elementDamage(input: Omit<DamageRequest, "source" | "target">): Filter {
    return and(
        present,
        hostile,
        allowsRestrictions,
        (battle, request, target) =>
            hasElemental(target) &&
            canReceiveDamage(battle, { ...input, source: request.source, target: ref(target) }),
    );
}

export function elementHealing(input: Omit<HealingRequest, "source" | "target">): Filter {
    return and(
        present,
        sameSide,
        allowsRestrictions,
        (battle, request, target) =>
            hasElemental(target) &&
            (resolveDamageRatio(battle, ref(target)) ?? 0) > 0 &&
            canReceiveHealing(battle, { ...input, source: request.source, target: ref(target) }),
    );
}

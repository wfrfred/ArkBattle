export function attribute(value, min = 0, max = null) {
    return { default: value, min, max };
}

export function vitality(maxHp = 100, overrides = {}) {
    return {
        maxHp: attribute(maxHp, 1),
        defense: attribute(0),
        resistance: attribute(0, 0, 100),
        recoverySpeed: attribute(0),
        recoveryRatio: attribute(0, 0, 1),
        ...overrides,
    };
}

export function elemental(bursts, recoverySpeed = 0) {
    return {
        maxEp: attribute(1000, 1),
        recoverySpeed: attribute(recoverySpeed),
        elementResistance: attribute(0, 0, 100),
        damageResistance: attribute(0, 0, 100),
        burstRecoverySpeed: attribute(1),
        bursts,
    };
}

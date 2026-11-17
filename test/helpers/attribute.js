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

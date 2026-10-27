export interface Modifier {
    readonly addition: number;
    readonly multiplier: number;
    readonly finalAddition: number;
    readonly finalScaler: number;
}

export function create(input: Partial<Modifier> = {}): Modifier {
    const { addition = 0, multiplier = 0, finalAddition = 0, finalScaler = 1 } = input;

    return { addition, multiplier, finalAddition, finalScaler };
}

export function apply(base: number, modifiers: Iterable<Modifier>): number {
    let addition = 0;
    let multiplier = 0;
    let finalAddition = 0;
    let finalScaler = 1;

    for (const modifier of modifiers) {
        addition += modifier.addition;
        multiplier += modifier.multiplier;
        finalAddition += modifier.finalAddition;
        finalScaler *= modifier.finalScaler;
    }

    return ((base + addition) * Math.max(0, 1 + multiplier) + finalAddition) * finalScaler;
}

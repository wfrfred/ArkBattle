export interface Parameters {
    readonly cost: number | null;
    readonly baseAddition: number;
    readonly step: number;
    readonly maxMultiplier: number;
    readonly costScale: number;
    readonly finalAddition: number;
}

export function create(
    input: Partial<Parameters> & { readonly cost: number },
): Parameters & { readonly cost: number };
export function create(input?: Partial<Parameters>): Parameters;
export function create(input: Partial<Parameters> = {}): Parameters {
    const {
        cost = null,
        baseAddition = 0,
        step = 0,
        maxMultiplier = 0,
        costScale = 1,
        finalAddition = 0,
    } = input;

    return { cost, baseAddition, step, maxMultiplier, costScale, finalAddition };
}

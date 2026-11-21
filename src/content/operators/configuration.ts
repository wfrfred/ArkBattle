export interface Configuration {
    readonly elite: 0 | 1 | 2;
    readonly level: number;
    readonly potential: 1 | 2 | 3 | 4 | 5 | 6;
    readonly trust: number;
    readonly module?: { readonly id: string; readonly level: 1 | 2 | 3 };
}

export interface SkillSelection {
    readonly skillIndex: number;
    readonly skillLevel: number;
}

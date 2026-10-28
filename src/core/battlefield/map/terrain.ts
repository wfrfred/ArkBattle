export interface Definition<P extends object = object> {
    readonly id: symbol;
    readonly create: (params: P) => Terrain<P>;
}

export interface Terrain<P extends object = object> {
    readonly definition: Definition<P>;
    readonly params: P;
}

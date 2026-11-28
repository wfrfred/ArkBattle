export interface Definition<P extends object = object> {
    readonly id: symbol;
    readonly create: (params: P) => Terrain<P>;
}

export interface Terrain<P extends object = object> {
    readonly definition: {
        readonly id: symbol;
        readonly create: (params: never) => Terrain<P>;
    };
    readonly params: P;
}

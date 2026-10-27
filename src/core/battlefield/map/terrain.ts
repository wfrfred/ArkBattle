export interface Definition<P extends object> {
    readonly id: symbol;
    readonly create: (params: P) => Terrain<P>;
}

export interface View {
    readonly definition: Pick<Definition<object>, "id">;
}

export interface Terrain<P extends object> extends View {
    readonly definition: Definition<P>;
    readonly params: P;
}

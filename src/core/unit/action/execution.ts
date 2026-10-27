export type Id = number;

export type Status = "RUNNING" | "ENDING";

export interface View {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly status: Status;
}

export interface Execution<E extends object = object> extends View {
    readonly state: E;
}

export interface Snapshot extends View {
    readonly state: unknown;
}

export type { Definition, Lifetime, Scope } from "./lifetime.js";

export {
    create,
    scope,
    getRef,
    available,
    dependencies,
    bind,
    unbind,
    defer,
} from "./operations.js";

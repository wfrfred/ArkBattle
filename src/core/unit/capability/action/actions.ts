import { Store } from "../../../common/collection/store.js";
import type { Query } from "../../../common/query.js";
import type { Action, Snapshot } from "./action.js";
import type { Execution, Id as ExecutionId, Snapshot as ExecutionSnapshot } from "./execution.js";
import type { Definition, Id } from "./definition.js";
import type { Identified } from "../../../common/ref.js";

export class Actions {
    static readonly #empty = new Actions(Store.empty<Id, Action<any, any>>());

    readonly #store: Store<Id, Action<any, any>>;

    private constructor(store: Store<Id, Action<any, any>>) {
        this.#store = store;
    }

    static empty(): Actions {
        return Actions.#empty;
    }

    get size(): number {
        return this.#store.size;
    }

    get<P extends object, E extends object>(
        id: Id,
        definition: Definition<P, E, never>,
    ): Action<P, E> | undefined;
    get(id: Id): Snapshot | undefined;
    get(id: Id, definition?: Definition<any, any, never>): Action<any, any> | undefined {
        const self = this.#store.get(id);

        if (definition === undefined) {
            return self;
        }

        return self?.definition === definition ? self : undefined;
    }

    getExecution(
        id: ExecutionId,
    ): (Snapshot & { readonly execution: ExecutionSnapshot }) | undefined {
        const self = this.#store.values().find((entry) => entry.execution?.id === id);

        return self as Execution<any, any> | undefined;
    }

    values(): Query<Snapshot> {
        return this.#store.values();
    }

    keys(): Query<Id> {
        return this.#store.keys();
    }

    add<P extends object, E extends object>(self: Action<P, E> | Execution<P, E>): Actions {
        return new Actions(
            this.#store.add(self.definition.id, self as Identified<never, Action<P, E>>),
        );
    }

    replace<P extends object, E extends object>(
        definition: Definition<P, E, never>,
        self: NoInfer<Action<P, E> | Execution<P, E>>,
    ): Actions {
        const store = this.#store.replace(definition.id, self as Identified<never, Action<P, E>>);

        return store === this.#store ? this : new Actions(store);
    }

    toJSON(): readonly Snapshot[] {
        return this.#store.values().toArray();
    }
}

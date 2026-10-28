import { Store } from "../../common/collection/store.js";
import type { Query } from "../../common/query.js";
import type { Action, Snapshot } from "./action.js";
import type { Execution, Id as ExecutionId } from "./execution.js";
import type { Definition, Id } from "./definition.js";
import type { Identified } from "../../common/ref.js";

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

    get(id: Id): Action | undefined;
    get<P extends object, E extends object>(
        id: Id,
        definition: Definition<P, E>,
    ): Action<P, E> | undefined;
    get<P extends object, E extends object>(
        id: Id,
        definition?: Definition<P, E>,
    ): Action | Action<P, E> | undefined {
        const self = this.#store.get(id);

        if (definition === undefined) {
            return self;
        }

        return self?.definition === definition ? self : undefined;
    }

    getAction(id: Id): Action | undefined {
        return this.#store.get(id);
    }

    getExecution(id: ExecutionId): Execution | undefined {
        const self = this.values().find((entry) => entry.execution?.id === id);

        return self as Execution | undefined;
    }

    values(): Query<Action> {
        return this.#store.values() as Query<Action>;
    }

    keys(): Query<Id> {
        return this.#store.keys();
    }

    add<P extends object, E extends object>(self: Action<P, E> | Execution<P, E>): Actions {
        return new Actions(
            this.#store.add(
                self.definition.id,
                self as Omit<Action<P, E>, keyof Identified<object>>,
            ),
        );
    }

    replace<P extends object, E extends object>(
        definition: Definition<P, E>,
        self: NoInfer<Action<P, E> | Execution<P, E>>,
    ): Actions {
        const store = this.#store.replace(
            definition.id,
            self as Omit<Action<P, E>, keyof Identified<object>>,
        );

        return store === this.#store ? this : new Actions(store);
    }

    toJSON(): readonly Snapshot[] {
        return this.#store.values().toArray();
    }
}

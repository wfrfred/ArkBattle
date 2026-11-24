import { Store } from "../../../common/collection/store.js";
import type { Query } from "../../../common/query.js";
import type { Action } from "./action.js";
import type { Execution, Id as ExecutionId } from "./execution.js";
import type { Definition, Id } from "./definition.js";

type ActionWithExecution = Action & { readonly execution: Execution };

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

    get(id: Id): Action | undefined {
        return this.#store.get(id);
    }

    getByExecution(id: ExecutionId): ActionWithExecution | undefined {
        return this.values().find(
            (entry): entry is ActionWithExecution => entry.execution?.id === id,
        );
    }

    values(): Query<Action> {
        return this.#store.values() as Query<Action>;
    }

    keys(): Query<Id> {
        return this.#store.keys();
    }

    add<P extends object, E extends object>(self: Action<P, E>): Actions {
        return new Actions(this.#store.add(self.definition.id, self));
    }

    replace<P extends object, E extends object>(
        definition: Definition<P, E, never>,
        self: NoInfer<Action<P, E>>,
    ): Actions {
        const store = this.#store.replace(definition.id, self);

        return store === this.#store ? this : new Actions(store);
    }
}

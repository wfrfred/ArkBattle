import { Store } from "../../../common/collection/store.js";
import type { Query } from "../../../common/query.js";
import { ref, type Ref } from "../../../common/ref.js";
import type { Action } from "./action.js";
import type { Execution, ExecutionRef } from "./execution.js";
import type { Definition, Id } from "./definition.js";

type ActionWithExecution = Action & { readonly execution: Execution };

export class Actions {
    static readonly #empty = new Actions(Store.empty<Ref<Action<any, any>>, Action<any, any>>());

    readonly #store: Store<Ref<Action<any, any>>, Action<any, any>>;

    private constructor(store: Store<Ref<Action<any, any>>, Action<any, any>>) {
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
        definition: Definition<P, E, never>,
    ): Action<P, E> | undefined;
    get<P extends object, E extends object>(reference: Ref<Action<P, E>>): Action<P, E> | undefined;
    get(
        identity: Id | Pick<Definition, "id"> | Ref<Action<any, any>>,
    ): Action<any, any> | undefined {
        if (typeof identity === "string") {
            return this.#store.values().find((self) => self.definition.id === identity);
        }

        if ("id" in identity) {
            return this.#store.values().find((self) => self.definition === identity);
        }

        return this.#store.get(identity);
    }

    getByExecution(reference: ExecutionRef): ActionWithExecution | undefined {
        return this.values().find(
            (entry): entry is ActionWithExecution => entry.execution?.ref === reference,
        );
    }

    values(): Query<Action> {
        return this.#store.values() as Query<Action>;
    }

    add<P extends object, E extends object>(self: Action<P, E>): Actions {
        if (this.get(self.definition.id) !== undefined) {
            throw new RangeError(`duplicate action definition: ${self.definition.id}`);
        }

        return new Actions(this.#store.add(ref(self), self));
    }

    replace<P extends object, E extends object>(self: Action<P, E>): Actions {
        const store = this.#store.replace(ref(self), self);

        return store === this.#store ? this : new Actions(store);
    }
}

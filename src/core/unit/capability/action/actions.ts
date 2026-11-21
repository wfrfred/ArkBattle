import { Store } from "../../../common/collection/store.js";
import type { Query } from "../../../common/query.js";
import type { Action, ActionView, Snapshot } from "./action.js";
import type { Execution, ExecutionView, Id as ExecutionId } from "./execution.js";
import type { Definition, Id, Program } from "./definition.js";
import type { Identified } from "../../../common/ref.js";

export class Actions {
    static readonly #empty = new Actions(Store.empty<Id, ActionView>());

    readonly #store: Store<Id, ActionView>;

    private constructor(store: Store<Id, ActionView>) {
        this.#store = store;
    }

    static empty(): Actions {
        return Actions.#empty;
    }

    get size(): number {
        return this.#store.size;
    }

    get<P extends object, E extends object, H extends object>(
        id: Id,
        definition: Definition<P, E, H>,
    ): Action<P, E, H> | undefined;
    get(id: Id, definition?: Program): ActionView | undefined;
    get(id: Id, definition?: Program): unknown {
        const self = this.#store.get(id);

        if (definition === undefined) {
            return self;
        }

        return self?.definition === definition ? self : undefined;
    }

    getExecution(id: ExecutionId): ExecutionView | undefined {
        const self = this.values().find((entry) => entry.execution?.id === id);

        return self as ExecutionView | undefined;
    }

    values(): Query<ActionView> {
        return this.#store.values();
    }

    keys(): Query<Id> {
        return this.#store.keys();
    }

    add<P extends object, E extends object, H extends object>(
        self: Action<P, E, H> | Execution<P, E, H>,
    ): Actions {
        return new Actions(
            this.#store.add(self.definition.id, self as Identified<never, Action<P, E, H>>),
        );
    }

    replace<P extends object, E extends object, H extends object>(
        definition: Definition<P, E, H>,
        self: NoInfer<Action<P, E, H> | Execution<P, E, H>>,
    ): Actions {
        const store = this.#store.replace(
            definition.id,
            self as Identified<never, Action<P, E, H>>,
        );

        return store === this.#store ? this : new Actions(store);
    }

    toJSON(): readonly Snapshot[] {
        return this.#store.values().toArray();
    }
}

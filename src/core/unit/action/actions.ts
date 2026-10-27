import { Store } from "../../common/collection/store.js";
import type { Query } from "../../common/query.js";
import type { Action, Snapshot, View } from "./action.js";
import type { Execution, Id as ExecutionId } from "./execution.js";
import type { Definition, Id } from "./definition.js";

export class Actions {
    static readonly #empty = new Actions(Store.empty<Id, View>());

    readonly #store: Store<Id, View>;

    private constructor(store: Store<Id, View>) {
        this.#store = store;
    }

    static empty(): Actions {
        return Actions.#empty;
    }

    get size(): number {
        return this.#store.size;
    }

    get(id: Id): View | undefined;
    get<P extends object, E extends object>(
        id: Id,
        definition: Definition<P, E>,
    ): Action<P, E> | undefined;
    get<P extends object, E extends object>(
        id: Id,
        definition?: Definition<P, E>,
    ): View | Action<P, E> | undefined {
        const self = this.#store.get(id);

        if (definition === undefined) {
            return self;
        }

        return self?.definition === definition ? self : undefined;
    }

    read<R>(
        id: Id,
        reader: <P extends object, E extends object>(self: Action<P, E>) => R,
    ): R | undefined {
        const self = this.#store.get(id);

        return self === undefined ? undefined : reader(self as Action);
    }

    getExecution(id: ExecutionId): Execution | undefined {
        const self = this.values().find((entry) => entry.execution?.id === id);

        return self as Execution | undefined;
    }

    values(): Query<View> {
        return this.#store.values();
    }

    keys(): Query<Id> {
        return this.#store.keys();
    }

    add<P extends object, E extends object>(self: Action<P, E> | Execution<P, E>): Actions {
        return new Actions(this.#store.add(self.definition.id, self));
    }

    replace<P extends object, E extends object>(
        definition: Definition<P, E>,
        self: NoInfer<Action<P, E> | Execution<P, E>>,
    ): Actions {
        const store = this.#store.replace(definition.id, self);

        return store === this.#store ? this : new Actions(store);
    }

    toJSON(): readonly Snapshot[] {
        return this.values()
            .map(({ definition }) => this.read<Snapshot>(definition.id, (self) => self)!)
            .toArray();
    }
}

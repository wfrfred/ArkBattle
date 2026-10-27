import { Store } from "../common/collection/store.js";
import type { Query } from "../common/query.js";
import type { Ref } from "../common/ref.js";
import type {
    CreationDefinition,
    Mechanism,
    MechanismDefinition,
    MechanismId,
    View,
} from "./mechanism.js";

export class Mechanisms {
    static readonly #empty = new Mechanisms(Store.empty<MechanismId, View>());

    readonly #entries: Store<MechanismId, View>;

    private constructor(entries: Store<MechanismId, View>) {
        this.#entries = entries;
    }

    static empty(): Mechanisms {
        return Mechanisms.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get<M extends View>(reference: Ref<M>): M | undefined;
    get(id: MechanismId): View | undefined;
    get<S extends object>(
        id: MechanismId,
        definition: MechanismDefinition<S>,
    ): Mechanism<S> | undefined;
    get<M extends View, S extends object>(
        identity: MechanismId | Ref<M>,
        definition?: MechanismDefinition<S>,
    ): View | M | Mechanism<S> | undefined {
        const self = this.#entries.get(typeof identity === "number" ? identity : identity.id);

        if (typeof identity !== "number") {
            return self;
        }

        if (definition === undefined) {
            return self;
        }

        const restored: Mechanism<S> | undefined =
            self?.definition === definition ? (self as Mechanism<S>) : undefined;

        return restored;
    }

    read<R>(id: MechanismId, reader: <S extends object>(self: Mechanism<S>) => R): R | undefined {
        const self = this.#entries.get(id);

        return self === undefined ? undefined : reader(self as Mechanism);
    }

    values(): Query<View> {
        return this.#entries.values();
    }

    keys(): Query<MechanismId> {
        return this.#entries.keys();
    }

    create<S extends object>(
        id: MechanismId,
        definition: MechanismDefinition<S>,
        active: boolean,
    ): { readonly mechanisms: Mechanisms; readonly reference: Ref<Mechanism<S>> };
    create(
        id: MechanismId,
        definition: CreationDefinition,
        active: boolean,
    ): { readonly mechanisms: Mechanisms; readonly reference: Ref<View> };
    create(
        id: MechanismId,
        definition: CreationDefinition,
        active: boolean,
    ): { readonly mechanisms: Mechanisms; readonly reference: Ref<View> } {
        // The trusted placement preserves one Definition's initialize/callback pairing.
        const restored = definition as MechanismDefinition;
        const self: Mechanism = {
            id,
            definition: restored,
            state: restored.initialize(),
            status: active ? "ACTIVE" : "INACTIVE",
        };

        return {
            mechanisms: new Mechanisms(this.#entries.add(id, self)),
            reference: { id } as Ref<View>,
        };
    }

    replace<S extends object>(
        reference: Ref<Mechanism<S>>,
        next: NoInfer<Mechanism<S>>,
    ): Mechanisms {
        const previous = this.get(reference);

        if (previous === undefined) {
            throw new RangeError(`unknown mechanism: ${reference.id}`);
        }
        if (next.id !== reference.id) {
            throw new TypeError("mechanism identity cannot change");
        }
        if (previous.definition !== next.definition) {
            throw new TypeError("mechanism definition cannot change");
        }

        return previous === next ? this : new Mechanisms(this.#entries.replace(reference.id, next));
    }

    remove(id: MechanismId): Mechanisms {
        return new Mechanisms(this.#entries.remove(id));
    }
}

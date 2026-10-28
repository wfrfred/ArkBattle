import { Store } from "../common/collection/store.js";
import type { Query } from "../common/query.js";
import type { Ref } from "../common/ref.js";
import type {
    CreationDefinition,
    Mechanism,
    MechanismDefinition,
    MechanismId,
} from "./mechanism.js";

export class Mechanisms {
    static readonly #empty = new Mechanisms(Store.empty<MechanismId, Mechanism<any>>());

    readonly #entries: Store<MechanismId, Mechanism<any>>;

    private constructor(entries: Store<MechanismId, Mechanism<any>>) {
        this.#entries = entries;
    }

    static empty(): Mechanisms {
        return Mechanisms.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get<M extends Mechanism<any>>(reference: Ref<M>): M | undefined;
    get(id: MechanismId): Mechanism | undefined;
    get<S extends object>(
        id: MechanismId,
        definition: MechanismDefinition<S>,
    ): Mechanism<S> | undefined;
    get<M extends Mechanism<any>, S extends object>(
        identity: MechanismId | Ref<M>,
        definition?: MechanismDefinition<S>,
    ): Mechanism<any> | undefined {
        const self = this.#entries.get(typeof identity === "number" ? identity : identity.id);

        if (typeof identity !== "number") {
            return self;
        }

        if (definition === undefined) {
            return self;
        }

        return self?.definition === definition ? self : undefined;
    }

    values(): Query<Mechanism> {
        return this.#entries.values() as Query<Mechanism>;
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
    ): { readonly mechanisms: Mechanisms; readonly reference: Ref<Mechanism> };
    create(
        id: MechanismId,
        definition: CreationDefinition,
        active: boolean,
    ): { readonly mechanisms: Mechanisms; readonly reference: Ref<Mechanism> } {
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
            reference: { id } as Ref<Mechanism>,
        };
    }

    replace<T extends Mechanism<any>>(reference: Ref<T>, next: NoInfer<T>): Mechanisms {
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

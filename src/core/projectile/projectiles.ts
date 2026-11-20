import { Store } from "../common/collection/store.js";
import type { Query } from "../common/query.js";
import type { Ref } from "../common/ref.js";
import type { Definition } from "./definition.js";
import type { Projectile, ProjectileFields, Id } from "./projectile.js";

export class Projectiles {
    static readonly #empty = new Projectiles(Store.empty<Id, ProjectileFields<any, any>>());

    readonly #entries: Store<Id, ProjectileFields<any, any>>;

    private constructor(entries: Store<Id, ProjectileFields<any, any>>) {
        this.#entries = entries;
    }

    static empty(): Projectiles {
        return Projectiles.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get<P extends ProjectileFields<any, any>>(reference: Ref<P>): P | undefined;
    get(id: Id): Projectile | undefined;
    get<S extends object, T extends object>(
        id: Id,
        definition: Definition<S, T>,
    ): Projectile<S, T> | undefined;
    get<P extends ProjectileFields<any, any>>(
        identity: Id | Ref<P>,
        definition?: Definition<any, any>,
    ): ProjectileFields<any, any> | undefined {
        const id = typeof identity === "number" ? identity : identity.id;
        const projectile = this.#entries.get(id);

        if (typeof identity !== "number") {
            return projectile;
        }
        if (definition === undefined) {
            return projectile;
        }

        return projectile?.definition === definition ? projectile : undefined;
    }

    values(): Query<Projectile> {
        return this.#entries.values() as Query<Projectile>;
    }

    keys(): Query<Id> {
        return this.#entries.keys();
    }

    add(projectile: ProjectileFields<any, any>): Projectiles {
        return new Projectiles(this.#entries.add(projectile.id, projectile));
    }

    replace<P extends ProjectileFields<any, any>>(
        reference: Ref<P>,
        projectile: NoInfer<P>,
    ): Projectiles {
        const entries = this.#entries.replace(reference.id, projectile);

        return entries === this.#entries ? this : new Projectiles(entries);
    }

    remove(id: Id): Projectiles {
        return new Projectiles(this.#entries.remove(id));
    }
}

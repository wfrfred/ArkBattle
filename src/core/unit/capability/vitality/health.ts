export interface Health {
    readonly hp: number;
    readonly minusHp: number;
}

export function change(current: Health, requestedHp: number, maxMinusHp: number): Health {
    let hp = requestedHp;
    let minusHp = current.minusHp;

    if (maxMinusHp > 0) {
        if (requestedHp <= 0) {
            const loss = current.hp - requestedHp;
            minusHp = current.hp > 1 ? loss - current.hp : current.minusHp + loss;
        } else if (requestedHp > current.hp) {
            const recovery = requestedHp - current.hp;
            minusHp = Math.max(0, current.minusHp - recovery);
            hp = current.hp + Math.max(0, recovery - current.minusHp);
        }

        hp = minusHp >= maxMinusHp ? 0 : Math.max(1, hp);
    }

    return hp === current.hp && minusHp === current.minusHp ? current : { hp, minusHp };
}

export function normalize(current: Health, maxHp: number, maxMinusHp: number): Health {
    let hp = Math.max(0, Math.min(current.hp, maxHp));
    let minusHp = Math.max(0, current.minusHp);

    if (maxMinusHp > 0) {
        minusHp = Math.min(minusHp, maxMinusHp);
        hp = minusHp >= maxMinusHp ? 0 : Math.max(1, hp);
    }

    return hp === current.hp && minusHp === current.minusHp ? current : { hp, minusHp };
}

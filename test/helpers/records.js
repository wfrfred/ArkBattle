/**
 * Synthetic 19×21 stage: open lanes on the normal field (rows 9–12) and the boss field (rows 1–5).
 * Normal: gates S (9,10) & (12,10), goal E (9,2); partner half mirrors with gates at col 18.
 * `opts.crates` = [[r,c]…] adds crate devices; `opts.rows` overrides specific rows ({ [row]: string }).
 */
export function flatStage(opts = {}) {
  const rows = [];
  for (let r = 0; r < 19; r++) rows.push('#'.repeat(21));
  rows[0] = 'aaaaaaaaaa#aaaaaaaaaa';
  rows[1] = '###IAAAAA###AAAAAI###';
  rows[2] = '##ErrrrrrrOrrrrrrrE##';
  rows[3] = '##hrrrrrrrfrrrrrrrh##';
  rows[4] = '##hrrrrrrrfrrrrrrrh##';
  rows[5] = '##hrrrrrrrOrrrrrrrh##';
  rows[6] = 'X'.repeat(21);
  rows[7] = 'aaaaaaaaaa###########';
  rows[8] = '####AAAAA##I#########';
  rows[9] = '##ErrrrrrrSrrrrrrrS##';
  rows[10] = '##hrrrrrrrfrrrrrrrf##';
  rows[11] = '##hrrrrrrrfrrrrrrrf##';
  rows[12] = '##hrrrrrrrSrrrrrrrS##';
  rows[13] = 'X'.repeat(21);
  for (const [k, v] of Object.entries(opts.rows || {})) rows[+k] = v;
  const devices = (opts.crates || []).map(([r, c], i) => ({ key: 'trap_1105_accrate', name: '阻隔工事', pos: [r, c], hidden: false, role: 'crate', active: true, alias: `crate#${i}` }));
  return { id: opts.id ?? 'flat', name: 'flat', rows, devices };
}


/** Default routes for the flat stage (and any stage with the standard gates). */
export function flatRoutes(kind = 'normal') {
  if (kind === 'boss' || kind === 'hidden') {
    return [
      { motion: 'WALK', start: [2, 10], end: [2, 2], checkpoints: [] },
      { motion: 'WALK', start: [5, 10], end: [2, 2], checkpoints: [] },
      { motion: 'FLY', start: [2, 10], end: [2, 2], checkpoints: [] },
      { motion: 'WALK', start: [2, 10], end: [2, 18], checkpoints: [] },
      { motion: 'WALK', start: [5, 10], end: [2, 18], checkpoints: [] },
    ];
  }
  if (kind === 'unite') {
    return [
      { motion: 'WALK', start: [9, 18], end: [9, 2], checkpoints: [] },
      { motion: 'WALK', start: [12, 18], end: [9, 2], checkpoints: [] },
      { motion: 'FLY', start: [9, 18], end: [9, 2], checkpoints: [] },
      { motion: 'WALK', start: [9, 10], end: [9, 2], checkpoints: [] },
    ];
  }
  return [
    { motion: 'WALK', start: [9, 10], end: [9, 2], checkpoints: [] },
    { motion: 'WALK', start: [12, 10], end: [9, 2], checkpoints: [] },
    { motion: 'FLY', start: [9, 10], end: [9, 2], checkpoints: [] },
    { motion: 'FLY', start: [12, 10], end: [9, 2], checkpoints: [] },
  ];
}


/**
 * Build a chess record in data/chess.json shape (for synthetic test units).
 * Minimal: chessRec({ id: 'test_guard', profession: 'WARRIOR', stats: { atk: 500 } })
 */
export function chessRec(o = {}) {
  const id = o.id ?? o.chessId ?? 'test_chess_a';
  const stats = {
    maxHp: 2000, atk: 500, def: 200, res: 0, cost: 10, blockCnt: 2, bat: 1, aspd: 100, respawnTime: 20,
    spRecovery: 1, hpRecoveryPerSec: 0, moveSpeed: 1, tauntLevel: 0, massLevel: 0, ...(o.stats || {}),
  };
  const rec = {
    chessId: id, baseId: o.baseId ?? id, isGolden: !!o.golden, tier: o.tier ?? 1, name: o.name ?? id, charId: o.charId ?? id,
    profession: o.profession ?? 'WARRIOR', subProfessionId: o.subProfessionId ?? o.subProf ?? null,
    position: o.position ?? (['SNIPER', 'CASTER', 'MEDIC', 'SUPPORT'].includes(o.profession) ? 'RANGED' : 'MELEE'),
    bonds: o.bonds ?? [], stats, rangeGrid: o.rangeGrid ?? [[0, 0], [0, 1]],
    dmgType: o.dmgType ?? null, attackKind: o.attackKind ?? null, projectile: o.projectile ?? null,
    canHitFly: o.canHitFly ?? null, targetPriority: o.targetPriority ?? null,
    trait: { desc: o.trait ?? '', bb: {} }, talents: o.talents ?? [], tokens: o.tokens ?? [],
    immunities: o.immunities ?? {},
    skill: o.skill === null ? null : {
      skillId: 'sk_test', name: 'test skill', skillType: 'MANUAL', durationType: 'NONE', duration: 10,
      spType: 'INCREASE_WITH_TIME', spCost: 10, initSp: 0, maxChargeTime: 1, bb: {}, trigger: { rule: 'DEFAULT' }, index: 1,
      ...(o.skill || {}),
    },
  };
  return rec;
}


/** Build an enemy record in data/enemies.json shape. */
export function enemyRec(o = {}) {
  const key = o.key ?? 'enemy_test';
  return {
    key, name: o.name ?? key, rank: o.rank ?? 'NORMAL', applyWay: o.applyWay ?? ((o.range ?? 0) > 0 ? 'RANGED' : 'MELEE'),
    stats: {
      maxHp: o.hp ?? 5000, atk: o.atk ?? 0, def: o.def ?? 0, res: o.res ?? 0, moveSpeed: o.speed ?? 1, bat: o.bat ?? 2,
      aspd: o.aspd ?? 100, rangeRadius: o.range ?? 0, blockCnt: o.blockCnt ?? 1, massLevel: o.mass ?? 1, lpr: o.lpr ?? 1,
      hpRecoveryPerSec: 0, elementRes: 0, elementDmgRes: 0, dmgType: o.dmgType ?? 'phys', motion: o.motion ?? 'WALK',
      immunities: o.immunities ?? {}, otherImmunities: o.otherImmunities ?? [], tauntLevel: o.taunt ?? 0,
    },
    notCountInTotal: !!o.notCountInTotal, tags: [], abilities: [], talents: { bb: {} }, skills: [],
  };
}

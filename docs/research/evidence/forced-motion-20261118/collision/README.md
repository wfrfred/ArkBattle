# 地形与碰撞取证复查

研究结论与适用范围见[批次首页](../README.md#地形和物理更新)。下列命令从仓库根目录运行。场景和玩家设置取自本机客户端。关卡和任务镜像的固定提交、URL 和原始字节哈希列在[逐格取证](stage-witness.json)中。

```sh
evidence=docs/research/evidence/forced-motion-20261118/collision
out=.cache/native-research/forced-motion-20261118-replay/collision
mkdir -p "$out"
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data'
assets="$game/StreamingAssets/AB/Windows"
python3 "$evidence/extract_tile_assets.py" --out "$out/tile-assets.json" \
  "$assets/battle/prefabs/[uc]tiles.ab" \
  "$assets/scenes/obt/main/level_main_02-08/level_main_02-08.ab" \
  "$assets/scenes/obt/training/level_training_14/level_training_14.ab" \
  "$assets/scenes/obt/training/level_mechanism_5/level_mechanism_5.ab"
python3 "$evidence/extract_enemy_physics.py" --out "$out/enemy-physics.json" \
  --manager "$game/globalgamemanagers" --enemy-bundle "$assets/battle/enm_pfb_base_0.ab"
python3 "$evidence/extract_ice_prefab.py" --game-data "$game" --out "$out/ice-corner-prefab.json"
stage=.cache/native-research/checkpoint-nondefault-20261107
python3 "$evidence/verify_stage_data.py" --mirror "$stage/mirror" \
  --levels "$stage/mirror-current/zh_CN/gamedata/levels" \
  --equip .cache/native-research/unit-audit-20261110/operator-config/uniequip_table.json \
  --tile-assets "$out/tile-assets.json" --out "$out/stage-witness.json"
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --with 'capstone==5.0.7' python "$evidence/extract_ranges.py" \
  --out "$out/contact-ranges.json" \
  --index 65802 65736 65737 66024 71729 71732 71733 77754 78062 78063 78067 79195 79200 79209 79214 28641 324482 \
  --select Torappu.Battle.Enemy.OnTick Torappu.Battle.Enemy._UpdateCurrentTile Torappu.Battle.Enemy._InitPhysics \
  Torappu.Battle.Enemy.get_onlyCollideWhenUnbalance Torappu.Battle.Tile._OnEnemyEnter Torappu.Battle.Tile.OnEnemyEnter \
  Torappu.Battle.Buff.OnCollideWithHighLand Torappu.Battle.Buff/BuffContainer.OnCollideWithHighLand \
  Torappu.Battle.Enemy/States/UnbalanceState.OnEnter Torappu.Battle.Enemy/States/UnbalanceState.OnExit \
  --search '::_UpdateCurrentTile' '._UpdateCurrentTile' 'OnEnterTile' '.EnemyEnter' 'Tile.OnEnemyEnter' '.DeathAreas' 'OnTriggerEnter2D' \
  --fields Torappu.Battle.Enemy Torappu.Battle.BattleController Torappu.Battle.Tile Torappu.Battle.Enemy/States/UnbalanceState
uv run --offline --with 'capstone==5.0.7' python "$evidence/extract_ranges.py" \
  --out "$out/collider-build-ranges.json" \
  --select Torappu.Battle.Tile._InitCollider Torappu.Battle.Tile.AddEnemy Torappu.Battle.Tile.Init Torappu.Battle.Tile.OnInit \
  Torappu.Battle.Tile.get_isHighland Torappu.Battle.Tile.OverwriteTileInfo Torappu.Battle.Tile.TryUpdateTileInfo \
  Torappu.Battle.Tile.OnEnemyMotionModeChanged Torappu.Battle.BattleFactory.CreateTile \
  Torappu.Battle.HarpoonProjectile._StopCollideHighLand Torappu.Battle.Buff.OnCollideWithHighLand Torappu.Battle.Enemy.get_rigidbody2D \
  --search '._InitCollider' 'Tile.AddEnemy' 'Tile.Init' 'Enemy.get_rigidbody2D' 'BoxCollider2D.' 'OnCollideWithHighLand' 'GroundCollision' 'MapCollision'
uv run --offline --with 'capstone==5.0.7' python "$evidence/extract_ranges.py" \
  --out "$out/ice-corner-native.json" --index 71744 71745 71746 71747 71748 71749 71750 71751 \
  --fields Torappu.Battle.IceCornerTile
uv run --offline --with 'capstone==5.0.7' python "$evidence/extract_ranges.py" \
  --out "$out/ice-corner-velocity.json" \
  --select Torappu.Battle.Enemy.set_velocity Torappu.Battle.Enemy.get_velocity Torappu.Battle.Enemy.StillPull
```

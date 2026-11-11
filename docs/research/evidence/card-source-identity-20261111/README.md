# Card 来源身份的生成与普通重部署

核查日期：2026-11-11。补齐 Character.cardUid 的生产者、写入和普通重部署保留关系；此前 Buff 组键消费者见 [buff-group-expiry](../buff-group-expiry-20261111/README.md)。本批只保存证据，机制结论维护在 [Case 24 第十三节](../../cases/24-deployment-cost-and-supply.md#十三carduid-的生成与普通重部署2026-11-11)，Effect 分组关联见 [Case 01 §9.6](../../cases/01-buff-installation-and-parent-scope.md#96-carduid-的生成与重部署保留)。没有修改项目实现或架构契约。

## 输入与选择

本机 Windows x64 IL2CPP、metadata v29。方法按当前全名和实际调用定位，没有套用旧客户端的方法索引；未执行游戏或验证 XLua／hotfix。

| 文件 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

| 目录 | 范围 |
| --- | --- |
| [allocation](allocation/README.md) | 战斗角色数据转换、UID 构造及计数器、数据 Duplicate、Card 构造与 getter、Character.cardUid 的 getter／setter。 |
| [deployment](deployment/README.md) | 普通 CharacterCard 部署，Character 写入 cardUid，退场按键找回原 Card、恢复并再次部署。 |

各 native.json／metadata.json 记录本次来源路径、长度、工具指纹、字段、方法、代码范围和字节哈希。必要指令保存在 ASM，发现结果留在缓存；跳转表数据不解释为指令。

## 复查与限制

各子目录 README 提供专用提取命令，输出到独立目录后比对 result 与 ASM。归档及共享选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/card-source-identity-20261111
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/card-source-identity-20261111 \
  --out .cache/native-research/card-source-identity-20261111/shared-replay
```

共享 replay 不恢复专用代码截断边界或完整动态调用图。普通回到原卡再部署的结论不自动涵盖删除后新建、TokenCard、多库存、预置、特殊复活、术语移动和模式替换；没有据此规定项目必须复刻原生 UID 编码。

本批已在独立目录复跑两项专用提取，34 份 ASM、全部 result 与客户端指纹一致，所有选中分段完整解码。共享选择器另作复查，不替代特殊代码边界或游戏运行观测。

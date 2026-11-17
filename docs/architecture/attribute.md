# Attribute

Attribute 表达数值底值、修正来源与有效范围。Definition 保存 `default/min/max`；State 保存 `contributions/min/max`，后两项是当前完整边界。空边界表示没有额外数值限制，余额、弹药、计数与报价不因此成为 Attribute。

Definition.default 是配置输入，先按 Definition 的默认边界规范化为底值；当前范围变更不改写这个底值。有效贡献先按 [Contribution](capability.md#属性与贡献) 选择，再求静态或动态输入，按四项公式计算并限幅：

```text
((base + Σaddition) × max(0, 1 + Σmultiplier)
 + ΣfinalAddition) × ΠfinalScaler
    → Clamp(currentMin, currentMax)
```

通用求值保留小数。明确的整数消费者在所属领域取整，动态输入只读当前 BattleState／宿主，范围本身在写入时求值并保存。

范围采用原生单槽：后写替换整个区间，未提供的一侧采用 Definition 默认边界；两侧均空不操作。clear 一次恢复 Definition 的完整上下限，不记录提供者，不恢复旧写入。清范围保留数值 Contribution，撤销 Contribution 也不撤销范围。

属性由所属领域持有，变更使用该领域的合法 Change。MaxHP 的比例／债务处理、Action 冷却刷新等后继遵守各自协议；公共 Attribute 不直接提交资源或驱动全场同步。

原生枚举、公式、范围入口与实际内容依据见 [Case39](../research/cases/39-death-attribution-and-attribute-ranges.md#4-属性求值与范围)。单槽恢复属于保留原生语义；Definition／State 的纯值组织与无查询缓存属于项目组织方式。

[集中测试](../../test/core/attribute.test.js)保障四项归并后的最终范围、整区间覆写／恢复、Contribution 与范围独立，以及只求值竞争后的有效输入。各领域只补自己的资源或计时后继。

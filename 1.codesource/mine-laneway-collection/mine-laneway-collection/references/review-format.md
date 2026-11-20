# 审查文件格式

所有文件 UTF-8。审查决定引用本次 `evidence.json` 的 `evidence_sha256`，每个候选 ID 恰好一项；文字 ID 来自该候选的 `nearby_texts`，原始文字、坐标、图层和有效颜色在证据的 `entities` 对应 ID 中。编号必须有文字 ID；无高程时为 null。同一文字不能用于不同测点。圆圈及文字有效颜色不同时不得因为位置更近而强行关联；重叠点按颜色分组复核。下列 ID 是结构示例，必须改为真实审查结果。

```json
{
  "evidence_sha256": "证据文件中的哈希",
  "decisions": [
    {"candidate_id":"entity-1", "accept":true, "name_text_id":"entity-2", "elevation_text_id":"entity-2"},
    {"candidate_id":"entity-3", "accept":false}
  ]
}
```

建巷输出的 `draft_sha256` 与测点决定绑定。逐条复核 `lanes`，只为接受的巷道填写 `index` 和完整点 ID 顺序；仅原顺序或完整反向有效，空数组表示不接受任何候选。复核两条边线必须来自原图、有效颜色相同，`boundary_geometry_quality.valid=true`，且巷道内每个点都有编号和标高；字母、`t/T`、`⊥`、`丅` 等原始标高后缀不得删除。单线、异色、宽度不稳定、方向不一致或形成矩形包线的边线不得批准。遗漏代表未接受，需报告。

```json
{
  "draft_sha256":"巷道候选文件中的哈希",
  "approvals":[{"index":0,"order":["p0","p1"]}]
}
```

重新解析、改动原图或审查决定后须重新生成对应文件。脚本核对哈希和 ID，不代替语义审查，也不能证明识别完整。

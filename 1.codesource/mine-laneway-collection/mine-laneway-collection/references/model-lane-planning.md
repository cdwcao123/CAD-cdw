# 大模型导线点成巷

输入给大模型的数据应只包含判断所需信息：完整导线点、同色双边线候选、候选包含的点、边界质量、端点、颜色、图层和 handle。不要把整图 DXF 或无关文字直接塞入提示词。

生成紧凑数据：

```powershell
node <技能目录>\scripts\model-packet.mjs `
  <测点.json> <同色边线网络.json> <模型数据.json>
```

模型读取 `模型数据.json` 后输出：

```json
{
  "schema_version": "mine-laneway-model-plan-v1",
  "lanes": [
    {
      "lane_id": "model-lane-1",
      "corridor_id": "candidate-1",
      "point_ids": ["circle-handle-1", "circle-handle-2"],
      "confidence": 0.94,
      "note": "同色双线，点沿走向排列"
    }
  ]
}
```

判断顺序：

1. 只有 `corridors[].quality[0]=true` 且 `corridors[].boundary_colors` 两项相同的 corridor 可选。
2. 只能使用该 corridor 的 `point_ids`，不得跨 corridor 拼接。
3. 根据坐标变化选择正向或反向顺序，保留原始编号、标高和后缀。
4. `points` 按 `point_fields` 解码；重叠点按颜色、图层、块实例区分，同一 `point_id` 只能使用一次。
5. 信息冲突、点不在双线之间或走向不清时保持未分配。

生成最终 JSON：

```powershell
node <技能目录>\scripts\materialize-lane-plan.mjs `
  <同色边线网络.json> <模型计划.json> <最终巷道.json>
node <技能目录>\scripts\validate-lanes.mjs <最终巷道.json>
```

材料化脚本会再次核对 corridor、颜色、点归属、重复使用和几何质量。模型计划不能绕过程序约束。

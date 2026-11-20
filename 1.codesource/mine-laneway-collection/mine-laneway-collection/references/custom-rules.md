# 用户采集规则

用户可以用自然语言追加采集规则。执行前先把本次规则写到任务目录的 `采集规则.json`，再通过 `--rules` 传给 `collect.mjs`。规则只调整本次任务，不修改技能默认值，也不覆盖同色双边线、颜色分层、单线不成巷和数据完整性这些约束。

```json
{
  "schema_version": "mine-laneway-rules-v1",
  "collection_rules": {
    "analysis_region": {
      "x_min": 1200,
      "y_min": 800,
      "x_max": 1800,
      "y_max": 1300
    },
    "label_association_radius_drawing_units": 29,
    "point_boundary_distance_drawing_units": 4,
    "point_boundary_text_height_multiplier": 12,
    "minimum_boundary_length_drawing_units": 10,
    "minimum_lane_length_drawing_units": 20,
    "minimum_point_count": 2,
    "boundary_gap_min": 1.5,
    "boundary_gap_max": 8,
    "boundary_chain_tolerance_drawing_units": 1.5,
    "boundary_layer_include": [],
    "boundary_layer_exclude": [],
    "boundary_color_include": [],
    "boundary_color_exclude": [],
    "boundary_color_priority": ["红色", "蓝色", "青色", "白色"],
    "allow_boundary_reuse": false
  },
  "complex_case_rules": []
}
```

颜色可写 ACI 数值、`aci:1`、`#FF0000`、`rgb:16711680`，或 `红/黄/绿/青/蓝/洋红/白/灰`。所有长度均为 DXF 图纸单位，禁止自动换算为米。

未显式给出 `point_boundary_distance_drawing_units` 时，采集器按图中较小文字的高度估算边界搜索距离，默认倍数为 12。该估算用于找到较宽的同色双线，不会改变“同色”要求。`allow_boundary_reuse` 默认 `false`，表示同一侧边线优先只服务一条已确认巷道；分支确有共用帮线时才由用户明确开启。

`analysis_region` 与命令行 `--region xmin,ymin,xmax,ymax` 等价。一次只处理用户指定的区域，规则证据来自 [局部区域分析](region-analysis.md)。

自然语言规则按以下方式转换：

- “只采集红色边线之间的点” → 在 `boundary_color_include` 写 `["红色"]`。
- “排除灰色边线” → 在 `boundary_color_exclude` 写 `["灰色"]`。
- “红色在上、蓝色在下” → `boundary_color_priority` 按所需处理顺序写入。
- “边线间距按 2 到 7 个图纸单位” → 写入 `boundary_gap_min` 与 `boundary_gap_max`。
- “只处理巷道和采区巷道图层” → 写入 `boundary_layer_include`。
- “每个巷道至少要 3 个导线点” → 写入 `minimum_point_count: 3`。
- “只看坐标 1200,800 到 1800,1300” → 写入 `analysis_region`。
- “同一条线延伸到单线区段时不要保留单线” → 保持 `allow_single_line_lanes: false`；生成器会裁剪到实际同色成对区段。
- “这个分支确实共用一条帮线” → 明确写入 `allow_boundary_reuse: true`，同时记录依据。

用户上传局部复杂情况图片时，按 [局部复杂情况学习](complex-case-learning.md) 生成 `complex_case_rules`。每条图像规则必须记录来源图、SHA-256、区域、用户说明、可见证据、适用范围、派生规则、动作和置信度。DXF 选区使用同一数组，并把来源写成 `source_kind: "dxf_region"`。单张局部图或单个区域默认只适用于 `single_case`，不能自动推广到整张图纸或其他项目。

所有规则文件在执行前运行：

```powershell
node <技能目录>\scripts\rule-check.mjs <采集规则.json>
```

如果用户规则会放宽“两条颜色相同边线、单线不成巷、导线点必须带编号和标高”等要求，拒绝该放宽并说明原因。边界复用是受控的分支选项，不能用来把异色线、辅助线或单线纳入巷道。规则互相冲突或单位无法确认时，保留默认值和未确定项，不猜测。

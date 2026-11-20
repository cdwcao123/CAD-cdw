# 局部区域分析

用户在对话中指定“看左上区域”“处理这个范围”“从 A 点到 B 点附近”时，先取得该区域在 DXF 主坐标区中的矩形范围。四个数值必须是 `xmin,ymin,xmax,ymax`，使用图纸原始单位，不自动换算为米。

用户给出 CAD 坐标时直接使用。用户只给出图片选框时，只有在能通过已知控制点、图框或同名实体把像素区域映射到 DXF 坐标后才写成 `analysis_region`；无法映射时只能作为 `single_case` 图像证据，并标记 `review_required`。

生成区域证据：

```powershell
node <技能目录>\scripts\region-report.mjs `
  <图纸.dxf> <临时目录\区域证据.json> `
  --region 1200,800,1800,1300 `
  --padding 0 `
  [--rules <已有规则.json>]
```

报告包含来源哈希、区域范围、区域内颜色和图层、原始边线 handle、测点颜色及重叠簇、文字原文、同色双边线候选、配对覆盖率、边界距离和候选阈值。报告中的 `suggested_rule_values` 只是证据统计，不是批准的规则。

结合用户说明完成以下判断：

1. 列出区域内哪些颜色形成了双侧边线，哪些只是近邻异色单线或辅助线。
2. 说明复杂点、交叉点、重叠点的颜色、编号、标高、圆圈或同块同心圆关系。
3. 把确认的阈值写进 `collection_rules`，把范围写进 `collection_rules.analysis_region`。
4. 把图像或区域的来源证据写入 `complex_case_rules`。区域证据使用 `source_kind: "dxf_region"`、`source_file`、`source_sha256` 和 `source_region`；图片证据使用 `source_kind: "image"`、`source_image`、`source_image_sha256` 和像素区域。
5. 单个区域的结论默认 `scope: "single_case"`。需要推广到整图时，必须有多区域一致证据或用户明确确认；低置信度结论保持 `action: "review_required"`。

生成规则后运行：

```powershell
node <技能目录>\scripts\rule-check.mjs <采集规则.json>
```

最终交付中列出区域坐标、规则文件哈希、采用的颜色优先级和仍需人工检查的交叉/遮挡位置。不要把区域证据写到工作区交付目录，除非用户明确要求保留审计材料。

# 局部复杂情况学习

用户上传局部截图或裁剪图并要求“识别图片、结合自然语言总结采集规则”时，可以查看图片，但只查看安全缩略图。该授权不能扩展为读取其他 CAD 预览、整页截图或浏览器截图。

用户指定 DXF 坐标区域时，改为读取 [局部区域分析](region-analysis.md)，生成 `region-report.mjs` 证据。无需读取截图；只有图片和区域能通过控制点建立映射时才合并两类证据。

## 图像取证

1. 记录用户原图路径和自然语言说明。用 `make-safe-preview.ps1` 生成安全 JPEG，取得 `source_sha256`、尺寸和 `source_region`。
2. 先查看整张安全缩略图。文字、颜色或小圆无法辨识时，用同一脚本的 `CropX`、`CropY`、`CropWidth`、`CropHeight` 参数生成局部安全裁剪；每张裁剪图必须单独满足 `safe_to_read=true`。
3. 只描述图中能直接观察到的证据：颜色、边线数量、圆圈/块关系、编号与标高位置、交叉/重叠关系、文字后缀、可见图层或标注。不要根据常识补出不存在的线、点或标高。
4. 图片与 DXF 不一致、无法确定图片来源、相同颜色在压缩后失真，或局部边界被截断时，结论必须标为 `review_required`，不能直接覆盖 DXF 规则。

## 规则输出

把自然语言与视觉证据合并，写入 `采集规则.json` 的 `complex_case_rules`。模型可把能够映射的阈值同步写入 `collection_rules`；无法映射的例外保留为复核规则，不得篡改正式 JSON 冒充已处理。

```json
{
  "rule_id": "case-001",
  "source_kind": "image",
  "source_image": "C:/path/complex-case.png",
  "source_image_sha256": "源图64位SHA-256",
  "source_region": { "x": 120, "y": 80, "width": 640, "height": 480 },
  "user_instruction": "同坐标不同颜色测点都要保留，红色优先",
  "observed_pattern": "同一坐标有两个独立圆和两套不同颜色编号/标高；两条红色边线包住该点，没有发现同块同心关系。",
  "applies_to": {
    "scope": "single_case",
    "layer_include": [],
    "color_include": ["红色"]
  },
  "derived_rules": {
    "merge_independent_overlapping_circles": false,
    "boundary_color_priority": ["红色"]
  },
  "action": "review_required",
  "confidence": 0.9
}
```

`scope` 只能是 `single_case`、`current_drawing` 或 `project`。单张局部图默认只能生成 `single_case` 规则；扩大到当前图纸或其他项目时需要更多样本或用户明确确认。`confidence < 0.8` 的跨图规则必须保持 `review_required`。

DXF 区域证据改用：

```json
{
  "source_kind": "dxf_region",
  "source_file": "C:/path/source.dxf",
  "source_sha256": "DXF源文件64位SHA-256",
  "source_region": {
    "x_min": 1200,
    "y_min": 800,
    "x_max": 1800,
    "y_max": 1300
  }
}
```

区域证据必须引用报告中的实体 handle、颜色、图层和配对覆盖率。不能只凭相邻关系认定两条异色线是一条巷道。

生成后执行：

```powershell
node <技能目录>\scripts\rule-check.mjs <采集规则.json>
```

校验不通过时不得把规则传给采集命令。校验通过只证明结构完整，不证明图像结论正确；在最终报告中列出规则编号、来源图哈希、适用范围、置信度和仍需人工确认的部分。

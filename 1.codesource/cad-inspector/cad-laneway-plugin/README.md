# cad-inspector 5.8.0 · 巷道采集主线基线

这是 `cad-inspector` 的 5.8.0 源码，也是没有 SDK 字段导出和云推送的主线基线。插件从 DWG/DXF 中识别圆圈测点、文字证据和同色双边线巷道候选，通过宿主默认模型完成证据选择与点序确认，最后下载巷道 JSON。

> 当前源码版本最高的是 [5.10.0 SDK 字段预览](../cad-inspector-sdk-fields-work/README.md)。本目录只描述 5.8.0，不应继续引用早期 3.x 页面中的 DWG 自动成图流程；当前 `index.js` 只下载 JSON，不提供结果 DWG 下载按钮。

## 版本与状态

| 项 | 值 |
| --- | --- |
| 插件名 | `cad-inspector` |
| 显示名 | 图纸测点采集 |
| 版本 | `5.8.0` |
| 后端 API | `backendApiVersion: 3` |
| 页面类型 | `full-page`，左侧栏入口 |
| 权限 | `engine.generate` |
| 状态 | 主线基线；发布包当前未保留在 `2.zip/cad-inspector/` |

## 本版能力

- 支持 `DWG` 和 ASCII `DXF`，单文件上限 80 MB。
- DWG 在 Worker 中通过随包 LibreDWG WASM 转成 DXF。
- 解析 LINE、LWPOLYLINE、POLYLINE、ARC、CIRCLE、TEXT、MTEXT、SPLINE、ELLIPSE 和嵌套块；圆弧与 bulge 被离散化。
- 识别圆圈、点名、纯数字编号、标高文字及组合文字；标高后缀参与后续校验。
- 只把圆心位于两条未闭合、同色边界线之间的候选作为巷道证据。
- 对重叠点按有效颜色、图层和块实例分组；只有同 `block_ref_id`、同圆心的同心圆允许合并。
- 前端每 5 个候选调用一次 `/collect`；服务端对模型响应执行 ID、点名、高程、重复使用和字段格式校验，最多纠正 3 次。
- 几何巷道生成后，前端再调用 `/connect` 让模型确认点序；模型只能选择正序或反序，不能改动几何或补造点。
- 完成结果保存在浏览器 IndexedDB 中，可查看本机历史并下载 JSON。

## 用户流程

1. 在宿主左侧栏打开“图纸测点采集”。
2. 选择 `.dwg` 或 `.dxf` 文件；确认已授权将该图相关候选发送给默认模型。
3. 点击“开始采集”。
4. 等待解析、模型点摘取和巷道连接审查完成。
5. 查看测点数和双边线巷道候选数，下载 `*-巷道候选.json`。
6. 在客户系统或目标服务端导入前，人工核对点名、标高、点序、边线来源和单位。

切换页面会暂停采集；原图字节和模型批次进度只保存在当前页面模块内存中，宿主刷新后不能恢复。已完成的结果可恢复，但不包含原图。

## 工具与宿主接口

| 接口/工具 | 输入 | 输出/作用 |
| --- | --- | --- |
| Worker `open` | 图纸字节、文件名、会话 ID | 解析绘图，返回测点/文字/巷道几何候选 |
| Worker `finalize` | 模型确认的点证据 | 组装测点和巷道候选，输出待审查点序 |
| Worker `approve-lanes` | 每条巷道的点序 | 返回最终测点和巷道 JSON |
| `GET /health` | 无 | 宿主插件 ID、模型能力是否可用 |
| `POST /collect` | 最多 40 个圆圈、200 条文字及局部巷道上下文 | 模型选择 `{circleId,nameId,elevationId}`，并由服务端校验 |
| `POST /connect` | 2–100 个点、两条边界线 | 模型返回全部点 ID 的正序、反序或空数组 |
| `pluginApi.logger` | 操作、计数、耗时、错误类别 | 审计日志，不记录原始坐标或图纸内容 |

## 输出数据

`index.js` 直接下载插件内部巷道数组。主要字段包括：

- 巷道级：`laneway_code`、`laneway_name`、`laneway_height`、`laneway_width`、`border_line_points`、`traverse_point_count`、`traverse_point_array`；
- 点级：`point_name`、`point_order`、`x`、`y`、`z_top`、`z_bottom`、`left_side`、`right_side`、`traverse_point_type`；
- 证据与质量：`boundary_line_colors`、`boundary_line_sources`、`boundary_geometry_quality`、`point_source`、候选编码等。

左右距离和巷宽以图纸单位表示，不是自动换算后的米。缺少标高时按巷道实测锚点插值；巷高无法确认时使用默认值 3，并在结果来源字段中标识。

## 代码框架

```text
cad-laneway-plugin/
├─ manifest.json              插件清单与权限
├─ index.js                   页面、批量模型请求、IndexedDB 历史与 JSON 下载
├─ server.js                  /health、/collect、/connect 及模型响应校验
├─ worker.js                  DWG→DXF、解析、候选排序、结果组装
├─ core/
│  ├─ parse.js                DXF 解析与块展开
│  ├─ survey.js               圆圈/文字证据候选与点组装
│  ├─ nodes.js                点名、标高解析和插值
│  ├─ priority.js             近邻文字和候选优先级
│  ├─ lanes.js                同色双边线复核与 JSON 巷道记录
│  ├─ nodegraph.js            导线点图路径
│  ├─ geometry.js             成链、配对、偏移、合并
│  ├─ semantic.js             巷道命名、标高继承、25 字段记录
│  ├─ pipeline.js             5.x 早期全流程实验的编排逻辑
│  ├─ dwg.js                  acad-ts DWG 写出参考实现
│  ├─ geo.js                  坐标配准工具
│  ├─ layers.js / learning.js / nl.js / quality.js / review.js
│  └─ result-store.js         IndexedDB 结果历史
├─ runtime/                   LibreDWG Web WASM 与许可/来源声明
├─ vendor/                    acad-ts 打包产物与许可证
├─ tests/                     协议、几何、渲染、标高等回归脚本
└─ 相关说明文档
```

`pipeline.js` 和 `dwg.js` 保留了早期“自动描线成图”实验；当前页面主路径是 `worker.js → lanes.js → server.js` 的点证据采集流程，不应仅凭这两个旧模块描述当前产品能力。

## 构建

父目录的 `build-laneway-plugin.py` 明确以本目录为源，执行静态字段、相对导入、清单文件和 ZIP 安全检查：

```powershell
python ..\build-laneway-plugin.py
```

脚本会在父目录重建 `elvespuck-plugin-cad-inspector-5.8.0.zip`，同版本旧文件会被删除。执行前先备份现有发布物。

## 测试

测试文件按主题包含：

- `tests/survey-flow.mjs`、`model-collection.mjs`、`model-connect.mjs`：点摘取和模型协议；
- `tests/lanes-collection.mjs`、`corridor-lanes.mjs`、`nodegraph-continuity.mjs`：双线和点序；
- `tests/schema-check.mjs`：25 字段结构；
- `tests/e2e.mjs`、`export-smoke.mjs`、`render-smoke.mjs`：历史导出和渲染回归；
- `tests/elevation-regression.mjs`、`priority.mjs`、`large-range.mjs`：标高、优先级和大坐标。

部分 E2E 脚本依赖真实图纸、宿主或 Python/CAD 环境，应在目标环境逐项执行。本次文档编制未把历史文档中的“全部通过”视为当前源码的自动化验收结论。

## 已知限制

- `REQUIREMENTS.md` 和 `ACCURACY-REVIEW.md` 记录了逐条形状对拍命中率不足的问题；不能把“条数接近”当作拓扑正确。
- 模型失败会停止当前批次，不自动生成未经模型确认的最终 JSON。
- 复杂、密集或局部详图区域可能被跳过；不确定圆圈可能不返回。
- DWG 转换状态为零不代表转换无损；块、外参、代理对象和字体仍可能影响结果。
- 结果仅供辅助采集，必须专业复核，不能直接作为生产台账或合规结论。

## README 维护

本文件只描述当前 `cad-laneway-plugin` 目录。若 5.8.0 继续发版，直接更新本文件；若后续版本合回本目录，需把标题、`manifest.json`、`KERNEL_VERSION`、模型接口、JSON 字段、打包脚本和测试状态一起更新。最高版本或分支关系变化时，同时更新父目录 README。

# cad-inspector 5.10.0 · SDK/接口字段预览

`cad-inspector` 5.10.0 是当前源码版本最高的分支。它在 5.8.0 的测点和同色双线采集链路上增加 SDK/接口字段白名单，并保留巷道台账推送尝试。

> 状态是预览。当前实现把候选映射为接口可用字段，但未通过真实 SDK 导入、真实云图 CAD 台账写入或生产数据验收。不要把 `5.10.0` 的文件名理解为稳定发布。

## 版本与边界

| 项 | 值 |
| --- | --- |
| 插件名 | `cad-inspector` |
| 版本 | `5.10.0` |
| 页面 | Vue 渲染函数形式的 full-page 插件 |
| 权限 | `engine.generate`、`egress`、`config.read` |
| 发布包 | `2.zip/cad-inspector/elvespuck-plugin-cad-inspector-5.10.0-sdk-preview.zip` |
| 源码状态 | 当前最高版本，预览/试验 |

本版新增字段导出并不等于完成 MAS/云图 CAD SDK 写入。`SDK_FIELDS.md` 明确说明：左右距离和巷宽来自帮线几何估算，使用图纸单位；缺失字段保持 `null`，不推断矿井、进尺、半径、煤层厚度等未知业务字段。

## 最新版本特性

- 保留圆圈、编号和标高证据校验；模型不能返回输入之外的 ID。
- 保留同色、未闭合、几何质量有效的双边线作为巷道边界。
- 导出 SDK/接口白名单字段，删除本地质量来源、证据和临时字段。
- 临时 `candidate-*` 巷道编码统一映射为 `null`。
- 缺失或非有限数值统一映射为 `null`，不擅自补业务值。
- 左右距离由测点到两条原始边线的投影估算；巷宽取各测点左右距离均值之和。
- 图纸结果保存在浏览器 IndexedDB；可查看历史并下载 JSON。
- 保留云推送页面，但当前代码直接映射 `toSdkRecords()` 后调用宿主 `egress`，没有调用 `/cloud-validate`。

## 用户流程

1. 上传 `.dwg` 或 `.dxf`，单文件不超过 80 MB。
2. 确认图纸和候选数据允许发送给宿主默认模型。
3. 点击“开始采集”或“继续采集”。
4. 等待本地几何筛选、模型文字摘取和模型点序确认。
5. 查看测点数、巷道候选数及估算来源。
6. 下载 `*-巷道候选.json`，或从本机历史恢复后下载。
7. 如需推送，先人工补齐正式巷道编码、矿井信息、巷宽、标高和测点数值，再在页面选择 JSON 并推送。
8. 推送后到目标系统核对；结果不确定时不要重复提交。

## 工具与接口

| 接口/模块 | 作用 |
| --- | --- |
| Worker `open` | DWG→DXF、DXF 解析、测点/文字/巷道候选 |
| Worker `finalize` | 应用模型点证据，组装巷道记录 |
| Worker `approve-lanes` | 应用正序/反序决策并输出最终候选 |
| `GET /health` | 模型能力检测 |
| `GET /cloud-status` | 云配置状态和来源 URL |
| `POST /connect` | 模型确认巷道点序 |
| `POST /collect` | 模型按批选择点名/高程证据，服务端严格执行 3 次校验/纠正 |
| `core/result-store.js` | IndexedDB 最新结果与历史 |
| `core/cloud-push.js#toSdkRecords` | SDK/接口字段白名单和 null 规范化 |
| 宿主 `cloud.laneway.create` | 批量新增巷道台账 |

服务端模型批次上限为 40 个圆圈、200 条文字；前端以 5 个候选为一批调用模型。

## 字段契约

巷道字段白名单位于 `core/cloud-push.js`：

```text
id, laneway_code, laneway_name, laneway_type, mineCode, mining_name,
horizontal_name, mining_area_name, work_face_name, material, color,
laneway_sec_style, traverse_point_count, laneway_use, laneway_height,
laneway_width, support_pattern, into_or_out_wind, series_ventilation,
return_air_type, excavation_status, excavation_type, current_footage,
border_line_points, translate_border_line_points, traverse_point_array
```

测点字段白名单：

```text
laneway_code, point_name, point_order, radius, left_side, right_side,
top_coal_thick, use_second_side, coal_seam_struct, second_left_side,
bottom_coal_thick, second_right_side, x, y, z_top, z_bottom,
traverse_point_type
```

`MineCode` 会映射为 `mineCode`；接口未声明的 `evidence`、`boundary_geometry_quality` 等字段不会进入导出记录。

## 代码框架

```text
cad-inspector-sdk-fields-work/
├─ index.js                    页面、采集批次、历史、下载、推送
├─ server.js                   /health、/cloud-status、/connect、/collect
├─ worker.js                   解析、候选筛选和最终结果组装
├─ core/
│  ├─ parse.js                 DXF 与块解析
│  ├─ survey.js                圆圈/文字证据
│  ├─ priority.js              近邻文字、井口提示优先排序
│  ├─ nodes.js                 点名/标高解析
│  ├─ lanes.js                 同色双边线几何与巷道记录
│  ├─ nodegraph.js             导线点路径
│  ├─ cloud-push.js            SDK 字段白名单
│  └─ result-store.js          IndexedDB 历史
├─ runtime/                    LibreDWG Web WASM 与许可证/来源说明
├─ SDK_FIELDS.md               字段语义和单位边界
├─ 云端推送说明.md             云推送预览说明
├─ test-sdk-fields.mjs         单巷道左右距离、巷宽和字段清理
└─ test-cloud-push.mjs         云推送模拟测试（当前与源码版本不一致）
```

## 开发与发布

当前源码没有专用 5.10.0 打包脚本。不要直接使用父目录面向 5.8.0 的 `build-laneway-plugin.py`，因为两者的文件清单、manifest 和字段模块不同。发布时应：

1. 从 `manifest.json` 和 `index.js` 双重确认版本仍为 `5.10.0`；
2. 固定 `runtime/`、`LICENSE`、`GPL-3.0.txt`、`NOTICE` 和对应源码说明；
3. 核对 ZIP 根目录清单、相对导入和文件哈希；
4. 在真实 ElvesPuck 客户端执行安装、模型调用、JSON 下载和云推送验收。

## 测试状态

- `node --test test-sdk-fields.mjs`：通过，验证左右侧距离、巷宽、临时编码清理和证据字段删除。
- `node --test test-cloud-push.mjs`：失败。测试期望 5.9.1 的 `prepareCloudPayload()` 完整性校验和 `/cloud-validate` 路由；5.10.0 当前源码只保留 `toSdkRecords()`，没有这些能力。
- 不应通过修改 README 描述掩盖该源码/测试错位。发布 5.10.0 前必须决定是恢复校验能力、删除过期测试，还是把测试指向 5.9.1。

## 已知限制

- 左右距离和巷宽是图纸单位下的几何估算，不是测量值，也没有自动换算为米。
- 临时编码及缺失字段返回 `null`；接收方可能拒绝 null，实际 SDK/接口兼容性尚未验证。
- 云推送没有当前分支内的字段完整性预校验；这与 `云端推送说明.md` 的“不执行字段完整性校验”一致，但与 5.9.1 分支不同。
- 未做真实云端鉴权、真实 SDK 导入、真实版本保存或生产台账写入验证。
- 复杂图形、块变换、外参、字体和代理对象可能影响识别。
- 所有候选必须由专业人员对照原图复核。

## README 维护

发版时原地更新本文件，必须同步 `manifest.json`、`index.js` 的 `KERNEL_VERSION`、字段白名单、云推送是否校验、测试状态、发布包路径和父目录分支表。不要再创建每个版本一份的独立 README。

# cad-inspector 5.9.1 · 巷道台账云推送预览

本分支在 `cad-inspector 5.8.0` 的测点与同色双线采集链路上，增加“推送巷道台账”能力。它仍负责从图纸生成人工核验候选，重点验证采集结果经宿主 `egress` 批量新增到云图 CAD 巷道台账的字段映射、预校验和错误处理。

> 这不是完整 SDK 字段分支。当前源码版本最高的是 [5.10.0 SDK 字段预览](../cad-inspector-sdk-fields-work/README.md)；两者云推送行为不同，不能互换测试结论。

## 版本与发布

| 项 | 值 |
| --- | --- |
| 插件名 | `cad-inspector` |
| 版本 | `5.9.1` |
| 清单权限 | `engine.generate`、`egress`、`config.read` |
| 发布包 | `2.zip/cad-inspector/elvespuck-plugin-cad-inspector-5.9.1-cloud-push-preview.zip` |
| 状态 | 技术验证预览，不是稳定版 |

## 本版特性

- 沿用 5.8.0 的 DWG/DXF 解析、双侧同色边界筛选、模型点证据和点序审查。
- 新增 `core/cloud-push.js`，按接口字段白名单生成批量新增报文。
- 新增 `/cloud-validate`，在发送前检查巷道编码、矿井信息、数值字段、测点顺序、左右距离和边界坐标。
- 新增 `/cloud-status`，只返回是否配置和来源地址，不返回令牌。
- 页面可推送当前采集结果，也可选择人工补齐的 UTF-8 JSON 数组。
- 通过宿主 `pluginApi.http.egress.call('cloud.laneway.create', ...)` 发送，不在插件内直接持有明文云端地址或令牌。
- 对超时、HTTP 失败、业务码失败和“结果未知”分别提示；未知结果要求先查云端再决定是否重试。

## 使用流程

### 1. 配置宿主

在 ElvesPuck 服务端合并配置的 `env` 中设置：

- `CLOUDCAD_BASE_URL`：仅 HTTP/HTTPS 来源，例如 `https://cad.example.test:61012`，不能带路径、查询字符串或账号密码；
- `CLOUDCAD_TOKEN`：目标系统令牌，不得写入前端、日志、文档或插件包。

重启插件或宿主，使 `ctx.egress.declare()` 重新注册出站操作。

### 2. 采集或准备 JSON

先完成图纸采集，或在页面中选择已经人工核验并补齐字段的 UTF-8 JSON 数组。

原始候选通常含 `candidate-*` 临时编码、未知巷宽或未知标高，按预期会被预校验阻止。不要为了通过校验而自动编造业务字段。

### 3. 推送并核对

点击“推送至巷道台账”。成功后仍应在云系统核对实际写入；请求超时或返回不明确时，先查询是否已写入，禁止直接重复提交。

## 工具与接口

| 工具/接口 | 作用 |
| --- | --- |
| `GET /cloud-status` | 返回 `{configured, origin}`，不暴露令牌 |
| `POST /cloud-validate` | 调用 `prepareCloudPayload()` 检查完整数组，成功返回可发送的 `{data}` |
| `POST /connect` | 模型确认巷道内测点顺序 |
| `POST /collect` | 模型选择点名和高程文字证据 |
| `GET /health` | 检查插件和模型能力 |
| 宿主出站 `cloud.laneway.create` | `POST /XAYL_Designer/CADCollection/GisLaneway/CreateList` |
| `core/cloud-push.js#prepareCloudPayload` | 白名单映射、删除证据字段、校验必填数值与编码 |

出站声明限制为：请求体最多 4 MB、响应最多 128 KB、超时 30 秒。

## 预校验规则

`prepareCloudPayload()` 当前要求：

- 数组非空，单次最多 2000 条；
- `laneway_code` 非空、唯一且不是 `candidate-*`；
- 有 `mineCode`/`MineCode` 或 `mining_name`；
- 有有限数值的 `laneway_height`、`laneway_width`、`current_footage`；
- 至少 2 个测点，`traverse_point_count` 与数组长度一致；
- 测点必需数值字段完整，`point_order` 为整数，`use_second_side` 为布尔值；
- 每个测点的 `laneway_code` 与巷道编码一致；
- 两条帮线坐标均为有限数值。

通过校验只代表结构可发送，不代表目标系统一定接受，也不代表巷道几何或测量数据正确。

## 代码框架

```text
cad-inspector-cloud-push/
├─ index.js                   页面、模型批次、人工 JSON 选择、云推送状态
├─ server.js                  模型接口、/cloud-status、/cloud-validate、egress 声明
├─ worker.js                  DWG/DXF 解析与采集结果组装
├─ core/
│  ├─ cloud-push.js           字段白名单、完整性校验、接口映射
│  ├─ lanes.js / priority.js  同色双线和点候选
│  ├─ survey.js / nodes.js    圆圈、文字和高程
│  ├─ parse.js                DXF 解析
│  └─ result-store.js         浏览器本机历史
├─ runtime/                   LibreDWG WASM、许可证和来源说明
├─ test-cloud-push.mjs        映射、校验、出站声明和 UI 分支模拟
└─ 云端推送说明.md
```

## 测试

```powershell
node .\test-cloud-push.mjs
```

本次扫描时该脚本通过，输出 `cloud push validation and declaration: ok`。测试仅使用模拟 router、模拟宿主和模拟 `egress`，没有访问真实内网。

## 已知限制

- 未验证真实鉴权、目标接口字段约束、重复数据判定、真实写入和回滚。
- 未记录已在真实 ElvesPuck 客户端安装的运行结果。
- 当前示例配置使用 HTTP 内网地址时，令牌和巷道数据不会被传输层加密。
- 云推送是批量新增；无幂等键情况下，重试可能产生重复台账。
- 采集候选默认缺字段，必须人工补齐；插件不自动生成矿名、巷道编码、巷宽或标高。
- 模型和几何结果均需专业复核。

## 发布与维护

发布包已经存在，无需重新构建。升级本分支时，应原地更新本 README，并同步：

- `manifest.json` 和 `KERNEL_VERSION`；
- 出站目标、请求体上限和鉴权字段；
- `/cloud-validate` 规则及字段映射；
- 页面提示、测试结果和真实系统验收状态；
- 父目录 README 中的分支表。

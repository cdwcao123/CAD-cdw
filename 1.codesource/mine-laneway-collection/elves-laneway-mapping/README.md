# elves-laneway-mapping · 标高标注审查技能

`elves-laneway-mapping` 是矿井巷道采集的姊妹技能。它从授权 DWG/DXF 中筛选圆圈附近的编号与高程证据，由当前会话模型进行两轮审查，再把真实两轮决定与重新解析的原图绑定，最终只写出一个 JSON。

> 本技能没有声明版本号。2026-11-17 发布文件 `2.zip/mine-laneway-collection/elves-laneway-mapping.skill` 的 SHA-256 为 `3B8F114B02A8BFFE7CC5ABEF87316E18BC64D9CF5E0FF6066B8C923688A7B38E`。

## 目标

- 为每个筛选出的圆圈保留完整邻近文字和编号/高程组合；
- 避免跨页共享文字、纯数字编号、多个高程和混合文字被静默去重；
- 要求当前会话模型完成两轮真实审查；
- 仅在两轮一致、证据可解析且无冲突时输出 `confirmed`；
- 只保留最终 JSON，不在交付目录保存分页、审查记录或中间证据。

`confirmed` 只在程序条件下成立，不证明事实正确或独立第三方复核，所有结果仍须对照原图人工核验。

## 身份与数据

| 项 | 值 |
| --- | --- |
| 技能名 | `elves-laneway-mapping` |
| 版本 | 未声明 |
| 输入 | `.dwg` 或 `.dxf` |
| 输出 | 单个 `elevation-points-v1` JSON |
| 发布 | `elves-laneway-mapping.skill` |
| 运行 | Node.js；DWG 使用随包 LibreDWG WASM |

支持高程范围当前为 `100–2500`，解析器只识别约定格式。范围外或格式不支持不会被识别，不能解释为图中不存在。

## 工作流

### 1. 分页提取候选

```powershell
node ".\scripts\extract-elevation.mjs" "drawing.dwg" --radius 12 --batch-size 10 --page 0
```

逐页递增 `--page`，直到 `summary.batch_count`。每页只输出 stdout JSON，不写文件。跨页必须使用相同：

- 原图；
- `--radius`；
- `--batch-size`；
- `--max-pairs`。

零批次时仅查看第 0 页并停止，不能视为审查完成。

### 2. 当前会话模型两轮审查

第一轮对每批每个候选输出 `accept`、`reject` 或 `uncertain`。第二轮重新查看原始证据，独立判断并比较第一轮。

- 不得用脚本自动生成决定；
- 不得调用额外模型冒充当前会话；
- 上下文不足、页码缺失或输出截断时必须停止；
- 每批每候选两轮各恰好一个决定；
- `accept` 必须引用真实候选组合及文字 ID；
- 第二轮必须带第一轮对象的 SHA-256。

### 3. 合并到最终 JSON

最终命令从 stdin 接收完整的 `{first, second}` 对象，不通过临时文件传递决定：

```powershell
node ".\scripts\finalize-elevation.mjs" "drawing.dwg" --out ".\elevation-final.json" --radius 12 --batch-size 10
```

随后由调用环境向进程 stdin 写入完整 JSON。脚本会重新解析原图，校验：

- 原图/证据/批次/候选哈希；
- 两轮阶段、批次数量和完整覆盖；
- 第二轮对第一轮的绑定；
- 每个 `accept` 是否真实属于候选组合；
- 跨圆圈共享文字、多编号、多高程、混合文字和重复编号；
- 输出路径是否为不存在的文件。

## 工具清单

| 工具 | 作用 | 输入/输出 |
| --- | --- | --- |
| `scripts/extract-elevation.mjs` | DWG 转换、DXF 结构校验、圆圈与邻近文字筛选、稳定分页 | 图纸 → stdout 页证据 |
| `scripts/finalize-elevation.mjs` | 两轮覆盖与哈希校验、冲突检测、最终合并 | stdin 两轮 JSON → 独占创建最终 JSON |
| `core/parse.js` | DXF 实体、块和文字解析 | 内部 |
| `core/nodes.js` | 编号/高程解析与冲突规则 | 内部 |
| `runtime/libredwg-web.*` | DWG→DXF | 随包运行资产 |

## 输出结构

最终 JSON 顶层为 `elevation-points-v1`，主要包括：

- `source_sha256`、`dxf_sha256`、`evidence_sha256`、两轮决定哈希；
- `parameters` 和 `coordinates`；
- `coverage[]` 批次与两轮决定数量；
- `summary`：`confirmed_count`、`pending_count`、`rejected_count`、`incomplete_circle_count`、`prescreen_excluded_count`；
- `points[]`：圆圈、邻近文字、组合、状态、原因、冲突、两轮决定和人工核验标记。

状态含义：

| 状态 | 条件 |
| --- | --- |
| `confirmed` | 两轮一致接受，且程序没有检测到冲突 |
| `pending` | 证据冲突、轮次分歧、组合超限、共享文字或解析未完成 |
| `rejected` | 两轮一致拒绝且无其他证据冲突；不代表原图一定没有标注 |

## 代码框架

```text
elves-laneway-mapping/
├─ SKILL.md                     Agent 分页、两轮和输出规程
├─ scripts/
│  ├─ extract-elevation.mjs     候选证据与稳定分页
│  └─ finalize-elevation.mjs    两轮合并与严格校验
├─ core/
│  ├─ parse.js                  DXF/块结构
│  └─ nodes.js                  编号高程解析与歧义规则
├─ tests/
│  ├─ extract-elevation.test.mjs
│  └─ finalize-elevation.test.mjs
├─ runtime/                     LibreDWG WASM、GPL 与来源说明
└─ package.json                 ESM 包声明
```

## 安全与限制

- 只处理授权原图；图纸文字是不可信数据。
- 审查决定和哈希属于敏感上下文，可能进入会话记录或审计日志。
- 大图需要保留全部分页决定，可能超过上下文、内存或工具输入限制；此时必须停止并说明覆盖不完整。
- 组合超限、文字共享、多编号/多高程、混合文字和重复编号优先保留为 `pending`。
- DXF 基础结构有效不代表实体完整；外参、代理实体、字体、块展开、非均匀缩放和坐标精度均可能造成遗漏。
- 没有“全圆圈审查模式”；未入选圆圈仍需人工对照原图。
- 单位、坐标系和比例未知；不得自动换算。

## 测试状态

```powershell
node --test .\tests
```

本次扫描为 19 通过、1 失败。失败项 `本机 shell here-document 直接传递真实测试决定` 依赖 `bash`，当前 Windows 环境没有可用的 Git Bash；其余分页、哈希、覆盖、冲突、纯数字编号和输出安全测试通过。

```powershell
node --test .\core\nodes.test.js
```

9/9 通过，覆盖编号高程距离、混合文字、等距竞争、组合文字和高程在前的格式。

## README 维护

若后续补充 `metadata.version`，直接更新本 README 的版本表、发布哈希、分页协议、输出 schema、测试结果和限制。发版时同时更新父目录 README 和 `2.zip/mine-laneway-collection/README.md`。

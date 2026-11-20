# mine-laneway-collection 1.23.0 · 矿井巷道采集技能

这是一个面向 Agent 的矿井 DWG/DXF 采集技能。它把“发现测点”和“决定哪些点组成哪条巷道”拆成两步：先保留全部有效导线点及其同色双线候选，再让当前会话模型基于紧凑数据包排点，最后由程序把模型计划重新绑定到真实几何并校验。

> 1.23.0 是技能包版本，不意味着图纸识别已达到生产精度。结果必须由专业人员对照原图核验。

## 身份与发布

| 项 | 值 |
| --- | --- |
| 技能名 | `mine-laneway-collection` |
| 版本 | `1.23.0` |
| 入口 | `SKILL.md` |
| Node 入口 | `scripts/collect.mjs`、`worker.js` |
| 发布包 | `2.zip/mine-laneway-collection/mine-laneway-collection-skill-1.23.0.zip` |
| SHA-256 | 见发布目录同名 `.sha256` 文件 |

## 1.23.0 特性

- Python 解释器支持 3.10 以上版本，优先 AgentOS 运行时，其次用户环境。
- 已安装 ezdxf 时直接使用；CPython 3.12 可使用随包 wheel；其他 Python 版本使用纯标准库 DXF 后备。
- 点清单与成巷判断分离：有效编号点不会仅因暂时无同色双线候选而被删除。
- 每条点记录保留 `same_color_corridor_ids`、边界状态、颜色、图层、块实例和文字来源，便于回溯。
- 同色双线几何校验包含并行覆盖、宽度稳定性、端部平行度、中心偏移和单线尾段裁剪。
- 新增 `model-packet.mjs`，把测点和候选巷道压缩成行列式模型数据包，附源文件哈希和输出 schema。
- 新增 `materialize-lane-plan.mjs`，校验模型引用的 `corridor_id`、点 ID、颜色、几何质量和点唯一性，再生成最终 JSON。
- 支持用户指定 `--region` 矩形区域、`--all-areas` 和自定义规则文件。
- 支持只画原始同色双线、圆圈、编号和完整标高后缀的“点模式”复核图。
- 支持把每条巷道画成独立块并设置重绘顺序，便于在查看器中整体高亮。
- 运行依赖随包提供 LibreDWG WASM；Windows x64 Python 3.12 wheels 仅作可选加速。

## 不可违反的采集规则

1. 导线点必须有圆圈、编号；正式巷道点还必须有标高，标高原文后缀必须保留。
2. 一条巷道只使用两条未闭合原始边线，且两条线有效颜色完全相同。
3. 异色线、单线、中心线、辅助线、交叉四边形、宽度突变和方向不一致的线都不是巷道边界。
4. 圆心必须位于两条边线之间；不得借用邻近白色线替代蓝色双线。
5. 重叠点先按颜色、图层和块实例分组；只有同 `block_ref_id`、同圆心的同心圆合并。
6. 源图中的边线 handle、图层、颜色和文字原文必须可追溯。
7. 不得用视觉判断覆盖程序校验；单线成巷、异色配对、矩形包线或边界不稳定时必须失败或跳过。

## 使用流程

### 路径 A：点模式

适合只需要导线点、编号、标高和边线背景。

```powershell
$skill = 'E:\path\to\mine-laneway-collection'
$tmp = Join-Path $env:TEMP 'mine-lane-work'
New-Item -ItemType Directory -Force $tmp | Out-Null

node "$skill\scripts\collect.mjs" points "drawing.dxf" "$tmp\points.json"
node "$skill\scripts\collect.mjs" network "drawing.dxf" "$tmp\network.json" "$tmp\points.json"
node "$skill\scripts\dxf.mjs" draw-points "$tmp\network.json" ".\测点复核.dxf" "$tmp\points.json"
```

点模式 DXF 只画原始同色双边线、按颜色区分的圆圈、编号和标高，不画巷道块或中心线。

### 路径 B：巷道模式

1. 生成全部点清单：

```powershell
node "$skill\scripts\collect.mjs" points "drawing.dxf" "$tmp\points.json" --rules "$tmp\采集规则.json"
```

2. 生成同色双线网络：

```powershell
node "$skill\scripts\collect.mjs" network "drawing.dxf" "$tmp\network.json" "$tmp\points.json" --rules "$tmp\采集规则.json"
```

3. 生成紧凑模型数据包：

```powershell
node "$skill\scripts\model-packet.mjs" "$tmp\points.json" "$tmp\network.json" "$tmp\model-packet.json"
```

4. 当前会话模型读取数据包，按 `references/model-lane-planning.md` 输出 `mine-laneway-model-plan-v1` 点序计划。

5. 物化并严格校验：

```powershell
node "$skill\scripts\materialize-lane-plan.mjs" "$tmp\network.json" "$tmp\model-plan.json" ".\巷道最终.json"
node "$skill\scripts\validate-lanes.mjs" ".\巷道最终.json"
```

6. 任一项失败时不得绘图或交付。生成整体高亮复核图：

```powershell
node "$skill\scripts\dxf.mjs" draw "$tmp\network.json" ".\巷道复核.dxf" ".\巷道最终.json"
node "$skill\scripts\dxf.mjs" inspect ".\巷道复核.dxf"
```

### 局部区域与自定义规则

先输出区域证据：

```powershell
node "$skill\scripts\region-report.mjs" "drawing.dxf" "$tmp\region.json" --region 100,200,800,900
```

根据用户要求和证据编写 `mine-laneway-rules-v1` 规则，再校验：

```powershell
node "$skill\scripts\rule-check.mjs" "$tmp\采集规则.json"
```

区域坐标和阈值全部使用图纸单位，不假定为米。

## 工具清单

| 工具 | 作用 | 关键输出 |
| --- | --- | --- |
| `scripts/collect.mjs` | `evidence`/`points`/`lanes`/`final`/`network` 多阶段入口 | 点清单、证据、双线网络 |
| `scripts/model-packet.mjs` | 压缩大模型输入，绑定源哈希 | `mine-laneway-model-packet-v1` |
| `scripts/materialize-lane-plan.mjs` | 将模型计划物化为真实巷道记录 | 最终巷道 JSON |
| `scripts/validate-lanes.mjs` | 检查双线、同色、质量、点来源、编号、标高和点是否落在边界内 | 人类可读 JSON，失败退出码 1 |
| `scripts/dxf.mjs` | 调用 Python 运行 `inspect`/`draw`/`draw-points` | 新 DXF 或结构报告 |
| `scripts/dxf_tools.py` | ezdxf 绘制块、重绘顺序、范围和活动视口 | R2010 DXF |
| `scripts/dxf_fallback.py` | 无 ezdxf 时用标准库读取和写出基础 DXF | R12 DXF |
| `scripts/run-dxf.py` | 选择已安装 ezdxf、匹配 wheel 或标准库后备 | 自动渲染后端 |
| `scripts/convert-dwg.mjs` | LibreDWG DWG→DXF | 独占创建 DXF |
| `scripts/region-report.mjs` | 矩形区域颜色、线长、测点、配对和规则建议 | `mine-laneway-region-evidence-v1` |
| `scripts/calibrate.mjs` | 用真值巷道统计点距、圆半径、标注距离和交叉规律 | `laneway-calibration-v1` |
| `scripts/rule-check.mjs` | 校验自定义规则 schema 和必需的不可放宽项 | 规则校验报告 |
| `scripts/review-page.mjs` | 对大证据文件按页输出模型审查批次 | 标准输出 JSON |
| `scripts/make-safe-preview.ps1` | 生成不超过 960×720、80 KB 的 JPEG | 图像元数据与哈希 |
| `scripts/dxf-regression.mjs` | 双线、绘制、裁剪、重绘回归 | 回归断言 |
| `scripts/smoke-test.mjs` | 合成图、坐标区、颜色、规则、模型计划等综合测试 | 本地 smoke 结果 |

## JSON 与 DXF 交付契约

最终巷道数组至少需要满足：

- `border_line_points` 恰有两条原图边线，每条至少两点；
- `boundary_line_colors` 为两个相同且非 `unknown` 的有效颜色；
- `boundary_line_sources` 恰有两项；
- `boundary_geometry_quality.valid === true`；
- `single_line_used !== true`；
- `traverse_point_array` 非空，每点有编号、标高、圆圈来源，且坐标位于同色边界范围内；
- 最终 DXF 的模型空间可见、视口和 `$EXTMIN/$EXTMAX` 位于真实坐标范围。

生成后至少核对：

```text
double_boundaries == lanes
different_boundary_colors == 0
single_line_used == 0
boundary_geometry_quality.valid == true   (每条)
```

## 代码框架

```text
mine-laneway-collection/
├─ SKILL.md                     Agent 执行规程和不可违反规则
├─ worker.js                    打开/解析、点证据、双线、模型确认事件
├─ core/
│  ├─ parse.js                  DXF、块、SPLINE/ELLIPSE、颜色继承
│  ├─ colors.js                 ACI/真彩/BYLAYER/BYBLOCK
│  ├─ survey.js                 圆圈与文字证据
│  ├─ point-inventory.js        全量有效点库存及候选边线
│  ├─ nodes.js                  点名、标高、里程插值
│  ├─ priority.js               文字唯一分配、同心圆合并
│  ├─ lanes.js                  同色双线配对、质量、裁剪和记录
│  ├─ geometry.js               成链、边界配对、偏移和去重
│  ├─ nodegraph.js              导线点路径
│  ├─ network.js                巷道网络与交叉上下文
│  ├─ region.js                 矩形裁剪
│  └─ rule-validation.js        规则 schema 和不可放宽项
├─ scripts/                     采集、区域、校准、模型计划、验证和绘制
├─ references/                  按需读取的区域、规则、模型、安全、复核文档
├─ runtime/                     LibreDWG Web WASM 与许可/来源说明
├─ vendor/wheels/               可选 Windows x64 Python 3.12 依赖
├─ agents/openai.yaml           UI/调用元数据
└─ package.json                 ESM 包声明
```

## 环境与构建

- Node.js：运行 CLI 和 Worker；
- Python 3.10+：`dxf.mjs` 在 AgentOS 运行时、用户环境和其他可用解释器中选择；
- 可用 `MINE_DXF_PYTHON` 明确指定：

```powershell
$env:MINE_DXF_PYTHON = 'C:\path\to\python.exe'
```

`run-dxf.py` 接受 Python 3.10+。优先使用当前环境已安装的 ezdxf；若 CPython 3.12 Windows x64 缺少 ezdxf，则临时使用随包 wheels；其他版本使用纯标准库后备。`MINE_DXF_RENDERER=basic|ezdxf|auto` 可强制选择后端。

## 测试状态

本次扫描：

```powershell
node .\scripts\smoke-test.mjs
```

通过，覆盖合成审查、反向点序、哈希绑定、主坐标区、同心圆、同色边界、颜色继承、区域裁剪和规则校验。

```powershell
node .\scripts\dxf-regression.mjs
```

已分别通过 AgentOS Python 3.12 + 随包 wheel，以及 Python 3.14 + 纯标准库后备。纯标准库后备生成的文件还通过了 ezdxf 读取和 AutoCAD 2020 `AUDIT`。

## 已知限制

- 图和文字不是天然可信的“导线点/巷道”证明，候选仍可能误识别或漏识别。
- 图纸单位、坐标系和比例可能未知；除非用户明确提供，不能当作米或矿区坐标。
- 模型只处理压缩候选和点序；任何越权 corridor、点复用、异色边界、无效质量和缺失字段都应被拒绝。
- 圆弧、SPLINE、块变换、代理对象、字体和外参可能导致误差或遗漏。
- `network` 必须传入测点或最终巷道 JSON，不能只凭线条猜测配对。
- 图像预览是受限辅助，不能替代 DXF 实体核验。
- 最终结果必须人工对照原图，不得用于未经复核的生产数据。

## README 维护

发版时原地更新本文件：同步 `SKILL.md` 的 `metadata.version`、默认流程、脚本清单、JSON schema、环境依赖、测试状态、示例命令和发布包哈希。父目录 README、`2.zip/mine-laneway-collection/README.md` 和总览版本表必须同步。

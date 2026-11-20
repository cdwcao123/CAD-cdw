# cad-standard-reviewer 1.3.0-preview.22 · CAD 图样标准化审查插件

本插件在 ElvesPuck 中审查用户提供规则下的 DWG/DXF 图样。它先固定规则、标准库和资料快照，再用 DXF 解析器提取图框、标题栏、明细栏、文字、标注、线型和几何证据，随后运行本地规则引擎并调用宿主模型完成分批初审与第二轮复查，输出问题卡、覆盖范围和审计记录。

> 这是预览版。模型可用性、复杂文档解析和 OCR 都可能不完整，任何结论都必须由专业人员复核。

## 版本与发布

| 项 | 值 |
| --- | --- |
| 包名 | `cad-standard-reviewer` |
| 版本 | `1.3.0-preview.22` |
| 后端 API | `backendApiVersion: 3` |
| 权限 | `engine.generate` |
| 页面 | full-page，左侧栏“CAD图样审查” |
| 最新发布包 | `2.zip/cad-standard-reviewer/elvespuck-plugin-cad-standard-reviewer-1.3.0-preview.22.zip` |

## 最新版本特性

### `1.3.0-preview.22`

- Python 运行时优先使用 AgentOS 自带 3.12，其次其他 AgentOS Python 和用户环境 Python 3.10+。
- DOCX 改为 Python 标准库解析 OOXML，OCR 改为 Windows 原生能力，不再捆绑 lxml、python-docx 或 winrt 原生包。
- 安装包体积由 preview.21 的约 10.4 MB 降至约 3.4 MB。
- 保留 preview.21 的规则适用性预检和明确错误日志。

### 当前源码中已具备的能力

- 规则库和标准库均支持 JSON、YAML/YML、CSV、TXT、Markdown、XML、HTML/HTM、RTF、PDF、DOCX、XLSX。
- 保留上传原件、解析正文、人工编辑版本和模型整理结果，历史版本不覆盖原件。
- 标准集合支持规则文件、可选标准库、原件 SHA-256、识别片段和正文版本快照。
- 规则与标准库可被多个集合引用；更新集合生成新版本，旧审查继续引用旧快照。
- 支持最多 64 MB DXF；前端分片上传，可 `gzip` 上传。
- 本地精确检查由上传规则中的 `checkType` 启用；源码中的机械规则样本仅供测试，不进入安装包。
- 模型按“资料片段 × 图纸证据片段”分批初审，再逐批向模型提供初审结果复查；每批必须回传 `coveredBatchId`。
- 模型只能补充已启用规则下的疑似问题；本地精确不符合结论不能被模型覆盖。
- 结果保存本机 JSON、索引和 NDJSON 审计；默认保留 90 天、最多 200 条审查记录，可在设置中调整。

## 使用流程

1. 打开“规则库”，上传与目标图样配套的规则文件。
2. 检查解析正文；如解析不完整，编辑并保存新正文版本，不修改原件。
3. 在“标准库”按需上传材料、公差或参考资料；标准库不是审查必需项。
4. 在“标准集合”选择规则文件、标准库和资料，保存集合版本。
5. 进入“图纸审查”，选择集合和 DXF/DWG。
6. 等待本地上传、适用性预检、本地证据提取、模型初查和模型复查。
7. 查看结论、七字段问题卡、本地初查候选、模型状态、批量进度和解析警告。
8. 导出 JSON 报告或问题表；所有发现仍须专业人员核对原图和标准原文。

已有审查不会随规则、标准库或集合的新版本自动更新。要使用新资料，必须创建新集合版本并重新审查。

## 本地规则覆盖

默认示例 `rules/v1.json` 覆盖机械二维图样，不代表客户正式标准。

| 规则 | 检查主题 | 主要对象 |
| --- | --- | --- |
| R01 | 图框边距 | 图幅、图框、装订边 |
| R02 | 标题栏字段完整性 | 名称、代号、材料、比例、版次、张次、阶段、签署 |
| R03 | 比例一致性 | 标注值与图元实测距离 |
| R04 | 明细栏与件号双向一致 | 明细栏、件号、指引线 |
| R05 | 线型与线宽一致性 | 可见轮廓、不可见轮廓、轴线、剖面线 |
| R06 | 字体与字高 | 全图文字、标题、技术要求、尺寸数字 |
| R07 | 尺寸标注三要素与符号 | 尺寸线、尺寸界线、数字、φ/R |
| R08 | 尺寸数字方向 | 竖直尺寸、斜线区 |
| R09 | 配合代号 | 基孔制、基轴制、公差带 |
| R10 | 几何公差框格 | 格数、基准、框格高度 |
| R11 | 表面结构标注 | Ra/Rz、完整符号、统一注法 |
| R12 | 材料牌号 | 明细栏材料、旧写法和企业牌号库 |

内置规则不是“通用合规认证”。上传规则可以定义 R13 等自定义编号，但未经可靠校准的语义规则只能进入待确认或模型检查，不会静默套用同编号内置逻辑。

## 工具与接口

### 前端

| 模块/操作 | 作用 |
| --- | --- |
| `index.js` | 页签、状态恢复、分片上传、批量审查、结果渲染和导出 |
| `pluginApi.storage` | 保存当前会话页签和结果摘要 |
| `pluginApi.http` | 调用插件命名空间路由 |
| `pluginApi.logger` / `showToast` | 宿主日志和用户提示 |

### 服务端路由

| 路由 | 作用 |
| --- | --- |
| `GET /health` | 模型、规则、库和存储健康状态 |
| `GET /rules`、`GET/PUT /settings` | 规则目录与阈值/保留策略 |
| `POST /uploads`、`POST /uploads/:id/chunks` | 分片上传 |
| `GET /sources`、`GET /sources/:id` | 资料原件和提取历史 |
| `PUT /sources/:id/edit`、`POST /sources/:id/recalibrate` | 人工编辑正文、模型重新整理 |
| `POST /sources/:id/preview-understand` | 对不完整预览做模型分类和不确定性说明 |
| `GET/POST/DELETE /rule-files` | 规则文件目录、导入、启停和删除 |
| `GET/POST/DELETE /libraries` | 标准库目录、导入、启停和删除 |
| `GET/POST/DELETE /standard-collections` | 集合版本 |
| `POST /standard-collections/:id/versions` | 基于固定 base version 创建新版本 |
| `POST /review` | 固定集合快照后执行审查 |
| `GET /reviews`、`GET/DELETE /reviews/:id` | 审查历史和记录 |
| `GET /logs`、`POST /logs/open`、`GET /diagnostics` | 审计、日志和诊断 |

### 解析和模型模块

| 文件 | 作用 |
| --- | --- |
| `server/analyze.js` | DXF 字节 → 解析 → 语义提取 → 规则判定 |
| `server/dxf.js` | DXF 编码、表、块、实体和坐标处理 |
| `server/extract.js` | 图幅、图框、标题栏、明细栏、件号、尺寸、FCF、粗糙度证据 |
| `server/rules.js` | 12 条本地规则与问题卡 |
| `server/llm.js` | 证据分片、模型初审/复查、JSON 校验、去重和合并 |
| `server/rule-applicability.js` | CAD/非 CAD 规则适用性预检 |
| `server/rule-import.js` | JSON/Markdown/DOCX 规则统一结构 |
| `server/library-import.js` | 材料/公差库导入 |
| `server/source-store.js` | 原件、正文版本、提取片段 |
| `server/standard-collection-store.js` | 集合版本和快照校验 |
| `server/docx-preview.js`、`pdf-preview.js`、`xlsx-preview.js` | 文档预览 |
| `server/python-runtime.js` | Python 3.10+ 自动发现与 AgentOS 优先选择 |
| `server/ocr.js` | Windows 原生 OCR |
| `server/store.js` | 设置、审查记录、NDJSON 审计和原子写入 |

## 代码框架

```text
cad-standard-reviewer/
├─ manifest.json / package.json
├─ index.js                         全页面 UI
├─ server.js                        路由、快照校验、审查编排
├─ server/
│  ├─ dxf.js + geom.js              图纸解析与几何
│  ├─ extract.js                    图样语义证据
│  ├─ rules.js                      R01–R12 本地规则
│  ├─ llm.js                        模型两阶段审查
│  ├─ rule-applicability.js         规则适用性预检
│  ├─ rule-import.js                规则导入/规范化
│  ├─ library-import.js             标准库导入/规范化
│  ├─ source-store.js               资料与正文历史
│  ├─ standard-collection-store.js  固定集合
│  └─ store.js                      设置、审查、审计
├─ skills/document-reading/SKILL.md 文档正文整理约束
├─ rules/v1.json                   示例机械图样规则
├─ libraries/                       示例材料库与公差库
├─ assets/dwg/                      DWG 转换 Worker、WASM、许可与源码说明
├─ tests/                           168 项本地测试入口
└─ 使用指南.md
```

## 规则与集合安全

- 审查时必须能从规则和标准库快照追溯原件 SHA-256、提取片段和正文版本。
- 不完整规则不能部分参与审查；批量选择规则文件时必须完整选择。
- 集合创建后不可无提示替换底层资料；旧集合缺少来源预览时，只有在原件哈希和快照一致性通过后才可恢复。
- 已修改的内置库不能继续冒充原始内置资料送审。
- 模型输入超过限制、资料不完整、输出接近上限或缺失批次确认时，状态必须为未完成/待确认。

## 测试

推荐命令：

```powershell
node --test .\tests
```

测试会自动发现 AgentOS 自带 Python，其次使用用户环境中的 Python 3.10+。DOCX 使用 Python 标准库解析 OOXML；PDF 使用随包 pypdf；Windows OCR 使用系统原生 OCR，不再按 Python 小版本捆绑原生依赖。

2026-11-20 最终回归：168 项全部通过，0 跳过、0 失败。

## 构建与发布

最新发布包已经存在，但本目录没有可用的当前构建脚本。`1.codesource/cad-inspector/build-cad-plugin.py` 的源码路径不指向本目录，且其 `INCLUDE` 清单未覆盖当前轻量运行时结构。当前不能把该旧脚本视为可复现构建。重新发版前必须：

1. 更新 `INCLUDE`，覆盖 `server.js` 的所有相对导入；
2. 纳入轻量 `vendor/python`（pypdf）、技能和许可；
3. 校验 ZIP 根目录、相对导入、文件哈希和运行时；
4. 在真实 ElvesPuck 宿主执行模型、DWG、PDF、DOCX、OCR 和集合审查验收。

## 已知限制

- DWG 需 LibreDWG 转换；状态成功不代表转换无损。
- 块展开、外参、代理对象、布局视口、字体、动态块和继承颜色可能造成误判。
- PDF/DOCX/XLSX 复杂表格、公式、图形、批注和合并单元格可能提取不完整。
- OCR 最多处理前 20 页/图片，需要 Windows x64 和对应语言包；不依赖 Python。
- 模型不是独立第三方审查者；“初查+复查”仍在同一宿主和同一模型上下文策略下，不等于外部签章。
- 结论不是合规认证，不能替代专业审查。

## README 维护

发版时原地更新本文件，并同步 `manifest.json`、`package.json`、`server.js` 的 `PLUGIN_VERSION`、新路由、规则清单、依赖、测试数量和发布包。父目录 README 与 `2.zip/cad-standard-reviewer/README.md` 同步更新版本和可交付状态。

# 大屏二三维设计工具（designerV4）系统开发文档

| 项 | 内容 |
|---|---|
| 适用代码 | `D:\Release\test\pages\designerV4`（以下所有证据路径均相对该目录） |
| 适用版本 | 2026-11 当前工作副本（package.json 版本 `0.0.0`，无 CHANGELOG，无独立版本标记；README 标题仍为 "DesignerV3"，见第 13 章） |
| 目标读者 | 第一次接触该平台的开发人员 + AI 开发助手 |
| 覆盖范围 | `src/` 主工程及根目录构建/入口配置；**不含** `2dHighEditor/` 目录、部署环境的 `pages/baseAssets` 平台资源、后端服务实现 |
| 编写依据 | 全部结论来自当前源码只读调查；关键结论附 `相对路径:行号` 证据 |

## 三态标注规范（本文所有能力结论必居其一）

| 标注 | 含义 |
|---|---|
| ✅ 已实现并有证据 | 功能可用，附 `路径:行号` 源码依据 |
| ⚠️ 已有接口但受限 | 代码/字段/接口存在，但能力、入口或适用范围受限，写明受限内容 |
| ❓ 待确认 | 证据不足，列出缺少的证据；**不得当作事实使用** |

> 本仓库内无自动化测试、无 CI 配置，文档结论的证据强度以源码实现为主；凡"运行时行为发生在平台外部（后端、MasBrowser 引擎、baseAssets 脚本）"的结论，均按 ⚠️/❓ 处理。

> **与既有文档的分工**：工作区已存在《小安易联-大屏二三维设计工具开发指南.md》，该文档基于**部署产物**（`dist/` 压缩产物）静态检查编写，主体内容是 `2dHighEditor/instance-backendless`（HT 二维底图编辑器）的二开契约，其"无源码工程"前提已不适用于本文。两份文档按以下分工使用，不存在同一主题的冲突版本：
> - **本文（源码工程侧）**：`src/` 主工程的架构、组件开发、数据机制、事件、插件、构建发布——凡需改源码的工作以本文为准；
> - **旧文（部署产物/HT 编辑器侧）**：`2dHighEditor` HT 编辑器 `custom/` 扩展契约、backendless 实例配置、产物级目录结构——凡涉及 HT 底图编辑器二开仍参考旧文（其 §1.2"无源码工程、不做源码级修改"的表述仅适用于产物场景）。

---

## 目录

1. 概述与适用范围
2. 快速开始
3. 核心概念与架构
4. 工程结构与配置规范
5. 组件开发
6. 数据机制与业务逻辑
7. 事件交互与二三维联动
8. 业务插件扩展机制
9. 权限与安全
10. 开发、构建、测试与调试
11. 发布、部署与版本管理
12. 完整示例
13. 常见陷阱与最佳实践
14. AI 开发助手工作规范
- 附录 A：后端接口速查表
- 附录 B：localStorage / window 全局变量速查表
- 附录 C：待确认问题清单（需产品/平台负责人确认）

---

## 1. 概述与适用范围

### 1.1 平台是什么

designerV4 是一个 **Vue 3 + Vite + TypeScript 前端工程**，是"小安易联"工业互联网操作系统的二三维协同设计器页面。它在一个工程内同时承载两类设计器和一类业务扩展机制：

| 子系统 | 职责 | 证据 |
|---|---|---|
| ESW 二三维组态设计器（`views/designer`） | 二维组态 / 二维 GIS / 三维组态场景编辑：图层、图元（feature）、测点绑定、地图、视口。真正的渲染与交互由外部 SDK `MasBrowser`（`baseAssets/public/MasBrowser/masBrowser.min.js`，不在本仓库）承担，本工程负责配置界面与数据编排 | `src/views/designer/index.vue:15-16`、`src/views/designer/center/renderCenter.vue:42-48`、`index.html:115-116` |
| BI 大屏设计器（`views/biDesigner`） | 数据大屏（图表/文本/表格/外部业务组件）拖拽设计，GoView 改造而来；无独立路由，与 ESW 共用 `/sceneEdit` | `src/views/designer/index.vue:82-96` |
| 业务插件机制（`src/plugins`） | 业务代码与二三维内核隔离：设备风险、作业风险插件通过 URL 参数启用，自实现业务数据保存 | `src/plugins/index.ts:30-35`、`src/views/designer/index.vue:136-140` |
| 运行态渲染器 | `preview/`（PC）与 `mbpreview/`（移动端）两个独立 HTML 入口 | `src/main.ts:46-68`、`src/router/preview.ts:5-14` |

场景（一个"大屏/组态工程"）以 JSON 形式经后端接口保存，设计态保存即对运行态生效（无独立发布门禁，见第 11 章）。

### 1.2 开发方式（按侵入性从低到高）

| 方式 | 是否需要改本工程源码 | 说明 |
|---|---|---|
| 配置式大屏搭建 | 否 | 管理页建场景 → 拖组件 → 配数据源/事件 → 保存即生效 |
| 数据源配置 | 否 | 表单（平台开放表）或自定义接口 + `parseFun` JS 解析 |
| 外部业务组件包（WebView） | 否 | 组件包经 `/package` 页面发布（`DV_CompPack`），运行期远程加载 JS/CSS（`src/packages/components/WebView/index.vue:77-149`） |
| 事件脚本 / 数据过滤器 | 否 | CodeMirror 编写 JS，运行在浏览器 `eval` 环境（见 6.4、9.2） |
| 新增内置组件 | 是 | 在 `src/packages/components` 下按 4 文件契约添加（见 5.6 checklist） |
| 业务插件 | 是 | 在 `src/plugins` 添加模块并改 `plugins/index.ts` 接线（见第 8 章） |

### 1.3 主要限制（务必先读）

1. **本工程不能独立运行**：`index.html`/`preview.html` 以 `<script>` 强依赖部署环境的 `baseAssets/baseConfig/config.js`（定义 `baseAPI` 等，index.html:72）、MasBrowser SDK、HT/OpenLayers/Metamap3D、mqtt、workers 等（index.html:69-156）。缺失时 `baseAPI` 未定义、axios 无 baseURL（`src/service/index.ts:46-48`）。
2. **三套 axios 封装并存**、两套"数据源"概念并存，命名易混淆（见 6.1、6.6，必须区分）。
3. **存在较多 GoView/历史遗留死代码**（路由守卫缺失、持久化死链、`v-auth` 坏引用等），见附录 C，勿当作可用能力。
4. README.md 内容严重滞后（标题 DesignerV3、目录树过期、示例 API 名有误），以本文档为准。

### 1.4 技术栈

Vue 3.5 + Vite 4 + TS 5.5（`package.json:54-91`）；Pinia 2（无统一持久化插件生效，见 3.6）；Element Plus 2.9；echarts 5.6 + vue-echarts 7（`package.json:36,90`）；vue-router 4（hash 模式）；axios；mitt；CodeMirror 6；keymaster；`package.json:5-13` 提供 dev/build/type-check/lint/format 脚本。Node 版本要求 v16.20.0（README.md:80）。

---

## 2. 快速开始

### 2.1 前置条件

| 条件 | 说明 | 证据 |
|---|---|---|
| Node v16.20.0 | README 指定；Vite 4 最低要求 Node 14.18+/16+ | README.md:80 |
| 可访问的后端服务 | 接口前缀 `/XAYL_Designer`（设计器 CRUD）、`/DataView`、`/DataFlow`（BI）、`/XA_*`（平台基础）、`/User/Login` 等 | 附录 A |
| `baseAssets` 平台资源 | 与本工程平级的部署目录（部署环境路径形如 `/pages/baseAssets`），提供 `baseConfig/config.js`（定义 `baseAPI`）、MasBrowser/HT/GIS SDK。仓库内 `D:\Release\test\pages\baseAssets` 有一份可参考 | index.html:69-117 |
| 本仓库的 `public/` | `projectConfig/config.js`、`projectConfig/mapConfig.js`、`workers/`、`mqtt/` 随根路径加载 | index.html:74-75,98,146-151 |

### 2.2 安装与启动

```sh
npm install        # README.md:83-85
npm run dev        # vite dev server，host 0.0.0.0，端口 3001（vite.config.ts:215-221）
npm run build      # = type-check(vue-tsc --noEmit) + vite build（package.json:6-12）
npm run type-check # 仅类型检查
npm run lint       # eslint --fix
```

**dev 模式的外部依赖解析**：`.env.development` 中 `VITE_ASSETS_URL="/"`、`BASE_URL='./'`（vite.config.ts:17 `base: './'`），即 index.html 会请求 `http://localhost:3001/baseAssets/baseConfig/config.js`。dev server **没有配置任何 proxy**（vite.config.ts:215-221 无 proxy 键），因此本地开发需自行二选一（均需你方确认后实施，本文档不修改工程配置）：

- 方式 A：把 `baseAssets` 目录放到 dev server 可服务的 `/baseAssets` 路径（如临时拷入 `public/`，注意不要提交）；
- 方式 B：修改 `vite.config.ts` 增加 `server.proxy` 将 `/baseAssets`、后端前缀转发到目标平台环境（修改需团队授权）。

❓ 待确认：团队现行标准联调方式（无仓库内证据；vite 无 proxy、无 `.env` 后端地址，说明历史上按"部署到平台环境 pages/ 目录"方式联调）。

### 2.3 入口与 URL 约定

| 入口 | URL 形态 | 参数 | 证据 |
|---|---|---|---|
| 设计器 | `index.html#/sceneEdit?sceneId={场景ID}` | `sceneId` 必需；`plugins=[1,2]` 启用业务插件（仅设计器读取） | `renderCenter.vue:43`、`views/designer/index.vue:136-140` |
| 管理页 | `index.html#/manager?componentType=pel|map|scene` | 图元/底图/场景三页签 | `views/manager/index.vue:41` |
| 数据源管理 | `index.html#/dataSource` | — | `router/index.ts` |
| 组件包管理 | `index.html#/package` | CAD 扩展资源包（CloudCad） | `views/package/index.vue:189` |
| PC 运行态 | `preview.html#/{sceneId}`（`scenePerviewUrl` 配置为 `/pages/designerV4/dist/preview.html#/`） | 场景 ID 解析顺序：`params.id` → query `id|sceneId|sceneID|ID` → hash 末段兜底；另支持 `pageId、whType=auto、w/h/hp/vp/hvp、bgColor、onePageShow、clearComponentCache、componentCachePolicy` | `public/projectConfig/config.js:15`、`views/preview/wrapper.vue:24-44` |
| 移动端运行态 | `#/{sceneId}`（mbpreview） | `platform=AP` 时设计器预览按钮打开 `sceneMbPerviewUrl` | `useSync.hook.ts:2087-2092` |

⚠️ 受限：仓库无 `mbpreview.html`，vite build input 也没有它（vite.config.ts:72-79）；`sceneMbPerviewUrl` 未在 `projectConfig/config.js` 定义（useSync.hook.ts:2091 直接引用）。移动端运行形态 ❓ 待确认。

⚠️ 不一致：vite input key `'preview/index'` 使产物为 `dist/preview/index.html`，而 `scenePerviewUrl` 指向 `dist/preview.html`——依赖部署端整理目录或重写规则，❓ 待确认部署脚本。

### 2.4 走通一个最小 BI 大屏（验证环境可用）

1. 登录：设计器页面本身无路由守卫；token 来自 `localStorage['TOKEN']`（`src/service/request/index.ts:19`）。开发引导页 `HomeView.vue:198-215` 内置 admin/123456 自动登录（**安全隐患，见 9.3，仅限开发引导**）。
2. `#/manager?componentType=scene` → 新建场景（名称查重 `useValidtorName.ts`）→ 成功后自动 `window.open(bindEditorUrl + 'sceneId=' + ID)` 打开设计器（`views/manager/managerList.vue:522-545`；`bindEditorUrl` 在 `public/projectConfig/config.js:10`）。
3. 在设计器中切到 BI 大屏模式（同页并存，designer/index.vue:15-16,82-96）→ 左侧组件面板拖入"文本"和"柱状图"→ 悬浮按钮"样式"改属性、"数据"选静态数据。
4. `Ctrl+S` 保存（快捷键绑定 `useKeyboard.hook.ts:355` → `saveAndExit`，topBar.ts:226），观察 `PATCH /XAYL_Designer/GisScene/ModifyDetail` 返回 code 200。
5. `Ctrl+P` 预览（useKeyboard.hook.ts:346 → `dataSyncPreview`，useSync.hook.ts:2067-2093），新窗口打开 `scenePerviewUrl + sceneId`。

每一步失败原因排查见第 10.4 节。

---

## 3. 核心概念与架构

### 3.1 对象模型

```
租户（CompanyID/TenantInfo，App.vue:91-107）
└── 场景分组（GisSceneGroup）
    └── 场景 Scene（GisScene）
        ├── ID / Name / Type / GroupID / CompanyID           [sceneData.d.ts:1-17]
        ├── Style: string（JSON 字符串，一个场景的全部前端数据）
        │     ├── ESW 场景样式 SceneStyle{rotate,realTimeColor,bColor,startView,isUtils} [sdkts/Scene/types.d.ts:10-18]
        │     └── Style.BIJson = ChartEditStorage（BI 大屏全部数据）[chartEditStore.d.ts:334-345]
        │           ├── editCanvasConfig（画布/平台/缩放/主题/翻页/事件…）[:73-172]
        │           ├── pageList[]（多页 + 母版机制）
        │           │     └── children[]（组件实例 CreateComponentType）
        │           ├── componentList（当前页快捷引用；保存时被删除 [:2059-2061]）
        │           └── Elementlds / Servicelist（图元与服务清单，供运行态预载）
        ├── Layers[]（场景图层，内含 Features[] 图元）
        └── ViewerGroups[]（三维视口分组）
```

场景 Type（GUID 映射，仅源码内 3 种有实现）：`1546ecdd…→1 二维组态`、`124a0f3d…→2 二维GIS`、`ff35f5bc…→4 三维组态`；**Type=3（三维 GIS）映射为空字符串**（`renderCenter.vue:72-74`）⚠️。

### 3.2 组件实例数据结构（画布上的一个组件）

权威定义 `src/packages/index.d.ts:178-249`。职责切分是本平台最重要的契约：

| 字段 | 谁消费 | 内容 |
|---|---|---|
| `attr {x,y,w,h,zIndex,offsetX,offsetY,rotate}` | 画布外壳 style | 绝对定位与尺寸（index.d.ts:187-196） |
| `styles` | 画布外壳 style | 滤镜/旋转/倾斜/混合/动画（publicConfig.ts:56-84） |
| `option` | 组件自身渲染 + 属性面板"样式"弹窗 | 组件业务配置（自由形状，各组件 config.ts 定义），含 `option.dataset{type,isFromInterface,dimensions[],source}` 数据载体 |
| `request` | 数据体系 | `RequestConfigType`，见 6.3（chartEditStore.d.ts:259-300） |
| `events {baseEvent[], eventOptions, advancedEvents?, interactEvents?}` | 事件体系 | 见第 7 章（index.d.ts:148-171,224-236） |
| `status {lock,hide,defaultHide,favorite,share,collectId}` | 编辑/运行 | 显隐与锁定（index.d.ts:64-71） |
| `chartConfig` | 注册查找 | 指回组件清单描述符（key/chartKey/conKey/package/category） |

页面实例 `CreatePageType`（index.d.ts:251-263）：`id/title/hide/lock/removable/children/hideType/interfaces/animations`；`pageList[0]` 为"母版"页（`inDesignHide` 机制，chartEditStore.ts:289）。

### 3.3 设计态 / 预览态 / 运行态

| 态 | 载体 | 数据获取 | 行为差异 |
|---|---|---|---|
| 设计态 | `index.html#/sceneEdit?sceneId=` | `GET /XAYL_Designer/GisScene/GetDetail?ID=`（service/designer/render.ts:22-28） | 撤销/重做、图层树、属性编辑；**组件数据轮询代码整段被注释**（useChartDataFetch.hook.ts:39-125），设计时是否显示真实数据 ❓ 待确认 |
| 预览 | 与运行态同 URL，从设计器 Ctrl+P 打开；先经 `dataSyncPreview` 同步数据（useSync.hook.ts:2067-2093） | 同运行态 | — |
| 运行态 | `preview.html#/{sceneId}`、mbpreview | **IndexedDB worker 缓存优先**，miss 走 GetDetail 并后台回写（`views/preview/utils/storage.ts:145-207`）；URL `clearComponentCache`/`componentCachePolicy` 控制缓存 | 无编辑 UI；组件轮询由 `UnifiedTimerManager` 统一调度（preview/suspenseIndex.vue:311-362）；大屏级事件挂载后执行（suspenseIndex.vue:483-490）；监听宿主 postMessage（`VAchangeGisDesigner/VAchangeGis`、`clearComponentCache/refreshComponent`，suspenseIndex.vue:764-780） |

### 3.4 入口分发（MPA + data-app-entry）✅

两个 HTML 共用一个 `src/main.ts`，按 `<body data-app-entry>` 三选一挂载（main.ts:46-72）：

```ts
// src/main.ts:46-72（节选）
const appConfigs = {
    app:       { RootComponent: ..., mountSelector: '#app',       router: router },
    preview:   { RootComponent: ..., mountSelector: '#preview',   router: preview },
    mbpreview: { RootComponent: ..., mountSelector: '#mbpreview', router: mbpreview }
}
const appEntry = document.body.dataset.appEntry
const currentAppConfig = appConfigs[appEntry]
```

三套 hash 路由（createWebHashHistory）：`router/index.ts`（设计/管理）、`router/preview.ts`、`router/mbpreview.ts`（后两者 catch-all `/:id(.*)*`）。**全部路由无任何守卫、无鉴权**（全 src 检索 `beforeEach|beforeResolve|beforeEnter` 0 命中，已复核）。✅

挂载后 main.ts 把 `Vue/$vue/ElementPlus/mittBus/echarts/$maslg` 挂到 window 供仓外脚本使用（main.ts:177-184）；生产环境默认禁 console（main.ts:129-133，`window.isLog=true` 可保留）。

### 3.5 运行时配置的三层来源

| 层 | 来源 | 内容 | 状态 |
|---|---|---|---|
| 平台级 | `baseAssets/baseConfig/config.js`（**仓外**） | `baseAPI`、`axiosTimeout` 兜底、`globalConfig`、`tszfRegular`、地图 key 等 | ❓ 待确认字段全集（缺该文件样本） |
| 项目级 | `public/projectConfig/config.js`（241 行） | 见 4.2 字段表 | ✅ |
| 构建级 | `.env.development/.env.production` | 仅 `VITE_ASSETS_URL`、`VITE_THREE_ASSETS_URL`、`VITE_COMPONENT_URL`（注入 HTML 模板变量） | ✅ 已复核 |

### 3.6 状态管理双体系

| 体系 | store | 风格 | 持久化 |
|---|---|---|---|
| 二三维（ESW） | `stores/designer/{designer,layer,pointlist,tool,views}`、`dataSource`、`mangager`(拼写如此)、`mapApiUse` | setup | 无 |
| BI（GoView 系） | `stores/modules/chartEditStore`（2840 行核心）、chartHistory（撤销栈上限 5，designSetting.ts:73）、chartLayout、design、setting、packages、aiChat | options | 自研 `getLocalStorage/setLocalStorage` + `StorageEnum` key（enums/storageEnum.ts） |

⚠️ `pinia-plugin-persistedstate` 与 `GlobalBiState`/`setupStore` 是死链：main.ts:89 用裸 `createPinia()`，persist 永不生效（stores/index.ts:81-90，已复核）。勿依赖 `GlobalBiState`。

### 3.7 请求层三套实例并存（必须区分）

| 实例 | 位置 | baseURL | token 头 | 返回约定 | 使用方 |
|---|---|---|---|---|---|
| A：`MRequest` 单例 `request` | `service/request/index.ts` + `service/index.ts:45-99` | 全局 `baseAPI`（仓外注入） | 小写 `token`（request/index.ts:19） | `{code,data,info}`，`code!==200` 弹错；兜底 `{State:500,…}` | `service/**`（设计器 CRUD） |
| B：`http()` | `utils/http/index.ts:12-20,95` | `(window).baseAPI`，超时 `axiosTimeout??30000` | 拦截器大写 `TOKEN`（:27）+ 函数内小写 `token`（:115）——**同请求双头** | `code==200` 过；异常**返回 `{code:200,data:{}}` 吞错**（:86-90） | `api/**`（BI 全量）、hooks |
| C：`api/axios.ts` | `api/axios.ts:6-9` | `import.meta.env.VITE_DEV_PATH/VITE_PRO_PATH` —— **.env 未定义 ⇒ baseURL=undefined** | — | `ResultEnum.DATA_SUCCESS=0` 为成功 | 少量；错误页跳转 `redirectErrorPage` 依赖未注册路由（见附录 C） |

---

## 4. 工程结构与配置规范

### 4.1 实际目录结构（README 中目录树已过期，以本节为准）✅

```
designerV4/
├── index.html / preview.html          # 双 HTML 入口（mbpreview 无入口 ❓）
├── vite.config.ts                     # MPA input(:72-79)、manualChunks(:143-203)、无 proxy(:215-221)
├── vite/plugins/autoImport.ts         # vue/vue-router/pinia + src/hooks/** 全局自动导入
├── build.py                           # 打包脚本（存在缺陷，见 11.2）
├── public/
│   ├── projectConfig/config.js        # 项目运行时配置（见 4.2）
│   ├── projectConfig/mapConfig.js     # 全局 mapSelect：瓦片/倾斜摄影/数据引擎服务清单
│   ├── workers/manager-worker.js      # 请求调度 Worker（getWorker，:585）
│   └── mqtt/mqttws31.min.js           # Paho MQTT
└── src/
    ├── main.ts / App.vue              # 入口分发 / 平台桥接（主题、用户、租户）
    ├── router/{index,preview,mbpreview}.ts
    ├── views/
    │   ├── designer/                  # ESW 设计器（top/left/center/right）
    │   ├── biDesigner/                # BI 设计器（top/left/center，无独立路由）
    │   ├── preview/ mbpreview/        # 运行态渲染器
    │   ├── manager/                   # 图元/底图/场景管理（componentType 三页签）
    │   ├── dataSource/                # 数据源（GisSubSystem）管理
    │   ├── package/                   # CAD 扩展资源包管理（≠ BI 组件包页面接口）
    │   └── template/                  # AI 知识库大屏模板（Gis_aiknowledge）
    ├── packages/                      # ★ 画布组件库（index.json + components + public + chartConfiguration）
    ├── components/                    # 设计器业务 UI/属性面板控件（无画布组件）
    ├── plugins/                       # 业务插件（index.ts 桥 + equipment/job）+ Vue 插件(highlight/icon)
    ├── service/                       # axios 实例 A 及设计器接口封装
    ├── api/                           # 实例 B 的 BI/平台接口清单
    ├── stores/                        # Pinia 双体系
    ├── hooks/ enums/ settings/ utils/ types/ typings/ directives/ assets/ styles/
```

### 4.2 `public/projectConfig/config.js` 字段表（运行时全局 var）✅

| 字段（行号） | 含义 | 主要消费点 |
|---|---|---|
| `axiosTimeout = 60*1000`（:2） | 请求超时 | service/index.ts:48、utils/http/index.ts:16 |
| `isFileAuthority=false`（:7） | 图片是否走鉴权接口取图 | managerConfig.vue:441 |
| `isCardAnimation=false`（:9） | 图元卡片动画开关 | — |
| `bindEditorUrl`（:10） | 绑点编辑器/设计器打开地址（新建场景后 window.open 用） | managerList.vue:543 |
| `modalEitorUrl`（:11）/`htEitorUrl`（:12） | 三维底图编辑器 / HT 高图编辑器（2dHighEditor）地址 | — |
| `CADFileDownUrl`（:13） | CAD 采集工具下载包 | — |
| `scenePerviewUrl='/pages/designerV4/dist/preview.html#/'`（:15） | 场景预览地址 | topBar.vue:322、useSync.hook.ts:2089 |
| `ProductManualUrl`（:16） | 使用手册 PDF | — |
| `projectType='colliery'`（:18） | 行业类型 | 多处业务分支 |
| `isLog=true`（:19） | 生产是否保留 console | main.ts:129-133 |
| `showRelationTab=true`（:20） | 右侧"关系"页签开关 | right/index.vue:90 |
| `isRestrictBorderline=false`（:21） | 拖拽边界限制 | useDrag.hook.ts:281 |
| `EditMode="normal"`（:22） | 编辑模式 | designer/index.vue:199、center/ts/event.ts:15-33 |
| `useGradingAlarm=true`（:24） | 分级报警开关 | right/datainfo/dataSourceTool.ts:38 |
| `fontFamily/predefineColors/predefineNoAlphaColors/repeatImageList`（:37-125） | 字体、调色板、平铺贴图清单 | 属性面板 |
| `tipText/BindTextSet`（:135-201） | 提示文案、测点绑定文本 | — |
| 注释的按钮权限说明（:202-241） | `btn_add/btn_edit…` 权限 key 约定（文档性注释） | — |

字段约束：这些是 `var` 全局，无 schema 校验；`env.d.ts:24-27`、`src/types/global.d.ts:13-25` 只做 TS 声明。新增字段必须同时补类型声明，否则 vue-tsc 报错。

`mapConfig.js`（353 行）定义全局 `mapSelect`：`mapNotWork`（在线瓦片清单）、`qxmx`（倾斜摄影）、`sjcjfw`（数据引擎服务）、`dataServerTypeList`（巷道/工作面）、`cadqpfw` 等，被"底图管理"新增底图弹窗消费（`views/manager/components/mapConfig/addMap.vue:271-281`）。

### 4.3 场景 JSON 契约（配置格式核心）✅

- 保存载荷 `Partial<SceneData>`：`{ID, Name, Type, GroupID, Style:string, CompanyID, Layers[], ViewerGroups[], operation?}`（`src/types/masBrowserTsType/typings/sceneData.d.ts:1-17`）；`operation` 0 增/1 改/2 删（图层内 Feature 同理，PATCH 前置处理见 service/designer/render.ts:48-67 的注释与实现）。
- `Style` 是 **JSON 字符串**（不是对象）：先 `dataBIJsonUpdate` 组装 `style.BIJson` 再 `JSON.stringify`（useSync.hook.ts:1861-2064，关键行 2056-2064）。
- `BIJson` 保存时**删除 componentList**（useSync.hook.ts:2059-2061），运行态从 `pageList[].children` 派生（chartEditStore.ts:298-309）——二开时缓存一致性注意点（第 13 章陷阱 6）。
- 类型入口：`ChartEditStorage`（chartEditStore.d.ts:334-345）、`EditCanvasConfigType`（:73-172，含 `width/height/background/backgroundImageId/previewScaleType/activePageId/sceneId/isCooperate/loadingConfig/platform/themes/events`）。

### 4.4 tsconfig 与自动导入

- `paths`：`@/*→src/*`；`/#/*→types/*` 指向不存在的顶层 types（遗留 ❓）（tsconfig.json:18-22）。
- `unplugin-auto-import`：vue/vue-router/pinia API + **`src/hooks/**` 全部导出**成为全局符号（vite/plugins/autoImport.ts:4-19，产物 auto-imports.d.ts）。新增 hooks 文件会被全局注入，命名需避免冲突。
- `unplugin-vue-components`：Element Plus 与 `src/components` 自动注册（vite.config.ts:21-23，产物 components.d.ts）。

---

## 5. 组件开发

### 5.1 组件体系总览 ✅

**画布组件只存在于 `src/packages/components/`；`src/components/` 全部是设计器业务 UI / 属性面板控件，不可拖入画布**（证据见调查：EditComponent 只按 `chartConfig.chartKey` 渲染 packages 组件）。

组件注册是三层机制，没有手写映射表：

1. **构建期 glob 映射**：`import.meta.glob` 收集 `components/**/config.vue`、`**/index.vue`、预览图（packages/index.ts:6-14）；**注册表 = 目录结构，组件 key = 目录名**（:59-85）。
2. **配置类动态 import**：`createComponent` 按 `包/分类/key` 懒加载 `config.ts` 并 `new`（:25-52）；`redirectComponent`（`'包/分类/键'`）支持复用其他组件的配置（:43-49）。
3. **Vue 全局注册**：`componentInstall(key, node)` 经 `window['$vue'].component(...)` 运行期注册（utils/components.ts:7-11；调用点 useSync.hook.ts:204-224、preview/hooks/useComInstall.hook.ts:15-32）。

左侧组件列表数据源是 `src/packages/index.json`（分组数组 → list 项），与 `packagesList`（packages/index.ts:17-21 聚合，仅 packagesStore/AI 面板反查预览图用）**并存可能漂移**（第 13 章陷阱 4）。清单项字段：

```json
{ "key": "BarCommon", "chartKey": "VBarCommon", "conKey": "VCBarCommon",
  "title": "柱状图", "category": "Bars", "categoryName": "柱状图",
  "package": "Charts", "chartFrame": "echarts", "image": "bar_x.png" }
```
（packages/index.json:344-354；类型 `ConfigType` index.d.ts:19-48。**没有** `name/config` 字段，显示名是 `title`；`chartFrame`：`echarts`/`common`。）

分类三级：package（`PackagesCategoryEnum`，index.d.ts:273-294：Charts/Tables/Informations/Photos/Icons/Decorates/WebView/Three——其中 Photos/Icons/Decorates 为遗留枚举 ⚠️，Three/WebView 不进 index.json、经素材/组件包拖入）→ category（包内枚举，如 Bars/Pies/Lines/Scatters/Mores）→ index.json 顶层分组。

### 5.2 单组件 4 文件契约 ✅

以 `Charts/Bars/BarCommon`（echarts 图表）与 `Informations/Texts/TextCommon`（普通组件）为参照：

| 文件 | 职责 | 关键契约 |
|---|---|---|
| `index.ts` | 清单描述符 `ConfigType`（key/chartKey/conKey/package/category/chartFrame…） | BarCommon/index.ts:4-14 |
| `config.ts` | 实例默认值：`option`（含 dataset）、`events.eventOptions`、`export default class Config extends PublicConfigClass`；echarts 类用 `echartOptionProfixHandle(option, includes)` | BarCommon/config.ts:8,48-190,201-207；TextCommon/config.ts:82-138,179-184 |
| `index.vue` | 渲染组件（注册名 `chartKey`）。props 只有 `chartConfig/themeSetting/themeColor`；只消费 `chartConfig.option/request/events`；echarts 类内部 `use([...])` 按需注册并 `<v-chart :option>`；交互回调统一调 `commonMethods(props.chartConfig,'Click',data)` | BarCommon/index.vue:19-55,417-423,462,487-489 |
| `config.vue` | 属性面板（注册名 `conKey`）。props `optionData` 双向绑定实例 `option`，用 `@/components/FormItem` + `Pages/ChartItemSetting` 公共控件 | BarCommon/config.vue:7-129 |

数据流（option → 渲染）：拖拽 `dragStart` 先 `componentInstall` 再 dataTransfer（ChartsItemBox/index.vue:84-92）→ drop `createComponent` → `chartEditStore.addComponentList` → `<component :is="chartConfig.chartKey" :chartConfig="item">` 响应式渲染（EditComponent/index.vue:25-43）；属性面板 `<component :is="conKey" v-model:optionData="targetData.option">`（ChartSetting/index.vue:50）。

### 5.3 属性面板实际结构（与常见"四 tab"认知不同）✅

选中组件后是**画布悬浮按钮 + 弹窗**："样式"（基础表单 + 组件私有 config.vue）/ "事件"（基础事件 + 内嵌"高级事件"脚本区）/ "动画"（仅 lottie 图元出现）；**"数据"是独立弹窗**（静态/请求/公共三选一，写回 `option/request/filter`，ChartData/index.vue:266-270）。⚠️ 所谓"高级 tab"不存在，`advancedEvents` 当前**存了也没人执行**（消费方 ChartEventScreenHandle 已注释停用，ChartEvent/index.vue:19,29）。

### 5.4 数据驱动组件的两种模式

- 新约定（推荐）：组件内 `getRefresh` 调 `interfaceProcessing(props.chartConfig)` + `showDataProcessing`，并订阅 `mittBus.on(id+'getRefresh')`（BarCommon/index.vue:417-423,487-489）。
- 旧模式 `useChartDataFetch`：设计态轮询段整体注释（hook 39-125），且 `echartsUpdateHandle` 仅 `chartFrame===ECHARTS` 生效——**新组件不要用旧 hook**（第 13 章陷阱 7）。

### 5.5 外部业务组件（WebView 组件包）✅

不动本工程源码的扩展路线：

- 发布/管理：`/package` 相关接口 `DV_CompPack` 的 `SaveForm/PackRelease/GetPackVersionList/VersionRollBack/PackExport`（api/package/index.ts:10-26）。⚠️ 注意 `views/package` 页面本身是 CAD 扩展资源包（CloudCad/Cad_package，views/package/index.vue:189 + service/cadPackage），BI 组件包由设计器内 `ChangeComponentPackage` 弹窗管理，但该弹窗当前**无调用方**（附录 C）。
- 设计器加载：`ChartsOptionContent/index.vue:69-113` 拉用户已安装包+包内控件，转成 `{package:'WebView', chartKey:'VWebView', dataset:{id,name}}` 清单项追加到左侧；刷新通道 `mittBus('ComponentPackageListRefresh')`（:120-126）。
- 运行期：按 `dataset.ID/name` 远程取 `ControlJs/ControlCss` 并编译注册（WebView/index.vue:77-149），IndexedDB 缓存 + 并发锁（componentCodeCache.ts/componentLoadLock.ts）；编译出的工厂组件接收 `chartConfig/showDataProcessing/interfaceProcessing/commonMethods/themeColors` props；主题色经 `mittBus('themeColorChange')` 下放。

### 5.6 新增内置组件 checklist（参照 BarCommon / TextCommon）✅

| # | 操作 | 文件 |
|---|---|---|
| 1 | index.json `list` 加清单项（8 个必填字段） | `src/packages/index.json` |
| 2 | 预览图放 `src/assets/images/chart/`，文件名 = `image` 字段 | — |
| 3 | 建目录 `src/packages/components/{Package}/{Category}/{Key}/`（**key=目录名**） | — |
| 4 | `index.ts` 描述符 `export const XxxConfig: ConfigType` | 参照 BarCommon/index.ts |
| 5 | `config.ts`：option+events+`class Config extends PublicConfigClass`；echarts 类 `echartOptionProfixHandle` | 参照 config.ts:201-207 |
| 6 | `index.vue` 渲染组件（见 5.2 契约；事件调 `commonMethods`） | — |
| 7 | `config.vue` 属性面板（props `optionData`） | — |
| 8 | 在分类聚合 `…/{Category}/index.ts` 数组追加描述符 | Bars/index.ts |
| 9 | 仅新增包/分类时扩 `PackagesCategoryEnum/Name`、包内 `index.d.ts` | index.d.ts:273-307 |
| 10 | 需要接口数据：按 5.4 新约定接 `interfaceProcessing` + `mittBus` 刷新 | Radar/index.vue:296 为旧模式反例 |
| 11 | 验证：左侧可搜 → 拖拽/双击上屏 → 样式弹窗生效 → 数据弹窗静态/接口切换 → `preview.html` 运行态渲染一致（预览端独立注册组件） | — |

### 5.7 echarts 封装约定 ✅

渲染委托 `vue-echarts`；每个图表组件在自己的 index.vue `use([...])` 按需注册（echarts/core）；入口全局副作用注册 `echarts-liquidfill`、`echarts-gl` 并把 echarts 挂 window（main.ts:6-8,184）⚠️ 但当前组件库无任何组件使用 liquidFill/scatterGL series——注册了不等于有用。主题合并 `mergeTheme`、公共轴配置 `packages/chartConfiguration/echarts`；数据更新 `vChartRef.setOption(option,{replaceMerge:['dataset','series']})`（BarCommon/index.vue:395）。

---

## 6. 数据机制与业务逻辑

### 6.1 两套"数据源"概念（严禁混淆）✅

| | 机制 A：图元数据源 | 机制 B：组件请求配置 |
|---|---|---|
| 对象 | `GisSubSystem`（数据库开放表或自定义接口） | 每个 BI 组件的 `request: RequestConfigType` |
| 管理入口 | `#/dataSource` 页面 | 组件"数据"弹窗 |
| 用途 | 给 **2D 场景图元**绑业务表/接口，驱动图元状态、动画、实时值 | BI 大屏图表/表格取数、字段映射、轮询、MQTT |
| 服务层 | `service/dataSource`（实例 A） | `utils/biHttp.ts` + Web Worker |
| 详见 | 6.6 | 6.2–6.5 |

### 6.2 BI 组件请求配置字段（RequestConfigType）✅

`chartEditStore.d.ts:259-300`；默认值 `packages/public/publicConfig.ts:12-38`（默认 `requestDataType:STATIC=1`、GET、`requestRefreshNumber:1`）。核心字段：

| 字段 | 说明 |
|---|---|
| `requestDataType` | 1 静态 / 2 接口 / 3 公共接口(数据池)（enums/httpEnum.ts:16-23） |
| `requestContentType` | `'api'` / `'mqtt'`（:25-30） |
| `requestUrl` | 支持 JS 反引号模板字符串（见 6.3） |
| `requestParams{Params,Header,Body{form-data/json/…}}` | 参数值支持动态取值（见 6.3 参数来源） |
| `requestInterval`(秒)+`requestIntervalUnit` | UI 固定"秒"，min0 max1000（ChartDataRequest/index.vue:224-234）；分/时/日仅在疑似弃用的数据池 hook 生效 ⚠️ |
| `requestMqttContent{MQTTtopic,MQTThostname,MQTTport,MQTTUser,MQTTPwd,…}` | MQTT 配置 |
| `requestSQLContent.sql` | ⚠️ 字段与 SQL 编辑器存在，但取数主链路不消费 SQL——**没有 SQL 直连能力**（biHttp.ts customizeHttp 无 SQL 分支） |
| `isPublic/publicId/publicName` | 公共接口（数据池）订阅 |
| `responseFields/responseContent` | 响应参数结构 |
| 组件实例顶层 `filter` | 数据过滤器脚本（6.4） |

### 6.3 取数主链路（真实执行路径）✅

```
组件 getRefresh
 → interfaceProcessing(targetData)          hooks/useChartDataProcessing.hook.ts:84
    ├─ api  → designerCustomizeHttp(biHttp.ts:574-731)  缓存键 pondId:method:url:params，
    │        TTL 300s，并发上限 5，同键订阅复用（:455,425-431,640-648）
    │        → customizeHttp(biHttp.ts:276)：
    │           URL = new Function('return `'+requestUrl+'`')()   ← 反引号模板求值（:339，已复核）
    │           headers['token']=localStorage.TOKEN（:353-355）
    │           前缀 = window[requestDataPondId]（数据池服务地址，未配则报"请配置xx服务地址"，:360-371）
    │           实际请求 → window.getWorker(host).addRequest(...)（public/workers/manager-worker.js:585）
    └─ mqtt → MqttCall → mittBus 分发（见 6.5）
 → resDataProcessing / showDataProcessing（:182-297）：按 dimensions 做
    "远程字段 interfaceField → 默认字段 defaultField" 映射与 dataType 归一
 → 组件 setOption / 重绘
```

请求参数取值来源（`withData`，biHttp.ts:87-264）✅：`localCache`（localStorage，支持 `a.b.c` 路径）、`fixed` 固定值、`function` 系统变量（TOKEN/用户 ID/部门 ID/各类日期，`RequestFunction/functions.ts:1-227`）、`component`（取其它组件当前值/dataset）、`urlparam`（URL query）；参数值以 `javascript:` 开头时按 `new Function` 求值（translateStr :54-85）。**这就是平台的"变量"机制——没有独立的全局变量表。**

### 6.4 数据过滤器 vs 脚本事件（README 易误导，已复核修正）✅

| | 数据过滤器（filter） | 事件"执行脚本"（scriptCode） | 事件"数据请求"回调 |
|---|---|---|---|
| 编辑处 | 数据弹窗 `MasCode`（ChartDataAjax/index.vue:40） | 事件表单 CodeMirror（editEvent.vue:181） | editEvent.vue:269 |
| 执行处 | `newFunctionHandle`：`eval(filter)` 后 **仅传 `fn(data)`**（utils/utils.ts:183-184） | `eval(scriptCode)` 后 `newFunction(chartEditStore.getPageList, chartEditStore)`（useLifeHandler.hook.ts:557-562） | 请求成功后 `newFunction(res.data, chartEditStore)`（:214-220） |
| 默认模板 | `filter(data)`（CodeMirror/index.vue:72） | `(pageList,chartEditStore)=>{}`（editEvent.vue:693） | `(data,chartEditStore)=>{}`（editEvent.vue:690） |

**README.md:142-177 的示例属于第三类"数据请求回调"**，不是数据过滤器；且示例中 `chartEditStore.getPageList()` 以方法调用是错的——`getPageList` 是 pinia getter **属性**（chartEditStore.ts:236-238），正确写法 `chartEditStore.getPageList`。README 提到的 `getComponentById/updateComponent` **不存在**，实际为 `findComponentById`/`getIdByComponent`/`updateComponentById`/`updateComponentList`（chartEditStore.ts:823,1126,760）。

脚本可访问的 chartEditStore API：getter `getPageList/getComponentList/getTargetChart/getEditCanvasConfig…`（:232-273）；action `setPageList/addPageList/removeComponentList/updateComponentById/setHideComponentById/getCommonMethods/downloadFile…`（:289-2804 区间）。

⚠️ 安全边界：脚本/过滤器/URL 模板全部走 `eval`/`new Function`，权限 = 设计器使用者，见 9.2。

### 6.5 静态数据、轮询与 MQTT ✅

- 静态/远程是**开关关系不是合并**：`requestDataType>1` 走远程，`==1` 用 `option.dataset.source`（组件 watch，如 BarCommon/index.vue:466-481）；"合并"仅指远程缺字段时回落 `defaultData/defaultField`（showDataProcessing :226-272）。
- 轮询编排（运行态）：收集 `requestInterval>0 && requestDataType>1 && !status.hide` 组件 → `UnifiedTimerManager.updateTimers` → `mittBus.emit(id+'getRefresh')`（preview/suspenseIndex.vue:311-362；组件 onMounted 订阅、onUnmounted 注销）。默认全局间隔 30s（designSetting.ts:64-67）。
- MQTT：`requestContentType='mqtt'` → `MqttCall`（Paho，utils/mqtt.ts:52；库由 preview/index.html 引入 mqttws31.min.js）；消息 `mittBus.emit('host/port/topic')` 通知组件；断线重连与多 topic 复用长连接（mqtt.ts:17-49,63-100）。
- ⚠️ WebSocket/Socket.IO 作为数据推送：仓内**无直接实现**；三维场景专属实时通道 ❓ 待确认（在 MasBrowser 引擎侧）。

### 6.6 图元数据源（机制 A）契约 ✅

管理页三步表单：基本信息 → 显示规则 → 实时数据绑定（views/dataSource/components/sourceDetail.vue:19-37）。

- 类型 `BindCode`：`table`（绑定平台开放表 `XA_Base/XABaseTableRights/GetList` + 字段权限过滤 `IsOpen`）或 `interface`（BindTable 置 'noTable'，接口子表单 portForm）——sourceDetail.vue:55-90,386,524-525。
- 接口子表单 `OtherShowFieldInfo`（types/dataSource/types.ts:89-103）：`{url, type(GET/POST/PUT/PATCH/DELETE), params(JSON 文本，支持 {BindField} 占位), paramsType(JSON/FORM), fields[], parseFun, driveField?}`；令牌 `useSystemToken` 或第三方 tokenString **仅测试用不落库**（portForm.vue:17-24,154-157）。
- `parseFun`：JS 函数，默认 `function parseFun(data){ if(data.code===200){return data.data} }`（sourceDetail.vue:315）；测试请求成功后 `eval(parseFun+'(returnData)')` 回填字段列表（portForm.vue:176-234）；运行期同样 eval（right/datainfo/dataSource.vue:422）。
- 落库：`OtherShowField/DriveField` **JSON.stringify 成字符串**存字段，读取时 parse（sourceDetail.vue:527-531,574-592）。
- CRUD：`/XAYL_Designer/GisSubSystem[Group]/{GetList,Create,Modify,Delete,SetOrder}`（service/dataSource/index.ts:24-183）。

---

## 7. 事件交互与二三维联动

### 7.1 三套事件体系总表 ✅

| 体系 | 配置入口 | 触发类型 | 存储位置 | 运行时执行者 |
|---|---|---|---|---|
| ESW 图元事件 | 右侧"事件"tab（featureEvents.vue/eventBase.vue） | 仅 `leftClick`/`rightClick`（eventBase.vue:5-8）+ 右键菜单 showMenu | `feature.Events`（JSON 字符串，designerStore.setFeatureProperty，featureEvents.vue:171,187）；契约 `EventDesc{type,action}`（types/designer/rightPanel.d.ts:23-39） | ⚠️ **外部 MasBrowser 引擎**（menuEvent/eventType，types/masBrowserTsType/…/api.d.ts:160,327-332）；内置函数库 `masEditEventList.js/masInnerFunction.js` 为仓外资源（index.html:89-90） |
| BI 组件事件 | 组件"事件"弹窗（ChartEventBaseHandle） | `Click/Mouseenter/Mouseleave`（双击与生命周期触发已注释停用，index.ts:19-52）；组件可自带 eventOptions（如二三维场景组件 Load/featureClick/rClick/lDbClick/mapClick/zoomLevelChanged，BrowserDataConfig.ts:37-45） | `component.events.baseEvent: EventInterface[]`（index.d.ts:148-171,224-236） | `commonMethods(chartConfig,type,row)` → `singleEventAction`（useLifeHandler.hook.ts:758-771,319-755） |
| 大屏级事件 | 画布设置（CanvasPage/index.vue:317-325） | `vnodeMounted 加载完成`、`sceneAssociationButton 场景关联按钮`；**无定时器触发** | `editCanvasConfig.events`（:275-281） | 预览挂载后 `executeScreenEvents`（preview/suspenseIndex.vue:483-490） |

### 7.2 BI 动作类型全清单 ✅

`ChartEventBaseHandle/index.ts:54-114`，执行体 `useLifeHandler.singleEventAction`：

| 动作 | 说明 / 关键行为 |
|---|---|
| `openLink` 打开链接 | 打开方式 dialog(iframe 弹窗，经 `mittBus('masIframeDialogChannel')` → 全局 IframeDialog)/pageJump/newWindow/modalwindow/platformPageJump；非 http 地址被强补 `http://`（:425-427 ⚠️ https 站点混合内容）；参数 `{var}` 取 `window[var]`（:388-398） |
| `pageJump` 场景跳转 / `goBackPage` 返回上一场景 | 页历史在 chartHistoryStore.pageJumpHistory；⚠️ **goBackPage 分支缺 `break`，会贯穿执行 dataLinkage**（useLifeHandler:508-521，已复核，第 13 章陷阱 3） |
| `dataLinkage` 数据联动 | `mittBus.emit(targetId+'getRefresh', params)`；范围 all/指定组件；公共接口(requestDataType==3)联动同接口订阅组件；分页组件重置 page=1（:521-556） |
| `script` 执行脚本 | `eval(scriptCode)(getPageList, chartEditStore)`（:557-562） |
| `dataSubmission` 数据请求 | 先请求再执行回调脚本 `(data,chartEditStore)`（:211-220）——README 示例的宿主 |
| `componentByValue` 组件传值 / `componentHiding` 组件显隐(show/hide/toggle) / `positionChange` / `colorChange` 色系变化 | 显隐对 `key==='Popup'` 组件联动内部组件（:247-251） |
| `configurationLinkage` 组态联动 | `mittBus.emit('mas${componentId}LinkageChannel',{function,params})` → 场景组件实例方法（7.3） |
| `ExecuteComponentEvents` 执行组件的事件 | `mittBus('ActiveCommonMethods')` → 目标组件 commonMethods（chartEditStore:2784-2791 ↔ preview/suspenseIndex.vue:713-735） |
| `uploadFile` 下载文件 / `closeChartScroll`/`openChartScroll` 图表动画开关 | :741-752 |

### 7.3 BI → 三维场景指令 ✅

动作配置提供白名单 `threeFunctionOptions`（ChartEventBaseHandle/index.ts:189-287，**拼写原样保留**）：`scnenChange 切换场景`、`getRealTimePosition 获取人员位置`、`startTrack/destorytTrack 轨迹回放`、`zoomToFeature 定位至元素`、`setLayersVisibility`、`setFeaturesVisibility`；另有 `configurationLinkageOptions`（:148-157）`pelPositioning 图元定位`、`sceneChange 场景切换`。执行链：LinkageChannel → `MasBrowserRef[function](params)`（preview/suspenseIndex.vue:706-711，组件 id 固定 `masBrowserId`）。引擎方法全集见 `src/types/masBrowserTsType/src/MasBrowserTsType.d.ts`（gotoView L43、zoomToFeature L112、setFeaturesVisibility L90、addPopup L20、menuEvent L71 等）——运行时实现在仓外 min 包 ⚠️。

三维 → 二维：场景组件自身 `events.baseEvent` 由 MasBrowser 组件内部触发 `commonMethods`（commonMethods 以 prop 注入：preview/suspenseIndex.vue:18,48；WebView 工厂组件同样注入）。

### 7.4 跨页面/宿主通信 ✅

| 通道 | 用途 |
|---|---|
| `mittBus`（window.mittBus） | `${id}getRefresh` 联动刷新、`masIframeDialogChannel`、`mas${id}LinkageChannel`、`ActiveCommonMethods`、`themeColorChange`、`ComponentPackageListRefresh` 等 |
| `emitter`（utils/mitt.ts） | 设计器内部（setSize、rightIconTypeClick、SceneBindCodeChange）⚠️ 与 mittBus 两总线并存 |
| `window.postMessage` | 与宿主平台：APP 跳应用 `childApplyJumpMenu`（useLifeHandler:413-423）、`platformPageJump`（:475-482）；接收 GIS 数据下发 `VAchangeGisDesigner/VAchangeGis` 与缓存清理通知（preview/suspenseIndex.vue:764-780） |
| `BroadcastChannel('masMessageChannel')` | 平台多页签主题消息（App.vue:19,109-118） |

### 7.5 事件体系的已知停用/死路径 ⚠️

- `EventModel`（monaco 版多函数编辑器）停用，仅其 code.vue 被数据过滤器复用；`advancedEvents`（渲染前后脚本）无执行方；`useChartInteract`/`InteractEvents` GoView 遗留无调用（第 13 章陷阱 9）。

---

## 8. 业务插件扩展机制

### 8.1 真实机制（README 表述需修正）✅

- 启用方式：**hash 路由的 query 参数**，形如 `#/sceneEdit?sceneId=xxx&plugins=[1,2]`，值 JSON 数组解析后存 store（views/designer/index.vue:136-140 + stores/designer/designer.ts:38-39,53-55）。不是"解析 URL 哈希识别"，也不是运行时动态插拔。
- 注册表是硬编码数字 ID：`pluginNames = { equipmentRisk: 1, jobRisk: 2 }`（plugins/index.ts:30-35）；分发用 if/else。插件代码与平台**编译期强耦合**（直接 import 平台内部模块），无沙箱、无 SDK 注入、无外部加载能力。

### 8.2 生命周期钩子与接线点 ✅

| 钩子（plugins/index.ts） | 平台调用点 | 语义 |
|---|---|---|
| `handelDragEnd(feature): boolean`（:42-54） | center/ts/event.ts:182-184：`if(!handelDragEnd(feature)) saveAndElement(feature)` | 返回 true = 业务接管，**图元不写平台图元库**，几何数据由插件塞进业务表 Feature 字段（job.ts:170） |
| `handelRemove(): boolean`（:59-68） | right/ts/index.ts:163-165 | 删除元素时清插件缓存 |
| `handelSceneSave()`（:85-92） | topBar.ts:247-250：场景 PATCH 成功后 `await` | 插件在此落库自己的业务数据（README"业务代码需自己实现保存"的确切含义） |
| `handelSceneLoad()`（:73-80） | **无任何调用方** ⚠️ | 定义存在但场景加载后不会自动执行业务数据加载（第 13 章陷阱 10） |
| `showStyle/showDate/showEvent/showProperties/showRelation` computed | right/index.vue:113-118 等 | 插件元素屏蔽平台右侧页签；`showAnimation/showOther/rightPlugin1/showRightPlugin1/rightPlugin1Name` **未被消费** ⚠️（plugins/index.ts:99-118） |

插件可用 API：`getEngine()`（三维/二维引擎）、`designerInfoStore`、`request`（实例 A）、`window.commonUtils`、Element Plus（job.ts:1-4 即 import 清单）——**没有** app/router/chartEditStore 级注入点。

### 8.3 参照模板：job 插件骨架 ✅

```
src/plugins/job/
├── job.ts                  # featureCaches: Map<图元ID,{feature, option:'add'|'edit'|'delete'|'none', ...}>
│   ├── handelJobDragEnd     # 上图：引擎 createMark/createModel；不在风险区域内则 removeObjectByGuid 回滚（:66-84）
│   ├── getJobCache/setJobCache/deleteJobCache（:109-126）
│   ├── saveJobs → POST /Riskdata/Risk_Operation/SaveList（:147-190）   ← 业务自实现保存
│   ├── getJobAPI → GET /Riskdata/Risk_Operation/GetList（:195）
│   ├── loadJobs（:234）
│   └── showJobStyle/Data/…/Plugin computed（:238-246，命中缓存→屏蔽平台页签并显示插件面板）
├── JobLeftPlugin.vue / JobRightPlugin.vue / JobCenter.vue
```

⚠️ 当前版本 `*LeftPlugin.vue` 无挂载点（views/designer/index.vue:31-40 未含插件左栏），`activeLeftBar==='jobRisk'` 分支实际不可达；新建插件若需左栏，要自行接线。

### 8.4 插件边界汇总

1. 仅设计器生效：`route.query.plugins` 只在 views/designer 读取；**预览/运行态不加载插件**（业务运行时数据加载途径不在本仓 ❓）。
2. 保存必须业务自理（见 8.2）；平台只存场景 JSON。
3. `handelSceneLoad` 无调用方，若需"场景加载后拉业务数据"必须自行补接线。
4. 无版本管理/外部加载/隔离——插件等同平台源码一部分。

---

## 9. 权限与安全

### 9.1 平台强制 vs 前端约定 ✅/⚠️

| 层 | 事实 | 状态 |
|---|---|---|
| 路由级鉴权 | **不存在**：无任何守卫、meta、token 校验 | ✅（已证实缺失） |
| token | `localStorage['TOKEN']`；注入头小写 `token`（service/request/index.ts:19、utils/http/index.ts:115、biHttp.ts:354、worker manager-worker.js:74）；实例 B 拦截器另加大写 `TOKEN`（:27）→ 同请求双头，**后端以哪个为准 ❓ 待确认** | ✅ 现象 / ❓ 后端行为 |
| 401 处理 | 未见统一 401→登录跳转；错误页路由未注册（第 13 章陷阱 8） | ⚠️ |
| 按钮权限 | `GET /Module/GetModuleAuthority`（api/auth/index.ts + service/manager/function.ts:29）→ `useModuleAuthority.ts` 写 `mangagerStore.optAuth`；key 约定注释见 config.js:202-241；**localhost 视为全权限**（useModuleAuthority.ts:15-45，生产行为 ❓） | ✅ 机制 / ❓ 边界 |
| 数据权限 | 数据源"开放表/字段"由平台接口 `XABaseTableRights/GetList`、`GetXA_BaseTableFieldRightsList` 下发（IsOpen 过滤）——表/字段级权限由**服务端**裁决 | ✅ 前端证据 / 后端强制 ❓ |
| 场景锁 | `LockScene/Unlock/IsLock`（service/manager/scene.ts:204-231，5 分钟自动释放）；BI 保存分支执行 unlock，**ESW 保存链路解锁代码被注释**（topBar.ts:232-233） | ⚠️ |
| 文件权限 | `isFileAuthority` 开关默认 false（config.js:7） | ✅ |

### 9.2 代码执行面（安全评审必读）✅

以下用户可配置内容都会进入 `eval` / `new Function`：数据过滤器（utils.ts:183）、组件 requestUrl 反引号模板（biHttp.ts:339）、`javascript:` 前缀参数（biHttp.ts:54-85）、数据源 parseFun（portForm.vue:186-187）、事件脚本（useLifeHandler:559）、WebView 组件包 JS（外部资源）。CodeMirror 的"验证"按钮即执行代码（CodeMirror/index.vue:175-186 ⚠️ 误执行风险）。**边界结论**：能编辑大屏/数据源者等同于获得部署环境的浏览器执行权；此能力无前端侧白名单/沙箱——权限收敛必须依赖平台侧对"谁能保存大屏/数据源"的按钮与接口权限。服务端是否二次校验请求 URL 白名单 ❓ 待确认。

### 9.3 已发现的安全隐患（如实报告）

1. **硬编码自动登录**：HomeView.vue:198-215，`admin` / `e10adc3949ba59abbe56e057f20f883e`（md5("123456")）写 TOKEN。**生产发布前必须确认该入口是否可达/移除**。
2. 异常吞掉：utils/http 错误返回 `{code:200,data:{}}`（:86-90），排障困难且掩盖权限失败。
3. `directives/modules/auth.ts:5` import 不存在的 `@/stores/modules/auth`，`v-auth` 一旦被使用即编译失败（第 13 章陷阱 8）。

---

## 10. 开发、构建、测试与调试

### 10.1 可执行命令 ✅

| 命令 | 实际行为 | 备注 |
|---|---|---|
| `npm run dev` | vite dev @3001，无 proxy | 外部依赖解析见 2.2 |
| `npm run type-check` | `vue-tsc --noEmit` | **提交前必跑**；本仓库现存死代码可能报错/不检查（如 auth.ts 无人引用则不报） |
| `npm run build` | type-check + vite build（terser drop_console/debugger） | 产物 `dist/`（outDir './build' 被注释，vite.config.ts:211） |
| `npm run lint` / `format` | eslint --fix / prettier src/ | — |
| `python build.py` | 执行 npm run build 后尝试进 `build/` 删 baseAssets | ⚠️ 与 dist 不一致必然报错；重试递归调用参数个数错误会 TypeError（build.py:25,73，第 13 章陷阱 12）。不建议使用 |

### 10.2 测试现状

仓库内**无任何自动化测试文件/测试框架配置**（已检索确认）。最低验收清单（人工）：

| 验收项 | 方法 |
|---|---|
| 类型 | `npm run type-check` 通过 |
| 设计态 | 新组件可拖拽/双击上屏、样式弹窗改属性即时生效、撤销重做正常（上限 5 步） |
| 数据 | 静态↔接口切换正常；接口失败有 ElMessage 提示（注意 9.3-2 吞错场景） |
| 事件 | 每个动作在设计器保存后到 **preview.html 运行态**验证（设计态不跑轮询） |
| 运行态 | `preview.html#/{sceneId}` 渲染一致；先加 `?clearComponentCache=true` 排除 IndexedDB 缓存干扰（storage.ts 缓存策略） |
| 隔离 | 用另一场景 ID 打开确认无数据串页 |

以上清单为**约定**，本次交付未替用户执行运行验证（未起后端环境），标注：未运行。

### 10.3 调试入口 ✅

- 生产禁 console 的两层：main.ts:129-133（`window.isLog=true` 保留，config.js:19 已默认 true）+ terser/esbuild 构建期剥离（vite.config.ts:53-60,234-236——**构建后加 isLog 也无效**，调试须用 dev）。
- window 挂载：`$vue/Vue/ElementPlus/mittBus/echarts/$maslg`（main.ts:177-184）；`mittBus` 上可手动 emit `${id}getRefresh` 触发组件刷新。
- 请求不走 axios Network 面板：BI 组件请求在 **Web Worker**（manager-worker.js）内执行，Network 里看 worker 发起的请求。
- 场景数据排查：`GET /XAYL_Designer/GisScene/GetDetail?ID=` 的 `Style` 字段解开即 BIJson；运行态优先查 IndexedDB 缓存（key 含场景数据，storage.ts:145-207）。

### 10.4 快速开始各步骤常见失败

| 症状 | 原因 | 处理 |
|---|---|---|
| 白屏 + config.js 404 | `/baseAssets/...` 不可达 | 见 2.2 方式 A/B |
| 请求 404/跨域 | `baseAPI` 未定义或无代理 | 检查 baseConfig/config.js；无 proxy 需同源部署或加代理 |
| 场景打开空白 | sceneId 无效 / Type GUID 不在 3 种映射内 | renderCenter.vue:72-74 |
| 保存成功但预览旧数据 | IndexedDB 缓存 | URL 加 `clearComponentCache=true` |
| 新组件预览不显示 | 预览端组件注册需完整 build | 重新构建部署（useComInstall.hook.ts） |

---

## 11. 发布、部署与版本管理

### 11.1 构建产物结构 ✅

- input：`index.html` → `dist/index.html`；`'preview/index'` → `dist/preview/index.html`（vite.config.ts:72-79）；entry 按页输出到 `<page>/assets/`，共享 chunk `assets/shared/`（:83-141）；manualChunks 分包 vue-core/echarts/element-plus/…（:143-203）。
- 部署形态（从 `scenePerviewUrl='/pages/designerV4/dist/preview.html#/'` 与 `VITE_COMPONENT_URL='../../designerV4/dist/'` 推断）：dist 整体放到平台 `pages/designerV4/dist/`，与 `pages/baseAssets` 同级。❓ 待确认：`preview/index.html` 与配置里的 `preview.html` 路径差异由部署端如何处理（整理目录 / 重写 / 手放副本），仓库无部署脚本证据。
- 有副作用操作：发布/替换 dist、`SceneVersion/Release`、导入导出、删除均需人工确认授权。

### 11.2 build.py ⚠️ 不建议使用

`build.py:73` 主逻辑：`npm run build` 成功后进 `build/` 删 baseAssets——与 vite 默认 dist 输出不一致（outDir 被注释），清理步骤必然失败被 catch；用户选 Y 重试时 `cmd()` 递归传参缺 3 个参数会 TypeError。README.md:9 仍标注它是打包程序，**实际用 `npm run build` 即可**。

### 11.3 场景数据的"发布"语义（重要边界）✅

| 动作 | 实际语义 | 证据 |
|---|---|---|
| 设计器保存（Ctrl+S / 按钮） | `PATCH /XAYL_Designer/GisScene/ModifyDetail` **直接更新运行态数据**（保存即生效，无审核/发布门禁；ESW 与 BI 共用主链路） | topBar.ts:226-264 → render.ts:48-67（已复核） |
| BI 顶栏"发布"按钮 | 仅 `copySceneID` 复制预览地址，**不是版本发布** | biDesigner/top/topBar.vue:447-459 |
| 版本发布 | `SceneVersion/Release`（弹描述框，快照存版本） | biDesigner topBar.vue:884-903；scene.ts:252-261 |
| 版本列表/下载/回滚 | `SceneVersion/GetList、DownLoad、BackTo` | scene.ts:234-286；manager/publishLog.vue:124-175 |
| `DV_Release` 接口 | 已定义无调用方 | api/chart/publish/index.ts:13-17 ⚠️ |

其他交付能力（managerList.vue + scene.ts）：场景复制（CopyScene function.ts:121-127）、导入/导出（Export/Import :146-165，含关联 API 导出 :167-185）、回收站 Restore（:137-143）、锁（:204-231）。

### 11.4 运行态缓存与更新延迟（发布后必读）

运行态 IndexedDB 缓存优先（storage.ts:145-207）+ 保存删除 componentList：保存成功后旧浏览器窗口可能仍是旧配置；wrapper 页监听 `SavePageEnum.JSON/CHART_TO_PREVIEW` postMessage 才会即时刷新（preview/wrapper.vue:48-56）。对最终用户的更新生效策略（缓存过期时间、componentCachePolicy 默认值）请按 12.1 示例第 6 步验证后写入你的发布 SOP。❓ 缓存 TTL 具体值未逐行核对，使用前先读 storage.ts。

---

## 12. 完整示例

> 示例 A/B 为"配置式"，与当前实现一致，可直接在可用环境执行（本次交付未连接后端实测，执行前请确认第 2.1 节前置条件）；示例 C/D 为代码模板，基于仓库真实组件/插件简化，标"示意"处不可直接复制运行。

### 12.1 示例 A：从零做一个"生产安全大屏"（列表 + 图表 + 接口数据 + 联动）

1. **建场景**：`#/manager?componentType=scene` → 新建 → 自动打开设计器（managerList.vue:522-545）。
2. **画布设置**：BI 模式 → 画布设置弹窗设分辨率/背景/`previewScaleType`（CanvasPage/index.vue:~130-290；运行态缩放策略 useScale.hook.ts:63-123）。
3. **拖组件**：左侧拖入"柱状图"（BarCommon）与"表格"（TablesBasic）。
4. **配数据**：组件悬浮按钮"数据" → 数据来源=请求数据 → 选接口（接口树来自 `/DataFlow/RestAPIQuery/GetRestAPITreeWithDir` 等，api/chart/chartData.ts:11-19）→ 填参数（取值类型选 fixed/urlparam/组件取值）→ 刷新时间（秒）→ 必要时写数据过滤器 `filter(data){ return data }` → 字段映射（dimensions：接口字段→默认字段，ChartData/index.vue:67-99）。
5. **配联动**：表格"事件"→ 单击时 → 动作"数据联动"→ 目标=柱状图，并给柱状图接口参数配"组件取值"引用表格选中行字段（withData 的 component 分支，biHttp.ts:131-255）。
6. **保存并验证**：Ctrl+S → `PATCH ModifyDetail` 200 → Ctrl+P 预览 → Network（worker）确认轮询按 requestInterval 触发 → 再开 `preview.html#/{sceneId}?clearComponentCache=true` 验证无缓存状态。
7. **失败排查**：数据弹窗提示"请配置xx服务地址" = 数据池前缀 `window[requestDataPondId]` 未注入（biHttp.ts:364-367），检查 baseConfig/config.js。

### 12.2 示例 B：自定义接口数据源并绑定图元（机制 A）

1. `#/dataSource` → 新建分组 → 新建数据源：类型=接口；填 url、方法、params（可用 `{主键字段}` 占位）、参数类型；令牌选"系统令牌"。
2. 写 `parseFun`：`function parseFun(data){ return data.data }` →"测试请求"，成功后从返回结果勾选显示字段（portForm.vue:160-243）。
3. 保存（落库 JSON.stringify，见 6.6）。
4. 设计器内选中图元 → 右侧"数据"页 → 选择该数据源 + 绑定字段；实时数据配置 DriveField（sourceDetail.vue:264-274）。
5. 验证：设计态确认绑定回显；运行态由 MasBrowser 引擎按 BindCode/数据源取数驱动图元（引擎侧行为 ⚠️ 不在本仓验证范围）。

### 12.3 示例 C：新增内置组件（骨架示意，参照 TextCommon）

```ts
// src/packages/components/Informations/Mores/HelloCard/index.ts —— 清单描述符
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
export const HelloCardConfig: ConfigType = {
    key: 'HelloCard', chartKey: 'VHelloCard', conKey: 'VCHelloCard',
    title: '欢迎卡片', category: 'Mores', categoryName: '更多',
    package: PackagesCategoryEnum.INFORMATIONS,
    chartFrame: ChartFrameEnum.COMMON, image: 'hello_card.png'
}
```

```ts
// config.ts —— 实例默认值（结构参照 TextCommon/config.ts:82-184）
import cloneDeep from 'lodash/cloneDeep'
import { PublicConfigClass, CreateComponentType } from '@/packages/index.d'
import { HelloCardConfig } from './index'
export const option = { dataset: { type: 'object', isFromInterface: false, dimensions: [], source: { text: '你好，大屏' } }, fontSize: 16, fontColor: '#ffffff' }
export default class Config extends PublicConfigClass implements CreateComponentType {
    public key = HelloCardConfig.key
    public chartConfig = cloneDeep(HelloCardConfig)
    public option = cloneDeep(option)
    public events = cloneDeep({ eventOptions: [{ label: '单击时', value: 'Click' }], baseEvent: [] })
}
```

`index.vue` 渲染 props.chartConfig.option 并在 click 里调 `commonMethods(props.chartConfig, 'Click', data)`（hooks/useLifeHandler.hook.ts:758）；`config.vue` 以 `props.optionData` 双向编辑。完整 11 步见 5.6；其中 class 构造细节以 `TextCommon/config.ts:179-184` 真实代码为准（此处为示意骨架）。

### 12.4 示例 D：业务插件（骨架，参照 job 插件）

1. 新建 `src/plugins/myBiz/myBiz.ts`：`featureCaches = new Map()`；实现 `handelMyBizDragEnd(feature)`（引擎建标记 + 写缓存 'add'）、`saveMyBiz()`（汇总 add/edit/delete → 业务保存接口）、`showMyBiz*` computed（照抄 job.ts:238-246 模式）。
2. 接 `plugins/index.ts`：`pluginNames.myBiz = 3`；在 `handelDragEnd/handelRemove/handelSceneSave` 增加分支（仿 :42-92 现有 if/else）。
3. 启用：设计器 URL 加 `&plugins=[3]`（views/designer/index.vue:136-140）。
4. 若需左栏面板：在 `views/designer/index.vue` 左栏挂载点自行加入 `MyBizLeftPlugin.vue` 并让工具 store `activeLeftBar` 可切换到你的 key（现状无插件左栏挂载点，8.3 ⚠️）。
5. 验证：拖图元上图 → 保存 → Network 先见 ModifyDetail 再见你的业务保存接口 → 重开场景确认业务数据回显（若需加载回显，自行在场景加载完成处调 `loadMyBiz()`——`handelSceneLoad` 现无人调用 ⚠️）。

---

## 13. 常见陷阱与最佳实践

| # | 陷阱 | 触发条件 → 表现 | 原因 | 处理 |
|---|---|---|---|---|
| 1 | 把 README 当现状 | 照 README 调 `getPageList()`/`getComponentById` → TypeError | README 过期（DesignerV3 标题、API 名有误、目录树过期） | 以本文 6.4/6.5 为准；改代码先 grep 真实签名 |
| 2 | "数据过滤器"拿不到 chartEditStore | 在数据弹窗 filter 里用第二参数 → undefined | filter 只传 `fn(data)`（utils.ts:184）；第二参数仅"脚本/数据请求"事件有 | 需要 store 就用事件动作"执行脚本" |
| 3 | goBackPage 贯穿执行 dataLinkage | 配置"返回上一场景"→ 顺带触发数据联动 | `useLifeHandler:508-519` case 缺 `break`（已复核） | 平台缺陷；改 useLifeHandler 补 break 并回归测试 |
| 4 | 双组件清单漂移 | 组件目录/config 已加，但左侧不显示或 AI 面板找不到 | 左侧读 index.json，`packagesList` 另有用途；TextTree 即为有目录无清单例 | 新组件两处同步（5.6 步骤 1、8） |
| 5 | `key=目录名` 隐式约定 | 目录名 ≠ 清单 key → fetch 组件找不到 | glob 按路径倒数第二段匹配（packages/index.ts:59-67） | 目录名严格等于 key |
| 6 | 保存删 componentList + IndexedDB 缓存 | 改完保存，部分终端旧数据 | useSync.hook.ts:2059-2061 + storage.ts 缓存 | 发布后带 clearComponentCache 验证；二开勿依赖 componentList |
| 7 | 用旧数据 hook 写新组件 | 设计态不出数据 | useChartDataFetch 轮询段注释（:39-125）；echartsUpdateHandle 只认 ECHARTS | 按 5.4 新约定 interfaceProcessing+mittBus |
| 8 | v-auth / 错误页跳转 | 引入 auth 指令编译失败；跳 404 页落空 | stores/modules/auth 不存在；错误页未注册路由（utils/router.ts:165 引用已注释枚举） | 勿使用；需要时先补实现 |
| 9 | "高级事件/双击事件"配了没反应 | 勾选渲染前后脚本 / 双击触发 | advancedEvents 消费方停用；双击在 UI 注释（第 7.5 节） | 避免使用；等待平台恢复 |
| 10 | 插件业务数据不回填 | 保存成功，重开场景业务信息丢失 | `handelSceneLoad` 无调用方（plugins/index.ts:73-80） | 自行在场景加载完成处补调 load 函数 |
| 11 | 以为 SQL 数据源可用 | 填 SQL 无效 | requestSQLContent 未被取数链路消费 | 用接口数据源 + parseFun |
| 12 | build.py | 打包后报 Error: | 脚本与 dist 目录不一致 + 重试参数错误 | 用 `npm run build` |
| 13 | token 头大小写不一致 | 换环境后部分接口 401 | `TOKEN`/`token` 双头（utils/http:27,115） | 与后端确认口径；新代码统一走一种实例 |
| 14 | 异常被吞 | 页面空白无报错 | utils/http 错误返回 `{code:200}`（:86-90） | 看 Network 原始响应；勿依赖 ElMessage |
| 15 | 预览产物路径 | 构建后 preview.html 404 | 产物是 preview/index.html，配置指 dist/preview.html | 按 11.1 部署验证；列入 ❓ 清单 |
| 16 | requestUrl 是 JS 模板 | URL 含 `` ` ``、`${` 意外求值报错 | new Function 反引号求值（biHttp.ts:339） | URL 中避免反引号语法，确需变量用 `${urlparam...}` 规范 |

**代码评审检查清单**（改本工程源码时）：
- [ ] `npm run type-check` 通过；未新增 window 全局名冲突（config.js/global.d.ts 已占名）
- [ ] 新组件：目录名=key、index.json 同步、预览图就位、运行态注册验证
- [ ] 新数据组件：走 interfaceProcessing/新约定；未依赖被注释的 hook
- [ ] 未使用 v-auth、GlobalBiState、persist 配置、advancedEvents、EventModel 多函数编辑器
- [ ] 事件动作使用 7.2 清单内类型；新动作需在 singleEventAction 实现
- [ ] 不新增 eval 面；确需时说明权限收敛方案
- [ ] README 类文档更新写入本仓库 docs/（不要直接信任 README）

---

## 14. AI 开发助手工作规范

1. **场景区分**：
   - 纯能力咨询 → 直接依据本文档回答，注明章节与证据路径。
   - 具体开发咨询/实施 → 先读取本文档 + 目标文件最新源码（行号会漂移，**引用前必须重新打开源文件核对**），再给方案或改码。
   - 涉及运行/发布/数据变更 → 列出将执行的命令与影响，等用户明确确认。
2. **需求澄清顺序**：先确认属于哪条扩展路线（1.2 表）、目标态是 ESW 图元还是 BI 组件、数据走机制 A 还是 B；不明确时提问，不得自行假设"数据源"含义。
3. **操作边界**：
   - 可自主：只读检索、本地新增组件文件（未提交）、类型检查、dev 构建验证（环境允许时）。
   - 需用户确认：修改平台内核公共文件（chartEditStore/useLifeHandler/useSync/biHttp）、增删依赖、改 vite/env/config.js、任何发布/删除/导入导出场景数据、build.py。
   - 禁止：绕过按钮权限拼装 URL 直调删除/发布接口；在生产数据上试错；把 ❓ 项当事实写进配置。
4. **能力检索纪律**：只使用第 5-8 章列出的真实注册机制、真实接口与真实 store 方法名；不得猜测 API 名（历史教训见 6.4 README 对照）；文档间冲突时以源码为准并回填"待确认清单"。
5. **交付报告**：如实区分"已验证（附命令与结果）/已实现未验证/未运行"；引用源码结论必须带 `路径:行号`；发现本文档与代码不一致时更新文档并在附录 C 记录。
6. **本建议与现状**：平台尚未提供专用 AI 工具/受控 API，本章是工作约定，非既成能力。

---

## 附录 A：后端接口速查（相对 baseAPI）

| 域 | 接口 | 用途 | 证据 |
|---|---|---|---|
| 场景 | `GET /XAYL_Designer/GisScene/GetDetail?ID=` | 读场景全量 | service/designer/render.ts:22-28 |
| | `PATCH /XAYL_Designer/GisScene/ModifyDetail` | 保存场景（图元/图层/Style） | render.ts:48-67 |
| | `POST /XAYL_Designer/GisFeature/Create` | 单图元入库 | render.ts:30-36 |
| | `/XAYL_Designer/GisScene/`：Create/Delete/GetList/GetOne/ModifyOne/Restore/Export/Import + API 导入导出 + Lock/Unlock/IsLock | 场景 CRUD/交付/锁 | service/manager/scene.ts:75-231 |
| | `SceneVersion/Release、GetList、DownLoad、BackTo` | 版本 | scene.ts:234-286 |
| 图元/底图 | `/XAYL_Designer/GisElement[Group]/*`、`GisBaseDrawing[Group]/*` | 图元与底图素材 CRUD | service/manager/pel.ts:21+、map.ts:23-160 |
| 数据源(机制 A) | `/XAYL_Designer/GisSubSystem[Group]/*`；`/XA_Base/XABaseTableRights/GetList`、`GetXA_BaseTableFieldRightsList` | CRUD + 开放表/字段 | service/dataSource/index.ts:24-183 |
| BI 数据 | `/DataFlow/RestAPIQuery/*`、`/DataView/DV_Virtually/GetApiData`、`/DataFlow/API_Rest_APIInfo/GetList` | 接口树/取数/发布列表 | api/chart/chartData.ts:11-19 |
| BI 资产 | `/DataView/DV_Project|DV_Template|DV_Resources|DV_CompPack|DV_UserCompPack/GetPageList`；DV_CompPack SaveForm/PackRelease/VersionRollBack/PackExport | 工程/模板/资源/组件包 | api/biproject|bitemplate|resource|package |
| 平台 | `User/Login`、`UserCenter/GetUserInfo`、`Module/GetModuleAuthority`、`XA_Tenant/XATenantInfo/GetTenantInfo`、`XA_Base/XABaseShortcut|XABaseIcons/GetList`、`/Annexes/*` | 认证/权限/租户/菜单/附件 | api/auth/index.ts:9-58、api/base.ts、api/chart/index.ts |
| 模板(AI) | `Gis_aiknowledge` GetList/GetEntity/SaveForm/Export/Import | AI 知识库大屏模板 | api/chart/template.ts:9-29 |

## 附录 B：localStorage / window 全局速查

| Key / 全局名 | 含义 | 证据 |
|---|---|---|
| `TOKEN` | 登录令牌 | service/request/index.ts:19 |
| `userInfo` / `RelationList` | 用户信息/角色（App.vue 补写） | App.vue:76-89 |
| `GlobalState` / `Language` / `uicolor` / `tenantInfo` / `BiResourcePathPrefix` | 平台主题、语言、租户 | App.vue:13-21,30-73；main.ts:135 |
| `GO_SYSTEM_SETTING / GO_DESIGN / GO_CHART_LAYOUT / GO_CHART_STORAGE_LIST / GO_USER_MEDIA_PHOTOS` | BI 自研持久化 | enums/storageEnum.ts:1-18 |
| `baseAPI / axiosTimeout / maslg / commonUtils / globalConfig / tszfRegular` | 平台注入（仓外 baseConfig） | env.d.ts:24-27；global.d.ts:5-11 |
| `mapSelect / projectType / fontFamily / predefineColors …` | 项目注入（projectConfig） | 4.2 节 |
| `getWorker / Vue / $vue / ElementPlus / mittBus / echarts / $maslg` | 运行期挂载 | main.ts:177-184；manager-worker.js:585 |
| `masEditEventList / masInnerFunction / MasBrowser / MasBrowserTs` | 外部 SDK 全局 | index.html:89-90,115-116 |

## 附录 C：待确认问题清单（建议提交产品/平台负责人）

| # | 问题 | 缺少的证据 | 建议负责人 |
|---|---|---|---|
| C1 | mbpreview：无 HTML 入口、`sceneMbPerviewUrl` 未定义，移动端运行形态 | 部署端 mbpreview 页面 | 部署/平台 |
| C2 | `preview/index.html` 产物与 `scenePerviewUrl` 指 `dist/preview.html` 的路径差异 | 部署脚本/nginx 配置 | 部署 |
| C3 | `baseAssets/baseConfig/config.js` 字段全集（baseAPI、globalConfig、数据池前缀变量、地图 key） | 该文件样本 | 平台 |
| C4 | token 头 `TOKEN`/`token` 后端以哪个为准；三套 axios 收敛计划 | 后端鉴权中间件 | 后端 |
| C5 | HomeView 硬编码 admin/123456 自动登录是否会随包发布 | 发布清单 | 产品/安全 |
| C6 | `handelSceneLoad` 无调用方：插件加载回显是否已改由上层流程承担 | 平台组确认 | 平台前端 |
| C7 | `goBackPage` 缺 break：是否作为缺陷修复 | 平台组确认 | 平台前端 |
| C8 | Type=3（三维 GIS）GUID 空缺：规划还是废弃 | 产品规划 | 产品 |
| C9 | 设计态组件数据轮询整段注释：设计时是否应显示真实数据 | 平台组确认 | 产品/平台 |
| C10 | 三维场景实时通道是否有 WebSocket 规划（现仅 MQTT+轮询） | 引擎侧文档 | 引擎 |
| C11 | `useModuleAuthority` localhost 全权限的生产行为；服务端接口级权限覆盖范围 | 后端权限实现 | 后端/安全 |
| C12 | `ChangeComponentPackage/ChangeImageSource` 无调用方：BI 组件包安装入口现状为何 | 产品确认 | 产品 |
| C13 | DV_Release、DV_Template、echarts-gl 等"有接口无消费"资产的去留 | 平台规划 | 平台 |
| C14 | 运行态 IndexedDB 缓存 TTL 与 `componentCachePolicy` 取值语义 | storage.ts 完整核对 + 引擎确认 | 平台前端 |

---

*本文档由源码只读调查生成；执行过的验证：main.ts 入口分发、保存链路（topBar.ts→render.ts）、脚本执行（useLifeHandler/biHttp）、路由守卫缺失、env 文件内容、index.html 资源依赖逐项复核通过。未执行：应用实际运行与后端联调（无可用后端环境，相关章节按"未运行"对待）。*

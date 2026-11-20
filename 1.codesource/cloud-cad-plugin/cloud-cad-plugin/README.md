# 云图 CAD 云桥 0.1.0 · 云端图纸接入插件

这是一个基于云图 CAD Editor SDK 的独立 Vue 网页插件，用于把 SDK 编辑器接入现有业务系统的云端图纸链路。用户可以登录业务账号、浏览工作区和图纸、直接从云端打开图纸、上传新图纸，并把当前编辑结果保存为新的 MCD 版本。

## 版本与发布

| 项 | 值 |
| --- | --- |
| 包名 | `cloud-cad-plugin` |
| 版本 | `0.1.0` |
| 运行要求 | Node.js `>=20.19.0` |
| 构建栈 | Vue 3.5、Element Plus 2.13、TypeScript 5.8、Vite 6.3 |
| 发布包 | `2.zip/cloud-cad-plugin/cloud-cad-plugin-0.1.0.zip` |
| SHA-256 | `318EDB3D965E6BC3765BA5D70F9AD870236D3C6D849D8C27C58737555606D147` |

## 0.1.0 特性

- 独立业务账号登录；密码在浏览器端计算 MD5 后提交，不保存账号或密码。
- 校验 token 后读取当前用户信息。
- 读取工作区列表、图纸列表和图纸详情。
- 从云端打开 MCD、MCTF、DWG、DXF：
  - MCTF 直接由 SDK 读取；
  - 其他格式先通过云端图纸转换服务得到 MCD 缓冲区。
- 上传 DWG、DXF、MCD、MCTF，生成缩略图并创建图纸记录。
- 将当前 SDK 编辑数据库保存为 MCD、上传并登记新版本。
- 可选刷新缩略图；不刷新时沿用已有缩略图。
- 维护 `window.currentWorkingAreaInfo`，向 SDK 内置采集插件提供工作区和图纸上下文。
- 支持同源部署时复用 `localStorage.TOKEN`，也支持独立部署时在当前标签页保存插件 token。
- 提供只读连接测试和缩略图链路测试脚本。

## 页面结构

页面由顶部状态栏、CAD 编辑区和右侧接入面板组成：

1. 顶部显示编辑器状态、API 地址和业务系统入口；
2. 左侧主区域挂载 `McEditor`；
3. 右侧面板完成登录、工作区选择、图纸搜索/打开、本地文件上传、版本描述和保存；
4. 面板可折叠，但编辑器保持挂载，避免关闭面板时销毁当前数据库。

## 使用流程

### 部署与启动

```powershell
npm ci
npm run dev
```

默认访问 `http://127.0.0.1:5188/`。

生产构建：

```powershell
npm run build
npm run preview
```

构建产物在 `dist/`。必须通过 HTTP 静态服务访问，不能双击 `index.html`；本地测试不要把 `dist/` 作为普通文件直接打开。

### 配置

运行参数在 `public/config.js`，构建后复制为 `dist/config.js`：

```js
window.cloudCadPluginConfig = {
  apiBase: 'http://192.168.100.54:61012',
  mcdConvertApi: 'http://192.168.100.54:61012',
  systemUrl: 'http://192.168.100.54:6555/',
  assetsPath: './',
  coreAssetsPath: './core/',
  reuseSystemToken: true,
  requestTimeout: 60000,
};
```

`config.js` 可以在发布后修改，不必重新构建。不得把账号、密码或长期 token 写入该文件。

### 登录和打开图纸

1. 在面板输入账号、密码。
2. 登录成功后选择工作区。
3. 搜索并点击图纸。
4. 插件读取图纸详情的 `MasFileId` 或 `DxfFileId`。
5. MCTF 由 SDK 直接加载；其他路径通过 `openCloudDrawingToMcdBuffer()` 转换，再读取 MCD 缓冲区。
6. 打开成功后设置业务上下文和页面标题。

### 上传

支持 `.dwg`、`.dxf`、`.mcd`、`.mctf`，前端限制 120 MB。流程为：

```text
Base64 上传文件 → 生成/上传缩略图 → 写入图纸主表 → 刷新列表 → 打开
```

MCTF 跳过缩略图转换。其他格式缩略图失败不阻止图纸上传，但会显示提示。

### 保存新版本

```text
SDK saveAsMcd()
  → 可选生成 1280×720 JPEG 缩略图
  → 上传 MCD
  → GisWebcadMapHistory/SaveForm 创建历史版本
  → GisWebcadMapMain/SaveForm 指向新版本
```

插件只在上传和保存按钮被主动点击时执行写操作。

## 工具与 API

### 业务 API 封装

| 方法 | 业务接口 | 作用 |
| --- | --- | --- |
| `login()` | `POST /User/Login` | MD5 密码登录并取得 token |
| `getCurrentUser()` | `GET /User/Current` | 校验会话、读取用户 |
| `getWorkspaces()` | `GET /XAYL_WebCad/GisWebcadArea/GetList` | 工作区 |
| `getDrawings()` | `GET /XAYL_WebCad/GisWebcadMapMain/GetList` | 图纸列表 |
| `getDrawingDetail()` | `GET /XAYL_WebCad/GisWebcadMapMain/GetForm` | 图纸详情 |
| `uploadFileBase64()` | `POST /XAYL_WebCad/GisWebcadMapHistory/UploadFile` | 上传图纸或缩略图 |
| `exportThumbnail()` | `POST /CloudCad/file/export` | MCD 转 JPEG |
| `saveDrawing()` | `POST /XAYL_WebCad/GisWebcadMapMain/SaveForm` | 创建/更新图纸主表 |
| `saveMapVersion()` | `POST /XAYL_WebCad/GisWebcadMapHistory/SaveForm` | 登记历史版本 |

请求默认使用 `token` 请求头，60 秒超时；上传最长 180 秒，缩略图最长 120 秒。

### 本地脚本

| 脚本 | 网络写入 | 用途 |
| --- | --- | --- |
| `npm run smoke:readonly` | 无 | 登录、工作区、图纸列表只读连通性 |
| `npm run smoke:thumbnail` | 无业务写入 | 读取一张 MCD 并调用缩略图转换服务 |

只读测试需要：

```powershell
$env:CLOUDCAD_ACCOUNT = 'your-account'
$env:CLOUDCAD_PASSWORD = 'your-password'
$env:CLOUDCAD_API_BASE = 'http://192.168.100.54:61012'
npm run smoke:readonly
```

不要把真实账号写入源码或提交到共享日志。

## 代码框架

```text
cloud-cad-plugin/
├─ src/
│  ├─ App.vue                         顶栏、编辑器与面板布局
│  ├─ main.ts                         Vue 入口
│  ├─ components/
│  │  ├─ CadEditor.vue                McEditor 初始化、销毁和 ready/error 事件
│  │  └─ CloudBridgePanel.vue         登录、列表、打开、上传、保存版本
│  ├─ utils/
│  │  ├─ cloudCadApi.ts               业务 API 与统一响应处理
│  │  ├─ mcHostPreset.mjs             SDK import map、静态资源和开发重写
│  │  ├─ files.ts                     文件扩展名、大小和 Base64
│  │  └─ md5.ts                       浏览器端 MD5
│  └─ types/cloudCad.ts               API、工作区、图纸和运行配置类型
├─ public/
│  ├─ config.js                       部署后可变配置
│  ├─ core/                           CAD Core SDK、字体和类型声明
│  ├─ editor/                         Editor SDK
│  ├─ package/                        SDK 自带插件
│  ├─ lib/                            运行时基础样式
│  ├─ menuConfig.js                   菜单配置
│  └─ packages.json                   SDK 插件清单
├─ scripts/
│  ├─ smoke-readonly.mjs
│  └─ smoke-thumbnail.mjs
├─ vite.config.ts
└─ package.json
```

构建时 `vite-plugin-static-copy` 将 `config.js`、`packages.json`、`menuConfig.js` 和运行时文件复制到 `dist`。SDK 的 `core/`、`editor/` 和 `package/` 必须按完整依赖树一起部署。

## 验证状态

2026-11-20 本地执行：

- `npm run type-check`：通过；
- `npm run build`：通过；
- Vite 输出两条提示：`config.js` 作为非模块脚本不能被打包，以及 `public/lib/base.css` 构建时不存在并保留为运行时解析。部署时必须确保 `dist/lib/` 和 `dist/config.js` 实际存在；
- 本次没有使用真实账号执行只读或缩略图 smoke，也没有在目标业务站点完成上传、打开和保存版本的端到端验收。

## 安全与限制

- 未修改 AgentOS 客户端源码。
- 未保存账号或密码；token 仍在浏览器存储或 SDK 网络请求中使用，必须按内部安全规范管理。
- 复用同源 `localStorage.TOKEN` 只适用于可信同源部署；跨域或不可信页面不要启用。
- 插件绑定的业务接口路径与字段来自当前云图 CAD 系统，接口升级后可能不兼容。
- 上传是 Base64/FormData 内存路径，大文件可能造成浏览器内存压力。
- 保存新版本会创建真实云端记录；测试和演示必须使用测试工作区。
- 缩略图失败不阻断保存，但可能导致列表预览陈旧。
- 详细字段约束、服务端权限和真实文件转换保真度仍需目标环境验收。

## README 维护

发版时原地更新本文件，必须同步 `package.json`、运行依赖、配置项、业务 API、页面流程、构建警告、测试结果和发布包哈希。修改 SDK 目录或 import map 时，同时说明完整 `core/editor/package` 的升级方式。

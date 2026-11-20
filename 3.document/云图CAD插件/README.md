# 云图 CAD 云桥插件 0.1.0

## 交付内容

- 源码：`../../1.codesource/cloud-cad-plugin/cloud-cad-plugin/`
- 静态发布包：`../../2.zip/cloud-cad-plugin/cloud-cad-plugin-0.1.0.zip`
- 发布校验值：`318edb3d965e6bc3765ba5d70f9ad870236d3c6d849d8c27c58737555606d147`
- 统一接口地址：`http://192.168.100.54:61012`
- 业务系统地址：`http://192.168.100.54:6555/`

这是一个不修改 AgentOS 客户端源码的独立网页插件。它以云图 CAD Editor SDK 为底座，在编辑器上叠加业务接入面板，完成登录、工作区选择、云端图纸打开、上传图纸和保存新版本。

## 能力边界

已实现：

- 账号登录并获取 token。
- 读取工作区和图纸列表。
- 读取图纸详情和当前 MCD/MCTF 版本。
- 在 SDK 编辑器中打开云端图纸。
- 上传 DWG、DXF、MCD、MCTF。
- 把当前编辑器内容保存为新的 MCD 版本。
- 上传并刷新图纸缩略图。
- 写入 `window.currentWorkingAreaInfo`，兼容 SDK 自带地质采集插件。

未实现：

- 没有修改 AgentOS 客户端程序或其源码。
- 没有保存账号密码，也没有把抓包中的 token 写入工程。
- 没有在不经确认的情况下向云端写入测试图纸。
- 暂不支持图纸删除、版本回滚和多人锁控制。

## 部署

解压发布包并部署整个目录到 HTTP 静态服务。不要只复制 `index.html`，`core/`、`editor/`、`package/`、`vendor/` 都是运行时必需资源。

可部署为业务系统同源路径，例如：

```text
http://192.168.100.54:6555/pages/cloudCAD/plugin/
```

部署位置由实际 Web 服务器决定。本插件工程不包含 IIS/Nginx 配置，也没有改动现有站点文件。

同源部署时可以复用 `localStorage.TOKEN`；跨域部署时在插件面板中登录。接口服务已允许跨域请求。

## 使用流程

1. 登录云图 CAD 账号。
2. 选择工作区。
3. 从图纸列表打开已有图纸，或上传新文件。
4. 在 SDK 编辑器中编辑。
5. 填写版本说明；如需更新封面，勾选“刷新缩略图”。
6. 点击“保存新版本”。

保存链路为：

```text
当前 McCore 数据库
  -> saveAsMcd()
  -> Base64
  -> GisWebcadMapHistory/UploadFile
  -> GisWebcadMapHistory/SaveForm
  -> GisWebcadMapMain/SaveForm
```

## 验证结果

2026-11-20 已使用系统测试账号完成只读验证：

- 登录成功。
- 工作区读取成功：5 个。
- 图纸读取成功：19 张。
- 已有 MCD 读取成功。
- 缩略图转换成功：源文件 4,121,349 字节，JPEG 2,057,130 字节。
- `npm run type-check` 通过。
- `npm run build` 通过。

写入接口已完成代码对接，但为避免在客户系统产生无意义数据，本次交付未主动执行“新建图纸/保存版本”的线上写操作。


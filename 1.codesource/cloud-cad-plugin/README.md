# cloud-cad-plugin · 云图 CAD 云端接入源码

本目录只有一个独立网页插件工程，当前版本 `0.1.0`。源码、SDK 静态资产、类型声明和本地 smoke 脚本均位于 `cloud-cad-plugin/`。

| 包 | 版本 | 发布包 | 详细说明 |
| --- | --- | --- | --- |
| `cloud-cad-plugin/` | `0.1.0` | `2.zip/cloud-cad-plugin/cloud-cad-plugin-0.1.0.zip` | [README](cloud-cad-plugin/README.md) |

该工程不是 ElvesPuck 插件清单包，而是通过 Vite 构建的独立 Web 页面。开发入口为 `npm run dev`，生产产物为 `dist/`。

发版时直接更新 `cloud-cad-plugin/README.md` 和本索引，不新建版本化 README。SDK 的 `public/core/`、`public/editor/`、`public/package/` 是随包运行资产，不能当缓存单独删除或只替换其中一个目录。

# cloud-cad-plugin · 发布包

当前保留 `cloud-cad-plugin-0.1.0.zip`，对应源码为 `1.codesource/cloud-cad-plugin/cloud-cad-plugin/`。

| 项 | 值 |
| --- | --- |
| 版本 | `0.1.0` |
| 文件 | `cloud-cad-plugin-0.1.0.zip` |
| SHA-256 文件 | `cloud-cad-plugin-0.1.0.sha256` |
| ZIP SHA-256 | `318EDB3D965E6BC3765BA5D70F9AD870236D3C6D849D8C27C58737555606D147` |
| 用途 | 云图 CAD SDK 云端图纸接入网页 |

该包是静态 Web 发布包，不是 ElvesPuck 插件安装包。部署时解压后通过 HTTP 静态服务发布，并确保 `config.js`、`core/`、`editor/`、`package/` 和 `lib/` 位于完整目录结构中。

发布后可修改 `config.js`，无需重新构建。不得把账号、密码或 token 写入包内。安装、运行和接口说明见 [源码 README](../../1.codesource/cloud-cad-plugin/cloud-cad-plugin/README.md)。

发版时在原位置替换同名 README，更新版本、文件名、哈希、接口兼容性和已验证环境；不要为单个版本新增 README。


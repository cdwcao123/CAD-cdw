# cad-inspector · 安装包

现存 3 个包，均为试验分支的预览包，旧版本（含主线 5.8.0）已清理。

| 包 | 来源分支 | 说明 |
| --- | --- | --- |
| `5.10.0-sdk-preview.zip` | `cad-inspector-sdk-fields-work` | 最新，与源码 21/21 文件一致 |
| `5.9.2-sdk-fields-preview.zip` | 同名分支的中间版 | 源码已演进到 5.10.0，此包只作归档，与当前源码对不上 |
| `5.9.1-cloud-push-preview.zip` | `cad-inspector-cloud-push` | 云推送试验，与源码 20/20 文件一致 |

## 注意

- **主线 `cad-laneway-plugin` 是 5.8.0，但 5.8.0 的包已不在本目录**；需要主线包时用 `../../1.codesource/cad-inspector/cad-laneway-plugin/` 重新打包。
- 三个包都是预览/试验产物，不要当正式版交付；安装前确认客户端版本，避免与主线混用。
- 回滚旧包可从回收站恢复，不要改文件名。

源码：`../../1.codesource/cad-inspector/`。

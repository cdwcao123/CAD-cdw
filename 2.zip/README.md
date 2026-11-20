# 2.zip · 发布包

按包名分四个目录，存放各版本的插件安装包和技能包。源码在 `../1.codesource/<包名>/`，详细版本与使用说明见仓库根目录的 [README](../README.md)。

| 目录 | 内容 | 现有 |
| --- | --- | --- |
| `cad-inspector/` | 巷道采集插件安装包 `elvespuck-plugin-cad-inspector-*.zip` | 3 个预览包（5.9.1 / 5.9.2 / 5.10.0） |
| `cad-standard-reviewer/` | CAD 审查插件安装包 `elvespuck-plugin-cad-standard-reviewer-*.zip` | 7 个预览包（preview.16 / 17 / 18 / 19 / 20 / 21 / 22） |
| `mine-laneway-collection/` | 采集技能包 `mine-laneway-collection-skill-*.zip` 与 `elves-laneway-mapping.skill` | 6 个技能版本（1.18.0 / 1.19.0 / 1.20.0 / 1.21.0 / 1.22.0 / 1.23.0）+ 1 个姊妹技能包 + 4 个 `.sha256`；当前版本 1.23.0 |
| `cloud-cad-plugin/` | 云图 CAD 网页插件静态发布包 `cloud-cad-plugin-*.zip` | 0.1.0 |

## 约定

- **只保留最近几个版本**，早期版本已清理（可在回收站恢复）。包数会随发版变化，以目录实际内容为准，不要按固定数量引用。
- 文件名即版本号。后缀含义：`-final` / `-verified` 是同一版本的不同校验批次；`-preview.N` 是预览序列；`-sdk-preview` / `-cloud-push-preview` / `-sdk-fields-preview` 是对应试验分支的产物，不算稳定版。
- 技能包附带同名 `.sha256`，安装或分发前先核对校验值。
- 回滚直接取旧版本包安装，不改文件名，避免与已安装版本混淆。

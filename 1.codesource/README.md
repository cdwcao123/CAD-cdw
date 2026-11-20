# 1.codesource · 源码

按包名分四个独立目录，存放四个项目的源代码。对应的安装包在 `../2.zip/<包名>/`，目录结构一一对应。各包的最新版本与详细文档见仓库根目录的 [README](../README.md)。

| 目录 | 包名 | 项目 |
| --- | --- | --- |
| `cad-inspector/` | cad-inspector | 巷道采集插件（客户端 full-page 插件） |
| `cad-standard-reviewer/` | cad-standard-reviewer | CAD 图样标准化审查插件 |
| `mine-laneway-collection/` | mine-laneway-collection `1.23.0` | 矿井巷道采集技能（Agent 技能包，Python 3.10+） |
| `cloud-cad-plugin/` | cloud-cad-plugin | 云图 CAD SDK 云端图纸接入插件 |

## 存放约定

- 只保留在研源码和仍在使用的试验分支。已废弃的历史版本快照不在此保留，历史产物以 `2.zip` 里的发布包为准。
- 插件目录内的 `runtime/`（LibreDWG WASM）和 `vendor/`（第三方运行资产）属于随包内容，改代码后要一并保留，不能当缓存删掉。`mine-laneway-collection` 的 `vendor/wheels/` 是可选 CPython 3.12 加速依赖，不是最低 Python 版本。
- 所有目录都不含 `node_modules`、`.venv`、`__pycache__` 等依赖环境，可随时重建，不进版本管理。
- 工作区不是 Git 仓库，改动前先核对现有文件，不要覆盖原始图纸和已发布安装包。

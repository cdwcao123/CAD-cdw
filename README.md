# CAD-cdw 工作区总览

本工作区集中保存云图 CAD 相关插件、Agent 技能、发布包和项目文档。源码、第三方随包资产和已发布压缩包都可能同时存在，阅读或发版前应先确认真实版本入口。

本仓库已纳入 Git 管理，远程地址为 `https://github.com/cdwcao123/CAD-cdw.git`，主分支为 `main`。`node_modules/` 等依赖目录不入库，克隆后按各子项目 `package.json` 重新安装即可。

> 文档基线：2026-11-20。版本以各包 `manifest.json`、`package.json` 或技能 front-matter 为准；未声明版本的技能以发布文件 SHA-256 和日期作为身份标识。

## 当前源码与最新版本

| 项目 | 类型 | 最新源码版本 | 源码目录 | 状态 | 详细说明 |
| --- | --- | --- | --- | --- | --- |
| cad-inspector | ElvesPuck full-page 插件 | `5.10.0` | `1.codesource/cad-inspector/cad-inspector-sdk-fields-work/` | SDK/接口字段预览 | [README](1.codesource/cad-inspector/cad-inspector-sdk-fields-work/README.md) |
| cad-standard-reviewer | ElvesPuck full-page 插件 | `1.3.0-preview.22` | `1.codesource/cad-standard-reviewer/cad-standard-reviewer/` | 预览版 | [README](1.codesource/cad-standard-reviewer/cad-standard-reviewer/README.md) |
| cad-standard-review | Agent 审图技能 | 未声明独立版本 | `1.codesource/cad-standard-reviewer/cad-standard-review/` | 与审查插件共用审查口径 | [README](1.codesource/cad-standard-reviewer/cad-standard-review/README.md) |
| cloud-cad-plugin | 独立网页插件 | `0.1.0` | `1.codesource/cloud-cad-plugin/cloud-cad-plugin/` | 可构建的接入原型 | [README](1.codesource/cloud-cad-plugin/cloud-cad-plugin/README.md) |
| mine-laneway-collection | Agent 采集技能 | `1.23.0` | `1.codesource/mine-laneway-collection/mine-laneway-collection/` | 当前主技能；Python 3.10+ 自适应 | [README](1.codesource/mine-laneway-collection/mine-laneway-collection/README.md) |
| elves-laneway-mapping | Agent 标高审查技能 | 未声明独立版本 | `1.codesource/mine-laneway-collection/elves-laneway-mapping/` | 姊妹技能 | [README](1.codesource/mine-laneway-collection/elves-laneway-mapping/README.md) |

`cad-inspector` 还有两条需要明确标识的分支：

| 分支 | 版本 | 用途 | 详细说明 |
| --- | --- | --- | --- |
| `cad-laneway-plugin` | `5.8.0` | 不含 SDK 字段和云推送的主线基线 | [README](1.codesource/cad-inspector/cad-laneway-plugin/README.md) |
| `cad-inspector-cloud-push` | `5.9.1` | 巷道台账批量推送试验 | [README](1.codesource/cad-inspector/cad-inspector-cloud-push/README.md) |

## 目录职责

```text
CAD-cdw/
├─ 1.codesource/   当前在研源码和保留的试验分支
├─ 2.zip/          可安装 ZIP、.skill 文件和校验文件
├─ 3.document/     开发、交接、环境、测试数据及真值图纸
├─ ../4.skills/    第三方参考库本地副本（位于上级目录，不参与本项目构建）
├─ 技能清单-项目仓库.md
└─ README.md
```

`1.codesource/` 只说明“源码在哪里”，不保证每条分支都可交付。`2.zip/` 只说明“某个版本曾被打包”，不能反推源码状态。遇到冲突时按以下优先级判断：

1. 包内 `manifest.json`、`package.json`、`SKILL.md` front-matter；
2. 当前源码入口文件和测试结果；
3. 发布目录 README 与文件名；
4. 历史说明文档。

## 常用入口

- 插件源码索引：[1.codesource/README.md](1.codesource/README.md)
- 发布包索引：[2.zip/README.md](2.zip/README.md)
- 开发与交接文档：[3.document/README.md](3.document/README.md)
- 第三方技能仓库清单：[技能清单-项目仓库.md](技能清单-项目仓库.md)

## 文档维护约定

每个插件或技能发版时，必须在原目录的 `README.md` 上原地更新，不新建 `README-vX.md`、`README-new.md` 或每个版本一份的重复文档。至少同步以下内容：

1. 包名、版本、状态和源码/发布包路径；
2. 本版新增、变更、删除的能力；
3. 用户使用流程与生产限制；
4. CLI、脚本、HTTP 路由、宿主 API 或出站调用的工具清单；
5. 代码目录和关键数据流；
6. 构建、安装、测试与校验命令；
7. 已验证事项、已知失败项和未完成的端到端验证；
8. 上一版文档中已经失效的版本号、字段、命令和限制。

若某个包没有版本元数据，应记录其发布文件 SHA-256，直到补上正式版本号。发布后还要同步更新相邻的 `2.zip/<包名>/README.md` 和本文档的版本表。

## 2026-11-20 验证快照

- `cad-standard-reviewer`：`node --test tests` 通过 168 项，0 跳过、0 失败。Python 3.10+ 自动发现，优先 AgentOS 自带 3.12；DOCX 使用标准库 OOXML 解析，OCR 使用 Windows 原生能力，preview.22 包体约 3.4 MB。
- `cloud-cad-plugin`：`npm run type-check` 和 `npm run build` 通过；构建仍有 `config.js` 非模块脚本及运行时 `lib/base.css` 的提示。
- `mine-laneway-collection 1.23.0`：`smoke-test.mjs` 通过；DXF 回归分别通过 AgentOS Python 3.12 + 随包 wheel、Python 3.14 + 用户环境 ezdxf、Python 3.14 + 纯标准库后备，以及 Python 3.12 强制标准库后备。后备 DXF 另通过 ezdxf 读取和 AutoCAD 2020 `AUDIT`。
- `elves-laneway-mapping`：`node --test tests` 为 19 通过、1 失败，失败项依赖本机 Git Bash here-document；`node --test core/nodes.test.js` 为 9/9 通过。
- `cad-inspector 5.10.0`：SDK 字段测试通过；云推送测试仍期望 5.9.1 的 `/cloud-validate` 校验路径，当前 5.10.0 源码未实现该路径，因此测试失败。

以上验证只覆盖本地代码与测试，不代表真实宿主安装、真实云端鉴权、生产台账写入或专业图纸结论已经验收。

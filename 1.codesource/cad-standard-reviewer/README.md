# cad-standard-reviewer · CAD 图样标准化审查

本目录包含一个 ElvesPuck 全页面插件和一个 Agent 审图技能。插件负责规则/标准库上传、集合版本、DWG/DXF 证据提取、本地规则引擎和两阶段模型审查；技能提供不依赖插件页面、以文件判读为核心的通用审图流程。

当前插件版本为 `1.3.0-preview.22`，最新预览包位于 `2.zip/cad-standard-reviewer/elvespuck-plugin-cad-standard-reviewer-1.3.0-preview.22.zip`。

## 目录

| 目录 | 内容 | 详细说明 |
| --- | --- | --- |
| `cad-standard-reviewer/` | ElvesPuck 插件源码，版本 `1.3.0-preview.22` | [README](cad-standard-reviewer/README.md) |
| `cad-standard-review/` | 可独立使用的审图技能，未声明独立版本 | [README](cad-standard-review/README.md) |

## 当前版本要点

- 规则文件和可选标准库都必须由用户上传，插件不把内置示例当作客户标准。
- 规则/标准库保留原件、提取正文、人工编辑版本和模型整理历史。
- 标准集合固定规则、标准库、原件哈希和提取片段；后续资料变化不会回写已完成审查。
- `preview.22` 支持 Python 3.10+，优先 AgentOS 自带 3.12，其次用户环境 Python。DOCX 使用标准库解析 OOXML，OCR 使用 Windows 原生能力。
- `preview.21` 新增规则适用性预检。明显属于工艺、生产或其他非 CAD 文档的规则会在模型调用前返回 `RULE_FILE_NOT_APPLICABLE`。
- 本地精确检查由上传规则中的 `checkType` 启用；源码规则样本仅供测试，不进入安装包。
- DWG 会先转成 DXF；PDF/DOCX/XLSX 等资料可解析正文，扫描件 OCR 依赖 Windows x64 和对应语言包。

## 验证状态

在 PowerShell 下运行：

```powershell
node --test .\tests
```

本次完整回归为 168 通过、0 跳过、0 失败。`npm test` 当前在 PowerShell 下仍可能无法展开 `tests/*.test.mjs` 通配符；CLI 下使用 `node --test tests` 或显式传入测试文件。

本目录没有有效的当前打包脚本。`1.codesource/cad-inspector/build-cad-plugin.py` 的清单未覆盖 preview.22 的轻量运行时结构。当前安装包已通过精简 vendor 和 ZIP 校验生成；后续重新打包前仍应建立独立、可复现的构建清单。

## 数据和人工边界

- 审查结论只针对已执行范围，不代表整图合规、技术方案正确或可签章。
- 模型输出结构错误、批次覆盖不完整或最终复查失败时，不能报告“模型审查完成”。
- 复杂表格、扫描件、图片、公式和跨片段语义可能丢失；缺证据必须标待确认。
- 图纸和标准资料可能含敏感信息，插件没有自动决定数据出境策略。

## README 维护

插件或技能发版时直接更新对应子目录的 `README.md`，并同步本文件的版本、发布包、验证状态与构建说明。不要再新增按版本编号的 README。

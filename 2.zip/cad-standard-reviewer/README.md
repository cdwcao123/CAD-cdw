# cad-standard-reviewer · 安装包

现存 7 个包，均为 1.3.0 预览线：`preview.16` 至 `preview.22`。

- `preview.22` 是最新包，支持 Python 3.10+，优先 AgentOS 自带 3.12；DOCX 使用标准库解析 OOXML，OCR 使用 Windows 原生能力，包体约 3.4 MB。
- `preview.21` 增加规则适用性预检和明确错误日志。
- `preview.16` 至 `preview.20` 用于对比和回滚。
- 早期稳定版（1.1.1、1.2.0、1.2.1-final 等）已清理；需要稳定版交付时，从源码按稳定分支重新打包，或从回收站恢复原包。

安装与回滚方式同 `cad-inspector`：按 zip 安装，旧包保留不改名。

源码：`../../1.codesource/cad-standard-reviewer/`。

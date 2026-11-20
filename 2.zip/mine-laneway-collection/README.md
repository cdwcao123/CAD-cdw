# mine-laneway-collection · 技能包

矿井巷道采集技能的各版本包。当前保留 `1.18.0`、`1.19.0`、`1.20.0`、`1.21.0`、`1.22.0`、`1.23.0`。

- `mine-laneway-collection-skill-1.23.0.zip`：最新。Python 3.10+ 自适应，优先 AgentOS 运行时，并提供 ezdxf、可选 wheel 和标准库三种后端。
- `1.22.0`、`1.21.0`、`1.20.0`、`1.19.0`、`1.18.0`：历史版本，用于回滚与差异对比。

- `mine-laneway-collection-skill-*.zip`：技能主包，含精简 `SKILL.md`、`scripts/`、`core/`、`references/`、LibreDWG WASM 和 Python 3.10+ 自适应运行链路。1.23.0 不要求固定 Python 版本，纯标准库后备不会增加 NumPy wheel。
- `elves-laneway-mapping.skill`：姊妹技能「标高标注审查」的包。
- 版本号与技能 front-matter 的 `metadata.version` 一致；升级整包替换，不做增量覆盖。

源码：`../../1.codesource/mine-laneway-collection/`。

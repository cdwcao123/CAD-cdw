# 矿井巷道采集技能 1.23.0

本次修正 Python 版本硬限制。

运行策略：

- 解释器最低版本改为 Python 3.10；
- 优先使用 AgentOS 自带运行时，再使用用户环境 Python；
- 当前 Python 已安装 ezdxf 时直接使用 ezdxf；
- CPython 3.12 Windows x64 未安装 ezdxf 时，临时解包随包 wheels；
- Python 3.10、3.11、3.13、3.14 或其他平台未安装 ezdxf 时，使用 `dxf_fallback.py` 标准库后备；
- 不再设置 `PYTHONNOUSERSITE=1`，用户环境中的 ezdxf 可以被发现。

包体：

- 没有新增 NumPy 或其他版本专用 wheel；
- 新增内容只有一个纯 Python 后备脚本和运行时选择逻辑；
- 随包 CPython 3.12 wheels 保留为可选加速，不构成最低版本限制。

验证：

- AgentOS Python 3.12 + 随包 ezdxf wheel：DXF 回归通过；
- Python 3.14 + 无 ezdxf + 标准库后备：DXF 回归通过；
- Python 3.14 + 用户环境 ezdxf：DXF 回归通过；
- Python 3.12 + 强制标准库后备：DXF 回归通过；
- 后备生成的 624 点 DXF 可被 ezdxf 读取，并通过 AutoCAD 2020 `AUDIT`；
- Python 文件通过 3.10 语法检查。

当前结果仍须专业人员对照原图复核。

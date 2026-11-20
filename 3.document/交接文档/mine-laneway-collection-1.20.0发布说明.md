# 矿井巷道采集技能 1.20.0

交付位置：

- 源码：`1.codesource/mine-laneway-collection/mine-laneway-collection/`
- 安装包：`2.zip/mine-laneway-collection/mine-laneway-collection-skill-1.20.0.zip`

本次调整：

- 最终 JSON、DXF 默认写入当前工作区的独立交付目录；用户可指定保存路径。转换、证据和审查中间文件只放系统临时目录。
- 重叠、扎堆测点按有效 DXF 颜色稳定关联文字，输出重叠簇、颜色数量和颜色列表；同块同圆心同心圆仍只合并为一个点。
- 正式巷道要求两条未闭合原始边线为同一有效颜色。近邻异色单线、辅助线和竞争配对不能占用导线点；同色远距真实帮线通过自适应后备搜索补充。
- 同一条边线延伸出的未成对单线尾段会被裁剪，DXF 与 JSON 只保留实际同色双线覆盖范围。
- 支持在对话中指定 DXF 矩形区域。`region-report.mjs` 输出区域颜色、图层、handle、测点、文字和双边线配对证据，再由模型结合用户说明生成 `analysis_region` 和 `collection_rules`。
- 支持用户上传局部复杂图。安全 JPEG 证据与自然语言共同写入 `complex_case_rules`；DXF 选区使用 `source_kind=dxf_region`，不再只能依赖图片。
- Windows x64 仍随包提供 LibreDWG、ezdxf、NumPy、fontTools 等必要运行依赖。已从轮子中剔除测试、类型存根和 C 源文件，Python 本体与 Linux 运行时不随包。

环境：

- Node.js
- AgentOS 自带 Python 3.12
- Windows x64

验证：

- 合成回归覆盖同色远距双边线、异色白线排除、三色完全重叠测点、局部区域采集、区域证据和单线尾段裁剪。
- DXF 大坐标视口、点模式边线背景、实心块与文字输出回归通过。
- 真实 `银二井上下对照图` 测点模式回归采集 363 个同色双边线间测点，其中 352 个有标高，不少于 1.19.0 的 325 个。

限制：

- 复杂交叉、遮挡和区域规则的业务正确性仍需专业人员对照原图复核。
- 浏览器隐藏调用取决于当前 AgentOS 连接器是否提供后台标签页或 `visible=false`；密码、验证码和多因素认证由用户完成。

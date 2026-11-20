# cad-inspector · 矿井巷道采集插件源码

包名 `cad-inspector`，显示名“图纸测点采集”。插件读取 DWG/DXF 图纸，先用本地几何筛选测点与同色双边线候选，再调用宿主默认模型确认点文字和巷道连接，最终输出巷道 JSON；最新预览分支提供并发往巷道台账的接口字段映射。

当前目录不是单一线性开发树，而是“一条主线基线 + 两条验证分支”。阅读、测试和打包前必须先选对分支。

## 分支与版本

| 分支 | 版本 | 定位 | 发布包 | 详细说明 |
| --- | --- | --- | --- | --- |
| `cad-inspector-sdk-fields-work/` | `5.10.0` | 当前源码版本最高；SDK/接口字段导出与云推送预览 | `2.zip/cad-inspector/elvespuck-plugin-cad-inspector-5.10.0-sdk-preview.zip` | [README](cad-inspector-sdk-fields-work/README.md) |
| `cad-inspector-cloud-push/` | `5.9.1` | 独立云推送验证；带 `/cloud-validate` 字段校验 | `2.zip/cad-inspector/elvespuck-plugin-cad-inspector-5.9.1-cloud-push-preview.zip` | [README](cad-inspector-cloud-push/README.md) |
| `cad-laneway-plugin/` | `5.8.0` | 不含 SDK 字段与云推送的主线基线 | 当前 `2.zip` 未保留 | [README](cad-laneway-plugin/README.md) |

`5.9.2` 只有发布包，当前没有对应的独立源码目录；`5.9.2-sdk-fields-preview.zip` 应视为 5.10.0 之前的归档，不应作为当前源码状态。

## 选择原则

- 查看最高版本源码、SDK 字段映射或云推送预览：使用 `cad-inspector-sdk-fields-work/`。
- 需要推送前字段完整性校验：使用 `cad-inspector-cloud-push/`；不要误以为 5.10.0 也包含同一校验路径。
- 需要 5.8.0 基线或复现旧主线行为：使用 `cad-laneway-plugin/`。
- 正式交付前必须重新确认宿主版本、模型权限、云端环境以及实际安装包是否与目标源码一致。

## 共同数据流

```text
DWG/DXF
  → Worker 解析（DWG 由 LibreDWG WASM 转 DXF）
  → 导线点候选/文字/同色双边线候选筛选
  → 前端分批发给默认模型
  → 服务端校验模型引用、点名和高程
  → Worker 组装测点与巷道记录
  → 前端再次请求模型确认点序
  → SDK/接口 JSON + 本机历史
```

模型只决定“哪些已有证据可组合”和“点序是否正确”，几何边界、颜色、来源 handle 与坐标由本地程序保留。模型不确定或失败时不生成虚假结果。

## 目录结构

```text
cad-inspector/
├─ build-laneway-plugin.py       5.8.0 基线打包脚本
├─ build-cad-plugin.py           标准化审查插件打包脚本的旧副本，不用于本插件
├─ vendor/acad-ts/               5.8.0 DWG 写出库参考资料
├─ cad-laneway-plugin/           5.8.0 主线基线
├─ cad-inspector-cloud-push/     5.9.1 云推送验证分支
└─ cad-inspector-sdk-fields-work/5.10.0 SDK 字段预览分支
```

三个插件目录都自带 `runtime/libredwg-web.*` 和 GPL/来源声明。`runtime/` 是运行资产，不是可删除缓存；升级或替换时必须同时核对许可证和对应源码说明。

## 打包与校验

`build-laneway-plugin.py` 明确针对 `cad-laneway-plugin/` 的 `5.8.0` 源码，使用显式文件清单，执行：

```powershell
python .\build-laneway-plugin.py
```

该脚本会删除并重建同版本输出 ZIP，运行前要确认旧包已经备份。当前目录没有覆盖 5.9.1/5.10.0 的独立打包脚本，发布这些分支时应以现有发布日期包或经审查的构建流程为准，不应直接套用 5.8.0 清单。

## 验证状态

- 5.10.0 的 `node --test test-sdk-fields.mjs` 通过。
- 5.10.0 的 `test-cloud-push.mjs` 当前失败，因为它期望 `prepareCloudPayload()` 返回字段问题并调用 `/cloud-validate`，而 5.10.0 源码只做字段映射、未实现该路由。该失败属于源码与测试版本错位。
- 5.9.1 的 `node test-cloud-push.mjs` 通过本地模拟。
- 未见真实宿主安装、真实默认模型、真实内网鉴权和真实巷道台账写入的端到端验收记录。

## 安全与限制

- 候选数据会发送给宿主默认模型；使用者必须先确认图纸授权和数据分级。
- `CLOUDCAD_TOKEN` 只能放在宿主合并配置中，不能写入前端、插件包、日志或本 README。
- 云推送为批量新增，超时或返回不明确时先查云端，禁止直接重复推送。
- 点归属、左右距离、巷宽、标高和巷道连接均可能出错，结果必须由专业人员对照原图核验。
- 输出中的图纸单位不等于米；SDK/接口侧的 null、坐标单位和字段接受规则尚未完成全链路验证。

## README 维护

发版时直接更新本文件和各分支自己的 `README.md`，同步版本表、发布包路径、模型协议、云推送行为、测试结果和已知问题。不要为每个版本新增 README；历史变化写在当前 README 的版本说明中，旧发布包通过 `2.zip` 和校验值追踪。

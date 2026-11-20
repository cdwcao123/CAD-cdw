# SDK 集成说明：插件 JSON → 云图 CAD SDK（McDbTunnel）

> 状态：仅静态检查过 SDK 类型声明和部分转换代码，尚未验证公开导出、实体创建、MCD 保存、上传或目标系统对 null 标高的处理。下面的映射及调用片段仅供研究，不能视为可运行代码或兼容性结论。识别结果为实验性候选，不可直接导入生产。

## 一、数据链路

```
原始 DWG/DXF
  → 插件识别（导线点建图 + 标高锚定）
  → JSON 候选（字段兼容性尚待验证）
  → SDK convertTunnelData(json) → McTunnelData
  → new McDbTunnel(data) → McDbDatabase
  → 导出 .mcd
  → 上传/版本接口（本路线尚未端到端验证）
```

## 二、字段对齐（已在 SDK 源码核实）

`convertTunnelData` 读取的巷道级字段：

| 插件 JSON | SDK 内部 | 说明 |
| --- | --- | --- |
| `laneway_code` | `lanewayCode` | 空则 SDK 生成 UUID8 |
| `laneway_name` | `lanewayName` | 空则「未命名」 |
| `laneway_type` | `lanewayType` | 枚举「普通 / 竖井」 |
| `laneway_sec_style` | `lanewaySectionStyle` | 「半圆拱 / 圆弧拱 / 三心拱 / 矩形 / 梯形 / 圆形」 |
| `into_or_out_wind` | `intoOrOutWind` | 「进风 / 回风」 |
| `laneway_height` / `laneway_width` | `lanewayHeight` / `lanewayWidth` | 真值 3.0 / 4.0 |
| `traverse_point_array` | `nodes` | 见下表 |
| `border_line_points` | `borderLines` | `[{x,y},…]` 直接映射 `McGePoint` |
| `series_ventilation` | `seriesVentilation` | 「1 是 / 2 否」，缺省 "2" |
| `return_air_type` | `returnAirType` | 缺省「采区回风巷」 |
| `excavation_status` / `excavation_type` / `current_footage` | 同名 | 缺省「准备中 / 单掘 / 0」 |

`traverse_point_array[]` 每点：

| 插件 JSON | SDK 内部 |
| --- | --- |
| `point_name` | `pointName` |
| `left_side` / `right_side` | `leftSide` / `rightSide` |
| `point_order` | `pointOrder` |
| `traverse_point_type` | `traversePointType`（「导线点 / 停头 / 临时导线点 / 虚拟点」） |
| `x` / `y` / `z_top` / `z_bottom` | 同名 |
| `use_second_side` / `second_left_side` / `second_right_side` | 同名 |
| `radius` / `coal_seam_struct` / `bottom_coal_thick` | 同名 |

> 注：插件保留逐点候选标高；未知值为 null。将候选文字作为底板、按高度推算顶板仅是未验证的假设，不能视为真实顶底板标高。

## 三、宿主侧调用设想（伪代码，未经运行验证）

```js
import { convertTunnelData, createTunnel, generateTunnelBorderLine } from 'McCore'
// 或在采集工具包里：import { convertTunnelData } from '.../mcTunnel'

const dataList = JSON.parse(jsonText)            // 插件导出的数组
for (const raw of dataList) {
  const data = convertTunnelData(raw)            // 直接消费，无需改字段
  const tunnel = new McDbTunnel(data)            // 或 createTunnel(data.nodes, data.lanewayCode, db)
  db.addEntity(tunnel)                           // 加入当前数据库
}
// 边线可由 SDK 重算（插件已带 border_line_points，二选一）
// const borders = generateTunnelBorderLine(data.nodes, data.lanewaySectionStyle)
```

导出 `.mcd`：在 SDK 宿主环境调用 `McDbDatabase` 的 mcd 写出接口（`McDbTunnel.mcdOutFields(filer)` 是单实体写出钩子，数据库级保存由宿主封装）。

## 四、与现有「文件通道」的关系

| 通道 | 状态 | 适用 |
| --- | --- | --- |
| 文件通道：DWG → MCD → 上传 → 存版本 → 指向新版本 | 本次未复验 | 需单独验证 |
| JSON → SDK `McDbTunnel` → `.mcd` → 上传 | 未验证 | 需运行时端到端验证 |

两条通道最终都落到 `POST /GisWebcadMapHistory/UploadFile` + `/SaveForm` + `GisWebcadMapMain/SaveForm`（已核实）。

## 五、注意

- SDK 是浏览器端 TS 包（`McCore` / `McEditor` + import map），不能在插件 Node 后端直接跑；集成需在宿主页面或 demo（Vite）里完成。
- JSON 编码及目标系统对未知标高的兼容性需端到端验证。
- `series_ventilation` 是 MAS「图纸级巷道保存」曾缺的列，插件现已默认输出 "2"，可直接用于 `lanewayDataList`。

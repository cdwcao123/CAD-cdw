import type { DrainageCloudCadType, McExposureTime } from './enum';
import type { BoreholeCorrectionResult, BoreholeCorrectionVersion, BoreholePathAction, DrainageDetailMode, DrainageNumberTriplet, DrainageReverseMode, DrainageSyncCategory, DrainageSyncDetail, DrainageSyncFilterKey, DrainageSyncGroupKey, DrainageSyncType, DrillSiteCoordAction, EvaluationUnitMode } from './type';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McBoreholePath, McBoreholePurpose, McBoreholeType, McCoalType, McDbDrainageBorehole, McDbDrillSite, McDbGasArea, McDirectionalDesignParameter, McGasSource, McThroughParameter, McWorkFaceType } from '@/core_geology_collect_tool/mcDrainageBorehole';
import type { McDbTunnel } from '@/core_geology_collect_tool/mcTunnel';
import type { DataValidation, Worksheet } from 'exceljs';
import type { McColor, McCore, McDbDatabase, McDbEntity, McMctfFiler, McGeVector3 } from 'McCore';
import type { Column, NodeModuleDefine } from 'McEditor';
/** 修正选择列表的一组穿层孔；相同巷道内按孔号前缀分组，不使用施工班组。 */
export interface BoreholeCorrectionGroup {
    /** 由巷道实体 ID 和组号组成的唯一选择值。 */
    key: string;
    /** 巷道名称及孔号组号组成的显示名称。 */
    label: string;
    /** 关联巷道的实体 ID，用于筛选；未关联巷道时为空字符串。 */
    tunnelId: string;
    /** 筛选框显示的巷道名称；实体未取得名称时显示 ID，未关联时显示“未关联巷道”。 */
    tunnelName: string;
    /** 组内全部有效穿层孔的实体 ID；下一步时重新从原图纸读取。 */
    entityIds: string[];
}
/** 反演修正单侧列表的巷道筛选项，以实体 ID 区分同名巷道。 */
export interface BoreholeCorrectionTunnelOption {
    /** 巷道实体 ID；空字符串表示未关联巷道的分组。 */
    value: string;
    /** 与分组一致的巷道显示名称。 */
    label: string;
}
/** 首个弹框的两份独立单选列表，实际孔与设计孔严格分开。 */
export interface BoreholeCorrectionGroups {
    /** getIsDesign() 为 false 的反演钻孔分组。 */
    invert: BoreholeCorrectionGroup[];
    /** getIsDesign() 为 true 的待修正设计钻孔分组。 */
    design: BoreholeCorrectionGroup[];
}
/** 下一步提交的参数及左右组选择；未选组使用空字符串。 */
export interface BoreholeCorrectionSelection {
    /** 本次完整穿层参数；仅过煤长度、倾向终孔间距、巷道两侧范围允许修改，长度单位为米。 */
    parameters: McThroughParameter;
    /** 左侧反演钻孔组选项的 key。 */
    invertGroupKey: string;
    /** 右侧设计钻孔组选项的 key。 */
    designGroupKey: string;
}
/** 参数弹框输入；通过 onReady 注册提交读取函数，不实时修改 Core 参数。 */
export interface BoreholeCorrectionSetupProps {
    /** 打开弹框时从原图纸收集的两份钻孔分组。 */
    groups: BoreholeCorrectionGroups;
    /** 每次打开创建的完整参数初值。 */
    parameters: McThroughParameter;
    /** 组件就绪时注册读取最新参数和选择的函数；读取本身不计算、不写图纸。 */
    onReady: (read: () => BoreholeCorrectionSelection) => void;
}
/** 反演修正弹框的数字控件定义，仅包含三项可编辑参数。 */
export interface BoreholeCorrectionParameterField {
    /** 对应 Core 的过煤长度、巷道两侧范围或倾向终孔间距字段。 */
    key: 'coalPassLength' | 'area' | 'vSpace';
    /** 中文业务名称。 */
    label: string;
    /** 显示单位；空字符串表示无单位。 */
    unit: string;
    /** 控件显示的小数位数。 */
    precision: number;
    /** 参数最小值，单位米；过煤长度和巷道两侧范围允许为零，倾向终孔间距须为正。 */
    min: number;
}
/** 修正图件预览输入；只绘制 Core 返回图件的临时副本，不写正式图纸。 */
export interface BoreholeCorrectionPreviewProps {
    /** 计算及图层、样式来源所属的 Core。 */
    core: McCore;
    /** 原图纸键，换图后禁止绘制旧结果。 */
    drawingKey: string;
    /** 一份完整的设计平面图或修正平面图临时实体集合。 */
    entities: McDbEntity[];
}
/** 修正业务允许回写的钻孔字段快照，其他编号、位置、样式、关联信息均不覆盖。 */
export interface BoreholeCorrectionDrillState {
    /** 独立轨迹段数组；depth 单位为米，heading 和 tilt 单位为度。 */
    path: McBoreholePath[];
    /** 见煤深度，沿钻孔轨迹量取，单位为米。 */
    inCoalLength: number;
    /** 止煤深度，沿钻孔轨迹量取，单位为米。 */
    outCoalLength: number;
}
/** 一条原设计孔的修正写入计划，以实体 ID 绑定原孔，不使用孔号或列表显示顺序。 */
export interface BoreholeCorrectionChange {
    /** 修正孔 objectId 仅移除末尾一层 _clone 后得到的原设计孔 ID；必须属于本次 Core 返回的 designDrills。 */
    entityId: string;
    /** Core 返回新孔的三字段，实际应用使用独立轨迹数组。 */
    state: BoreholeCorrectionDrillState;
}
/** 按修正孔 objectId 区分的原孔更新与新孔入库计划；不依赖返回数组的顺序或数量一致。 */
export interface BoreholeCorrectionPlan {
    /** 带 _clone 后缀的修正孔对应的原孔更新，只回写轨迹、见煤深和止煤深。 */
    changes: BoreholeCorrectionChange[];
    /** 不带 _clone 后缀的完整新孔实体，保留 Core 返回的 ID 和属性，点击应用后才加入正式数据库。 */
    additions: McDbDrainageBorehole[];
}
/** 一次计算的图件及应用计划；预览和导出不执行正式图纸写入。 */
export interface BoreholeCorrectionCalculation extends BoreholeCorrectionResult {
    /** 原设计孔的更新及修正后新增孔的入库计划，只有点击应用才写入。 */
    plan: BoreholeCorrectionPlan;
}
/** 钻孔反演修正上下对比组件的输入，图件来自 Core 修正计算。 */
export interface BoreholeCorrectionDialogProps {
    /** 修正计算所属的 Core。 */
    core: McCore;
    /** 修正计算所属的图纸键。 */
    drawingKey: string;
    /** 设计平面图，使用 Core 返回的 designMap，未加入正式数据库。 */
    designMap: McDbEntity[];
    /** 修正平面图，使用 Core 返回的 newMap，未加入正式数据库。 */
    newMap: McDbEntity[];
    /** 将当前单选版本的已渲染快照导出为 DWG；未就绪、换图或转换失败时拒绝，由组件提示。 */
    onExport: (version: BoreholeCorrectionVersion, snapshot: DrainageDiagramExportSnapshot) => Promise<void>;
}
/** 管理参数及分组选择、Core 计算和真实图件预览的两步会话。 */
export interface BoreholeCorrectionController {
    /** 等待活动图纸就绪后打开参数及分组弹框；无图纸时提示，重复打开丢弃上一会话。 */
    open: () => Promise<void>;
    /** 关闭当前步骤弹框并使迟到的计算结果失效，释放参数、结果及换图监听。 */
    close: () => Promise<void>;
}
/** 评价单元面板状态；暴露时间使用字典键，对接 Core 时需转换为天数。 */
export interface EvaluationUnitPanelParameters {
    mode: EvaluationUnitMode;
    name: string;
    /** 评价单元实体高度，单位为米。 */
    height: number;
    /** 评价单元底板标高，单位为米；仅回采区域绘制模式使用。 */
    altitude: number;
    /** 巷道条带评价单元的巷道两侧宽度，单位为米；新建时默认 15 米。 */
    width: number;
    regular: boolean;
    /** 工作面日产量字典 Key 的字符串形式，取值 "1"～"7"，默认 "1"；沿用 Core 字符串字段契约。 */
    workFaceDayOutput: string;
    gasPressure: number;
    gasContentRate: number;
    range: number;
    measureFactor: number;
    coalReserve: number;
    gasReserve: number;
    startReserve: number;
    startTime: string;
    headLength: number;
    tiltLength: number;
    graphicArea: number;
    coalType: McCoalType;
    headH1: McExposureTime;
    headH2: McExposureTime;
    tiltH1: McExposureTime;
    tiltH2: McExposureTime;
    headH1Width: number;
    headH2Width: number;
    tiltH1Width: number;
    tiltH2Width: number;
}
/** 评价单元工作面日产量字典，用于下拉展示及同步接口分档映射。 */
export interface EvaluationUnitDayOutputOption {
    /** 同步接口 CompliancePara 的档位编号，取值 1～7。 */
    Key: number;
    /** 日产量区间及可解吸瓦斯含量上限的完整显示文本。 */
    Value: string;
    /** 该档可解吸瓦斯含量上限，对应 Value 括号内数值。 */
    Num: number;
}
/** 评价单元关联钻孔面板中的单条钻孔展示数据。 */
export interface EvaluationUnitBoreholeRow {
    /** 钻孔实体 objectId，用于保存评价单元的本地图纸关联。 */
    key: string;
    /** 钻孔号。 */
    boreholeNumber: string;
    /** 钻孔所属钻场编号；空字符串表示钻孔未关联钻场。 */
    drillSiteName: string;
    /** 钻孔所属巷道名称或编号；空字符串表示钻孔未关联巷道。 */
    tunnelName: string;
}
/** 评价单元关联钻孔面板的固定目标，打开后绑定图纸和单个评价单元。 */
export interface EvaluationUnitBoreholeTarget {
    /** 面板打开时的图纸 key，图纸切换后禁止继续写入。 */
    drawingKey: string;
    /** 当前单选评价单元的 objectId。 */
    entityId: string;
}
/**
 * 定向钻智能设计参数面板状态。
 * 设计计算字段继承 Core 契约，默认值与 Core 参数注释保持一致，用户清空后为 undefined。
 * 面积和钻场名称仅供展示，不传入 Core。
 */
export interface DirectionalDesignPanelParameters extends Partial<McDirectionalDesignParameter> {
    /** 已保存的抽采边界闭合多段线 objectId；空字符串表示尚未绘制。 */
    drainageBoundaryId: string;
    /** 已绘制设计边界的平面面积，单位平方米；0 表示尚未绘制边界。 */
    boundaryArea: number;
    /** 当前绘制或拾取的钻场实体 objectId；空字符串表示尚未选择钻场。 */
    drillSiteId: string;
    /** 已绘制钻场的显示名称；空字符串表示尚未绘制钻场。 */
    drillSiteLabel: string;
}
/** 定向钻数值控件输入；未填写的值保留为空，不隐式转换为 0。 */
export interface DirectionalDesignNumberControlProps {
    /** Core 参数当前值；undefined 表示未填写。 */
    modelValue?: number;
    /** 是否禁用输入，默认可编辑。 */
    disabled?: boolean;
    /** 显示单位；空字符串表示无单位。 */
    unit: string;
}
/** 直接绑定 Core 数值字段的定向钻参数控件配置。 */
export interface DirectionalDesignNumberField {
    /** 定向钻面板中可编辑的数值参数键。 */
    key: Exclude<keyof DirectionalDesignPanelParameters, 'drainageBoundaryId' | 'drillSiteId' | 'boundaryArea' | 'drillSiteLabel'>;
    /** 面板显示标签。 */
    label: string;
    /** 面板显示单位；无单位时为空字符串。 */
    unit: string;
}
/** 定向钻智能设计面板的业务操作，由宿主按 Core 能力分别接入。 */
export interface DirectionalDesignPanelActions {
    /** 响应绘制设计边界操作。 */
    onDrawBoundary: () => void | Promise<void>;
    /** 响应绘制钻场操作。 */
    onDrawDrillSite: () => void | Promise<void>;
    /** 响应从当前图纸拾取已有钻场操作。 */
    onSelectDrillSite: () => void | Promise<void>;
    /** 使用点击时的完整参数快照开始设计。 */
    onStartDesign: (parameters: DirectionalDesignPanelParameters) => void | Promise<void>;
    /** 关闭参数面板并返回抽采设计模块。 */
    onClose: () => void;
}
/** 定向钻智能设计参数会话，负责关闭、换图及交互命令的生命周期。 */
export interface DirectionalDesignController {
    /** 等待活动图纸就绪并打开参数面板；准备失败时抛出错误。 */
    open: () => Promise<void>;
    /** 结束本会话，仅中断本会话拥有的命令，不移除其他面板。 */
    close: () => void;
}
/** 定向钻参数面板完成绘制或拾取后的钻场结果。 */
export interface DirectionalDesignDrillSiteSelection {
    /** 钻场实体 objectId，作为 Core 定向钻设计的钻场引用。 */
    id: string;
    /** 钻场业务编号，用于参数面板只读展示。 */
    label: string;
}
/** 定向钻面板钻场只读结果控件的输入属性。 */
export interface DirectionalDrillSiteControlProps {
    /** 当前钻场显示名称；空字符串表示尚未绘制或拾取钻场。 */
    modelValue: string;
    /** 控件禁用状态；禁用时不得触发图纸拾取。 */
    disabled?: boolean;
    /** 点击右侧拾取图标时执行的业务操作。 */
    onPick: () => void;
}
/** 定向钻设计结果的单个 Excel 式数据行。 */
export interface DirectionalDesignResultRow {
    /** 从主孔开孔点累计的孔深，单位米；分支包含主孔沿程长度，清空输入时为 null。 */
    depth: number | null;
    /** 方位角，单位度，正北为 0、顺时针增加；清空输入时为 null。 */
    azimuth: number | null;
    /** 倾角，单位度，向上为正、向下为负；清空输入时为 null。 */
    inclination: number | null;
    /** 方位角减目标方位角，单位度，不额外归一化；分支首行命中主支测点时按原表继承其偏差，依赖缺失时为 null。 */
    deviation: number | null;
    /** 相对孔口、沿目标方位的纵向距离，单位米；所需输入缺失时为 null。 */
    relativeX: number | null;
    /** 相对孔口、目标方位右侧为正的横向偏移，单位米；所需输入缺失时为 null。 */
    relativeY: number | null;
    /** 相对孔口的上下偏移，单位米，向上为正；所需输入缺失时为 null。 */
    relativeZ: number | null;
    /** 东向 X 坐标，单位米；主孔首行取 getPosition().x 或导入表 H3，后续按平衡正切法累计，无法计算时为 null。 */
    eastX: number | null;
    /** 北向 Y 坐标，单位米；主孔首行取 getPosition().y 或导入表 I3，后续按平衡正切法累计，无法计算时为 null。 */
    northY: number | null;
    /** Z 坐标，单位米；主孔首行取 getPosition().z 或导入表 J3，后续以孔口 Z 为基准累计，无法计算时为 null。 */
    elevation: number | null;
    /** 轨迹所属分支名称。 */
    branch: string;
}
/** 定向钻设计结果底部单个 Sheet 的展示数据。 */
export interface DirectionalDesignResultSheet {
    /** 对应定向钻实体的 objectId，用于页签唯一标识及场景高亮，不使用可能重名的孔号。 */
    key: string;
    /** Sheet 页签及孔号区域显示名称，原样使用 Core 孔号并保留其中的组编号。 */
    label: string;
    /** 设计/实际属性：true 对应“孔号＋设计”工作表，false 对应“孔号＋成孔”或无类别后缀的旧模板。 */
    isDesign: boolean;
    /** 开孔位置说明，来自实体 getDrillPosition() 或导入表 B1；空字符串表示未记录。 */
    openingPosition: string;
    /** 该钻孔的设计日期，格式为 YYYY-MM-DD。 */
    designDate: string;
    /** 该钻孔的目标方位角，单位度，初始由实体 getTargetHeading() 提供；清空输入时为 null。 */
    targetAzimuth: number | null;
    /** 偏角率文本，表示相邻钻杆偏离角，单位度；面板及模板取全局 directionalDrillDeviationRate（初值 1.5），导入暂存 K1 原值。 */
    deviationRate: string;
    /** 当前 Sheet 的轨迹数据行。 */
    rows: DirectionalDesignResultRow[];
    /** 原实体的分支起点及校验输入；参数导出保留此信息，确保反演不受表格派生坐标影响。 */
    cadBranchOrigins?: DirectionalCadBranchOrigins;
}
/** 分支起点溯源使用的主孔测量输入，不包含公式派生坐标。 */
export interface DirectionalCadOriginInput {
    /** 从孔口累计的孔深，单位米。 */
    depth: number;
    /** 到达当前测点的方位角，单位度。 */
    azimuth: number;
    /** 到达当前测点的倾角，单位度。 */
    inclination: number;
}
/** 原实体单个分支的实际起点，允许与主孔投影点存在偏移。 */
export interface DirectionalCadBranchOrigin {
    /** 与表格分支列对应的名称。 */
    branch: string;
    /** 导出时分支起点的累计孔深，单位米；此值被编辑后不再复用原起点。 */
    depth: number;
    /** 原分支的 CAD 世界坐标，单位米，不使用表格公式重算值。 */
    position: DrillSiteCoordRow;
}
/** 导出工作表中用于还原 CAD 分支起点的来源快照。 */
export interface DirectionalCadBranchOrigins {
    /** 来源孔口世界坐标，单位米；孔口变化后快照失效。 */
    origin: DrillSiteCoordRow;
    /** 来源主孔测点，顺序与表格一致；主孔输入变化后快照失效。 */
    main: DirectionalCadOriginInput[];
    /** 各分支的原始起点，只还原未改变分叉孔深的分支。 */
    branches: DirectionalCadBranchOrigin[];
}
/** 原公式使用的单位方向分量；传入方位角计算绝对坐标，传入偏差角计算相对坐标。 */
export interface DirectionalDesignDirection {
    /** 水平正弦分量，对应绝对东向或相对横向，无量纲；角度缺失时为 null。 */
    east: number | null;
    /** 水平余弦分量，对应绝对北向或相对纵向，无量纲；角度缺失时为 null。 */
    north: number | null;
    /** 向上分量，无量纲；倾角缺失时为 null。 */
    vertical: number | null;
}
/** 定向钻二维剖面单个数值轴的共享显示参数。 */
export interface DirectionalProfileAxisConfig {
    /** 网页图表和 Excel 图表共同显示的坐标轴标题。 */
    title: string;
    /** 坐标轴最小值，单位与当前轴数据一致。 */
    min: number;
    /** 坐标轴最大值，单位与当前轴数据一致。 */
    max: number;
    /** 主刻度及主网格间隔，单位与当前轴数据一致。 */
    majorUnit: number;
    /** 每个主刻度区间五等分后的次刻度及次网格间隔，单位与当前轴数据一致。 */
    minorUnit: number;
}
/** 二维剖面中一条主支或分支，顺序与图表系列索引一致。 */
export interface DirectionalProfileBranchSeries {
    /** 原始结果行中的分支名称。 */
    name: string;
    /** 每个轨迹点的累计孔深、相对 Z 坐标，单位均为米。 */
    data: [number, number][];
}
/** 三维轨迹中一条主支或分支的纵向、横向和上下偏移。 */
export interface DirectionalSpatialBranchSeries {
    /** 轨迹分支的显示名称。 */
    name: string;
    /** 相对主孔孔口的纵向 X、横向 Y、上下 Z，单位米；纵向沿目标方位，横向向右为正。 */
    data: [number, number, number][];
}
/** 网页 ECharts 与 Excel 导出共用的定向钻二维剖面显示参数。 */
export interface DirectionalProfileChartConfig {
    /** 孔深横轴参数。 */
    xAxis: DirectionalProfileAxisConfig;
    /** 上下偏移纵轴参数。 */
    yAxis: DirectionalProfileAxisConfig;
    /** 各轨迹分支依次采用的曲线颜色。 */
    colors: string[];
}
/** 可嵌入 Excel 的定向钻二维剖面图像。 */
export interface DirectionalProfileChartImage {
    /** ECharts 服务端 SVG 渲染结果的 UTF-8 字节。 */
    bytes: Uint8Array;
    /** 图像及 Excel 展示区域的宽度，单位像素。 */
    width: number;
    /** 图像及 Excel 展示区域的高度，单位像素。 */
    height: number;
}
/** 定向钻设计结果面板的动态输入。 */
export interface DirectionalDesignResultProps {
    /** 当前设计或既有钻孔的 Sheet 列表，每个钻孔对应一个结果页签。 */
    sheets: DirectionalDesignResultSheet[];
    /** 是否禁止编辑当前快照；定向钻参数及反演传 true，设计结果和特性详情传 false。 */
    readonly: boolean;
    /** 当前选中 Sheet 变化时同步场景钻孔高亮及外层标题栏操作。 */
    onActiveSheetChange: (sheet: DirectionalDesignResultSheet) => void;
    /** 打开当前 Sheet 的轨迹图；智能设计结果及参数详情提供，反演面板省略时隐藏入口。 */
    onOpenTrajectory?: () => void;
    /** 导出标题栏所属弹框的 CSS 类名；省略时使用智能设计结果弹框。 */
    dialogClass?: string;
    /** 工作簿附图及文件名选项；省略时沿用设计结果导出。 */
    exportOptions?: DirectionalDesignExportOptions;
    /** 智能设计产生的临时实体会话；查看既有钻孔详情时不提供。 */
    session?: DirectionalDesignResultSession;
    /** 保存本次智能设计成果并关闭结果面板；查看既有钻孔详情时不提供。 */
    onSave?: () => void;
    /** 取消本次智能设计成果并进入未保存关闭确认；查看既有钻孔详情时不提供。 */
    onCancel?: () => void;
}
/** 定向钻轨迹图的动态输入。 */
export interface DirectionalTrajectoryChartProps {
    /** 设计结果或既有钻孔详情面板当前选中的单个 Sheet，包含本次编辑及公式计算结果。 */
    sheet: DirectionalDesignResultSheet;
}
/** 定向钻设计结果整体导出组件的输入属性。 */
export interface DirectionalDesignResultExporterProps {
    /** 当前全部设计结果，每项导出为一个同名 Excel 工作表。 */
    sheets: DirectionalDesignResultSheet[];
    /** 打开当前 Sheet 的轨迹图；省略时隐藏入口。 */
    onOpenTrajectory?: () => void;
    /** 标题栏所属弹框的 CSS 类名；省略时使用智能设计结果弹框。 */
    dialogClass?: string;
    /** 工作簿附图及文件名选项；省略时沿用设计结果导出。 */
    exportOptions?: DirectionalDesignExportOptions;
    /** 保存本次智能设计成果；查看既有钻孔详情时不显示保存按钮。 */
    onSave?: () => void;
    /** 取消本次智能设计成果；查看既有钻孔详情时不显示取消按钮。 */
    onCancel?: () => void;
}
/** 定向钻设计结果及参数工作簿的导出选项。 */
export interface DirectionalDesignExportOptions {
    /** 是否附带轨迹图；省略时附图，参数及反演模板传 false。 */
    includeTrajectory?: boolean;
    /** 下载文件名前缀，不含日期和扩展名；省略时为“定向钻设计结果”。 */
    filename?: string;
}
/** 定向钻反演弹框持有的图纸事务及工作表。 */
export interface DirectionalReverseSession {
    /** 复用钻孔反演的实体备份、图纸绑定、删除和保存校验。 */
    reverse: DrainageReverseSession;
    /** 每个成功补建的设计孔或反演的实际孔对应一个 Sheet，key 与 reverse.rows 的 id 一致。 */
    sheets: DirectionalDesignResultSheet[];
}
/** 定向钻反演弹框输入；会话在最小化与恢复之间保持。 */
export interface DirectionalReverseDialogProps {
    /** 当前弹框独立持有的反演会话。 */
    session: DirectionalReverseSession;
    /** 校验并保留已导入的反演实体，成功后关闭弹框；失败时抛错。 */
    onSave: () => Promise<void>;
}
/** 定向钻智能设计结果会话持有的临时实体，仅在用户保存后转为正式成果。 */
export interface DirectionalDesignResultSession {
    /** 生成结果时的图纸 key；删除临时成果前必须仍处于该图纸。 */
    drawingKey: string;
    /** 本次设计绘制的边界实体 objectId。 */
    boundaryEntityId: string;
    /** 本次设计绘制的临时钻场 objectId；使用拾取钻场时为空字符串。 */
    temporaryDrillSiteId: string;
    /** 本次 Core 计算生成的全部钻孔实体 objectId。 */
    boreholeEntityIds: string[];
}
/** Element Plus 列宽拖拽事件中与定向钻结果对齐相关的列信息。 */
export interface DirectionalDesignTableColumnResizeInfo {
    /** 普通数据列对应的字段名；索引列没有该值。 */
    property?: string;
    /** 表格列类型，索引列为 index。 */
    type?: string;
}
/** 定向钻虚拟结果表输入；展示窗口与完整业务数据分离。 */
export interface DirectionalDesignVirtualTableProps {
    /** 完整结果行及只读空行，编辑直接更新原行对象。 */
    data: object[];
    /** 业务列、行号列及按可用宽度补齐的尾部空列配置。 */
    columns: Column[];
    /** 数据行高度，单位像素；未设置项为 32px。 */
    rowHeights: number[];
    /** 业务表头高度，单位像素。 */
    headerRowHeight: number;
}
/** 定向钻虚拟结果表的尺寸与滚动同步事件。 */
export interface DirectionalDesignVirtualTableEvents {
    /** 数据行高度（像素），序号对应完整数据源。 */
    rowResize: [rowIndex: number, height: number];
    /** 业务表头高度，单位像素。 */
    headerRowResize: [height: number];
    /** 列宽变更（像素），外层同步列标与元数据行。 */
    headerDragend: [width: number, oldWidth: number, column: DirectionalDesignTableColumnResizeInfo];
    /** 表体横向偏移，单位像素。 */
    scrollLeft: [left: number];
    /** 表体扣除滚动条后的可用宽度，单位像素。 */
    viewportWidth: [width: number];
    /** 单元格写入后通知外层适配列宽，行对象保持与完整结果一致。 */
    cellEdit: [column: Column, row: object];
}
/** 获取指定矿井、指定抽采数据类别的服务器数据；字段名大小写与查询接口保持一致。 */
export interface DrainageCloudCadDataRequest {
    /** 数据类别编号，字符串 1～6，含义见 DrainageCloudCadType。 */
    Type: DrainageCloudCadType;
    /** 矿井编码，必填，由当前工作区的 AreaCode 提供。 */
    mineCode: string;
}
/** GetCloudCadData 实测响应；失败响应可能没有 State，data 为 null。 */
export interface DrainageCloudCadResponse<T = DrainageServerDrillSite | DrainageServerBorehole | DrainageServerEvaluationUnit> {
    /** 服务端附加状态码，成功样例为 200；业务判断使用 code。 */
    State?: number;
    /** 业务状态码，200 为成功，410 为鉴权失败。 */
    code: number;
    /** 服务端结果说明。 */
    info: string;
    /** 结果数组；失败时可为 null，不代表空列表。 */
    data: T[] | null;
}
/** 钻场接口记录；未消费的扩展字段保留原值，不推断其类型或含义。 */
export interface DrainageServerDrillSite {
    /** 服务端唯一 GUID。 */
    ID: string;
    /** 矿井编码；历史数据可能为空字符串，列表归属以带 mineCode 的查询结果为准。 */
    MineCode: string;
    /** 钻场名称/编号，可能重复，不能单独作为唯一键。 */
    SideName: string;
    /** 设计端保存时记录来源实体 objectId；历史数据也可能为普通备注或空值。 */
    Remark?: string | null;
    /** 钻场类型显示名称，缺省时为空。 */
    SideType_Text: string | null;
    /** 所属巷道记录 GUID；空字符串表示服务端记录未关联巷道。 */
    laneway: string;
    /** 获取接口直接返回的所属巷道编码；未关联时为空字符串。 */
    lanewayCode: string;
    /** 所属巷道显示名称。 */
    laneway_Text: string | null;
    /** 边界坐标的 JSON 数组字符串；服务端 Y 为高程、Z 为 CAD 北坐标的相反数。 */
    Coord: string;
    /** 钻场高度，单位米；历史数据有负值，保留展示但禁止导入。 */
    Height: number;
    /** 删除标记，0 表示有效记录。 */
    DeleteMark: number;
    /** 服务端其他字段保持原始值，非空类型未经确认的字段不参与同步比较。 */
    [key: string]: unknown;
}
/** 四类钻孔共用的服务器记录；同号设计与实际参数合并保存，定向轨迹分别存入 Field4、Field3。 */
export interface DrainageServerBorehole {
    /** 服务端唯一 GUID。 */
    ID: string;
    /** 所属矿井编码。 */
    MineCode: string;
    /** 孔号，同一关联范围内仍可能重复。 */
    DrillName: string;
    /** 设计端保存的来源实体 objectId；未由设计端保存时可缺省或为 null。 */
    Field1?: string | null;
    /** 定向钻实际轨迹 JSON，结构为 DirectionalSyncTrajectory；分支起点使用 Core CAD 坐标，空值表示未保存此类轨迹。 */
    Field3?: string | null;
    /** 定向钻设计轨迹 JSON，结构及坐标轴同 Field3；空值时读取旧 Remark 主孔轨迹。 */
    Field4?: string | null;
    /** 孔型：1 顺层左帮、2 顺层右帮、3 穿层顶板、4 穿层底板、5 定向、6 高位；不同于请求 Type。 */
    DrillType: string;
    /** 孔型显示名称。 */
    DrillType_Text: string;
    /** 钻孔用途显示名称，使用 Core 已公开的用途枚举对接。 */
    DrillingPurpose_Text: string | null;
    /** 用途编号：1 区域防突、2 局部防突、3 采空区瓦斯治理；未记录时为 null。 */
    DrillingPurpose: number | null;
    /** 开孔处巷道走向，单位度，null 表示未记录。 */
    TunnelHeading: number | null;
    /** 设计开孔坐标 JSON 对象，服务端坐标轴与钻场 Coord 相同；null 表示未记录。 */
    Coord: string | null;
    /** 实际开孔坐标；不覆盖设计坐标。 */
    ActualCoord: string | null;
    /** 所属巷道记录 GUID，未关联时为 null。 */
    LanewayID: string | null;
    /** 获取接口直接返回的所属巷道编码；未关联时为空字符串。 */
    lanewayCode: string;
    /** 所属钻场记录 GUID，未关联时为 null。 */
    DrillingSiteID: string | null;
    /** 设计端保存的完整开孔位置说明；空字符串表示未记录，旧记录可能缺省或为 null。 */
    RefPointName?: string | null;
    /** 服务器查表生成的只读开孔位置说明，无法解析测点时为“未定义”。 */
    OpeningPosition: string | null;
    /** 设计方位角，单位度；定向孔逐段值保存在 Field4，旧记录保存在 Remark。 */
    DesignAzimuthAngle: number | null;
    /** 设计倾角，单位度；定向孔为 null，以 Field4 分段表示。 */
    DesignAngle: number | null;
    /** 设计孔深，单位米；定向孔为 null，以 Field4 分段表示。 */
    DesignDrillDepth: number | null;
    /** 设计孔径，单位米，写入 Core radius 时除以 2。 */
    DesignDrillDiameter: number | null;
    /** 设计抽采半径，单位米。 */
    DesignExtractionRadius: number | null;
    /** 设计见煤深度，单位米；null 表示未记录。 */
    DesignSeeCoalDepth: number | null;
    /** 设计止煤深度，单位米；null 表示未记录。 */
    DesignStopCoalDepth: number | null;
    /** 实际方位角，单位度；定向孔逐段值保存在 Field3。 */
    ActualAzimuthAngle: number | null;
    /** 实际倾角，单位度；新保存的定向孔为 null，以 Field3 分段表示。 */
    ActualAngle: number | null;
    /** 实际孔深，单位米；新保存的定向孔为 null，以 Field3 分段表示。 */
    ActualDrillDepth: number | null;
    /** 实际孔径，单位米。 */
    ActualDrillDiameter: number | null;
    /** 实际抽采半径，单位米。 */
    ActualExtractionRadius: number | null;
    /** 实际见煤深度，单位米。 */
    ActualSeeCoalDepth: number | null;
    /** 实际止煤深度，单位米。 */
    ActualStopCoalDepth: number | null;
    /** 旧定向孔设计主孔 [{heading,tilt,depth}] JSON；仅在 Field4 为空时读取，新同步不改写此字段。 */
    Remark: string | null;
    /** 删除标记，0 表示有效。 */
    DeleteMark: number;
    /** 其他服务器字段原样保留，未确认字段不参与写入。 */
    [key: string]: unknown;
}
/** 评价单元批量保存条目；每项独立携带主实体及其钻孔、测点关联。 */
export interface EvaluationUnitSaveItem {
    /** 待新增或修改的评价单元实体。 */
    evaluatingUnit: ZnccSjEvaluatingunitEntity;
    /** 服务端主键；省略表示新增，提供时表示修改对应记录。 */
    keyValue?: string;
    /** 当前评价单元关联的钻孔或测点；省略表示本次不同步关联关系。 */
    unitAndDrillList?: ZnccSjUnitanddrillEntity[];
}
/** 评价单元主实体，对应服务端 zncc_sj_evaluatingunit。 */
export interface ZnccSjEvaluatingunitEntity extends Record<string, unknown> {
    /** 工作面绝对瓦斯涌出量分档，取值 1～6。 */
    AbGasEmission?: number;
    /** 风量，单位 m³/min。 */
    AirVolume?: number;
    /** 达标可解吸瓦斯含量，单位 m³/t。 */
    AnalysisGasNum?: number;
    /** 残余可解吸瓦斯含量，单位 m³/t。 */
    AnalysisRemGasNum?: number;
    /** 区域 ID，对应 gis_workingface 工作面 ID。 */
    AreaID?: string | null;
    /** 煤的灰分。 */
    AshContent?: number;
    /** 标准大气压。 */
    Atm?: number;
    /** 煤种：1 无烟煤，2 瘦煤及焦煤，3 肥煤、气煤及长烟煤。 */
    CoalType?: number | null;
    /** 工作面日产量分档，取值 1～7。 */
    CompliancePara?: number;
    /** 达标情况：1 已达标，0 未达标。 */
    ComplianceStatus?: number;
    /** 吸附常数 a。 */
    ConstantA?: number;
    /** 吸附常数 b。 */
    ConstantB?: number;
    /** 创建公司 ID。 */
    CreateCompanyId?: string;
    /** 创建时间，JSON 请求中按日期时间字符串序列化。 */
    CreateDateTime?: Date;
    /** 创建部门 ID。 */
    CreateDepartmentId?: string;
    /** 创建人 ID。 */
    CreateUserId?: string;
    /** 删除标记。 */
    DeleteMark?: number;
    /** 抽采率，使用 0～1 小数。 */
    DrainageRate?: number;
    /** 抽采开始日期，JSON 请求中按日期时间字符串序列化。 */
    ExtractionDate?: Date;
    /** 计量因子。 */
    Factor?: number;
    /** 走向方向 H1 暴露时间分档，取值 1～7。 */
    H1Time?: number;
    /** 走向方向 H2 暴露时间分档，取值 1～7。 */
    H2time?: number;
    /** 评价单元主键。 */
    Id?: string;
    /** 初始抽采量。 */
    InitialExtractionNum?: number;
    /** 图形规则标记：0 不规则，1 规则。 */
    IrregularPolygon?: number;
    /** 长度。 */
    Length?: number;
    /** 煤的水分。 */
    MoistureContent?: number;
    /** 原始瓦斯含量。 */
    OriginalGasNum?: number;
    /** 原始瓦斯含量补充字段，业务含义待服务端确认。 */
    OriginalGasNum1?: string;
    /** 瓦斯涌出主要来源，取值 1～4。 */
    OutburstSource?: number | null;
    /** 父级 ID。 */
    ParentId?: string;
    /** 预计达标抽采时间，JSON 请求中按日期时间字符串序列化。 */
    PlanTime?: Date;
    /** T2 测点编号。 */
    PointCodeT2?: string;
    /** T 进测点编号。 */
    PointCodeTIn?: string;
    /** 图形面积。 */
    PolygonArea?: number;
    /** 煤的孔隙率。 */
    Porosity?: number;
    /** 抽采半径。 */
    Radius?: number;
    /** 区域坐标 JSON，用于保存采集点位。 */
    Regional?: string | null;
    /** 残余瓦斯含量，单位 m³/t。 */
    RemainingGasNum?: number;
    /** 残余瓦斯压力，单位 MPa。 */
    RemGasPressure?: number;
    /** 达标抽采率，使用 0～1 小数。 */
    StandardDrainageRate?: number;
    /** 达标抽采量。 */
    StandardExtractionNum?: number;
    /** 达标瓦斯含量，单位 m³/t。 */
    StandardGasNum?: number;
    /** 达标瓦斯压力，单位 MPa。 */
    StandardGasPressure?: number;
    /** 残存瓦斯含量，单位 m³/t。 */
    SurvivalGasNum?: number;
    /** T2 和 T 进的系统编号。 */
    SystemCode?: number;
    /** 倾向方向 h1 暴露时间分档，取值 1～7。 */
    Tendencyh1Time?: number;
    /** 倾向方向 h2 暴露时间分档，取值 1～7。 */
    Tendencyh2Time?: number;
    /** 厚度。 */
    Thickness?: number;
    /** 瓦斯总储量。 */
    TotalGasNum?: number;
    /** 煤炭总储量。 */
    TotalReserves?: number;
    /** 累计抽采量。 */
    TotalValue?: number;
    /** 实体类型：0 工作面，1 评价单元，2 区域。 */
    Type?: number;
    /** 评价单元名称。 */
    UnitName?: string;
    /** 容重（密度）。 */
    UnitWeight?: number;
    /** 容重补充字段，业务含义待服务端确认。 */
    UnitWeight1?: number;
    /** 修改时间，JSON 请求中按日期时间字符串序列化。 */
    UpdateDateTime?: Date;
    /** 修改人 ID。 */
    UpdateUserId?: string;
    /** 宽度。 */
    Width?: number;
}
/** 评价单元关联钻孔或测点实体，对应服务端 zncc_sj_unitanddrill。 */
export interface ZnccSjUnitanddrillEntity extends Record<string, unknown> {
    /** 创建公司 ID。 */
    CreateCompanyId?: string;
    /** 创建时间，JSON 请求中按日期时间字符串序列化。 */
    CreateDateTime?: Date;
    /** 创建部门 ID。 */
    CreateDepartmentId?: string;
    /** 创建人 ID。 */
    CreateUserId?: string;
    /** 删除标记：0 未删除，1 已删除。 */
    DeleteMark?: number;
    /** 钻孔 ID 或测点 ID。 */
    DrilD?: string;
    /** 关联记录主键。 */
    Id?: string;
    /** 关联类型：1 钻孔，2 管路。 */
    Type?: number;
    /** 评价单元 ID。 */
    UnitID?: string;
    /** 修改时间，JSON 请求中按日期时间字符串序列化。 */
    UpdateDateTime?: Date;
    /** 修改人 ID。 */
    UpdateUserId?: string;
}
/** 评价单元返回记录；已确认字段用于列表、详情、边界比较和本地实体导入。 */
export interface DrainageServerEvaluationUnit extends ZnccSjEvaluatingunitEntity {
    /** 服务端唯一 GUID，注意字段为 Id 而非 ID。 */
    Id: string;
    /** 评价单元名称。 */
    UnitName: string;
    /** 煤种字典键：1 无烟煤，2 瘦煤及焦煤，3 肥煤、气煤及长烟煤；null 表示未提供。 */
    CoalType: number | null;
    /** 瓦斯涌出来源字典键：1 非突出，2 条带，3 回采，4 邻近层或围岩，5 揭煤；null 表示未提供。 */
    OutburstSource: number | null;
    /** 接口返回的瓦斯涌出来源字典名称；缺省或 null 时按来源编码转换。 */
    OutburstSource_Text?: string | null;
    /** 关联区域 GUID，具体与矿井的关系待服务端确认。 */
    AreaID: string | null;
    /** 获取接口可选返回的巷道编码；缺省表示未提供，与本地实体的关联方式待确认。 */
    lanewayCode?: string;
    /** 区域坐标环 JSON，结构为 [[[x, y, z], ...]]，采用服务端坐标轴；未绘制时为 null。 */
    Regional: string | null;
    /** 删除标记，0 表示有效。 */
    DeleteMark: number;
}
/** 既有巷道查询接口中用于关联转换的字段。 */
export interface DrainageTunnelLookup {
    /** 巷道服务器 GUID。 */
    Id: string;
    /** Core 巷道业务编码。 */
    laneway_code: string;
    /** 巷道显示名称；接口未提供或未命名时为空，仅用于详情展示。 */
    laneway_name?: string | null;
    /** 所属矿井编码。 */
    MineCode: string;
    /** 删除标记，0 表示有效。 */
    DeleteMark: number;
}
/** 既有巷道 GetList 的双层响应；实测外层成功码 200、内层成功码 0。 */
export interface DrainageTunnelResponse {
    /** 外层业务状态码。 */
    code: number;
    /** 外层结果说明。 */
    info: string;
    /** 内层巷道列表响应，失败时可为 null。 */
    data: DrainageCloudCadResponse<DrainageTunnelLookup> | null;
}
/** 一次查询所需的服务器记录及关联表，只在当前同步面板会话中使用。 */
export interface DrainageServerContext {
    /** 当前类型返回的记录。 */
    records: (DrainageServerDrillSite | DrainageServerBorehole | DrainageServerEvaluationUnit)[];
    /** 钻场关联表，用于将 DrillingSiteID 转成钻场业务编号。 */
    sites: DrainageServerDrillSite[];
    /** 当前矿井的巷道 GUID、Core 编码与名称关联表；用于名称展示和上传时转换 GUID。 */
    tunnels: DrainageTunnelLookup[];
    /** 巷道关联表读取失败时的提示；不阻断已按 mineCode 查询到的钻场、钻孔列表展示。 */
    tunnelLookupIssue?: string;
    /** 本次请求的矿井编码。 */
    mineCode: string;
}
/** 本地同步筛选条件；空字符串表示全部，__unassociated__ 表示缺少该项关联。 */
export interface DrainageSyncFilters {
    /** 钻孔类型；取穿层钻孔、顺层钻孔、定向钻孔、高位钻孔，空字符串表示全部。 */
    boreholeType: string;
    /** 归一化钻场筛选标识；可解析时使用实体 objectId，否则按所属巷道和历史编号区分。 */
    site: string;
    /** 归一化巷道筛选标识；可解析时使用实体 objectId，否则保留历史编码的独立标识。 */
    tunnel: string;
    /** 工作面实体标识；未找到实体时使用巷道保存值或评价单元的 workFaceCode 作为独立筛选标识。 */
    workFace: string;
    /** 评价单元实体 objectId。 */
    evaluationUnit: string;
}
/** 单个本地实体在各筛选维度上的归属，多值表示同一同步行包含多个关联标识。 */
export interface DrainageSyncFilterData {
    /** 钻孔所属同步孔型；钻场及评价单元为空数组。 */
    boreholeType: string[];
    /** 归一化后的钻场标识；无关联时为空数组。 */
    site: string[];
    /** 归一化后的巷道标识；无关联时为空数组。 */
    tunnel: string[];
    /** 钻场和钻孔从巷道读取、评价单元从自身 workFaceCode 读取的工作面标识；未关联时为空数组。 */
    workFace: string[];
    /** 明确关联该钻孔的评价单元 objectId；无关联时为空数组。 */
    evaluationUnit: string[];
}
/** 筛选选项，标识参与匹配，名称只用于展示。 */
export interface DrainageSyncFilterOption {
    /** 当前图纸内的稳定筛选标识。 */
    value: string;
    /** 中文业务名称，同号钻场追加所属巷道以便区分。 */
    label: string;
}
/** 当前图纸的本地关联索引，不进入同步比较或持久化数据。 */
export interface DrainageSyncFilterIndex {
    /** 以本地实体 objectId 索引各筛选维度；设计孔与反演孔分别建项。 */
    entities: Map<string, DrainageSyncFilterData>;
    /** 各维度的标识与展示名称字典。 */
    labels: Record<DrainageSyncFilterKey, Map<string, string>>;
}
/** 单项本地筛选控件的展示配置。 */
export interface DrainageSyncFilterControl {
    /** 绑定的筛选条件字段。 */
    key: DrainageSyncFilterKey;
    /** 控件前的中文名称。 */
    label: string;
    /** 孔型固定为四类；其他选项根据上游条件从当前类别本地数据生成。 */
    options: DrainageSyncFilterOption[];
}
/** 同步弹框内的本地筛选区域输入。 */
export interface DrainageSyncFiltersProps {
    /** 当前三个大类型之一。 */
    category: DrainageSyncCategory;
    /** 当前类别的完整本地行，尚未经过筛选。 */
    rows: DrainageSyncRow[];
    /** 当前图纸关联索引；图纸尚未就绪时缺省。 */
    index?: DrainageSyncFilterIndex;
    /** 当前筛选值。 */
    modelValue: DrainageSyncFilters;
    /** 读取或写入期间禁用条件变更。 */
    disabled: boolean;
}
/** 本地同步筛选区域的值变更事件。 */
export interface DrainageSyncFiltersEmits {
    /**
     * 更新完整筛选快照，已清除本次修改字段的下游条件。
     * @param event Vue v-model 对应的值更新事件名。
     * @param value 新的完整筛选条件。
     * @returns 无返回值。
     */
    (event: 'update:modelValue', value: DrainageSyncFilters): void;
}
/** 单个同步面板会话的服务器数据加载器；钻场写入后需主动清理关联缓存。 */
export interface DrainageContextLoader {
    /** 读取当前类型记录并复用同矿井钻场、巷道关联；请求失败会清除对应失败缓存。 */
    load: (type: DrainageSyncType, mineCode: string) => Promise<DrainageServerContext>;
    /** 钻场保存或删除成功后清理钻场缓存；下一次 load 重新获取。 */
    invalidateSites: () => void;
    /** 用户手动刷新时清理钻场和巷道缓存，保证下一次 load 重新请求服务器。 */
    invalidateAll: () => void;
}
/** 服务器转换与本地对比后的同步分组结果。 */
export interface DrainageSyncResult {
    /** 四个同步分组。 */
    groups: DrainageSyncGroup[];
}
/** SaveListForm 保存参数：两个列表作为 form-data，isSite 作为 URL 查询参数。 */
export interface DrainageCloudCadSaveRequest {
    /** 钻孔记录 JSON 数组字符串；本次没有钻孔时传 []。 */
    gas_drillList: string;
    /** 钻场记录 JSON 数组字符串；本次不保存钻场时传 []。 */
    gas_siteList: string;
    /** 是否保存钻场；通过 URL 查询参数传 true/false，不能放入 FormData。 */
    isSite: boolean;
}
/** DeleteSiteDrillList 的 form-data 字段，按服务端 ID 删除。 */
export interface DrainageCloudCadDeleteRequest {
    /** 钻孔服务端 ID，以英文逗号分隔；没有钻孔时传空字符串。 */
    gas_drillList: string;
    /** 钻场服务端 ID，以英文逗号分隔；没有钻场时传空字符串。 */
    gas_siteList: string;
}
/** 写操作沿用平台 code/info 响应，成功后重新读取列表确认结果。 */
export interface DrainageCloudCadMutationResponse {
    /** 业务码，200 为平台业务成功状态。 */
    code: number;
    /** 服务端处理说明。 */
    info: string;
    /** 保存接口返回处理计数字符串，可能不是 JSON；不能据此确认落库，须重新查询实体。 */
    data?: unknown;
}
/** 钻场详情展示快照，由调用方从本地实体或服务器记录转换，不是服务端接口结构。 */
export interface DrillSiteDetailData {
    /** 钻场业务编号，不是实体 objectId。 */
    siteID: string;
    /** 所属巷道业务编号，未关联时为空字符串。 */
    tunnelID: string;
    /** 所属巷道名称，仅用于展示；缺省或空字符串表示未取得名称，不参与同步匹配。 */
    tunnelName?: string;
    /** 钻场高度，沿用 Core 数值及当前图纸长度单位。 */
    height: number;
    /** 是否显示钻场编号注记；服务器没有该样式字段时缺省。 */
    showText?: boolean;
    /** 钻场底部边界坐标，保持 Core 顺序；空数组表示没有坐标数据。 */
    coords: DrillSiteCoordRow[];
}
/** 钻孔详情展示快照；轨迹段深度、孔径及抽采半径均沿用现有抽采模块的米制数据。 */
export interface BoreholeDetailData {
    /** 钻孔业务孔号，不是实体 objectId。 */
    drillID: string;
    /** Core 钻孔类型枚举值。 */
    drillType: McBoreholeType;
    /** 钻孔用途；服务器未记录时缺省，不覆盖本地已有值。 */
    purpose?: McBoreholePurpose;
    /** 开孔处巷道走向，单位度；未记录时缺省。 */
    tunnelHeading?: number;
    /** 所属巷道业务编号，未关联时为空字符串。 */
    tunnelID: string;
    /** 所属巷道名称，仅用于展示；缺省或空字符串表示未取得名称，不参与同步匹配。 */
    tunnelName?: string;
    /** 所属钻场实体 ID；服务端快照为钻场 GUID，旧版导入可能为编号；未关联时为空字符串。 */
    siteID: string;
    /** 所属钻场名称（Core 钻场号或服务器 SideName）；缺省或空字符串表示未取得名称。 */
    siteName?: string;
    /** 服务端钻场记录的设计来源 objectId，用于导入钻孔时关联已有的本地钻场。 */
    siteSourceEntityId?: string;
    /** 开孔位置说明，未填写时为空字符串。 */
    drillPosition: string;
    /** 是否为设计钻孔。 */
    isDesign: boolean;
    /** 开孔三维坐标，沿用当前图纸坐标单位；服务器未记录时为 null。 */
    position: DrillSiteCoordRow | null;
    /** Core 几何半径，单位米，详情按两倍显示孔径；服务器缺孔径时为 null。 */
    radius: number | null;
    /** 抽采半径，单位米；服务器未记录时为 null。 */
    range: number | null;
    /** 是否显示抽采范围；服务器未提供该样式字段时缺省。 */
    showRange?: boolean;
    /** 见煤深度，单位米；Core 未记录时为 0，服务器未记录时为 null。 */
    inCoalLength: number | null;
    /** 止煤深度，单位米；Core 未记录时为 0，服务器未记录时为 null。 */
    outCoalLength: number | null;
    /** 按顺序排列的轨迹段；空数组表示没有轨迹数据，总孔深为各段深度之和。 */
    paths: BoreholePathRow[];
    /** 定向钻分支轨迹，起点为 Core CAD 坐标；无分支为空数组，普通孔缺省。 */
    branchData?: BoreholeBranchData[];
}
/** 脱离 Core 实体引用的定向钻分支快照，可用于同步及临时实体重建。 */
export interface BoreholeBranchData {
    /** 分支起点的 Core CAD 三维坐标，单位与当前图纸相同。 */
    position: DrillSiteCoordRow;
    /** 从分支起点开始的分段轨迹，段长为米、角度为度，保持 Core 原始顺序。 */
    paths: BoreholePathRow[];
}
/** 定向钻 Field3 / Field4 JSON 契约；主孔开孔坐标仍使用 ActualCoord / Coord。 */
export interface DirectionalSyncTrajectory {
    /** getPath() 获取的主孔分段轨迹，段长为米、角度为度。 */
    paths: BoreholePathRow[];
    /** getBranchData() 获取的全部分支，起点保持 Core CAD 坐标轴，无分支时为空数组。 */
    branchData: BoreholeBranchData[];
}
/** 服务器评价单元的属性展示文本，保留线上字典名称及接口缺失语义。 */
export interface EvaluationUnitServerAttributes {
    /** 条带、回采、揭煤来源对应的区域类型；其他来源无独立工作面类型时显示“接口未提供”。 */
    workFaceType: string;
    /** 线上瓦斯来源名称，缺少中文名称时使用来源编码字典。 */
    gasType: string;
    /** 煤种编码对应的中文名称；未提供或未知编码明确显示原因。 */
    coalType: string;
}
/** 评价单元同步详情；实体构造参数与服务器展示文本分开，避免将实体默认值显示为线上属性。 */
export interface EvaluationUnitDetailData {
    /** 评价单元名称。 */
    name: string;
    /** 所属工作面类型。 */
    workFaceType: McWorkFaceType;
    /** 瓦斯涌出来源。 */
    gasType: McGasSource;
    /** 煤种。 */
    coalType: McCoalType;
    /** 工作面日产量；本地保存实际输入值，服务端分档值不反向冒充实际产量。 */
    workFaceDayOutput?: string;
    /** 达标瓦斯压力，单位 MPa。 */
    gasPressure?: number;
    /** 达标瓦斯含量，单位 m³/t。 */
    gasContentRate?: number;
    /** 抽采半径。 */
    range?: number;
    /** 计量因子。 */
    measureFactor?: number;
    /** 煤炭总储量。 */
    coalReserve?: number;
    /** 瓦斯总储量。 */
    gasReserve?: number;
    /** 初始抽采量。 */
    startReserve?: number;
    /** 抽采开始时间；空字符串表示未设置。 */
    startTime?: string;
    /** 走向方向 H1 暴露时间，单位天；0 表示无暴露。 */
    headH1?: number;
    /** 走向方向 H2 暴露时间，单位天；0 表示无暴露。 */
    headH2?: number;
    /** 倾向方向 h1 暴露时间，单位天；0 表示无暴露。 */
    tiltH1?: number;
    /** 倾向方向 h2 暴露时间，单位天；0 表示无暴露。 */
    tiltH2?: number;
    /** 评价单元高度，对应服务端厚度字段。 */
    height?: number;
    /** 图形面积。 */
    area?: number;
    /** 服务器属性展示文本；本地快照不提供，直接使用实体属性。 */
    serverAttributes?: EvaluationUnitServerAttributes;
    /** 边界坐标，使用当前 CAD 坐标轴。 */
    coords: DrillSiteCoordRow[];
    /** 服务端关联区域 GUID；本地实体没有该字段时缺省。 */
    areaID?: string | null;
    /** 服务端返回的巷道编码；本地实体没有该字段时缺省。 */
    tunnelID?: string;
}
/** 钻场详情面板输入；面板只读快照，不请求同步接口、不写入图纸。 */
export interface DrillSiteDetailsProps {
    /** 展示模式，省略时为本地详情。 */
    type?: DrainageDetailMode;
    /** 本地钻场快照，未提供时显示空状态。 */
    localData?: DrillSiteDetailData;
    /** 服务器钻场快照，未提供时显示空状态。 */
    serverData?: DrillSiteDetailData;
}
/** 钻孔详情面板输入；本地及服务器数据采用同一展示契约。 */
export interface BoreholeDetailsProps {
    /** 展示模式，省略时为本地详情。 */
    type?: DrainageDetailMode;
    /** 本地钻孔快照，未提供时显示空状态。 */
    localData?: BoreholeDetailData;
    /** 服务器钻孔快照，未提供时显示空状态。 */
    serverData?: BoreholeDetailData;
    /** 同一原始孔号对应的本地反演钻孔快照；本地实体仍独立保存。 */
    localActualData?: BoreholeDetailData;
    /** 同一服务端钻孔记录中的实际施工参数快照。 */
    serverActualData?: BoreholeDetailData;
}
/** 评价单元详情面板输入；本地与服务器采用同一只读快照。 */
export interface EvaluationUnitDetailsProps {
    /** 展示模式，省略时为本地详情。 */
    type?: DrainageDetailMode;
    /** 本地评价单元快照。 */
    localData?: EvaluationUnitDetailData;
    /** 服务器评价单元快照。 */
    serverData?: EvaluationUnitDetailData;
}
/** 详情属性表的一行，使用稳定键进行本地与服务器的差异比较。 */
export interface DrainageDetailAttributeRow {
    /** 字段业务键。 */
    key: string;
    /** 属性显示名称。 */
    label: string;
    /** 展示值；空字符串保持为空，不自动替换为默认业务值。 */
    value: string | number;
    /** 差异比较值；关联名称展示时保存原始关联标识，缺省时按展示值比较。 */
    compareValue?: string | number;
}
/** 详情面板单侧已转换的只读视图。 */
export interface DrainageDetailView {
    /** 左侧属性表行。 */
    attributes: DrainageDetailAttributeRow[];
    /** 下方坐标或轨迹明细，序号从 1 开始。 */
    rows: (DrillSiteCoordTableRow | BoreholePathTableRow)[];
    /** 每次创建一个未入库的临时实体；缺少几何时返回 null，插件不可用时由预览组件显示错误状态。 */
    createPreviewEntity: () => McDbEntity | null;
    /** 创建同一预览画布内的多个临时实体；提供时优先于单实体工厂。 */
    createPreviewEntities?: () => McDbEntity[];
    /** 预览左上角的颜色说明；颜色采用 CSS 色值。 */
    previewLegend?: DrainagePreviewLegendItem[];
}
/** CAD 详情预览中的颜色图例。 */
export interface DrainagePreviewLegendItem {
    /** 图例对应的业务对象名称。 */
    label: string;
    /** 图例色块的 CSS 颜色。 */
    color: string;
}
/** 钻场和钻孔共用的同步详情布局输入。 */
export interface DrainageDetailPanelProps {
    /** 当前展示范围。 */
    type: DrainageDetailMode;
    /** 本地展示视图，缺省时为空。 */
    local?: DrainageDetailView;
    /** 服务器展示视图，缺省时为空。 */
    server?: DrainageDetailView;
    /** 下方明细分组标题。 */
    detailTitle: string;
    /** 下方明细表的只读列。 */
    columns: Column[];
}
/** 属性表行样式回调的输入，沿用公共表格的 row 参数。 */
export interface DrainageDetailAttributeRowContext {
    /** 当前属性行。 */
    row: DrainageDetailAttributeRow;
}
/** 临时 CAD 预览的输入，工厂不得返回正式图纸中的实体。 */
export interface DrainageDetailPreviewProps {
    /** 创建独立临时实体；缺省或返回 null 时展示空状态。 */
    createEntity?: () => McDbEntity | null;
    /** 创建多个独立临时实体；用于在同一画布叠加设计孔和实际孔。 */
    createEntities?: () => McDbEntity[];
    /** 预览左上角展示的实体颜色说明。 */
    legend?: DrainagePreviewLegendItem[];
}
/** 特性面板原生颜色控件提交的数据。 */
export interface DrainagePropertyColorValue {
    /** 用户选择后生成的 Core 颜色对象。 */
    mcColor: McColor;
}
/** 钻场坐标列表弹框的目标，图纸切换后不得继续修改原图纸。 */
export interface DrillSiteCoordsDialogProps {
    /** 当前图纸的唯一 key。 */
    drawingKey: string;
    /** 钻场实体的 objectId。 */
    entityId: string;
}
/** 钻场与评价单元共用的边界坐标弹框输入，切换图纸或取消选择后关闭。 */
export interface DrainageCoordsDialogProps extends DrillSiteCoordsDialogProps {
    /** 钻场或评价单元实体的 objectId。 */
    entityId: string;
    /** 目标实体类型；省略时沿用钻场弹框行为。 */
    entityType?: 'McDbDrillSite' | 'McDbGasArea';
}
/** 钻场或评价单元边界点的可编辑坐标值，单位为当前图纸坐标单位。 */
export interface DrillSiteCoordRow {
    /** X 坐标。 */
    x: number;
    /** Y 坐标。 */
    y: number;
    /** Z 坐标。 */
    z: number;
}
/** 公共表格展示的钻场或评价单元边界点，序号从 1 开始且在当前列表内唯一。 */
export interface DrillSiteCoordTableRow extends DrillSiteCoordRow {
    /** 当前坐标在边界点数组中的展示序号，从 1 开始。 */
    index: number;
}
/** 钻场边界点单次修改的命令参数。 */
export interface DrillSiteCoordCommandPayload extends DrillSiteCoordsDialogProps {
    /** 本次操作类型。 */
    action: DrillSiteCoordAction;
    /** 修改时从零开始的边界点下标；新增在末尾追加，不提供该字段。 */
    index?: number;
    /** 批量删除时从零开始的点下标集合；其他操作不提供。 */
    indices?: number[];
    /** 新增或修改时的目标坐标；删除时不提供。 */
    coord?: DrillSiteCoordRow;
}
/** 钻孔轨迹弹框所绑定的图纸和钻孔实体。 */
export interface BoreholePathsDialogProps {
    /** 弹框打开时活动图纸的唯一 key。 */
    drawingKey: string;
    /** 目标钻孔实体的 objectId。 */
    entityId: string;
}
/** 单条钻孔轨迹段，深度单位米，角度单位度。 */
export interface BoreholePathRow {
    /** 当前轨迹段长度，单位米，必须大于零。 */
    depth: number;
    /** 当前轨迹段方位角，单位度。 */
    heading: number;
    /** 当前轨迹段倾角，单位度。 */
    tilt: number;
}
/** 钻孔轨迹段在列表中的显示数据。 */
export interface BoreholePathTableRow extends BoreholePathRow {
    /** 当前轨迹段的展示序号，从 1 开始。 */
    index: number;
}
/** 钻孔轨迹单次增删改命令参数。 */
export interface BoreholePathCommandPayload extends BoreholePathsDialogProps {
    /** 本次增删改操作类型。 */
    action: BoreholePathAction;
    /** 修改时从零开始的轨迹段下标；新增时在末尾追加。 */
    index?: number;
    /** 批量删除时从零开始的轨迹段下标集合。 */
    indices?: number[];
    /** 新增或修改时的轨迹段值；删除时不提供。 */
    path?: BoreholePathRow;
}
/** 钻场坐标与钻孔轨迹共用的三项数值输入弹框配置。 */
export interface DrainageNumberFormConfig {
    /** 公共弹框 ID，同一列表只允许打开一个输入弹框。 */
    id: string;
    /** 新增或修改时显示在公共弹框顶部的标题。 */
    title: string;
    /** 三个数值字段的标签，顺序与 values 对应。 */
    labels: [string, string, string];
    /** 三个字段的初始数值，顺序与 labels 对应。 */
    values: DrainageNumberTriplet;
    /** 确认后的提交方法，成功返回 true 关闭弹框，失败返回 false 保留输入。 */
    onSubmit: (values: DrainageNumberTriplet) => Promise<boolean>;
}
/** 内容组件提供给公共弹框确认按钮的接口。 */
export interface DrainageNumberFormData {
    /** 验证输入并提交；失败时阻止公共弹框关闭。 */
    confirm: () => Promise<boolean>;
}
/** 单孔、顺层和穿层孔共用的会话配置；参数与返回值直接沿用 Core 契约。 */
export interface BoreholeSessionConfig<TParameter, TResult> {
    /** 检查当前已安装插件是否提供本模式的绘制 API，用于识别未更新的插件包。 */
    isAvailable: (api: CoreGeologyCollectTool) => boolean;
    /** 从插件枚举构造本次打开使用的完整默认参数。 */
    createParameters: (api: CoreGeologyCollectTool) => TParameter;
    /** 创建参数面板；onChange 接收完整参数快照，onClose 结束当前会话。 */
    createPanel: (onClose: () => void, parameters: TParameter, api: CoreGeologyCollectTool, onChange: (parameters: TParameter) => void) => NodeModuleDefine;
    /** 调用插件异步绘制 API；返回实体或实体集合，取消返回 null，异常继续抛出。 */
    draw: (core: McCore, api: CoreGeologyCollectTool, parameters: TParameter) => Promise<TResult | null>;
    /** 通过已安装插件的事件单例发送实时参数。 */
    emitParameters: (api: CoreGeologyCollectTool, parameters: TParameter) => void;
    /** 清理本模式的参数回调，不修改其他模式的回调。 */
    clearParameters: (api: CoreGeologyCollectTool) => void;
}
/** 穿层孔命令完成后返回的正式钻孔与钻场实体集合。 */
export interface ThroughHoleDrawResult {
    /** 本次穿层孔设计写入当前图纸的钻孔实体。 */
    drills: McDbDrainageBorehole[];
    /** 本次穿层孔设计新建或采用的钻场实体。 */
    sites: McDbDrillSite[];
}
/** 钻场、钻孔参数共用面板的输入，不改变当前图纸数据。 */
export interface DrainageParameterDialogProps {
    /** 参数对象类型；省略时打开原钻孔参数表。 */
    mode?: DrainageReverseMode;
}
/** 钻场参数行，展示字段与钻场反演参数一致，未取得的定位信息留空。 */
export interface DrainageSiteParameterRow {
    /** 钻场实体 objectId，用于行点击定位，不是钻场业务编号。 */
    id: string;
    /** 采集时所属图纸 key，用于阻止跨图纸定位。 */
    drawingKey: string;
    /** 当前实体的钻场业务编号，保留前导零。 */
    siteName: string;
    /** 钻场深度，单位米，显示三位小数；缺少四角坐标时为空。 */
    depth: string;
    /** 钻场长度，单位米，显示三位小数；缺少四角坐标时为空。 */
    length: string;
    /** 当前钻场高度，单位米，显示三位小数。 */
    height: string;
    /** 关联巷道名称；关联不存在时为空。 */
    tunnelName: string;
    /** Core 按钻场口中点返回的导线点名称；缺少定位条件时为空。 */
    wirePointName: string;
    /** Core 返回的导线点方向，前或后；缺少定位条件时为空。 */
    wirePointDirection: string;
    /** Core 返回的钻场口中点到导线点的距离，单位米，显示三位小数；缺少定位条件时为空。 */
    guideDistance: string;
    /** 钻场相对关联巷道前进方向的位置，左帮或右帮；无法判断时为空。 */
    sitePosition: string;
    /** 当前几何及 Core 定位 API 返回的反演模板字段，长度单位米；采集保留原始精度，Excel 导出时取两位小数。 */
    exportValues: Record<string, string | number>;
}
/** 钻孔参数表格的单行展示数据。 */
export interface DrainageBoreholeParameterRow {
    /** 钻孔实体 objectId，用于点击定位，不是钻孔业务编号。 */
    id: string;
    /** 采集此行时所属图纸的 key，防止切换图纸后定位到同 ID 实体。 */
    drawingKey: string;
    /** 参数来源展示文本：设计或实际。 */
    valueMode: string;
    /** 钻孔业务编号。 */
    boreholeCode: string;
    /** 钻孔分类名称。 */
    boreholeType: string;
    /** 钻孔所属巷道名称。 */
    tunnelName: string;
    /** 开孔所在钻场或具体位置。 */
    openingPosition: string;
    /** 钻孔方位角，单位：度。 */
    azimuth: string;
    /** 钻孔倾角，单位：度。 */
    inclination: string;
    /** 钻孔设计孔深，单位：米。 */
    depth: string;
    /** 钻孔孔径，单位：毫米。 */
    diameter: string;
    /** 钻孔首次见煤深度，单位：米。 */
    coalStartDepth: string;
    /** 钻孔终止见煤深度，单位：米。 */
    coalEndDepth: string;
    /** 模板导出值：当前钻孔参数、Core API 返回的定位信息及已记录的施工字段；长度为米，未取得字段留空。 */
    exportValues: Record<string, string | number>;
}
/** Excel 字段定义，模板与读取共享同一份映射。 */
export interface DrainageExcelColumn {
    key: string;
    header: string;
    numeric?: boolean;
}
/** 补充当前 ExcelJS 类型声明缺失的区域数据验证能力，避免逐行创建空白单元格。 */
export interface DrainageTemplateWorksheet extends Worksheet {
    /** 工作表的数据验证规则集合。 */
    dataValidations: {
        /**
         * 为单元格区域设置数据验证。
         * @param address Excel 区域地址，如 G2:G10001。
         * @param validation 下拉选项、输入提示及错误提示规则。
         * @returns 已登记的规则。
         */
        add(address: string, validation: DataValidation): DataValidation;
    };
}
/** Excel 原始行，编号使用字符串，附带真实工作表行号。 */
export interface DrainageReverseRow {
    /** 本次导入行标识；会话登记时加批次前缀。 */
    id: string;
    /** Excel 原始行号，从 1 开始。 */
    index: number;
    /** Excel 字段文本；反演后实际见止煤字段替换为实体最终值。 */
    values: Record<string, string>;
    /** 阻止本行写入的错误信息，空字符串表示无错误。 */
    errorMessage: string;
    /** 本次岩性煤段结果说明，名称未匹配时显示“煤段”；岩性无完整煤段或尚未反演时为空。 */
    coalReverseInfo?: string;
}
/** 已按地层顺序筛选的煤层资料，用于岩性反演匹配。 */
export interface DrainageCoalStratum {
    /** 地层业务编码，与工作面关联煤层编码匹配。 */
    code: string;
    /** 地层资料中的煤层名称。 */
    name: string;
}
/** 从反演岩性中提取的完整煤段，仅包含名称严格为“煤”的区段。 */
export interface DrainageCoalSegment {
    /** 见煤深度，沿钻孔累计深度，单位米。 */
    start: number;
    /** 止煤深度，沿钻孔累计深度，单位米。 */
    end: number;
    /** 起止深度差保留两位小数，单位米，仅用于主煤层匹配时的最长煤段比较。 */
    length: number;
}
/** 待写入实际孔的完整煤段；地层匹配只补充名称和编码，不影响煤段保留。 */
export interface DrainageReverseCoalSegment {
    /** 匹配地层的煤层编码；未匹配时为空字符串，不生成虚构编码。 */
    code: string;
    /** 匹配地层的煤层名称；未匹配时为空字符串。 */
    name: string;
    /** 本次反演数据确定的见煤深度，单位米。 */
    start: number;
    /** 本次反演数据确定的止煤深度，单位米。 */
    end: number;
    /** 该孔实际穿煤长度，即 end - start，单位米；写入 Core 的 thickness 字段。 */
    thickness: number;
}
/** 一次反演弹框持有的临时结果；取消时删除新建实体并恢复本次更新的原有反演孔。 */
export interface DrainageReverseSession {
    /** 本会话导入的表格行，包含生成失败的错误行。 */
    rows: DrainageReverseRow[];
    /** 行 ID 对应本次新建或更新的实体 ID；反演孔在前，后续为本会话新建的设计孔。 */
    entityIds: Map<string, string[]>;
    /** 原有反演孔首次更新前的快照，键为正式实体 ID；本会话新建的孔不保存恢复快照。 */
    originals: Map<string, McDbEntity>;
    /** 首次导入时绑定的图纸；尚未导入时为空。 */
    context?: DrainageDrawingContext;
    /** 是否正在执行导入、删除或保存，供界面禁用重复操作。 */
    busy: boolean;
    /** 导入批次序号，用于区分不同批次的表格行 ID。 */
    batch: number;
    /** 关闭弹框时是否保留已确认的新建和更新结果。 */
    preserveOnClose: boolean;
}
/** 钻场或指定孔型的反演弹框输入，反演会话与弹框标识共同隔离取消和保存操作。 */
export interface DrainageReverseDialogProps {
    /** 导入对象：钻场或普通钻孔。 */
    mode: import('./type').DrainageReverseMode;
    /** 钻孔菜单限定的孔型；钻场和通用命令省略。 */
    category?: import('./type').DrainageStraightBoreholeCategory;
    /** 所属弹框标识；未传时使用原通用钻场或钻孔弹框标识。 */
    dialogId?: string;
    /** 当前弹框独立持有的反演实体及回滚快照。 */
    session: DrainageReverseSession;
    /** 确认保留本次反演实体并关闭弹框；保存失败时拒绝。 */
    onSave: () => Promise<void>;
}
/** 评价单元的序列化业务快照；不包含实体标识、样式和关联钻孔。 */
export interface GasAreaSnapshot {
    /** 评价单元名称；导入时非空，允许重复，不作为反演匹配键。 */
    name: string;
    /** 工作面类型，使用 Core 插件枚举中文值。 */
    workFaceType: McWorkFaceType;
    /** 关联工作面编码；空字符串表示未关联。 */
    workFaceCode: string;
    /** 瓦斯涌出来源，使用 Core 插件枚举中文值。 */
    gasType: McGasSource;
    /** 煤种，使用 Core 插件枚举中文值。 */
    coalType: McCoalType;
    /** 工作面日产量档位，保存字典 Key 的字符串；空字符串表示未设置。 */
    workFaceDayOutput: string;
    /** 达标瓦斯压力，MPa，非负。 */
    gasPressure: number;
    /** 达标瓦斯含量，m³/t，非负。 */
    gasContentRate: number;
    /** 抽采半径，m，非负。 */
    range: number;
    /** 计量因子，无量纲，非负。 */
    measureFactor: number;
    /** 初始抽采量，m³，非负。 */
    startReserve: number;
    /** 抽采开始时间，沿用实体文本；空字符串表示未设置。 */
    startTime: string;
    /** 煤炭储量，t，非负。 */
    coalReserve: number;
    /** 瓦斯储量，m³，非负。 */
    gasReserve: number;
    /** 走向 H1 煤壁暴露时间，天；0 表示无暴露。 */
    headH1: number;
    /** 走向 H2 煤壁暴露时间，天；0 表示无暴露。 */
    headH2: number;
    /** 倾向 H1 煤壁暴露时间，天；0 表示无暴露。 */
    tiltH1: number;
    /** 倾向 H2 煤壁暴露时间，天；0 表示无暴露。 */
    tiltH2: number;
    /** 走向 H1 等值宽度，m，非负；反演不重算。 */
    headH1Width: number;
    /** 走向 H2 等值宽度，m，非负；反演不重算。 */
    headH2Width: number;
    /** 倾向 H1 等值宽度，m，非负；反演不重算。 */
    tiltH1Width: number;
    /** 倾向 H2 等值宽度，m，非负；反演不重算。 */
    tiltH2Width: number;
    /** 评价单元高度，m，导入时大于 0。 */
    height: number;
    /** 图形面积，m²，非负；沿用文件值，不按坐标重新覆盖。 */
    area: number;
    /** 完整有序世界坐标，m；Excel 最后一列保存 JSON，不在面板展示。 */
    coords: DrillSiteCoordRow[];
}
/** 评价单元参数行，携带只读业务快照和定位信息。 */
export interface GasAreaParameterRow {
    /** 实体 objectId。 */
    id: string;
    /** 所属图纸 key。 */
    drawingKey: string;
    /** 从 mctfOutFields 白名单提取的精确值。 */
    snapshot: GasAreaSnapshot;
    /** 业务列显示值；不含坐标、关联钻孔。 */
    values: Record<string, string | number>;
}
/** 面板与 Excel 共用的业务列定义，不含坐标列。 */
export interface GasAreaField {
    /** 业务快照中的标量字段。 */
    key: Exclude<keyof GasAreaSnapshot, 'coords'>;
    /** 中文表头及适用单位。 */
    label: string;
    /** 数值列使用 General；其他列按文本读写。 */
    numeric?: boolean;
}
/** Excel 一行评价单元反演输入，错误行保留原始业务文本供用户核对。 */
export interface GasAreaReverseRow {
    /** 会话内唯一行 ID。 */
    id: string;
    /** Excel 行号，从 2 开始。 */
    index: number;
    /** 面板业务列显示值，不含坐标。 */
    values: Record<string, string | number>;
    /** 校验成功时的精确数据；失败时缺省。 */
    snapshot?: GasAreaSnapshot;
    /** 数据校验或构造失败原因；空字符串表示有效。 */
    errorMessage: string;
}
/** 评价单元反演会话，独立记录每行新建实体，取消时按 ID 删除。 */
export interface GasAreaReverseSession {
    /** 当前全部结果行，包含错误行。 */
    rows: GasAreaReverseRow[];
    /** 行 ID 到正式评价单元实体 ID 的映射。 */
    entityIds: Map<string, string>;
    /** 首次导入绑定的图纸；未导入时缺省。 */
    context?: DrainageDrawingContext;
    /** 导入、删除、保存期间禁止重复操作。 */
    busy: boolean;
    /** 导入批次编号，用于隔离不同行 ID。 */
    batch: number;
    /** 保存后关闭保留图形，其他关闭必须先回滚。 */
    preserveOnClose: boolean;
}
/** 已校验的评价单元写入计划，不修改图纸即可构造。 */
export interface GasAreaReversePlan {
    /** 对应的 Excel 行。 */
    row: GasAreaReverseRow;
    /** 当前行独立构造的未入库新实体，同名行之间不共用。 */
    entity: McDbGasArea;
}
/** 共用评价单元参数和反演组件的输入。 */
export interface GasAreaDialogProps {
    /** 参数只读模式或导入反演模式。 */
    mode: 'parameter' | 'reverse';
    /** 当前面板 ID，用于保存、取消和最小化。 */
    dialogId: string;
    /** 反演模式必传，参数模式省略。 */
    session?: GasAreaReverseSession;
    /** 反演保存校验并关闭；参数模式省略。 */
    onSave?: () => Promise<void>;
}
/** 当前图纸中的反演关联对象，通过活动 Core 的插件 API 创建实体。 */
export interface DrainageDrawingContext {
    core: McCore;
    api: CoreGeologyCollectTool;
    drawingKey: string;
    tunnels: McDbTunnel[];
    sites: McDbDrillSite[];
    drills: McDbDrainageBorehole[];
}
export interface DrainageTunnelLocation {
    point: McGeVector3;
    direction: McGeVector3;
    distance: number;
}
/** 已确定的反演开孔位置及关联信息；可来自已有钻孔或 Excel 定位参数。 */
export interface DrainageReverseBoreholeLocation {
    /** 开孔坐标，图纸世界坐标，单位为米。 */
    position: McGeVector3;
    /** 钻孔业务类型，取值为 Core 插件的钻孔类型枚举。 */
    drillType: McBoreholeType;
    /** 关联巷道的实体 ID；复用已有孔时保持其原始关联值。 */
    tunnelID: string;
    /** 关联钻场的实体 ID；非钻场孔为空字符串。 */
    siteID: string;
    /** 开孔位置文字说明；未记录时为空字符串。 */
    drillPosition: string;
    /** 开孔位置的巷道方位角，单位为度。 */
    tunnelHeading: number;
}
/** 写入前已全部校验的一行实体；可更新已有反演孔并附带新建设计孔。 */
export interface DrainageReversePlan {
    /** 本次计划对应的 Excel 原始行。 */
    row: DrainageReverseRow;
    /** 未入库的目标数据；首项用于更新 existing 或新建反演孔，后续设计孔始终新增。 */
    entities?: McDbEntity[];
    /** 待更新的已有反演孔；缺省时所有目标实体均新增，设计孔永远不作为更新目标。 */
    existing?: McDbDrainageBorehole;
    /** 校验或实体构造失败原因；空字符串表示成功。 */
    errorMessage: string;
}
/** 实体参数对比的显示行；空字符串表示没有该项数据或不具备该项判定条件。 */
export interface DrainageQualificationRow {
    /** 巷道、钻场与原始孔号组合的行标识，不是实体 ID。 */
    id: string;
    /** 去除本地实际孔后缀 _fy 的原始孔号。 */
    boreholeCode: string;
    /** 反演孔当前见煤深度，单位为米；没有唯一反演孔时为空。 */
    actualCoalStart: string;
    /** 反演孔当前止煤深度，单位为米；没有唯一反演孔时为空。 */
    actualCoalEnd: string;
    /** 实际止煤深度减见煤深度，单位为米，保留两位小数。 */
    actualCoalLength: string;
    /** 设计孔当前见煤深度，单位为米；没有唯一设计孔时为空。 */
    designCoalStart: string;
    /** 设计孔当前止煤深度，单位为米；没有唯一设计孔时为空。 */
    designCoalEnd: string;
    /** 设计止煤深度减见煤深度，单位为米，保留两位小数。 */
    designCoalLength: string;
    /** 两套见止煤段长度差的绝对值，单位为米，保留两位小数。 */
    lengthError: string;
    /** 长度误差不超过设计煤段长度三分之一时为“合格”，否则为“不合格”。 */
    lengthQualified: string;
    /** 两孔见煤深度差的绝对值，单位为米，保留两位小数。 */
    startError: string;
    /** 两孔止煤深度差的绝对值，单位为米，保留两位小数。 */
    endError: string;
    /** 见煤、止煤深度误差均小于 5 米时为“合格”，否则为“不合格”。 */
    coalPointQualified: string;
    /** 反演孔见煤点与止煤点在 XY 平面的距离，单位为米，保留一位小数。 */
    actualPointDistance: string;
    /** 反演孔当前抽采半径，单位为米。 */
    actualDrainageRadius: string;
    /** 实际水平点距不超过抽采半径时为“合格”，否则为“不合格”；独立于设计数据检查。 */
    pointDistanceQualified: string;
    /** “合格”“不合格”或带原因的“未判定”；实际点距超限直接不合格，否则缺少设计对照时未判定。 */
    finalResult: string;
    /** 最终判定为“不合格”时为 true，包括缺少设计对照但实际点距超限的记录。 */
    exportUnqualified: boolean;
    /** 与界面数值及判定一致的导出字段，不包含图纸 key 和实体 ID。 */
    exportValues: Record<string, string>;
}
/** 图纸合格判定展示行，附带行点击定位所需的实体引用。 */
export interface DrainageQualificationDrawingRow extends DrainageQualificationRow {
    /** 定位实体当前的钻孔类型，用于类型筛选。 */
    boreholeType: string;
    /** 定位实体关联的巷道名称，用于名称筛选；关联无法解析时为空字符串。 */
    tunnelName: string;
    /** 采集判定数据时的图纸 key，用于阻止跨图纸定位。 */
    drawingKey: string;
    /** 定位钻孔的真实 objectId；优先实际孔，没有实际孔时使用设计孔，不使用聚合行 id。 */
    entityId: string;
}
/** 随实体保存的原始 Excel 导入记录；合格判定不再使用该记录补齐另一套参数。 */
export interface DrainageExcelMetadata {
    /** 当前导入记录格式版本，固定为 1。 */
    version: 1;
    /** 原始表头字段键对应的单元格文本，空字符串表示未填写。 */
    values: Record<string, string>;
    /** 导入对象为钻场或钻孔。 */
    mode: import('./type').DrainageReverseMode;
    /** 创建该实体采用设计参数还是实际参数。 */
    valueMode: import('./type').DrainageDrillValueMode;
    /** 钻场定位的距离基准为中心或起点；钻孔记录中不用于合格判定。 */
    siteAnchor: import('./type').DrainageSiteAnchor;
}
/** 从图上唯一实体读取的合格判定参数；没有唯一实体时各字段缺省。 */
export interface DrainageCoalMeasurement {
    /** 见煤深度，单位为米；沿用既有规则，零值不参与见止煤判定。 */
    start?: number;
    /** 止煤深度，单位为米；沿用既有规则，零值不参与见止煤判定。 */
    end?: number;
    /** 抽采半径，单位为米；零值或缺省时跳过实际点距判定。 */
    radius?: number;
}
/** 同步弹框列表行，详情保存独立快照，不持有正式实体引用。 */
export interface DrainageSyncRow {
    /** 提交前核实的评价单元关联钻孔服务端 ID；空数组表示无关联，缺省表示尚未准备关联数据。 */
    evaluationUnitServerDrillIds?: string[];
    /** 服务端记录保存的设计来源 objectId，用于服务端 ID 与本地 ID 不同时的明确关联。 */
    sourceEntityId?: string;
    /** 当前列表内的稳定行标识。 */
    id: string;
    /** 数据在当前分组中的展示序号。 */
    index: number;
    /** 同步对象名称。 */
    name: string;
    /** 对应类型的详情输入；未提供表示该行尚不支持详情。 */
    detail?: DrainageSyncDetail;
    /** 本地实体 objectId；仅存在本地数据的行提供。 */
    localEntityId?: string;
    /** 聚合行包含的全部本地实体 ID；钻孔可同时包含设计孔和反演孔。 */
    localEntityIds?: string[];
    /** 服务端 GUID，不使用名称冒充关联标识。 */
    serverId?: string;
    /** 原始服务端对象；覆盖时复制为底稿，只改本地已有设计或实际实体对应的字段。 */
    serverRecord?: DrainageServerDrillSite | DrainageServerBorehole | DrainageServerEvaluationUnit;
    /** 服务端记录来自带当前 mineCode 的查询，服务器删除必须为 true。 */
    serverMineVerified?: boolean;
    /** 关联范围内的组合业务键，仅用于新增上传时检查批量重号，不用于同步分组配对。 */
    matchKey?: string;
    /** 数据缺失、重复或关联不明的原因；有值时禁止获取/覆盖本地。 */
    issue?: string;
}
/** 同步命令输入，UI 负责确认，服务负责预检及统一命令执行。 */
export interface DrainageSyncLocalOperation {
    /** 创建新实体、采用服务器内容或删除本地实体。 */
    action: 'import' | 'replace' | 'delete';
    /** 操作所属图纸，切换图纸后拒绝执行。 */
    drawingKey: string;
    /** 经过当前分组选择的完整行。 */
    rows: DrainageSyncRow[];
}
/** 同步行展开后的单个实体目标；一条钻孔记录可对应设计、实际两个目标。 */
export interface DrainageSyncLocalTarget {
    /** 目标 objectId；新建设计孔使用服务端 ID，新建实际孔使用对应设计标识加 _fy，已有实体保留 ID。 */
    id: string;
    /** 此目标的具体操作；采用服务器时可以同时覆盖已有孔并补建缺少的孔。 */
    action: DrainageSyncLocalOperation['action'];
    /** 当前目标的同步行，钻孔 serverData 已切换到对应设计或实际快照。 */
    row: DrainageSyncRow;
}
/** 本地同步命令的单个实体预检结果，包含失败时恢复原实体所需的快照。 */
export interface DrainageSyncLocalPlan extends DrainageSyncLocalTarget {
    /** 已存在的本地实体；新增获取时缺省。 */
    existing?: McDbEntity;
    /** 服务端快照创建的独立实体；删除时缺省。 */
    replacement?: McDbEntity;
    /** 执行前的 Core 字段快照，用于校验引用及覆盖失败恢复。 */
    before: McMctfFiler;
    /** 删除前的独立备份，失败时用于重新加入图纸。 */
    deletedBackup?: McDbEntity;
}
/** 宿主页面提供的矿井上下文，未就绪时禁止请求跨矿井数据。 */
export interface DrainageWorkspaceContext {
    /** 当前工作区基础信息。 */
    currentWorkingAreaInfo?: {
        /** 矿井编码。 */
        AreaCode?: string;
    };
}
/** 同步面板的入口参数。 */
export interface DrainageSyncDialogProps {
    /** 顶部同步菜单传入的初始类型。 */
    initialType: DrainageSyncType;
}
/** 同步面板中的一个数据分组。 */
export interface DrainageSyncGroup {
    /** 分组标识。 */
    key: DrainageSyncGroupKey;
    /** 分组显示名称。 */
    label: string;
    /** 当前分组数据，未接入的数据源使用空数组。 */
    rows: DrainageSyncRow[];
    /** 分组已有的同步操作按钮文字。 */
    submitLabels: string[];
}
/**
 * 抽采设计结果面板中的钻孔行数据。
 * 孔径使用米，与旧钻孔参数表使用毫米的展示契约不同。
 */
export interface DrainageDesignResultRow {
    /** 钻孔实体 objectId（UUID），兼作树节点标识及 Core 定位、删除目标；不是业务孔号。 */
    id: string;
    /** 钻场模式下关联钻场实体的 objectId；其他设计模式为空，最后一个关联结果钻孔删除时同步删除钻场。 */
    siteEntityId?: string;
    /** 钻孔业务编号，按设计结果原样展示。 */
    boreholeCode: string;
    /** 钻孔类型名称，例如顺层左帮孔。 */
    boreholeType: string;
    /** 钻孔实体记录的所属巷道编号，由 getTunnelID() 返回；未关联巷道时为空字符串。 */
    tunnelID: string;
    /** 根据巷道编码查询本图纸巷道实体取得的名称；未关联或实体不存在时为空字符串。 */
    tunnelName: string;
    /** 钻孔开孔位置说明，格式由业务数据确定。 */
    boreholePosition: string;
    /** 开孔轨迹段方位角，单位：度；无轨迹时为空字符串。 */
    azimuth: number | '';
    /** 开孔轨迹段倾角，单位：度；无轨迹时为空字符串。 */
    inclination: number | '';
    /** 钻孔设计深度，单位：米。 */
    depth: number;
    /** 钻孔孔径，单位：米。 */
    radius: number;
    /** 钻孔首次见煤深度，单位：米；未见煤时为空字符串。 */
    coalStartDepth: number | '';
    /** 钻孔止煤深度，单位：米；未见煤时为空字符串。 */
    coalEndDepth: number | '';
    /** 子钻孔设计结果，用于展示分组树行；无子项时不传。 */
    children?: DrainageDesignResultRow[];
}
/** 设计结果所属巷道筛选项，编码用于匹配，名称用于显示。 */
export interface DrainageDesignResultTunnelOption {
    /** 巷道编码，保持同名巷道的筛选身份独立。 */
    value: string;
    /** 巷道实体的实际名称。 */
    label: string;
}
/** 设计结果弹框接收的展示快照，仅保存实体 objectId，不持有 Core 实体实例。 */
export interface DrainageDesignResultProps {
    /** 本次智能设计结果，可包含 children 树节点；未提供时显示空表。 */
    rows?: DrainageDesignResultRow[];
    /** 钻场模式本次设计返回的全部钻场实体 objectId，关闭结果时即使没有钻孔行也必须清理。 */
    siteEntityIds?: string[];
    /** 结果所属图纸 key；定位、删除仅允许在此图纸激活时执行。 */
    drawingKey?: string;
    /** 保存当前设计并关闭结果面板；只销毁面板，保留已生成的钻孔和钻场实体。 */
    onSave?: () => void;
}
/**
 * 采集工具内的抽采设计模块 API。
 * 顶部菜单由静态配置提供，交互命令随采集工具安装。
 */
export interface EditorDrainageDesignApi {
    /** 抽采设计顶部模块的唯一 key，供后续命令或面板绑定使用。 */
    readonly moduleKey: string;
}
/** 图件选择器节点；顺层孔与穿层孔按巷道、钻孔组分层，定向钻按巷道、完整孔号分层。 */
export interface DrainageDiagramOption {
    /** 选择节点的唯一标识。 */
    key: string;
    /** 巷道、普通钻孔组、定向孔完整孔号或评价单元的显示名称。 */
    label: string;
    /** 右侧预览需要绘制的当前图纸实体 ID。 */
    entityIds: string[];
    /** 巷道下的普通钻孔组或定向单孔节点；定向单孔节点可包含同孔号的设计、实际实体。 */
    children?: DrainageDiagramOption[];
}
/** Element Plus 图件树勾选事件返回的受控状态。 */
export interface DrainageDiagramTreeCheckState {
    /** 当前完全勾选的节点 key，包含叶节点及已全选的父节点。 */
    checkedKeys: string[];
}
/** 抽采图件共用的差异化配置。 */
export interface DrainageDiagramConfig {
    /** 图件类型，决定预览组件及二维图件的几何生成、插入接口。 */
    type: import('./type').DrainageDiagramType;
    /** 发起菜单限定的孔型，贯穿选组、框选、预览、导出和插入；省略时沿用原图件范围。 */
    category?: import('./type').DrainageBoreholeCategory;
    /** 弹框及导出文件标题。 */
    title: string;
    /** 分组模式左侧选择区域的标题。 */
    selectionTitle: string;
    /** 分组模式是否使用多选树。 */
    multiple: boolean;
    /** 原图纸标识，用于阻止跨图纸预览或插入。 */
    drawingKey: string;
    /** 分组模式的选择项；框选模式为空。 */
    options: DrainageDiagramOption[];
    /** 拾取所得实体 ID；存在时隐藏左侧区域，定向钻为单个定向孔，三维布置图为单个评价单元，其余剖面图为钻孔集合。 */
    pickedEntityIds?: string[];
}
/** Editor 完成图件拾取后的固定选择，不包含预览或正式新增实体。 */
export interface DrainageDiagramSelection {
    /** 拾取开始时的图纸标识。 */
    drawingKey: string;
    /** 开孔示意图为单条巷道 ID，定向钻剖面为单个定向孔 ID，三维布置图为单个评价单元 ID，其余剖面图为钻孔集合。 */
    entityIds: string[];
}
/** 公共图件弹框输入，兼容分组选择与框选后的纯预览。 */
export interface DrainageDiagramDialogProps {
    /** 当前图纸、图件类型和选择来源。 */
    config: DrainageDiagramConfig;
    /** 注册底部确认按钮的插入操作；成功返回 true，取消或失败返回 false。 */
    onReady: (insert: () => Promise<boolean>) => void;
}
/** 评价单元三维布置图弹框输入；只预览单元范围内或相交的穿层孔及单层煤层，不生成正式图件。 */
export interface EvaluationUnitSpatialDialogProps {
    /** 绑定图纸及评价单元选择；分组模式读取 options，框选模式读取唯一 pickedEntityIds。 */
    config: DrainageDiagramConfig;
}
/** ECharts GL 三维预览输入，所有源数据通过所属图纸的 Core 公开接口读取。 */
export interface EvaluationSpatialPreviewProps {
    /** 打开弹框时的图纸标识，切换图纸后停止展示旧图。 */
    drawingKey: string;
    /** 评价单元实体 ID；未选择时为 undefined。 */
    entityId?: string;
    /** 钻孔数据类型；设计和实际分别读取单元范围内或相交的穿层孔，不互相补用。 */
    valueMode: import('./type').DrainageDrillValueMode;
}
/** 单个有效穿煤段的实际空间位置，坐标及标高单位均为米。 */
export interface EvaluationSpatialCoalInterval {
    /** 沿孔深取得的见煤坐标，允许见煤深为零。 */
    entry: DrainageNumberTriplet;
    /** 沿孔深取得的止煤坐标，止煤深必须大于见煤深且不超过轨迹长度。 */
    exit: DrainageNumberTriplet;
}
/** 三维预览使用的独立钻孔快照，不持有正式实体的可变坐标。 */
export interface EvaluationSpatialBorehole {
    /** 正式钻孔实体 ID，仅用于识别预览来源。 */
    id: string;
    /** 显示孔号；孔号为空时使用实体 ID。 */
    name: string;
    /** 主孔及各分支的连续三维轨迹；每条至少包含两个有限坐标点，单位米。 */
    paths: DrainageNumberTriplet[][];
    /** 有效见止煤坐标；缺失、深度越界或轨迹不可用时为 null，只显示轨迹。 */
    coal: EvaluationSpatialCoalInterval | null;
}
/** 一次读取的评价单元三维数据，保持 Core 中的世界坐标和真实标高。 */
export interface EvaluationSpatialData {
    /** 评价单元名称；名称为空时使用实体 ID。 */
    areaName: string;
    /** 本次快照的数据模式，用于区分设计孔和实际孔的轨迹颜色及系列名称。 */
    valueMode: import('./type').DrainageDrillValueMode;
    /** 不重复首点的 XY 闭合边界，单位米；Z 不用于推断煤层高程。 */
    boundary: DrainageNumberTriplet[];
    /** 当前模式下位于单元范围内或与边界相交的穿层顶板孔、底板孔，实体 ID 已去重。 */
    boreholes: EvaluationSpatialBorehole[];
    /** 范围内或相交的设计、实际穿层孔全部有效轨迹点，仅固定两种模式共有的视野，不作为当前模式显示数据。 */
    viewportPoints: DrainageNumberTriplet[];
}
/** 顶底板共享的平面倾斜趋势，用于去趋势残差插值及真实标高恢复。 */
export interface EvaluationSpatialSurfaceTrend {
    /** 局部 X 每增加一米时的标高变化量，单位米/米。 */
    xSlope: number;
    /** 局部 Y 每增加一米时的标高变化量，单位米/米。 */
    ySlope: number;
}
/** ECharts surface 网格：凸四角评价单元使用连续整面，其他多边形使用边界三角形曲面片。 */
export interface EvaluationSpatialSurfacePatch {
    /** 顶板网格点，世界坐标，按行排列；控制点扣除共同倾斜趋势后作残差反距离加权，再恢复真实标高。 */
    roof: DrainageNumberTriplet[];
    /** 底板网格点，与顶板共用 XY 网格。 */
    floor: DrainageNumberTriplet[];
    /** 网格行数、列数，均不小于 2。 */
    shape: [number, number];
}
/** 单层煤层的插值结果；数据不足时保留钻孔轨迹并提供原因。 */
export interface EvaluationSpatialSurfaceResult {
    /** 仅覆盖评价单元边界内部的网格；凸四角单元仅一片，其他多边形按三角剖分，无法成面时为空。 */
    patches: EvaluationSpatialSurfacePatch[];
    /** 有有效穿煤段的钻孔数；多个分支不重复计数。 */
    coalCount: number;
    /** 曲面未生成的原因；成功时为空字符串。 */
    message: string;
}
/** 三维预览从应用 CSS 变量读取的主题色值，供 ECharts Canvas/WebGL 直接使用。 */
export interface EvaluationSpatialChartTheme {
    /** 预览背景和三维环境背景颜色，继承 --el-bg-color。 */
    backgroundColor: string;
    /** 坐标轴标题和提示框正文颜色，继承 --el-text-color-primary。 */
    textColor: string;
    /** 坐标刻度文字颜色，继承 --el-text-color-regular。 */
    axisLabelColor: string;
    /** 坐标轴及指示线颜色，继承 --el-text-color-placeholder。 */
    axisLineColor: string;
    /** 三维坐标网格线颜色，继承 --el-border-color。 */
    splitLineColor: string;
    /** 悬浮提示框背景颜色，继承 --el-bg-color-overlay。 */
    tooltipBackgroundColor: string;
    /** 悬浮提示框边框颜色，继承 --el-border-color。 */
    tooltipBorderColor: string;
}
/** ECharts GL 提示框传入的数据项，只读取图件使用的字段。 */
export interface EvaluationSpatialTooltipParameter {
    /** 系列名称，对应煤层顶板、底板、轨迹或见止煤点。 */
    seriesName: string;
    /** 钻孔号及见煤/止煤描述；曲面采样点可为空。 */
    name?: string;
    /** 图表局部 XY 及真实 Z 坐标，单位米。 */
    value: DrainageNumberTriplet;
}
/** 二维 CAD 图件预览输入，不向正式数据库写入实体。 */
export interface DrainageDiagramPreviewProps {
    /** 菜单限定的孔型；省略时沿用图件原有范围，变更时使旧预览快照失效。 */
    category?: import('./type').DrainageBoreholeCategory;
    /** 没有源实体时显示的提示；省略时提示在左侧选择对象。 */
    emptyMessage?: string;
    /** 预览所属的原图纸标识。 */
    drawingKey: string;
    /** 所选源实体 ID；具体类型由图件类型和 picked 决定。 */
    entityIds: string[];
    /** 图件类型；省略时直接预览源实体副本。 */
    diagramType?: import('./type').DrainageDiagramType;
    /** 开孔方向；省略时为横向。 */
    openHoleDirection?: import('./type').OpenHoleDiagramDirection;
    /** 评价单元剖面使用的钻孔类型；省略时为设计，普通孔及定向钻剖面的实体 ID 已在弹框中筛选。 */
    drillValueMode?: import('./type').DrainageDrillValueMode;
    /** 是否使用拾取结果；普通孔及评价单元剖面使用所选钻孔集合，定向钻剖面仅使用拾取的单孔。 */
    picked?: boolean;
}
/** 评价单元剖面几何与插入共用的输入。 */
export interface EvaluationProfileSource {
    /** 有效穿层孔实体；分组模式来自单元边界的包含或相交查询，框选模式来自拾取结果。 */
    boreholes: McDbDrainageBorehole[];
    /** 剖面标题中的评价单元名；框选模式沿用“评价单元”。 */
    areaName: string;
}
/** 预览当前显示的实体及其样式来源，仅用于独立图纸导出。 */
export interface DrainageDiagramExportSnapshot {
    /** 预览所借用图层及样式的数据库。 */
    database: McDbDatabase;
    /** 已完成预览的临时实体，仅用于独立导出。 */
    entities: McDbEntity[];
}
/** 图件预览组件对弹框暴露的导出和打印能力。 */
export interface DrainageDiagramPreviewHandle {
    /** 返回已就绪的快照；未就绪、预览变化或图纸切换时抛出错误。 */
    getExportSnapshot: () => DrainageDiagramExportSnapshot;
    /** 返回绑定当前预览版本的打印目标；更换对象、设计/实际或图纸后失效。 */
    getPrintTarget: () => import('McEditor').PrintTarget;
}

import type { StratumVertexSessionState, StratumVertexSourceType } from './enum';
import type { StratumEditorMode } from './type';
import type { DialogData } from 'McEditor';
/** 地质采集工具插件配置，当前暂未开放可配置项。 */
export interface EditorGeologyCollectToolPluginConfig {
}
/** 后端返回的单个地层模型。字段名保持接口契约原样。 */
export interface StratumModel {
    /** 地层模型唯一标识；列表接口缺失时由外层列表项 Id 补齐。 */
    Id: string;
    /** 地层业务编码。 */
    stratum_code: string;
    /** 地层名称。 */
    stratum_name: string;
    /** 地层类型字典值，对应 stratum_type 字典的 F_ItemValue。 */
    stratum_type: string;
    /** 地层显示颜色，接口格式为 RGB(r,g,b)。 */
    stratum_color: string;
    /** 地层显示顺序，数值越小越靠前。 */
    stratum_sort: number;
    /** 是否为标识层：1 是，0 否；为 0 时数据源编辑及保存操作禁用。 */
    is_mark_layer: number;
    /** 是否为含水层：1 是，0 否。 */
    is_aquifer: number;
    /** 是否为隔水层：1 是，0 否。 */
    is_aquiclude: number;
    /** 地层关联路径。 */
    stratum_path: string;
    /** 父级地层编码；空字符串表示无父级。 */
    stratum_parentcode: string;
    /** 地层最小厚度。 */
    stratum_thickness_min: number;
    /** 地层最大厚度。 */
    stratum_thickness_max: number;
    /** 地层平均厚度。 */
    stratum_thickness_ave: number;
    /** 地层岩性特性。 */
    formation_lithology: string;
    /** 物性特性。 */
    physical_characteristics: string;
    /** 水文地质特性。 */
    hydrogeological_characteristics: string;
    /** 工程地质特性。 */
    engineering_geological_characteristics: string;
    /** 岩性组。 */
    lithology: string;
    /** 备注。 */
    remark: string;
    /** 删除标记：0 表示正常数据；其他取值含义待服务端确认。 */
    DeleteMark: number;
    /** 创建时间，沿用服务端日期时间字符串格式。 */
    CreateDateTime: string;
    /** 创建用户标识。 */
    CreateUserId: string;
    /** 创建公司标识。 */
    CreateCompanyId: string;
    /** 创建部门标识。 */
    CreateDepartmentId: string;
    /** 最后更新用户标识。 */
    UpdateUserId: string;
    /** 最后更新时间，沿用服务端日期时间字符串格式。 */
    UpdateDateTime: string;
    /** 服务端历史坐标数据原文，当前面板不解析该字段。 */
    coordinate: string;
    /** 当前地层已保存顶点的 JSON 数组字符串，保存数据源变更时同步更新。 */
    vertexInfo: string;
    /** 与 `vertexInfo` 同步的精细化坐标 JSON，格式为 `[细化点坐标, 原始顶点坐标]`。 */
    refineCoord: string;
    /** 所属矿井编码。 */
    MineCode: string;
}
/** 地层列表接口中的单个包装项。字段名保持接口契约原样。 */
export interface StratumListResponse {
    /** 服务端返回的三角网原始数据；include_tin=0 时通常为空。 */
    tininfo: unknown[];
    /** 当前列表项的地层配置。 */
    configinfo: StratumModel;
    /** 列表项唯一标识，用于在 configinfo.Id 缺失时回填。 */
    Id: string;
}
/** 查询地层列表的服务端请求契约。 */
export interface StratumListRequest {
    /** 待查询的矿井编码。 */
    MineCode: string;
    /** 是否包含三角网数据：0 不包含，其他取值由服务端约定。 */
    include_tin: number;
}
/** 新增、修改、删除及排序地层共用的全量保存请求契约。 */
export interface StratumSaveRequest {
    /** 更新后的全部地层模型；服务端按全量数据统一保存。 */
    data: StratumModel[];
}
/** 查询地层关联顶点数据的服务端请求契约。 */
export interface StratumLinkVertexDataRequest {
    /** 地层所属矿井编码。 */
    MineCode: string;
    /** 待查询的地层编码。 */
    StratumCode: string;
    /** 关联数据源类型；完整枚举值由服务端约定。 */
    LinkSourceType: number;
    /** 三角网顶底板查询标识；当前调用传 0，完整取值含义待服务端确认。 */
    isTop: number;
}
/** 地层关联顶点数据，字段名保持接口契约原样。 */
export interface StratumLinkVertexData {
    /** 数据源类型。 */
    strType: string;
    /** 顶点数据来源。 */
    strSource: string;
    /** 顶点 X 坐标。 */
    x: number;
    /** 顶点 Y 坐标。 */
    y: number;
    /** 顶板高程。 */
    zTop: number;
    /** 底板高程。 */
    zBottom: number;
    /** 顶板与底板之间的厚度。 */
    thickness: number;
}
/** 数据字典接口返回的地层类型明细，属性名必须与服务端历史契约保持一致。 */
export interface StratumTypeDetail {
    /** 字典明细唯一标识。 */
    F_ItemDetailId: string;
    /** 所属字典项标识。 */
    F_ItemId: string;
    /** 父级字典明细标识。 */
    F_ParentId: string;
    /** 字典明细编码。 */
    F_ItemCode: string;
    /** 字典明细名称，用作地层类型显示文字。 */
    F_ItemName: string;
    /** 字典明细值，用作地层类型提交值。 */
    F_ItemValue: string;
    /** 字典数据来源标识。 */
    F_SourceId: string;
    /** 快速查询关键字。 */
    F_QuickQuery: string;
    /** 简拼检索值。 */
    F_SimpleSpelling: string;
    /** 是否为默认项；空值表示服务端未配置。 */
    F_IsDefault: number | null;
    /** 服务端排序值。 */
    F_SortCode: number;
    /** 删除标记：0 未删除。 */
    F_DeleteMark: number;
    /** 启用标记：1 启用。 */
    F_EnabledMark: number;
    /** 字典明细描述。 */
    F_Description: string;
    /** 创建时间。 */
    F_CreateDate: string;
    /** 创建用户标识。 */
    F_CreateUserId: string;
    /** 创建用户名称。 */
    F_CreateUserName: string;
    /** 修改时间；空值表示尚未修改。 */
    F_ModifyDate: string | null;
    /** 修改用户标识。 */
    F_ModifyUserId: string;
    /** 修改用户名称。 */
    F_ModifyUserName: string;
    /** 是否为系统内置项。 */
    IsSys: number;
    /** 创建公司标识。 */
    CreateCompanyId: string;
    /** 创建部门标识。 */
    CreateDepartmentId: string;
    /** 创建公司显示名称。 */
    CompanyID_Text: string | null;
    /** 创建部门显示名称。 */
    DepartmentID_Text: string | null;
    /** 服务端数据来源内容。 */
    F_SourceContent: string | null;
    /** 服务端数据来源扩展名称。 */
    F_SourceExName: string | null;
}
/** 地层类型下拉选项。 */
export interface StratumTypeOption {
    /** 显示文字。 */
    label: string;
    /** 提交值。 */
    value: string;
}
/** 父级地层下拉选项。 */
export interface StratumParentOption {
    /** 地层名称与编码组成的显示文字。 */
    label: string;
    /** 父级地层编码。 */
    value: string;
}
/** 地层编辑弹框组件属性。 */
export interface StratumEditorDialogProps {
    /** 编辑模式：新增或修改。 */
    mode: StratumEditorMode;
    /** 弹框表单的初始地层模型。 */
    model: StratumModel;
    /** 可选择的父级地层。 */
    parentOptions: StratumParentOption[];
    /** 校验通过后向面板提交新模型，并等待面板完成全量保存。 */
    onSubmit: (model: StratumModel) => void | Promise<void>;
}
/** 打开地层编辑弹框时使用的配置。 */
export interface OpenStratumEditorOptions {
    /** 编辑模式：新增或修改。 */
    mode: StratumEditorMode;
    /** 弹框表单的初始地层模型。 */
    model: StratumModel;
    /** 可选择的父级地层。 */
    parentOptions: StratumParentOption[];
    /** 接收弹框产出的新模型，并由面板更新和保存列表。 */
    onSubmit: (model: StratumModel) => void | Promise<void>;
}
/** 宿主弹框管理器与内容组件之间的数据协议。 */
export type StratumDialogData = DialogData;
/** 地层数据源弹框内的顶点数据行，字段名按界面表格职责归一化。 */
export interface StratumDataSourceRow {
    /** 面板内使用的稳定行标识。 */
    id: string;
    /** 数据源类型。 */
    dataSourceType: string;
    /** 数据源类型对应的服务端编码；接口返回未知名称时为空。 */
    sourceTypeCode?: StratumVertexSourceType;
    /** 数据源名称。 */
    sourceName: string;
    /** 当前编辑会话中的顶点状态，用于状态筛选和行颜色显示。 */
    sessionState: StratumVertexSessionState;
    /** 修改衍生点所关联原顶点的 `strSource`；非衍生点为空。 */
    originalStrSource?: string;
    /** X 坐标；空白编辑值允许使用字符串表示。 */
    x: number | string;
    /** Y 坐标；空白编辑值允许使用字符串表示。 */
    y: number | string;
    /** 顶板高程；空白编辑值允许使用字符串表示。 */
    roof: number | string;
    /** 底板高程；空白编辑值允许使用字符串表示。 */
    floor: number | string;
    /** 地层厚度；空白编辑值允许使用字符串表示。 */
    thickness: number | string;
}
/** 地层数据源弹框组件属性。 */
export interface StratumDataSourceDialogProps {
    /** 宿主弹框标识。 */
    dialogId: string;
    /** 当前查看的地层模型。 */
    model: StratumModel;
    /** 当前地层关联的数据源行。 */
    rows: StratumDataSourceRow[];
}
/** 从修改衍生点 `strSource` 中解析出的原始点关联信息。 */
export interface StratumModifiedVertexSource {
    /** 原始顶点的数据来源类型编码。 */
    sourceType: StratumVertexSourceType;
    /** 原顶点的完整 `strSource` 字段值。 */
    originalStrSource: string;
}
/** 地层顶点配置弹框组件属性。 */
export interface StratumVertexConfigDialogProps {
    /** 当前顶点配置弹框标识，用于坐标拾取时临时隐藏弹框。 */
    dialogId: string;
    /** 修改时传入的原始行；新增时为空。 */
    row?: StratumDataSourceRow;
    /** 提交新增或修改后的数据源行。 */
    onSubmit?: (row: StratumDataSourceRow) => void;
}
/** 地层等高线采集弹框组件属性。 */
export interface StratumCollectContourDialogProps {
    /** 当前采集图层名称。 */
    layerName: string;
    /** 当前选择的实体类型集合。 */
    entityTypes: string[];
    /** 图层名称变化回调。 */
    onLayerNameChange?: (layerName: string) => void;
    /** 实体类型集合变化回调。 */
    onEntityTypesChange?: (entityTypes: string[]) => void;
}
/** 地层模块通用简单弹框的打开配置。 */
export interface StratumSimpleDialogConfig {
    /** 宿主弹框唯一标识。 */
    id: string;
    /** 弹框标题国际化原文。 */
    title: string;
    /** 弹框宽度，包含 CSS 长度单位。 */
    width: string;
    /** 弹框高度，包含 CSS 长度单位。 */
    height: string;
    /** 已注册到编辑器上下文的组件键。 */
    component: string;
    /** 传递给弹框内容组件的属性。 */
    props?: Record<string, unknown>;
    /** 确认按钮国际化原文；缺省为“确定”。 */
    confirmText?: string;
    /** 取消按钮国际化原文；缺省为“取消”。 */
    cancelText?: string;
}
/** 简单弹框内容组件向宿主暴露的操作协议。 */
export type StratumSimpleDialogData = Pick<DialogData, 'confirm'>;
/** 地层图层选择表格行。 */
export interface StratumLayerRow {
    /** 当前图纸图层表中的一号起始显示序号。 */
    id: number;
    /** 当前图纸中的图层名称。 */
    name: string;
}
/** 地层图层选择弹框组件属性。 */
export interface StratumLayerSelectDialogProps {
    /** 当前图层名称。 */
    modelValue?: string;
    /** 提交选中图层名称；多选时使用中文顿号连接。 */
    onSubmit?: (layerName: string) => void;
}
/** 地层实体类型选择弹框组件属性。 */
export interface StratumEntityTypeDialogProps {
    /** 当前选中的实体类型名称集合。 */
    modelValue?: string[];
    /** 提交新的实体类型名称集合。 */
    onSubmit?: (values: string[]) => void;
}
/** 地层顶点新增或修改表单。 */
export interface StratumVertexConfigForm {
    /** 数据源类型。 */
    dataSourceType: string;
    /** 顶点数据源名称。 */
    sourceName: string;
    /** X 坐标。 */
    x: number;
    /** Y 坐标。 */
    y: number;
    /** 顶板高程。 */
    roof: number;
    /** 底板高程。 */
    floor: number;
    /** 地层厚度。 */
    thickness: number;
}
/** 根据已勾选顶点插值得到的新位置高程。 */
export interface StratumVertexInterpolation {
    /** 新位置的顶板高程。 */
    roof: number;
    /** 新位置的底板高程。 */
    floor: number;
    /** 顶板与底板之差。 */
    thickness: number;
}
/** 从图面采集地层等高线的配置表单。 */
export interface StratumCollectContourForm {
    /** 参与采集的图层名称。 */
    layerName: string;
    /** 参与采集的实体类型名称集合。 */
    entityTypes: string[];
    /** 是否只采集实体顶点。 */
    onlyVertex: boolean;
    /** 相邻采样线允许的最大夹角，单位为度。 */
    maxAngle: number;
    /** 采样间隔距离，图面单位待业务确认。 */
    intervalDistance: number;
    /** 是否使用线性采集。 */
    useLinearCollect: boolean;
    /** 线性转换参数 A，具体公式待业务确认。 */
    a: number;
    /** 线性转换参数 B，具体公式待业务确认。 */
    b: number;
    /** 是否绘制采集点圆标记。 */
    drawCircle: boolean;
    /** 圆标记半径，图面单位待业务确认。 */
    circleRadius: number;
    /** 采集结果输出图层名称。 */
    outputLayer: string;
}
/** 根据巷道数据生成地层等值线的配置表单。 */
export interface StratumTunnelContourForm {
    /** 等值线最小值，数值单位待业务确认。 */
    minValue: number;
    /** 等值线最大值，数值单位待业务确认。 */
    maxValue: number;
    /** 生成方式标识，当前支持按间隔或指定值生成。 */
    generateMode: string;
    /** 按间隔生成时使用的数值间隔。 */
    interval: number;
    /** 按指定值生成时使用的原始输入文本。 */
    specifiedValues: string;
    /** 拟合方式标识，完整取值含义待业务确认。 */
    fitMode: string;
}
/** 地质采集所需的宿主工作区上下文，仅声明本模块实际使用的字段。 */
export interface GeologyWorkingAreaContext {
    /** 宿主维护的当前工作区信息；未打开工作区时可能不存在。 */
    currentWorkingAreaInfo?: {
        /** 巷道同步采用的矿井编码，缺失或空字符串表示工作区尚未提供。 */
        AreaCode?: string;
    };
}

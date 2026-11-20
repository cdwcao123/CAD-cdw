import type { DrillHoleDetailsMode, DrillHoleListValues } from './type';
import type { StratumModel } from '../../../types';
/** 数据模型数据源返回的钻孔字段；字段定义依据 SourceQuery 实际响应。 */
export interface DrillHoleSourceFields {
    /** 数据源内的钻孔唯一标识，同时作为列表钻孔代码。 */
    id: string;
    /** 所属矿井代码，用于筛选当前工作区数据。 */
    MineCode: string;
    /** 钻孔名称。 */
    name: string;
    /** 钻孔类型代码；空字符串表示未配置。 */
    drill_type: string;
    /** 第一勘探线标识；空字符串表示未配置。 */
    first_exploration_line: string;
    /** 第二勘探线标识；空字符串表示未配置。 */
    second_exploration_line: string;
    /** 孔口 X 坐标，单位沿用数据源坐标系。 */
    x: number;
    /** 孔口 Y 坐标，单位沿用数据源坐标系。 */
    y: number;
    /** 孔口 Z 高程，单位沿用数据源坐标系。 */
    z: number;
    /** 见煤点标高，单位 m。 */
    coal_seam_z: number;
    /** 煤厚，单位 m。 */
    coal_seam_thickness: number;
    /** 孔半径，单位 mm。 */
    radius: number;
    /** 终孔深度，单位 m。 */
    length: number;
    /** 开工日期时间，格式为服务端原始字符串，空字符串表示未填写。 */
    start_date: string;
    /** 竣工日期时间，格式为服务端原始字符串，空字符串表示未填写。 */
    end_date: string;
    /** 负责人名称或标识，具体取值由数据源配置决定。 */
    leader: string;
    /** 地层倾角，单位待确认。 */
    layer_angle: number;
    /** 终孔层位代码；空字符串表示未配置。 */
    end_seam: string;
    /** 测井深度，单位 m。 */
    logging_length: number;
    /** 测井日期时间，格式为服务端原始字符串，空字符串表示未填写。 */
    logging_date: string;
    /** 最终斜度，单位待确认。 */
    end_angle: number;
    /** 是否矿内孔：1 为是、0 为否，空字符串表示未配置。 */
    is_inmine: '0' | '1' | '';
    /** 是否斜孔：1 为是、0 为否，空字符串表示未配置。 */
    isoblique: '0' | '1' | '';
    /** 施工目的。 */
    target: string;
    /** 施工单位名称或标识，具体取值由数据源配置决定。 */
    unit: string;
    /** 穿过煤层代码数组。 */
    cross_coal: string[];
    /** 穿过层位代码数组。 */
    cross_layer: string[];
    /** 技术员。 */
    technician: string;
    /** 记录员。 */
    recorder: string;
    /** 水文员。 */
    hydrology_staff: string;
    /** 测井员。 */
    logging_person: string;
    /** 测井记录员。 */
    logging_desc_person: string;
    /** 钻孔说明。 */
    remark: string;
}
/** 勘探线数据模型返回的业务字段；用于钻孔列表关联显示勘探线名称。 */
export interface DrillHoleExplorationLineFields {
    /** 勘探线唯一标识，对应钻孔的第一、第二勘探线字段。 */
    id: string;
    /** 勘探线显示名称。 */
    name: string;
    /** 所属矿井代码。 */
    mine_code: string;
    /** 勘探线类型代码。 */
    line_type: string;
    /** 网格最小值，单位待确认。 */
    grid_minvalue: number;
    /** 网格最大值，单位待确认。 */
    grid_maxvalue: number;
    /** 勘探线方向，单位待确认。 */
    direction: number;
    /** 岩层走向，单位待确认。 */
    rock_trend: number;
}
/** SourceQuery 返回的一条勘探线模型数据。 */
export interface DrillHoleExplorationLineEntity {
    /** 勘探线模型描述及业务字段。 */
    metaData: {
        /** 勘探线模型标识。 */
        modelId: string;
        /** 勘探线模型名称。 */
        modelName: string;
        /** 勘探线模型类型。 */
        modelType: string;
        /** 当前勘探线的业务字段。 */
        fields: DrillHoleExplorationLineFields;
    };
}
/** 勘探线 SourceQuery 响应中的数据模型结果。 */
export interface DrillHoleExplorationLineData {
    /** 勘探线模型标识。 */
    modelId: string;
    /** 勘探线模型名称。 */
    modelName: string;
    /** 勘探线模型类型。 */
    modelType: string;
    /** 勘探线数据源标识。 */
    dataSourceId: string;
    /** JSON 字符串形式的字段配置。 */
    metaDataSchema: string;
    /** 要素类配置；列表查询时实际为空对象。 */
    featureClassSchema: Record<string, unknown>;
    /** 数据源坐标系配置。 */
    coordOption: {
        /** EPSG 坐标系代码。 */
        EPSG: string;
        /** Proj 坐标系参数。 */
        coordParams: string;
    };
    /** 勘探线模型数据列表。 */
    modelData: DrillHoleExplorationLineEntity[];
    /** JSON 字符串形式的分页信息。 */
    pagination: string;
}
/** GET SourceQuery 的勘探线列表响应。 */
export interface DrillHoleExplorationLineQueryResponse {
    /** HTTP 内业务状态，成功实测为 200。 */
    State: number;
    /** 业务码，成功为 200。 */
    code: number;
    /** 服务端业务提示。 */
    info: string;
    /** 勘探线数据模型结果；失败时可能为空。 */
    data: DrillHoleExplorationLineData | null;
}
/** GET DataItem/Details?code=drill_type 返回的钻孔类型字典项。 */
export interface DrillHoleTypeDictionaryItem {
    /** 字典明细唯一标识。 */
    F_ItemDetailId: string;
    /** 字典代码，当前接口固定为 drill_type。 */
    F_ItemCode: string;
    /** 钻孔类型显示名称。 */
    F_ItemName: string;
    /** 保存到钻孔 drill_type 字段的字典值。 */
    F_ItemValue: string;
    /** 显示顺序，数值越小越靠前。 */
    F_SortCode: number;
    /** 删除标记，0 表示有效。 */
    F_DeleteMark: number;
    /** 启用标记，1 表示可选。 */
    F_EnabledMark: number;
}
/** 地层模型 SourceQuery 中一条基础信息下拉数据。 */
export interface DrillHoleStratumSourceFields {
    /** 地层模型唯一标识。 */
    id: string;
    /** 地层显示名称。 */
    name: string;
    /** 保存到钻孔层位字段的业务编码。 */
    stratum_code: string;
    /** 所属矿井代码，用于只显示当前工作区地层。 */
    MineCode: string;
    /** 父级地层编码；空字符串表示顶级地层。 */
    stratum_parentcode: string;
    /** 地层显示顺序。 */
    stratum_sort: number;
}
/** 地层模型 SourceQuery 返回的一条模型实体。 */
export interface DrillHoleStratumSourceEntity {
    /** 地层模型描述和业务字段。 */
    metaData: {
        /** 地层模型标识。 */
        modelId: string;
        /** 地层模型名称。 */
        modelName: string;
        /** 模型类型，当前为 stratum。 */
        modelType: string;
        /** 当前地层的业务字段。 */
        fields: DrillHoleStratumSourceFields;
    };
}
/** 地层模型 SourceQuery 的数据部分。 */
export interface DrillHoleStratumSourceData {
    /** 地层模型标识。 */
    modelId: string;
    /** 地层模型名称。 */
    modelName: string;
    /** 模型类型，当前为 stratum。 */
    modelType: string;
    /** 地层数据源标识。 */
    dataSourceId: string;
    /** JSON 字符串形式的字段配置。 */
    metaDataSchema: string;
    /** 当前接口返回的地层模型实体。 */
    modelData: DrillHoleStratumSourceEntity[];
    /** JSON 字符串形式的分页信息。 */
    pagination: string;
}
/** GET SourceQuery 的地层模型响应。 */
export interface DrillHoleStratumSourceQueryResponse {
    /** HTTP 内业务状态，成功实测为 200。 */
    State: number;
    /** 业务码，成功为 200。 */
    code: number;
    /** 服务端业务提示。 */
    info: string;
    /** 地层模型结果；失败时可能为空。 */
    data: DrillHoleStratumSourceData | null;
}
/** 基础信息下拉框共用的显示项。 */
export interface DrillHoleSelectOption {
    /** 下拉框显示文本。 */
    label: string;
    /** 提交到服务端对应业务字段的原始值。 */
    value: string;
}
/** 钻孔基础信息中五个下拉框使用的真实接口选项。 */
export interface DrillHoleDetailsOptions {
    /** 钻孔类别字典项。 */
    holeTypes: DrillHoleSelectOption[];
    /** 第一、第二勘探线共用的当前矿井勘探线。 */
    explorationLines: DrillHoleSelectOption[];
    /** 起始、终止层位共用的当前矿井地层。 */
    strata: DrillHoleSelectOption[];
    /** 要素类代码与字段名组合到动态编辑下拉选项的映射。 */
    featureFields: Record<string, DrillHoleSelectOption[]>;
}
/** 打开添加、修改或虚拟钻孔详情公共弹框的参数。 */
export interface OpenDrillHoleDetailsDialogOptions {
    /** 当前详情使用的钻孔行或新增草稿。 */
    row: DrillHoleRow;
    /** 当前矿井旧岩层模型，用于已有详情名称映射。 */
    strata: StratumModel[];
    /** 基础信息下拉框的接口选项。 */
    detailsOptions: DrillHoleDetailsOptions;
    /** 保存基础表单及新增模式要素草稿的回调。 */
    onSave: (value: DrillHoleDetailsForm, featureClasses?: DrillHoleFeatureClass[]) => void | Promise<void>;
    /** 详情弹框业务模式。 */
    mode?: DrillHoleDetailsMode;
    /** 修改模式整体保存 SourceQuery 要素详情的回调。 */
    onSaveSourceDetail?: (data: DrillHoleSourceData) => void | Promise<void>;
}
/** 详情响应中一个要素类的单条数据。 */
export interface DrillHoleFeature {
    /** 要素属性；字段随要素类 Schema 变化。 */
    fields: Record<string, unknown>;
    /** 几何信息；非几何要素不返回该字段。 */
    geometry?: {
        /** 几何类型。 */
        type: string;
        /** 坐标数据，具体层级由几何类型决定。 */
        coord: unknown;
    };
    /** 图形样式；非几何要素不返回该字段。 */
    style?: Record<string, unknown>;
}
/** 详情响应中的一组钻孔要素类。 */
export interface DrillHoleFeatureClass {
    /** 要素类配置标识。 */
    id: string;
    /** 要素类代码，例如 rock_stratum。 */
    className: string;
    /** 要素类中文名称；字段名沿用服务端实际拼写。 */
    classLable: string;
    /** 要素类别，当前实测为“几何要素”或“非几何要素”。 */
    FeatureType: string;
    /** 一对一或一对多数量关系；SourceQuery 详情未返回时由要素类配置补充。 */
    featureCount?: string;
    /** 当前钻孔在该要素类下的数据。 */
    features: DrillHoleFeature[];
}
/** DataModelFeatureClassSchema/GetList 返回的一项要素类配置。 */
export interface DrillHoleFeatureClassSchemaRecord {
    /** 要素类配置唯一标识。 */
    ID: string;
    /** 所属钻孔模型标识。 */
    ModelId: string;
    /** 要素类代码。 */
    ClassName: string;
    /** 要素类显示名称。 */
    ClassLabel: string;
    /** 一对一或一对多数量关系，例如 1:1、1:N。 */
    FeatureCount: string;
    /** JSON 字符串形式的属性字段 Schema。 */
    AttrSchema: string;
    /** 几何类型，例如 Point 或 Line。 */
    GeoType: string;
    /** 要素类别，当前实测为“几何要素”或“非几何要素”。 */
    Field1: string;
    /** JSON 字符串形式的表单配置。 */
    Field2: string;
    /** 服务端配置的显示顺序文本。 */
    Field3: string;
}
/** 新增和虚拟钻孔构建完整业务 Tab 使用的要素类模板。 */
export interface DrillHoleFeatureTemplate {
    /** 按服务端配置顺序排列的空要素类。 */
    featureClasses: DrillHoleFeatureClass[];
    /** 要素类代码到属性字段 Schema 的映射。 */
    featureClassSchema: Record<string, string>;
}
/** 要素类 Schema 中一个可展示字段的配置。 */
export interface DrillHoleFeatureFieldSchema {
    /** 服务端字段名，对应 feature.fields 的键。 */
    name: string;
    /** 列表表头。 */
    label: string;
    /** 服务端值类型，例如 String、Int 或 Double。 */
    valueType: string;
    /** 表单控件类型，例如 Select、Input_Number 或 Input_TextArea。 */
    controlType: string;
    /** 是否在列表中展示，1 表示展示。 */
    isShowInList: number;
    /** 数值等字段的默认值；未配置时不存在。 */
    default?: unknown;
    /** 下拉选项来源；非下拉字段不存在。 */
    listSource?: string;
    /** 下拉数据表或关联模型标识；非下拉字段不存在。 */
    listType?: string[];
    /** JSON 字符串形式的下拉 label、value 字段路径。 */
    listOption?: string;
}
/** 钻孔详情动态要素 Tab 的表格列。 */
export interface DrillHoleFeatureColumn {
    /** feature.fields 中的字段键。 */
    prop: string;
    /** 表格列标题。 */
    label: string;
    /** 服务端值类型，例如 String、Int 或 Double。 */
    valueType: string;
    /** 编辑表单控件类型。 */
    controlType: string;
    /** 新增记录时使用的字段默认值；未配置时为空。 */
    defaultValue?: unknown;
    /** Select 字段从 54 页相同数据源加载的选项。 */
    options?: DrillHoleSelectOption[];
}
/** 要素字段 Schema 中 listOption JSON 的已确认结构。 */
export interface DrillHoleFeatureListOption {
    /** 选项显示文本在接口记录中的字段路径。 */
    label: string;
    /** 选项提交值在接口记录中的字段路径。 */
    value: string;
}
/** 公共要素编辑弹框确认后提交给钻孔详情草稿的数据。 */
export interface DrillHoleFeatureEditorSubmitData {
    /** 按当前要素类 Schema 收集的完整字段值。 */
    fields: Record<string, unknown>;
    /** 已解析的几何坐标；非几何要素不提供该字段。 */
    geometryCoord?: unknown;
}
/** 钻孔详情动态要素 Tab 的界面数据。 */
export interface DrillHoleFeatureTab {
    /** 要素类代码，同时作为 Tab 唯一标识。 */
    className: string;
    /** 服务端配置的 Tab 中文名称。 */
    label: string;
    /** 要素类别，当前为几何要素或非几何要素。 */
    featureType: string;
    /** 一对一或一对多数量关系。 */
    featureCount?: string;
    /** 按要素类 Schema 生成的列表列。 */
    columns: DrillHoleFeatureColumn[];
    /** 当前钻孔在该要素类下的属性数据。 */
    rows: Record<string, unknown>[];
}
/** SourceQuery 返回的一条钻孔模型数据。 */
export interface DrillHoleSourceEntity {
    /** 数据模型描述及钻孔业务字段。 */
    metaData: {
        /** 数据模型标识。 */
        modelId: string;
        /** 数据模型名称。 */
        modelName: string;
        /** 数据模型类型，本接口实际为 drill。 */
        modelType: string;
        /** 当前钻孔的业务字段。 */
        fields: DrillHoleSourceFields;
    };
    /** 详情查询返回的关联要素类；列表查询 isQueryFeatureInfo=0 时不返回。 */
    featureClasses?: DrillHoleFeatureClass[];
}
/** SourceQuery 响应中的数据模型结果。 */
export interface DrillHoleSourceData {
    /** 数据模型标识。 */
    modelId: string;
    /** 数据模型名称。 */
    modelName: string;
    /** 数据模型类型。 */
    modelType: string;
    /** 数据源标识。 */
    dataSourceId: string;
    /** JSON 字符串形式的字段配置。 */
    metaDataSchema: string;
    /** 要素类配置；isQueryFeatureInfo=0 时实际为空对象。 */
    featureClassSchema: Record<string, string>;
    /** 数据源坐标系配置。 */
    coordOption: {
        /** EPSG 坐标系代码。 */
        EPSG: string;
        /** Proj 坐标系参数。 */
        coordParams: string;
    };
    /** 钻孔模型数据列表。 */
    modelData: DrillHoleSourceEntity[];
    /** JSON 字符串形式的分页信息；当前接口返回全量数据。 */
    pagination: string;
}
/** GET DataModelDataSourceSchema/SourceQuery 的钻孔列表响应。 */
export interface DrillHoleSourceQueryResponse {
    /** HTTP 内业务状态，成功实测为 200。 */
    State: number;
    /** 业务码，成功为 200。 */
    code: number;
    /** 服务端业务提示。 */
    info: string;
    /** 数据模型结果；失败时可能为空。 */
    data: DrillHoleSourceData | null;
}
/** 钻孔详情初始化所用配置、字典接口的公共响应。 */
export interface DrillHoleAuxiliaryResponse<T> {
    /** 部分数据模型接口返回的状态码，成功为 200。 */
    State?: number;
    /** 业务码，成功为 200。 */
    code: number;
    /** 服务端业务提示。 */
    info: string;
    /** 接口数据，具体结构由所查询的配置或字典决定。 */
    data: T;
}
/** 钻孔列表请求；当前接入固定携带岩层明细。 */
export interface GisDrillListRequest {
    /** 矿井编码；由当前工作区 currentWorkingAreaInfo.AreaCode 提供，与巷道同步一致。 */
    MineCode: string;
    /** 是否包含岩层明细；当前已确认传 1，其他值未在本次接入中使用。 */
    include_rock: 1;
}
/** 删除单个钻孔的请求参数。 */
export interface GisDrillDeleteRequest {
    /** 待删除钻孔的业务代码。 */
    drill_code: string;
    /** 待删除钻孔所属矿井编码。 */
    MineCode: string;
}
/** 钻孔新增、保存和删除接口的通用业务响应。 */
export interface GisDrillMutationResponse {
    /** 业务状态码，成功为 200。 */
    code: number;
    /** 服务端业务提示。 */
    info: string;
    /** 服务端返回数据；当前保存和删除流程不依赖其具体结构。 */
    data?: unknown;
}
/** 钻孔接口的三维坐标，原样保留服务端数值；坐标系及平面坐标单位待确认。 */
export interface GisDrillCoordinate {
    /** X 坐标，按接口原值读取，不与 Y 交换。 */
    x: number;
    /** Y 坐标，按接口原值读取。 */
    y: number;
    /** Z 高程，沿用图纸坐标单位。 */
    z: number;
}
/** 钻孔表单从活动图纸拾取的世界坐标。 */
export interface DrillHolePickedPoint {
    /** 拾取点的世界坐标 X。 */
    x: number;
    /** 拾取点的世界坐标 Y。 */
    y: number;
    /** 拾取点的世界坐标 Z。 */
    z: number;
}
/** 虚拟钻孔创建时从活动图纸拾取的孔口坐标。 */
export interface VirtualDrillHolePoint extends DrillHolePickedPoint {
}
/** 钻孔及岩层明细共用的审计字段；空字符串和 null 均保留原始含义。 */
export interface GisDrillAuditFields {
    /** 创建时间，格式 YYYY-MM-DD HH:mm:ss。 */
    CreateDateTime: string;
    /** 创建用户标识。 */
    CreateUserId: string;
    /** 创建公司标识。 */
    CreateCompanyId: string;
    /** 创建部门标识。 */
    CreateDepartmentId: string;
    /** 更新用户标识；岩层样本可为空字符串。 */
    UpdateUserId: string;
    /** 更新时间，格式 YYYY-MM-DD HH:mm:ss；null 表示接口未提供。 */
    UpdateDateTime: string | null;
    /** 当前钻孔和岩层样本均为 null；非空取值及语义待服务端确认。 */
    DeleteMark: null;
}
/** 钻孔 rock_info 中的一条岩层记录，字段来自实际 GetList 响应。 */
export interface GisDrillRockRecord extends GisDrillAuditFields {
    /** 该钻孔岩层记录的唯一标识，不是岩性字典 id。 */
    Id: string;
    /** 所属矿井编码。 */
    MineCode: string;
    /** 岩性标识：实测既有 rockdictionary.rock_code，也有直接存储中文名称的历史记录。 */
    code: string;
    /** 钻孔接口提供的岩层名称。 */
    rock_name: string;
    /** 岩层排列顺序，显示时按数值升序。 */
    rock_sort: number;
    /** 所属钻孔代码，对应钻孔 drill_code。 */
    drill_code: string;
    /** 层厚，单位 m。 */
    depth: number;
    /** 累计层厚，单位 m；直接使用服务端结果。 */
    sum_depth: number;
    /** 真厚，单位 m。 */
    true_depth: number;
    /** 累计真厚，单位 m。 */
    sum_true_depth: number;
    /** 岩心长度，单位 m。 */
    core_length: number;
    /** 岩心采取率，按百分数显示，例如 42 表示 42%。 */
    core_collect_rate: number;
    /** 岩心倾角，沿用服务端角度值，单位待确认。 */
    core_angle: number;
    /** 界的名称或编码，空字符串表示未提供。 */
    rock_bound: string;
    /** 系的名称或编码，空字符串表示未提供。 */
    rock_system: string;
    /** 统的名称或编码，空字符串表示未提供。 */
    rock_series: string;
    /** 组的名称或编码，空字符串表示未提供。 */
    rock_group: string;
    /** 段的名称或编码，空字符串表示未提供。 */
    rock_part: string;
    /** 标志层代码，关联 GisStratum.configinfo.stratum_code。 */
    mark_bed: string;
    /** 标志层名称；实测有 null，允许通过地层接口补充。 */
    mark_bed_name: string | null;
    /** 底板点 X 坐标，与 bottom_coord.x 对应。 */
    bottom_x: number;
    /** 底板点 Y 坐标，与 bottom_coord.y 对应。 */
    bottom_y: number;
    /** 底板点高程，与 bottom_coord.z 对应。 */
    bottom_z: number;
    /** 底板点的完整三维坐标。 */
    bottom_coord: GisDrillCoordinate;
    /** 该岩层的岩性描述。 */
    remark: string;
}
/** 钻孔列表中的完整原始记录；本次 include_rock=1 时包含 rock_info 数组。 */
export interface GisDrillRecord extends GisDrillAuditFields {
    /** 服务端唯一标识；样本中与 drill_code 相同，但两字段分别保留。 */
    Id: string;
    /** 所属矿井编码。 */
    MineCode: string;
    /** 钻孔业务代码。 */
    drill_code: string;
    /** 钻孔名称。 */
    drill_name: string;
    /** 孔口坐标。 */
    coord: GisDrillCoordinate;
    /** 见煤点标高，单位 m。 */
    coal_seam_z: number;
    /** 煤厚，单位 m。 */
    coal_seam_thickness: number;
    /** 钻孔半径，沿用当前详情界面的 mm 单位。 */
    radius: number;
    /** 终孔深度，单位 m。 */
    length: number;
    /** 钻孔位置说明，空字符串表示未填写。 */
    position: string;
    /** 钻孔描述。 */
    remark: string;
    /** 开工日期时间，格式 YYYY-MM-DD HH:mm:ss。 */
    start_date: string;
    /** 竣工日期时间，格式 YYYY-MM-DD HH:mm:ss。 */
    end_date: string;
    /** 负责人。 */
    leader: string;
    /** 钻孔类型编码，完整字典含义待确认。 */
    drill_type: string;
    /** 第一勘探线标识；名称需相应字典提供，当前保留标识。 */
    first_exploration_line: string;
    /** 第二勘探线标识；名称需相应字典提供，当前保留标识。 */
    second_exploration_line: string;
    /** 地层倾角，单位待确认。 */
    layer_angle: number;
    /** 终孔层位代码，对应地层 stratum_code。 */
    end_seam: string;
    /** 测井深度，单位 m。 */
    logging_length: number;
    /** 测井日期时间，格式 YYYY-MM-DD HH:mm:ss。 */
    logging_date: string;
    /** 最终斜度，单位待确认。 */
    end_angle: number;
    /** 是否矿内孔；字符串 1 为是，0 为否。 */
    is_inmine: '0' | '1';
    /** 是否斜孔；字符串 1 为是，0 为否。 */
    isoblique: '0' | '1';
    /** 施工目的，沿用现有钻孔数据契约的 target 含义，不交换接口值。 */
    target: string;
    /** 施工单位，沿用现有钻孔数据契约的 unit 含义，不交换接口值。 */
    unit: string;
    /** 穿过地层代码的 JSON 数组字符串，可包含结尾换行；当前保留原文。 */
    cross_layer: string;
    /** 穿过煤层代码的 JSON 数组字符串；当前保留原文。 */
    cross_coal: string;
    /** 钻机名称，空字符串表示未提供。 */
    drilling_machine_name: string;
    /** 技术员。 */
    technician: string;
    /** 记录员。 */
    recorder: string;
    /** 水文员。 */
    hydrology_staff: string;
    /** 测井员。 */
    logging_person: string;
    /** 测井记录或解释人员；具体业务称呼待确认。 */
    logging_desc_person: string;
    /** 底板校正点 X 坐标。 */
    floor_correct_x: number;
    /** 底板校正点 Y 坐标。 */
    floor_correct_y: number;
    /** 底板校正点 Z 高程。 */
    floor_correct_z: number;
    /** 关联文件字段；路径或文件标识格式待确认。 */
    link_file: string;
    /** 包含的岩层明细，空数组表示无岩层记录。 */
    rock_info: GisDrillRockRecord[];
}
/** 钻孔查询接口的原始记录；新增钻孔的未填写字段实测会返回 null。 */
export interface GisDrillRecordResponse extends Omit<GisDrillRecord, 'position' | 'start_date' | 'end_date' | 'logging_date' | 'drilling_machine_name' | 'link_file' | 'rock_info'> {
    /** 钻孔位置；null 表示新增时未填写。 */
    position: string | null;
    /** 开工日期时间；null 表示新增时未填写。 */
    start_date: string | null;
    /** 竣工日期时间；null 表示新增时未填写。 */
    end_date: string | null;
    /** 测井日期时间；null 表示新增时未填写。 */
    logging_date: string | null;
    /** 钻机名称；null 表示新增时未填写。 */
    drilling_machine_name: string | null;
    /** 关联文件；null 表示新增时未填写。 */
    link_file: string | null;
    /** 原始岩层明细；null 表示该钻孔当前没有岩层，响应解析后统一转换为空数组。 */
    rock_info: GisDrillRockRecord[] | null;
}
/** 钻孔列表的内层业务响应。 */
export interface GisDrillListResult {
    /** 业务状态；成功样本为 200。 */
    State: number;
    /** 内层业务码；成功为 0。 */
    code: number;
    /** 内层业务提示。 */
    info: string;
    /** 钻孔记录数组；错误响应可能为空，不将其当作成功空列表。 */
    data: GisDrillRecordResponse[] | null;
}
/** POST GisDrill/GetList 的外层响应。 */
export interface GisDrillListResponse {
    /** 外层业务码；成功为 200，鉴权失败实测为 410。 */
    code: number;
    /** 外层响应提示。 */
    info: string;
    /** 内层响应；鉴权失败时为 null。 */
    data: GisDrillListResult | null;
}
/** 获取单个钻孔的内层业务响应。 */
export interface GisDrillOneResult {
    /** 业务状态；成功为 200。 */
    State: number;
    /** 内层业务码；成功为 0。 */
    code: number;
    /** 内层业务提示。 */
    info: string;
    /** 最新完整钻孔实体；未找到或失败时可能为 null。 */
    data: GisDrillRecordResponse | null;
}
/** POST GisDrill/GetOne 的外层响应。 */
export interface GisDrillOneResponse {
    /** 外层业务码；成功为 200。 */
    code: number;
    /** 外层响应提示。 */
    info: string;
    /** 单个钻孔内层响应；失败时可能为 null。 */
    data: GisDrillOneResult | null;
}
/** GET DataSource/GetDataTable?code=rockdictionary 的岩性字典项，保留服务端小写字段。 */
export interface RockDictionaryRecord {
    /** 字典项唯一标识，不用于关联钻孔岩层 Id。 */
    id: string;
    /** 岩性中文名称。 */
    rock_name: string;
    /** 岩性业务编码，用于匹配岩层 code；已删除历史项可能与有效项重复。 */
    rock_code: string;
    /** 备注；null 表示未填写。 */
    remark: string | null;
    /** 删除标记；true 的历史项不参与有效字典匹配。 */
    deletemark: boolean;
    /** 创建时间，格式 YYYY-MM-DD HH:mm:ss；null 表示未提供。 */
    createdatetime: string | null;
    /** 创建用户标识，系统内置数据可为 System。 */
    createuserid: string;
    /** 创建公司标识。 */
    createcompanyid: string;
    /** 创建部门标识；null 表示未提供。 */
    createdepartmentid: string | null;
    /** 更新用户标识；null 表示未提供。 */
    updateuserid: string | null;
    /** 更新时间，格式 YYYY-MM-DD HH:mm:ss；null 表示未提供。 */
    updatedatetime: string | null;
}
/** 岩性字典的单层响应，data 直接为数组。 */
export interface RockDictionaryResponse {
    /** 业务码，成功为 200。 */
    code: number;
    /** 业务提示。 */
    info: string;
    /** 岩性字典数组；错误响应可能为 null。 */
    data: RockDictionaryRecord[] | null;
}
/** 钻孔详情表单显示值；数字转换为字符串，零值不转为空。 */
export interface DrillHoleDetailsForm {
    /** 矿井名称，接口未提供时为空，不将矿井代码当作名称。 */
    mineName: string;
    /** 钻孔业务代码。 */
    drillHoleCode: string;
    /** 钻孔名称。 */
    drillHoleName: string;
    /** 施工单位。 */
    buildUnit: string;
    /** 施工目的。 */
    buildPurpose: string;
    /** 钻孔类型编码。 */
    holeType: string;
    /** 第一勘探线标识。 */
    explorationLine1: string;
    /** 第二勘探线标识。 */
    explorationLine2: string;
    /** 起始层位，接口未提供时为空。 */
    startHorizon: string;
    /** 终孔层位代码。 */
    endHorizon: string;
    /** 位置说明。 */
    location: string;
    /** 见煤点标高，m，字符串用于表单显示。 */
    coalPointElevation: string;
    /** 煤厚，m。 */
    coalThickness: string;
    /** 孔半径，mm。 */
    radius: string;
    /** 终孔深度，m。 */
    finalHoleDepth: string;
    /** 地层倾角，保持接口数值。 */
    geoWeakAngle: string;
    /** 测井深度，m。 */
    loggingDepth: string;
    /** 最终斜度，保持接口数值。 */
    finalInclination: string;
    /** 钻机名称。 */
    drillRigName: string;
    /** 负责人。 */
    owner: string;
    /** 技术员。 */
    technician: string;
    /** 记录员。 */
    recorder: string;
    /** 水文员。 */
    hydrographer: string;
    /** 测井员。 */
    loggingMan: string;
    /** 测井记录或解释人员。 */
    loggingInterpreter: string;
    /** 开工日期，YYYY-MM-DD，空字符串表示未提供。 */
    startDate: string;
    /** 竣工日期，YYYY-MM-DD。 */
    endDate: string;
    /** 测井日期，YYYY-MM-DD。 */
    loggingDate: string;
    /** 孔口 X 坐标字符串。 */
    collarX: string;
    /** 孔口 Y 坐标字符串。 */
    collarY: string;
    /** 孔口 Z 高程字符串。 */
    collarZ: string;
    /** 底板校正 X 坐标字符串。 */
    floorFixX: string;
    /** 底板校正 Y 坐标字符串。 */
    floorFixY: string;
    /** 底板校正 Z 高程字符串。 */
    floorFixZ: string;
    /** 钻孔描述。 */
    description: string;
    /** 是否矿内孔，只将接口字符串 1 转为 true。 */
    isInMine: boolean;
    /** 是否斜孔，只将接口字符串 1 转为 true。 */
    isInclined: boolean;
}
/** 详情岩层表共用的显示字段。 */
export interface DrillHoleRockDisplayRow {
    /** 对应 featureClasses.features 的原始下标，仅用于详情草稿编辑。 */
    featureIndex?: number;
    /** 钻孔岩层记录 Id。 */
    rockId: string;
    /** 原始岩性编码或历史中文标识。 */
    rockCode: string;
    /** 有效字典匹配名称；未匹配时保留钻孔自带岩层名称。 */
    rockName: string;
    /** 岩层顺序。 */
    rockOrder: number;
    /** 所属钻孔代码。 */
    drillHoleCode: string;
    /** 层厚，m。 */
    thickness: number;
    /** 累计层厚，m。 */
    totalThickness: number;
    /** 真厚，m。 */
    trueThickness: number;
    /** 累计真厚，m。 */
    totalTrueThickness: number;
    /** 岩心长度，m。 */
    coreLength: number;
    /** 岩心采取率，百分数。 */
    coreRecovery: number;
    /** 岩心倾角，单位沿用接口。 */
    coreBrokenAngle: number;
    /** 界名称，地层无法匹配时保留原值。 */
    jie: string;
    /** 系名称，地层无法匹配时保留原值。 */
    xi: string;
    /** 统名称，地层无法匹配时保留原值。 */
    tong: string;
    /** 标志层原始代码。 */
    markBedCode: string;
    /** 标志层名称；未关联到地层时显示原始代码。 */
    markBedName: string;
    /** 岩性描述。 */
    description: string;
}
/** 旧钻孔接口映射的岩层行，原始记录由 source 保留。 */
export interface DrillHoleRockRow extends DrillHoleRockDisplayRow {
    /** 完整原始岩层记录，不因显示映射丢失底板坐标等数据。 */
    source: GisDrillRockRecord;
}
/** 钻孔列表与详情之间传递的数据，详情字段可在新增草稿中缺省。 */
export interface DrillHoleRow extends Partial<DrillHoleDetailsForm> {
    /** 钻孔业务代码。 */
    drillHoleCode: string;
    /** 钻孔名称。 */
    drillHoleName: string;
    /** 服务端 Id，列表稳定行标识。 */
    id?: string;
    /** 所属矿井代码。 */
    mineCode?: string;
    /** 钻孔类型字典匹配的显示名称；未匹配时缺省，列表显示原编码。 */
    holeTypeName?: string;
    /** 当前矿井地层匹配的终孔层位名称；未匹配时缺省，列表显示原编码。 */
    endHorizonName?: string;
    /** 本次接口返回的 rock_info 条目数。 */
    stratumCount?: number;
    /** 映射并按顺序排列的全部岩层明细。 */
    rockTableData?: DrillHoleRockRow[];
    /** SourceQuery 详情中 rock_stratum 映射的岩层显示数据。 */
    detailRockTableData?: DrillHoleRockDisplayRow[];
    /** 完整原始钻孔响应，保留未显示字段。 */
    source?: GisDrillRecord;
    /** SourceQuery 详情返回的关联要素类数据。 */
    featureClasses?: DrillHoleFeatureClass[];
    /** 要素类代码到 JSON 字符串字段 Schema 的映射。 */
    featureClassSchema?: Record<string, string>;
    /** SourceQuery 详情的完整 data 对象，保存明细时按服务端契约整体提交。 */
    sourceDetailData?: DrillHoleSourceData;
}
/** 钻孔数据管理一次成功加载的结果。 */
export interface DrillHoleDataSet {
    /** 列表与详情使用的数据。 */
    rows: DrillHoleRow[];
    /** 用于层位名称关联的地层模型。 */
    strata: StratumModel[];
    /** 基础信息下拉框的钻孔类型、勘探线和地层选项。 */
    detailsOptions: DrillHoleDetailsOptions;
    /** 新增和虚拟钻孔创建完整业务 Tab 使用的空要素类模板。 */
    featureTemplate: DrillHoleFeatureTemplate;
}
/** 管理列表及其 Excel 导出共用的列配置。 */
export interface DrillHoleListColumn {
    /** 列表表头及 Excel 第一行使用的中文字段名。 */
    label: string;
    /** 对应列表展示值的字段键。 */
    prop: keyof DrillHoleListValues;
    /** 列表最小列宽，单位像素。 */
    minWidth: number;
    /** 统一单元格展示插槽，使表格与 Excel 使用相同的文本转换规则。 */
    slot: 'value';
}
/** Excel 文件选择后的解析检查结果。 */
export interface DrillHoleExcelInspection {
    /** 本次导入读取的工作表名称。 */
    sheetName: string;
    /** 去除表头及空行后的有效数据行数。 */
    rowCount: number;
    /** 阻止导入的格式或字段错误；空数组表示可以提交。 */
    errors: string[];
}
/** Excel 数值字段的解析规则。 */
export interface DrillHoleExcelNumberOptions {
    /** 空单元格使用的数值，未指定时为 0。 */
    defaultValue?: number;
    /** 是否要求单元格必须填写。 */
    required?: boolean;
}
export type { DialogData } from 'McEditor';

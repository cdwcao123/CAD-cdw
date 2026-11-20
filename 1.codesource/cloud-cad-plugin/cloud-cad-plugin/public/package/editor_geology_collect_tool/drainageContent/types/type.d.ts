import type { BoreholeDetailsProps, DirectionalDesignResultRow, DirectionalDesignResultSheet, DrainageBoreholeParameterRow, DrainageSiteParameterRow, DrillSiteDetailsProps, EvaluationUnitDetailsProps } from './interface';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McDbEntity } from 'McCore';
import type { TopNodeJsonItem } from 'McEditor';
/** Excel 反演对象及绘制时采用的参数。 */
export type DrainageReverseMode = 'site' | 'drill';
/** 钻场、钻孔参数面板共用的只读数据行，各自携带对应反演模板的导出值。 */
export type DrainageParameterRow = DrainageBoreholeParameterRow | DrainageSiteParameterRow;
export type DrainageDrillValueMode = 'design' | 'actual';
export type DrainageSiteAnchor = 'center' | 'start';
/** 评价单元配置面板当前展示的模式。 */
export type EvaluationUnitMode = 'mining' | 'roadwayStrip';
/** 评价单元关联钻孔面板的新增方式。 */
export type EvaluationUnitBoreholeAddMode = 'manual' | 'evaluationUnit';
/** 评价单元通过插件包管理器获取的 Core API 契约；仅用于类型检查。 */
export type EvaluationUnitCoreApi = Pick<CoreGeologyCollectTool, 'McCoalType' | 'McGasSource' | 'McWorkFaceType'>;
/** 穿层孔配置面板当前展示的模式。 */
export type ThroughHoleMode = 'drillSite' | 'roadway';
/** 顶部钻孔菜单所属孔型；顺层包含左、右帮孔，穿层包含底、顶板孔，定向仅包含定向钻孔。 */
export type DrainageBoreholeCategory = 'along' | 'through' | 'directional';
/** 普通单孔绘制及表格反演支持的孔型；定向钻使用独立轨迹绘制与反演流程。 */
export type DrainageStraightBoreholeCategory = Exclude<DrainageBoreholeCategory, 'directional'>;
/** 修正对比弹框的单选版本：old 为设计平面图，new 为修正平面图；仅决定导出对象，不改变应用目标。 */
export type BoreholeCorrectionVersion = 'old' | 'new';
/** Core 修正计算的非空结果；包含原设计孔、修正孔和两份临时图件，原孔与修正孔按 objectId 关联。 */
export type BoreholeCorrectionResult = NonNullable<Awaited<ReturnType<CoreGeologyCollectTool['correctBorehole']>>>;
/** 同步业务类别；“钻孔”合并四类孔型查询，具体孔型仍可供独立查询和关联核实使用。 */
export type DrainageSyncType = '钻场' | '钻孔' | '穿层钻孔' | '顺层钻孔' | '定向钻孔' | '高位钻孔' | '评价单元';
/** 同步界面展示的三个大类型。 */
export type DrainageSyncCategory = Extract<DrainageSyncType, '钻场' | '钻孔' | '评价单元'>;
/** 本地同步筛选控件的字段名。 */
export type DrainageSyncFilterKey = 'boreholeType' | 'site' | 'tunnel' | 'workFace' | 'evaluationUnit';
/** 抽采设计顶部工具共用的图件类型；directionalProfile 仅处理定向钻孔剖面。 */
export type DrainageDiagramType = 'openHole' | 'drillProfile' | 'directionalProfile' | 'evaluationProfile' | 'evaluationSpatial';
/** 图件分组选项读取的实体命名能力，各类实体仅提供自身支持的方法。 */
export type DrainageDiagramNamedEntity = McDbEntity & {
    /** 返回巷道编码。 */
    getLanewayCode?: () => string;
    /** 返回巷道显示名称。 */
    getLanewayName?: () => string;
    /** 返回评价单元名称。 */
    getName?: () => string;
    /** 返回钻孔编号。 */
    getDrillID?: () => string;
    /** 返回钻孔施工班组，不作为剖面图的分组依据。 */
    getGroup?: () => string;
    /** 返回钻孔关联钻场标识。 */
    getSiteID?: () => string;
    /** 返回钻孔关联巷道标识。 */
    getTunnelID?: () => string;
};
/** 定向钻轨迹图的二维和三维展示模式。 */
export type DirectionalTrajectoryViewMode = '2d' | '3d';
/** 定向钻结果中可参与图表数值校验的字段，不包含分支名称。 */
export type DirectionalDesignNumericField = Exclude<keyof DirectionalDesignResultRow, 'branch'>;
/** 单行定向钻 Excel 派生字段的公式文本，不含前导等号；未列出的字段保留输入快照值。 */
export type DirectionalDesignExcelFormulas = Partial<Record<DirectionalDesignNumericField, string>>;
/** 完成指定数值字段校验后的结果工作表；保留其他字段的空值语义。 */
export type DirectionalChartSheet<K extends DirectionalDesignNumericField> = Omit<DirectionalDesignResultSheet, 'rows'> & {
    /** 已确认 K 所列字段均为有限数字的轨迹明细。 */
    rows: (DirectionalDesignResultRow & Record<K, number>)[];
};
/** 开孔示意图预览及出图方向。 */
export type OpenHoleDiagramDirection = 'horizontal' | 'vertical';
/** 同步详情展示范围：本地数据、服务器数据或双方冲突对照。 */
export type DrainageDetailMode = 'local' | 'server' | 'conflict';
/** 同步列表所属分组；synced 沿用既有键名，界面语义为服务器返回的全量数据。 */
export type DrainageSyncGroupKey = 'conflict' | 'synced' | 'local' | 'server';
/** 同步面板向服务器发起的写操作。 */
export type DrainageSyncRemoteAction = 'create' | 'delete';
/** 评价单元批量删除请求体；数组元素为服务端评价单元主键。 */
export type EvaluationUnitDeleteRequest = string[];
/** 同步行对应的详情输入，kind 决定使用钻场还是钻孔面板。 */
export type DrainageSyncDetail = ({
    kind: 'drillSite';
} & DrillSiteDetailsProps) | ({
    kind: 'borehole';
} & BoreholeDetailsProps) | ({
    kind: 'evaluationUnit';
} & EvaluationUnitDetailsProps);
/** 钻场坐标命令支持的单次编辑操作。 */
export type DrillSiteCoordAction = 'add' | 'edit' | 'delete';
/** 钻孔轨迹段命令支持的单次编辑操作。 */
export type BoreholePathAction = 'add' | 'edit' | 'delete';
/** 钻场坐标或钻孔轨迹输入弹框的三个数值，顺序由对应标签确定。 */
export type DrainageNumberTriplet = [number, number, number];
/** 数字菜单输入项的取值约束。 */
export type DrainageNumberInputConstraint = {
    /** 控件允许输入的最小值；未配置时不限制下限。 */
    min?: number;
    /** 参数提交前的业务校验函数；返回 false 时忽略本次输入。 */
    validator?: (value: number) => boolean;
};
/**
 * 参数面板的字段更新入口，变更后向绘制会话发送完整参数快照。
 * @param key Core 参数对象中的字段名。
 * @param value 与所选字段类型一致的新值。
 * @returns 完整参数快照提交后结束。
 */
export type DrainageParameterUpdater<TParameter> = <TKey extends keyof TParameter>(key: TKey, value: TParameter[TKey]) => void;
/**
 * 为指定模式创建已绑定参数更新的数值控件。
 * @param key 当前模式的数字参数字段。
 * @param label 控件显示标签。
 * @param unit 单位文字，省略时无单位。
 * @param precision 显示精度，省略时为三位小数。
 * @param constraint 输入下限及提交校验，省略时不附加业务校验。
 * @returns 已绑定字段初值和更新回调的菜单控件。
 */
export type DrainageNumberInputFactory<TKey extends string> = (key: TKey, label: string, unit?: string, precision?: number, constraint?: DrainageNumberInputConstraint) => TopNodeJsonItem;
/** 钻孔面板绘制会话控制器，TResult 为插件 API 返回的单孔或钻孔集合。 */
export type DrawHoleController<TResult = import('@/core_geology_collect_tool/mcDrainageBorehole').McDbDrainageBorehole> = {
    /** 打开面板并等待绘制结束，成功返回 API 结果，取消或未启动返回 null，异常继续抛出。 */
    open: () => Promise<TResult | null>;
    /** 关闭面板并打断本会话的命令，不影响后续启动的其他命令。 */
    close: () => void;
};

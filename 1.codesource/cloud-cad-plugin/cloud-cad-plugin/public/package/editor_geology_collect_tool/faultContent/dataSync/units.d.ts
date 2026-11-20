import type { McGeoModelData } from '@/core_geology_collect_tool/mcGeoModel/types/interface';
/** 三维坐标点 */
interface FaultPoint {
    x: number;
    y: number;
    z: number;
}
/**
 * 断层同步行数据。
 * 大/小断层的本地行与服务器行统一归一化为该结构，保证可比较、可展示。
 */
export interface FaultRow {
    /** 断层编码（对应模型字段 id） */
    fault_code: string;
    /** 断层名称（对应模型字段 name） */
    fault_name: string;
    /** 矿井编码 */
    mine_code: string;
    /** 断层类型：大断层 / 小断层（McFaultMode） */
    fault_mode: number;
    /** 断层性质（中文，用于展示与比对） */
    fault_type_text: string;
    /** 断层走向延伸长度 */
    fault_length: number;
    /** 断层走向 */
    fault_towards: number;
    /** 断层倾向 */
    fault_trend: number;
    /** 断层倾角 */
    fault_angle: number;
    /** 断层落差最小值（小断层为断层落差） */
    fault_drop_min: number;
    /** 断开地层编码集合 */
    fault_stratums: string[];
    /** 显示名称（仅本地实体持有，不参与服务器同步） */
    fault_showtext?: boolean;
    /** 以下为大断层专属属性 */
    fault_drop_max?: number;
    fault_vert_direct?: string;
    fault_hor_direct?: string;
    fault_hor_dis?: number;
    /** 大断层专属几何：上盘坐标点 */
    fault_hang?: FaultPoint[];
    /** 大断层专属几何：下盘坐标点 */
    fault_bottom?: FaultPoint[];
    /** 小断层专属几何：中心点坐标 */
    fault_point?: FaultPoint;
    /** 本地实体转换出的模型数据（提交服务器时复用） */
    modelData?: McGeoModelData;
    /** 服务器原始模型数据（绘制到本地时复用） */
    serverModelData?: McGeoModelData;
    /** 服务器原始返回项（保留记录 id 等元信息） */
    serverSourceData?: any;
}
/** 断层性质字段值（可能为枚举或中文）统一转换为中文展示 */
export declare const faultTypeToText: (value: unknown) => string;
/**
 * 将内核地质模型数据归一化为断层行数据。
 * 本地（faultToModel 输出）与服务器（buildFaultModelData 输出）共用此函数，保证结构一致。
 * @param modelData 地质模型数据
 * @param mode 当前断层类型（大断层 / 小断层）
 */
export declare const modelDataToFaultRow: (modelData: McGeoModelData, mode: number) => FaultRow;
/**
 * 获取图纸中指定类型的全部断层行数据
 * @param mode 断层类型（大断层 / 小断层）
 */
export declare const getAllFaults: (mode: number) => Promise<FaultRow[]>;
/** 断层类型下拉选项 */
export interface FaultModeOption {
    /** 下拉展示名称（取模型名称） */
    label: string;
    /** 断层类型枚举（大断层 / 小断层） */
    value: number;
    /** 该类型对应的数据模型 ID */
    modelId: string;
}
/**
 * 加载断层类型下拉选项。
 * 调用模型列表接口，按名称筛选出「大断层 / 小断层」模型，并缓存模型 ID 供后续 SourceQuery 传参。
 */
export declare const loadFaultModeOptions: () => Promise<FaultModeOption[]>;
/**
 * 加载服务器断层数据
 * @param mode 断层类型（大断层 / 小断层）
 */
export declare const loadServerFaults: (mode: number) => Promise<{
    rows: FaultRow[];
    notice: string;
    modelId: string;
}>;
/**
 * 本地新增断层提交服务器（SourceAdd）
 * @param mode 断层类型（大断层 / 小断层）
 * @param rows 待提交的本地断层行
 */
export declare const submitFaultsToServer: (mode: number, rows: FaultRow[]) => Promise<void>;
/**
 * 冲突数据覆盖服务器（SourceUpdate），沿用服务器原始记录 id 做原地更新
 * @param mode 断层类型（大断层 / 小断层）
 * @param rows 本地断层行（覆盖源）
 * @param serverRows 服务器断层行（提供原始记录 id）
 */
export declare const updateFaultsToServer: (mode: number, rows: FaultRow[], serverRows: FaultRow[]) => Promise<void>;
/**
 * 删除服务器断层数据（SourceDelete）
 * @param mode 断层类型（大断层 / 小断层）
 * @param serverRows 待删除的服务器断层行
 */
export declare const deleteFaultsFromServer: (mode: number, serverRows: FaultRow[]) => Promise<void>;
/**
 * 服务器断层绘制到本地
 * 复用 modelToFault 完成模型数据 -> 断层数据转换，再复用 drawFaultByData 绘制
 * @param row 服务器断层行
 */
export declare const drawServerFaultToLocal: (row: FaultRow) => any;
/**
 * 断层数据对比（深度容差比较）
 * 本地行与服务器行均由同一归一化流程产出，结构一致，可直接比较
 */
export declare const compareFaultData: (localData: FaultRow[], serverData: FaultRow[]) => {
    conflicts: FaultRow[];
    localAdditions: FaultRow[];
    serverAdditions: FaultRow[];
};
export {};

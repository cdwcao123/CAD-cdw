import type { StratumModel } from '../../../types';
import type { DrillHoleAuxiliaryResponse, DrillHoleExplorationLineFields, DrillHoleExplorationLineQueryResponse, DrillHoleFeatureClassSchemaRecord, DrillHoleFeatureTemplate, DrillHoleRow, DrillHoleSelectOption, DrillHoleSourceFields, DrillHoleSourceQueryResponse, DrillHoleStratumSourceQueryResponse, DrillHoleTypeDictionaryItem, GisDrillListResponse, GisDrillOneResponse, GisDrillRecord, RockDictionaryRecord, RockDictionaryResponse } from '../types';
/**
 * 校验 SourceQuery 业务状态，并提取当前矿井的钻孔字段。
 * @param response SourceQuery 原始响应。
 * @param mineCode 当前工作区矿井代码。
 * @returns 仅属于当前矿井的钻孔数据源实体。
 * @throws 接口业务失败或 modelData 不是数组时抛出错误。
 */
export declare function readDrillHoleSourceList(response: DrillHoleSourceQueryResponse, mineCode: string): DrillHoleSourceFields[];
/**
 * 校验单个钻孔 SourceQuery 详情响应并提取实体。
 * @param response 携带 isQueryFeatureInfo=1 的 SourceQuery 响应。
 * @param keyValue 本次查询的钻孔主键。
 * @returns 当前钻孔的元数据与全部关联要素类。
 * @throws 接口业务失败、响应结构错误或未返回目标钻孔时抛出错误。
 */
export declare function readDrillHoleSourceDetail(response: DrillHoleSourceQueryResponse, keyValue: string): {
    entity: import("../types").DrillHoleSourceEntity;
    featureClassSchema: Record<string, string>;
};
/**
 * 校验勘探线 SourceQuery 响应，并提取当前矿井的勘探线字段。
 * @param response 勘探线 SourceQuery 原始响应。
 * @param mineCode 当前工作区矿井代码。
 * @returns 仅属于当前矿井的勘探线实体。
 * @throws 接口业务失败或 modelData 不是数组时抛出错误。
 */
export declare function readExplorationLineSourceList(response: DrillHoleExplorationLineQueryResponse, mineCode: string): DrillHoleExplorationLineFields[];
/**
 * 校验钻孔类型字典并生成基础信息下拉选项。
 * @param response DataItem/Details?code=drill_type 的响应。
 * @returns 按服务端排序值排列的有效钻孔类型。
 * @throws 接口业务失败或 data 不是数组时抛出错误。
 */
export declare function readDrillHoleTypeOptions(response: DrillHoleAuxiliaryResponse<DrillHoleTypeDictionaryItem[]>): DrillHoleSelectOption[];
/**
 * 校验钻孔要素类配置并构建新增模式的空要素草稿。
 * @param response DataModelFeatureClassSchema/GetList 的响应。
 * @returns 包含全部辅助类、钻探地层及后续业务 Tab 的空模板。
 * @throws 接口业务失败或 data 不是数组时抛出错误。
 */
export declare function readDrillHoleFeatureTemplate(response: DrillHoleAuxiliaryResponse<DrillHoleFeatureClassSchemaRecord[]>): DrillHoleFeatureTemplate;
/**
 * 校验地层 SourceQuery 响应并生成当前矿井的层位下拉选项。
 * @param response 地层模型 SourceQuery 响应。
 * @param mineCode 当前工作区矿井代码。
 * @returns 保持服务端模型顺序的地层名称与业务编码。
 * @throws 接口业务失败或 modelData 不是数组时抛出错误。
 */
export declare function readDrillHoleStratumOptions(response: DrillHoleStratumSourceQueryResponse, mineCode: string): DrillHoleSelectOption[];
/**
 * 将 SourceQuery 钻孔实体映射为管理面板列表行。
 * @param drill 数据源返回的钻孔字段。
 * @param explorationLineNames 勘探线标识到显示名称的映射。
 * @param holeTypeNames 钻孔类型代码到字典名称的映射。
 * @param stratumNames 当前矿井的地层编码到显示名称的映射。
 * @returns 仅承载列表展示及详情定位字段的钻孔行。
 */
export declare function mapDrillHoleSourceRow(drill: DrillHoleSourceFields, explorationLineNames: Map<string, string>, holeTypeNames: Map<string, string>, stratumNames: Map<string, string>): DrillHoleRow;
/**
 * 校验钻孔列表的两层业务状态后提取完整记录。
 * @param response GetList 的原始响应
 * @returns 原始钻孔数组；成功空数组保持为空，不构造示例数据
 * @throws 鉴权、外层或内层业务失败、数据结构不符合已确认契约时抛出错误
 */
export declare function readGisDrillList(response: GisDrillListResponse): GisDrillRecord[];
/**
 * 校验单个钻孔的两层业务状态后提取最新完整实体。
 * @param response GetOne 的原始响应。
 * @returns 服务端当前保存的完整钻孔实体。
 * @throws 外层或内层业务失败、实体缺失时抛出错误。
 */
export declare function readGisDrillOne(response: GisDrillOneResponse): GisDrillRecord;
/**
 * 校验岩性字典单层响应并提取字典项，删除标记由映射阶段处理。
 * @param response rockdictionary 原始响应
 * @returns 原始字典数组
 * @throws 业务失败或 data 不是数组时抛出错误
 */
export declare function readRockDictionary(response: RockDictionaryResponse): RockDictionaryRecord[];
/**
 * 转换一个钻孔的列表和详情字段；数值直接转字符串以保留 0 和服务端精度。
 * @param drill 原始钻孔记录
 * @param rockNames 有效岩性字典映射
 * @param stratumNames 当前矿井地层名称映射
 * @returns 包含全部岩层和原始响应的界面行
 */
export declare function mapDrillHoleRecord(drill: GisDrillRecord, rockNames: Map<string, string>, stratumNames: Map<string, string>): DrillHoleRow;
/**
 * 使用有效岩性字典和本矿井地层名称映射完整钻孔列表。
 * @param drills 钻孔原始记录
 * @param dictionary 岩性字典，deletemark=true 的重复历史项不参与匹配
 * @param strata 本矿井的地层模型，不使用其他矿井数据
 * @returns 独立界面行数组；原始响应和原岩层顺序均不修改
 */
export declare function mapDrillHoleRows(drills: GisDrillRecord[], dictionary: RockDictionaryRecord[], strata: StratumModel[]): DrillHoleRow[];

import type { DrillHoleAuxiliaryResponse, DrillHoleExplorationLineQueryResponse, DrillHoleFeatureClassSchemaRecord, DrillHoleSourceData, DrillHoleSourceQueryResponse, DrillHoleStratumSourceQueryResponse, DrillHoleTypeDictionaryItem, GisDrillDeleteRequest, GisDrillMutationResponse, GisDrillOneResponse, GisDrillRecord, RockDictionaryResponse } from '../drillHoleDataManage/types';
/** 钻孔模块接口入口，统一使用当前应用的 baseAPI 和登录鉴权客户端。 */
declare class DrillHoleApi {
    /**
     * 获取井田地质钻孔数据模型的全量列表。
     * @returns SourceQuery 数据模型响应，钻孔实体位于 data.modelData。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getList: () => Promise<DrillHoleSourceQueryResponse>;
    /**
     * 获取钻孔列表关联的勘探线数据。
     * @returns 勘探线 SourceQuery 响应，列表实体位于 data.modelData。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getExplorationLines: () => Promise<DrillHoleExplorationLineQueryResponse>;
    /**
     * 获取基础信息“钻孔类别”下拉选项。
     * @returns drill_type 字典明细，显示名称和保存值分别为 F_ItemName、F_ItemValue。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getDrillTypes: () => Promise<DrillHoleAuxiliaryResponse<DrillHoleTypeDictionaryItem[]>>;
    /**
     * 获取基础信息“起始层位”和“终止层位”的地层模型数据。
     * @returns 地层 SourceQuery 响应，选项实体位于 data.modelData。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getStrata: () => Promise<DrillHoleStratumSourceQueryResponse>;
    /**
     * 获取一个钻孔及其全部关联要素类数据。
     * @param keyValue 数据源主键，即列表实体的 id。
     * @returns 包含 metaData 和 featureClasses 的单钻孔 SourceQuery 响应。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由后续详情服务校验。
     */
    getSourceDetail: (keyValue: string) => Promise<DrillHoleSourceQueryResponse>;
    /**
     * 整体保存一个钻孔及其全部要素类明细。
     * 新增、修改、删除要素均由客户端修改完整 SourceQuery.data 后调用本接口。
     * @param data 当前钻孔的完整数据模型详情。
     * @returns 保存业务响应，成功码为 200。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由调用服务校验。
     */
    updateSource: (data: DrillHoleSourceData) => Promise<DrillHoleAuxiliaryResponse<string>>;
    /**
     * 获取钻孔模型的要素类 Schema 列表。
     * @returns 钻孔下 13 类几何或非几何要素的动态配置。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getFeatureClassSchemas: () => Promise<DrillHoleAuxiliaryResponse<DrillHoleFeatureClassSchemaRecord[]>>;
    /**
     * 获取地面钻孔表的数据源映射配置。
     * @returns 包含主从表关系、字段映射及查询规则的数据源配置。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getSourceSchema: () => Promise<DrillHoleAuxiliaryResponse<Record<string, unknown>>>;
    /**
     * 获取钻孔详情导出配置。
     * @returns 当前钻孔模型的导出字段及模板配置列表。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getExportSettings: () => Promise<DrillHoleAuxiliaryResponse<Record<string, unknown>[]>>;
    /**
     * 获取详情字段引用的关联地质模型数据。
     * @param modelId 关联模型标识；详情实测会查询勘探线、地层年代和煤层模型。
     * @returns 关联模型的 SourceQuery 原始响应。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getRelatedModelData: (modelId: string) => Promise<DrillHoleAuxiliaryResponse<Record<string, unknown>>>;
    /**
     * 获取钻孔详情字段引用的数据表字典。
     * @param code 数据表代码，例如 GisMineBaseList、Base_user、Base_Department、rock_bzc 或 cadFillSymbol。
     * @returns 对应数据表的字典记录。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getDetailDataTable: (code: string) => Promise<DrillHoleAuxiliaryResponse<Record<string, unknown>[]>>;
    /**
     * 获取钻孔详情字段引用的数据项字典。
     * @param code 数据项代码，详情实测包括 drill_type 和 GeoModelFeatureGeoType。
     * @returns 对应数据项的字典记录。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise。
     */
    getDetailDataItems: (code: string) => Promise<DrillHoleAuxiliaryResponse<Record<string, unknown>[]>>;
    /**
     * 获取一个钻孔的最新完整实体，修改弹框每次打开前调用。
     * @param params 钻孔业务代码和所属矿井编码，与删除接口参数一致。
     * @returns 双层单钻孔响应，完整实体位于内层 data。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getOne: (params: GisDrillDeleteRequest) => Promise<GisDrillOneResponse>;
    /**
     * 获取钻孔岩性字典。
     * @returns 岩性字典响应，包含未删除项和历史删除项。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由数据服务校验。
     */
    getRockDictionary: () => Promise<RockDictionaryResponse>;
    /**
     * 保存一个钻孔及其岩层明细，接口要求提交完整钻孔实体。
     * @param params 基于查询结果更新后的完整钻孔实体。
     * @returns 服务端修改结果，业务成功码为 200。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由调用方校验。
     */
    save: (params: GisDrillRecord) => Promise<GisDrillMutationResponse>;
    /**
     * 新增一个钻孔及其岩层明细，接口要求提交完整钻孔实体。
     * @param params 当前矿井下待新增的完整钻孔实体。
     * @returns 服务端新增结果，业务成功码为 200。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由调用方校验。
     */
    create: (params: GisDrillRecord) => Promise<GisDrillMutationResponse>;
    /**
     * 删除指定矿井中的一个钻孔。
     * @param params 钻孔业务代码和所属矿井编码。
     * @returns 服务端删除结果，业务成功码为 200。
     * @throws 网络或 HTTP 错误由 apiClient 拒绝 Promise，业务错误由调用方校验。
     */
    delete: (params: GisDrillDeleteRequest) => Promise<GisDrillMutationResponse>;
}
declare const drillHoleApi: DrillHoleApi;
export default drillHoleApi;

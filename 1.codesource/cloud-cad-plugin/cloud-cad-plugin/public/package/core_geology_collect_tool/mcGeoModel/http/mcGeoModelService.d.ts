/**
 * 地质模型接口服务
 * @description 负责地质模型库相关的所有 HTTP 请求，只负责请求、不包含业务解析；
 * 请求后的数据解析统一在 parse/ 目录完成，组装在 assemble/ 目录完成。
 * @class McGeoModelService
 */
export declare class McGeoModelService {
    /**
     * 获取模型基础实体信息（包含 MetaDataSchema / FormSchema）
     * @param modelId 数据模型 ID
     * @returns 模型基础实体响应
     * @example
     * const res = await mcGeoModelService.getDataModelEntity(modelId);
     */
    getDataModelEntity: (modelId: string) => Promise<any>;
    /**
     * 获取模型要素类 Schema 列表
     * @param modelId 数据模型 ID
     * @returns 要素类 Schema 列表响应
     * @example
     * const res = await mcGeoModelService.getFeatureClassSchemaList(modelId);
     */
    getFeatureClassSchemaList: (modelId: string) => Promise<any>;
    /**
     * 获取模型样式分类列表
     * @description 仅用于样式二维/三维分类；每条记录含 ID / ViewType / IsDefault / FeatureClassStyleIds
     * @param modelId 数据模型 ID
     * @returns 样式分类记录数组响应
     * @example
     * const res = await mcGeoModelService.getStyleModelList(modelId);
     */
    getStyleModelList: (modelId: string) => Promise<any>;
    /**
     * 获取要素类样式明细列表
     * @description 每条明细含 ID / StyleName / FeatureClassId / StyleOptions（样式选项树 JSON 字符串）
     * @param featureClassId 要素类 ID
     * @returns 要素类样式明细列表响应
     * @example
     * const res = await mcGeoModelService.getFeatureStyleList(featureClassId);
     */
    getFeatureStyleList: (featureClassId: string) => Promise<any>;
    /**
     * 获取数据源选项数据
     * @description 供下拉控件等场景加载数据源（editor 侧组装 options 时使用）
     * @param code 数据源编码
     * @returns 数据源数据列表响应
     * @example
     * const res = await mcGeoModelService.getDataSourceDataList(code);
     */
    getDataSourceDataList: (code: string) => Promise<any>;
}
/** 地质模型接口服务单例 */
export declare const mcGeoModelService: McGeoModelService;

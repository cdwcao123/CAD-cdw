import { responseType } from 'McCore';
import type { DrainageCloudCadDataRequest, DrainageCloudCadDeleteRequest, DrainageCloudCadMutationResponse, DrainageCloudCadResponse, DrainageCloudCadSaveRequest, EvaluationUnitSaveItem } from '../drainageContent/types/interface';
import type { EvaluationUnitDeleteRequest } from '../drainageContent/types/type';
import type { StratumLinkVertexData, StratumLinkVertexDataRequest, StratumListRequest, StratumListResponse, StratumModel, StratumSaveRequest } from '../types';
/** 地质采集接口入口，统一使用当前应用 baseAPI 和登录鉴权请求客户端。 */
declare class Api {
    /**
     * 获取指定矿井的钻场、钻孔或评价单元数据。
     * @param params Type 为字符串类别编号，mineCode 为矿井编码，均通过 GET 查询参数提交。
     * @returns 已实测的 State/code/info/data 响应；业务成功码为 200。
     * @throws 请求失败时沿用 apiClient 的异常，不转换为空数据。
     */
    getCloudCadData: (params: DrainageCloudCadDataRequest) => Promise<DrainageCloudCadResponse>;
    /**
     * 批量保存钻孔、钻场，以 form-data 提交 JSON 列表，查询参数 isSite 控制钻场保存。
     * @param params gas_drillList、gas_siteList 是 JSON 数组字符串；isSite 必须通过 URL 查询参数提交。
     * @returns 平台业务响应；调用方检查 code 后重新加载列表。
     * @throws HTTP 请求失败时保留 apiClient 异常。
     */
    saveCloudCadData: (params: DrainageCloudCadSaveRequest) => Promise<DrainageCloudCadMutationResponse>;
    /**
     * 批量删除钻孔、钻场，以 form-data 提交各自的服务端 ID 列表。
     * @param params gas_drillList、gas_siteList 为英文逗号分隔 ID，无数据的一类传空字符串。
     * @returns 平台业务响应；失败不能作为已删除处理。
     * @throws HTTP 请求失败时保留 apiClient 异常。
     */
    deleteCloudCadData: (params: DrainageCloudCadDeleteRequest) => Promise<DrainageCloudCadMutationResponse>;
    /**
     * 批量新增或修改评价单元，以 JSON 对象数组提交。
     * @param params 每项包含评价单元主实体；keyValue 为空时新增，非空时修改。
     * @returns 平台业务响应；调用方在成功后重新加载列表核对落库结果。
     * @throws HTTP 请求失败时保留 apiClient 异常。
     */
    saveEvaluationUnitList: (params: EvaluationUnitSaveItem[]) => Promise<DrainageCloudCadMutationResponse>;
    /**
     * 按服务端主键批量删除评价单元，以 JSON 字符串数组提交。
     * @param params 待删除评价单元的服务端主键列表。
     * @returns 平台业务响应；调用方在成功后重新加载列表核对删除结果。
     * @throws HTTP 请求失败时保留 apiClient 异常。
     */
    deleteEvaluationUnitList: (params: EvaluationUnitDeleteRequest) => Promise<DrainageCloudCadMutationResponse>;
    getTunnel: (params: any) => Promise<any>;
    /**
     * 获取指定矿井的地层配置列表。
     *
     * @param params 矿井编码及是否包含三角网数据的查询参数。
     * @returns 服务端双层响应；地层包装项位于 `response.data.data`。
     * @throws HTTP 请求失败时由 apiClient 拒绝 Promise，业务码由调用方校验。
     */
    getStratumList: (params: StratumListRequest) => Promise<responseType<responseType<StratumListResponse>>>;
    /**
     * 全量保存当前矿井的地层配置，新增、修改、删除及排序共用该接口。
     *
     * @param params 包含更新后全部 StratumModel 的请求对象，不能只传差异项。
     * @returns 服务端保存结果，业务成功码为 200。
     * @throws HTTP 请求失败时由 apiClient 拒绝 Promise，业务码由调用方校验。
     */
    saveStratum: (params: StratumSaveRequest) => Promise<responseType<unknown>>;
    /**
     * 保存更新过 `vertexInfo` 的完整地层信息对象。
     *
     * @param params 地层面板当前持有的完整模型。
     * @returns 服务端保存结果，当前按业务成功码 200 判断。
     * @throws HTTP 请求失败时由 apiClient 拒绝 Promise。
     */
    saveStratumEntity: (params: StratumModel) => Promise<responseType<unknown>>;
    /**
     * 获取指定地层关联的顶点数据。
     *
     * @param params 矿井、地层、数据源类型及顶底板查询参数。
     * @returns 顶点数组响应，业务成功码为 0。
     * @throws HTTP 请求失败时由 apiClient 拒绝 Promise，业务码由调用方校验。
     */
    getStratumLinkVertexData: (params: StratumLinkVertexDataRequest) => Promise<responseType<StratumLinkVertexData[]>>;
    /**
     * 获取 stratum_type 地层类型字典明细。
     *
     * @returns 字典接口原始响应；历史响应嵌套差异由 stratumType 服务兼容。
     * @throws HTTP 请求失败时由 apiClient 拒绝 Promise。
     */
    getStratumTypeList: () => Promise<any>;
    getWorkingFaceList: (params: any) => Promise<any>;
    getOneTunnel: (params: any) => Promise<any>;
    getOneWorkingFace: (params: any) => Promise<any>;
    batchdeleteTunnel: (params: any) => Promise<any>;
    updateTunnel: (params: any) => Promise<any>;
    batchAddTunnelsToServer: (params: any) => Promise<any>;
    getDataModelBaseInfoList: (params: any) => Promise<any>;
    getDataModelEntity: (params: any) => Promise<any>;
    /**
     * @description 查询数据源相关的数据
     * @param modelId 模型Id
     * @param sourceId 数据源Id
     * @param isQueryFeatureInfo 是否查询要素类信息
     * @returns {Object}
     */
    modelDataSourceQuery: (params: any) => Promise<any>;
    sourceAdd: (params: any) => Promise<any>;
    sourceUpdate: (params: any) => Promise<any>;
    sourceDelete: (params: any) => Promise<any>;
    uploadFile: (params: any) => Promise<any>;
    deleteFile: (params: any) => Promise<any>;
    getDrawingDetail: (params: any) => Promise<any>;
    saveDrawing: (params: any) => Promise<any>;
    uploadDrawing: (params: any) => Promise<any>;
    getDicts: (code: string) => Promise<any>;
    getDataSourceDataList: (code: string) => Promise<any>;
    getDataModelFeatureClassSchemaList: (params: any) => Promise<any>;
    deleteWorkingFace: (params: any) => Promise<any>;
    updateWorkingFace: (params: any) => Promise<any>;
    createWorkingFace: (params: any) => Promise<any>;
    saveBaseMapVersion: (params: any) => Promise<any>;
    buildTopologyService: (params: any) => Promise<any>;
    /**
     * 获取要素对应的样式列表
     */
    getFeatureStyleList: (params: any) => Promise<any>;
}
declare const api: Api;
export default api;

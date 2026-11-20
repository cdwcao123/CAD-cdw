import type { StratumModel } from '../../../types';
import type { DrillHoleDataSet, DrillHoleFeatureClass, DrillHoleRow, DrillHoleSourceData, GisDrillRecord } from '../types';
/**
 * 加载 SourceQuery 钻孔列表，并按当前工作区矿井代码筛选。
 * @returns 可直接供管理列表和详情使用的完整数据集
 * @throws 工作区缺少矿井编码或接口的网络、鉴权、业务、响应格式错误均透传给界面处理
 */
export declare function loadDrillHoleData(): Promise<DrillHoleDataSet>;
/**
 * 获取当前列表行对应的最新完整钻孔信息，并重新映射详情显示数据。
 * @param row 列表中选中的钻孔，使用其钻孔代码和矿井编码定位服务端实体。
 * @param strata 当前矿井地层，用于映射层位名称。
 * @returns 基于 GetOne 最新实体生成的详情行。
 * @throws 参数缺失、网络请求、业务状态或响应结构异常时抛出错误。
 */
export declare function loadLatestDrillHole(row: DrillHoleRow, strata: StratumModel[]): Promise<DrillHoleRow>;
/**
 * 按参考页面契约整体保存钻孔数据模型及全部要素类明细。
 * @param data 由 SourceQuery 详情复制并在本地完成增删改的数据对象。
 * @returns 保存成功后结束。
 * @throws 网络、HTTP 或业务状态失败时抛出错误。
 */
export declare function saveDrillHoleSourceDetail(data: DrillHoleSourceData): Promise<void>;
/**
 * 在基础钻孔新增成功后，将添加或虚拟钻孔弹框中的业务 Tab 草稿写入新钻孔。
 * 普通新增保留服务端生成的辅助几何；虚拟钻孔同时写入本地处理后的孔口和地层连线。
 * @param keyValue 新钻孔业务代码，对应 SourceQuery 的 keyValue。
 * @param featureClasses 添加弹框持有的完整要素类草稿。
 * @param includeGeometry 是否同时上传虚拟钻孔的孔口和地层连线草稿，普通新增默认不覆盖。
 * @returns 没有业务要素记录时直接结束；有记录时整体保存新钻孔详情。
 * @throws 新钻孔详情尚未生成、要素类缺失或 SourceUpdate 失败时抛出错误。
 */
export declare function saveCreatedDrillHoleFeatureDraft(keyValue: string, featureClasses: DrillHoleFeatureClass[], includeGeometry?: boolean): Promise<void>;
/**
 * 获取列表行对应的最新完整钻孔实体，供修改和虚拟钻孔复制共用。
 * @param row 列表中选中的钻孔。
 * @returns GetOne 返回的最新完整钻孔实体。
 * @throws 参数缺失、网络请求、业务状态或响应结构异常时抛出错误。
 */
export declare function loadLatestDrillHoleRecord(row: DrillHoleRow): Promise<GisDrillRecord>;

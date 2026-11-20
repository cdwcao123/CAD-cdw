import type { DrillHoleDetailsForm, DrillHoleFeatureTemplate, DrillHoleRow, GisDrillRecord, VirtualDrillHolePoint } from '../types';
/**
 * 基于查询返回的完整实体覆盖详情表单中允许编辑的字段。
 * @param row 当前钻孔行，必须携带 source 完整实体。
 * @param form 详情弹框提交的表单值。
 * @returns 可直接提交保存接口的完整钻孔实体，岩层和未展示字段保持原值。
 * @throws 缺少原始实体或数字字段无效时抛出错误，阻止发送不完整数据。
 */
export declare function createDrillHoleSaveRequest(row: DrillHoleRow, form: DrillHoleDetailsForm): GisDrillRecord;
/**
 * 创建新增钻孔使用的完整空实体，并映射为详情弹框数据。
 * @param featureTemplate 服务端要素类配置生成的完整空 Tab 模板。
 * @returns 当前工作区矿井下的新增钻孔草稿；数值字段默认 0，岩层明细默认空数组。
 * @throws 当前工作区未提供矿井编码时抛出错误。
 */
export declare function createDrillHoleDraft(featureTemplate: DrillHoleFeatureTemplate): DrillHoleRow;
/**
 * 直接保存一个完整钻孔实体。
 * @param record GetOne 或导入流程生成的完整钻孔实体。
 * @returns 保存完成后结束。
 * @throws 实体校验、网络请求或服务端业务失败时抛出错误。
 */
export declare function saveDrillHoleRecord(record: GisDrillRecord): Promise<void>;
/**
 * 直接新增一个完整钻孔实体。
 * @param record 新增或 Excel 导入生成的完整钻孔实体。
 * @returns 新增完成后结束。
 * @throws 实体校验、网络请求或服务端业务失败时抛出错误。
 */
export declare function createDrillHoleRecord(record: GisDrillRecord): Promise<void>;
/**
 * 保存详情表单对应的完整钻孔实体。
 * @param row 当前钻孔原始行。
 * @param form 用户确认后的详情表单。
 * @returns 保存完成后结束。
 * @throws 表单转换、网络请求或服务端业务失败时抛出错误。
 */
export declare function saveDrillHole(row: DrillHoleRow, form: DrillHoleDetailsForm): Promise<void>;
/**
 * 新增详情表单对应的完整钻孔实体。
 * @param row 当前新增钻孔草稿，source 包含完整空实体字段。
 * @param form 用户确认后的详情表单。
 * @returns 新增完成后结束。
 * @throws 表单校验、网络请求或服务端业务失败时抛出错误。
 */
export declare function createDrillHole(row: DrillHoleRow, form: DrillHoleDetailsForm): Promise<void>;
/**
 * 复制源钻孔最新完整实体并创建虚拟钻孔详情草稿。
 * 草稿使用拾取点作为孔口坐标，基础新增实体不携带岩层；复制的全部业务要素由 SourceUpdate 统一保存。
 * @param source GetOne 返回的源钻孔最新完整实体。
 * @param point 活动图纸拾取的虚拟钻孔孔口坐标。
 * @param featureTemplate 源钻孔详情要素，用于复制全部业务 Tab 数据。
 * @returns 包含复制字段及岩层坐标校正后的要素草稿；厚度字段保持原值，基础 rock_info 为空，尚未提交服务器。
 * @throws 校正岩层时新孔口坐标无效会抛出错误。
 */
export declare function createVirtualDrillHoleDraft(source: GisDrillRecord, point: VirtualDrillHolePoint, featureTemplate: DrillHoleFeatureTemplate): DrillHoleRow;
/**
 * 删除当前列表行对应的钻孔。
 * @param row 当前钻孔行，需包含钻孔代码和矿井编码。
 * @returns 删除完成后结束。
 * @throws 缺少矿井编码、网络请求或服务端业务失败时抛出错误。
 */
export declare function deleteDrillHole(row: DrillHoleRow): Promise<void>;

import { type McCore, type McDbEntity } from 'McCore';
import type { DrainageDrillValueMode } from '../types/type';
/**
 * 使用评价单元范围内或相交的穿层孔，或直接框选的穿层孔生成临时剖面实体。
 * @param core 评价单元所属的活动图纸 Core。
 * @param entityIds 分组模式为评价单元 ID，框选模式为钻孔 ID。
 * @param picked 是否直接使用框选钻孔，默认查询评价单元范围内或相交钻孔。
 * @param mode 设计或实际类型，默认设计。
 * @returns 未加入正式数据库的剖面临时实体；范围内穿层孔不满足 Core 出图条件时为空数组。
 * @throws Core 插件未公开剖面几何接口、源实体失效或范围查询失败时抛出错误。
 */
export declare function createEvaluationProfilePreview(core: McCore, entityIds: string[], picked?: boolean, mode?: DrainageDrillValueMode): Promise<McDbEntity[]>;
/**
 * 将预览所选源实体交给 Core 生成评价单元图件，并拾取插入点。
 * @param entityIds 分组模式为评价单元 ID，框选模式为钻孔 ID；空数组不进入 Core 拾取。
 * @param drawingKey 发起操作时的图纸 key，用于阻止跨图纸写入。
 * @param picked 是否直接使用框选钻孔，默认查询评价单元范围内或相交钻孔。
 * @param mode 本次插入使用的钻孔类型，默认设计。
 * @returns 成功插入返回 true，取消、切换图纸或失败返回 false。
 */
export declare function drawEvaluationProfile(entityIds: string[], drawingKey?: any, picked?: boolean, mode?: DrainageDrillValueMode): Promise<boolean>;
/**
 * 暂时隐藏分组弹框后进入插入点拾取，结束后恢复原弹框显示状态。
 * @param entityIds 分组模式为评价单元 ID，框选模式为钻孔 ID。
 * @param drawingKey 打开分组弹框时的图纸 key。
 * @param picked 是否直接使用框选钻孔，默认查询评价单元范围内或相交钻孔。
 * @param mode 弹框当前选择的钻孔类型，默认设计。
 * @returns 插入成功返回 true，取消或失败返回 false。
 */
export declare function insertPreviewEvaluationProfile(entityIds: string[], drawingKey: string, picked?: boolean, mode?: DrainageDrillValueMode): Promise<boolean>;

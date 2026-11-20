import type { EvaluationSpatialData } from '../types/interface';
import type { DrainageDrillValueMode } from '../types/type';
import type { McCore } from 'McCore';
/**
 * 通过 Core 空间查询读取评价单元范围内或相交的穿层孔，分组与框选入口共用。
 * @param core 弹框绑定的活动图纸内核。
 * @param entityId 单个评价单元实体 ID。
 * @param mode 设计或实际数据模式，两个模式分别读取各自实体。
 * @returns 真实世界坐标快照；只包含穿层顶板孔、穿层底板孔，无对应穿层孔时 boreholes 为空。
 * @throws 评价单元失效、边界无效、焦点视图不可用或 Core 空间查询失败时抛出可展示的错误。
 */
export declare function readEvaluationSpatialData(core: McCore, entityId: string, mode: DrainageDrillValueMode): EvaluationSpatialData;

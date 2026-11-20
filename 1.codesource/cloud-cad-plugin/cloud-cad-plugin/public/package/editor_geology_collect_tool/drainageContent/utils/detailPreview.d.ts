import { type McDbEntity } from 'McCore';
/**
 * 汇总详情中已绘制实体的二维范围，供公共预览引擎定位。
 * @param entities 已通过预览引擎绘制、尚未加入正式图纸数据库的临时实体。
 * @returns 单个有效实体或汇总范围的临时容器；没有有效二维范围时返回 null。
 */
export declare function createDetailPreviewZoomTarget(entities: McDbEntity[]): McDbEntity | null;

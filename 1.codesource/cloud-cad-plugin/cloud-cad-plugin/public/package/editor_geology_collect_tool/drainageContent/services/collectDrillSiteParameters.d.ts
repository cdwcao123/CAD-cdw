import type { DrainageDrawingContext, DrainageSiteParameterRow } from '../types/interface';
/**
 * 采集只读钻场参数表，显示精度与钻孔参数一致，采集值保留原始精度供导出流程处理。
 * @param context 当前图纸的钻场、巷道实体及图纸 key。
 * @returns 每个真实钻场一行，包含定位所需的 objectId 和图纸 key。
 */
export declare function collectDrillSiteParameters(context: DrainageDrawingContext): DrainageSiteParameterRow[];
/**
 * 沿用钻孔参数表的行点击行为，定位并持续高亮原图纸中的钻场。
 * @param row 参数表中保存图纸 key 和实体 objectId 的钻场行。
 * @returns 定位及选择同步完成后结束，不修改钻场。
 * @throws 图纸切换、尚未就绪或钻场已删除时抛出错误。
 */
export declare function locateDrillSiteParameter(row: DrainageSiteParameterRow): Promise<void>;

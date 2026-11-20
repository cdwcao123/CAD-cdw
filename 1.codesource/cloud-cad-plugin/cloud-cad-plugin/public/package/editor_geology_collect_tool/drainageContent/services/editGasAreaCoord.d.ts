import type { DrillSiteCoordRow } from '../types/interface';
/**
 * 在 Editor 临时命令中修改评价单元的现有边界点，沿用 Core setter 的撤销记录。
 * @param drawingKey 弹框所属图纸 key。
 * @param entityId 评价单元 objectId。
 * @param index 从零开始的现有边界点下标，不允许借此追加点。
 * @param coord 目标 XYZ 坐标，单位为图纸坐标单位。
 * @returns 命令及写入均完成时为 true；提交时目标失效、下标越界或命令失败返回 false。
 * @throws 开始执行前图纸已切换、坐标非法或当前存在其他命令时抛出错误。
 */
export declare function editGasAreaCoord(drawingKey: string, entityId: string, index: number, coord: DrillSiteCoordRow): Promise<boolean>;

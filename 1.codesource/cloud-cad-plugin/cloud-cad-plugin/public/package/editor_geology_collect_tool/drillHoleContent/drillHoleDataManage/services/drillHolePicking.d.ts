import type { DrillHolePickedPoint, VirtualDrillHolePoint } from '../types';
/** 使用当前图纸的柱状图模板拾取一组地层数据。 */
export declare function collectRockStratum(dialogIds: string[], templateName: string): Promise<Array<Record<string, string | number>> | undefined>;
/**
 * 暂时隐藏业务弹框并从当前活动图纸拾取一个世界坐标点。
 * @param dialogId 发起拾取的公共弹框标识。
 * @param message 命令行显示的拾取提示。
 * @returns 拾取成功时返回世界坐标；取消、切换图纸或无可用绘图区时返回 undefined。
 */
export declare function pickDrillHolePoint(dialogId: string, message: string): Promise<DrillHolePickedPoint | undefined>;
/**
 * 从活动图纸单选一个普通文字或多行文字实体，并读取实体文字内容。
 * @param dialogId 发起拾取的公共弹框标识。
 * @param message 命令行显示的拾取提示。
 * @returns 拾取成功时返回文字内容；取消或图纸切换时返回 undefined。
 * @throws 当前没有可用绘图区时抛出错误。
 */
export declare function pickDrillHoleText(dialogId: string | string[], message: string): Promise<string | undefined>;
/**
 * 暂时隐藏钻孔管理弹框并从当前活动图纸拾取虚拟钻孔孔口点。
 * @param dialogId 钻孔数据管理弹框标识。
 * @returns 拾取成功时返回世界坐标；取消、切换图纸或无可用绘图区时返回 undefined。
 */
export declare function pickVirtualDrillHolePoint(dialogId: string): Promise<VirtualDrillHolePoint | undefined>;

import { type McCore, type McDbEntity } from 'McCore';
import type { DrainageBoreholeCategory, OpenHoleDiagramDirection } from '../types/type';
/**
 * 生成指定巷道、指定方向的开孔示意图临时实体。
 * @param core 当前图纸 Core 实例。
 * @param tunnelId 巷道实体 ID。
 * @param direction 出图方向，horizontal 为横向，vertical 为纵向。
 * @param category 菜单限定孔型，转换成类型数组传给 Core；省略时不传筛选参数，显示所有类型。
 * @returns 未加入正式数据库的开孔示意图实体。
 * @throws Core 插件接口缺失、巷道失效或图件生成失败时抛出错误。
 */
export declare function createOpenHolePreview(core: McCore, tunnelId: string, direction: OpenHoleDiagramDirection, category?: DrainageBoreholeCategory): Promise<McDbEntity[]>;
/**
 * 将 Editor 已选巷道交给 Core 生成图件并拾取插入点。
 * @param tunnelId 已选巷道实体 ID；空值不进入 Core 拾取。
 * @param direction 出图方向，默认横向。
 * @param drawingKey 发起操作时的图纸标识，用于阻止跨图纸写入。
 * @param category 菜单限定孔型，使用与预览相同的类型数组；省略时不传筛选参数，显示所有类型。
 * @returns 成功插入返回 true，取消或失败返回 false。
 */
export declare function drawOpenHoleDiagram(tunnelId: string, direction?: OpenHoleDiagramDirection, drawingKey?: any, category?: DrainageBoreholeCategory): Promise<boolean>;
/**
 * 暂时隐藏分组出图弹框，并按当前选中的方向进入插入点拾取流程。
 * @param tunnelId 巷道实体 ID。
 * @param direction 当前选中的出图方向。
 * @param drawingKey 弹框所属图纸标识。
 * @param category 菜单限定孔型，透传至插入命令。
 * @returns 成功插入返回 true，取消或失败返回 false。
 */
export declare function insertPreviewOpenHoleDiagram(tunnelId: string, direction: OpenHoleDiagramDirection, drawingKey: string, category?: DrainageBoreholeCategory): Promise<boolean>;

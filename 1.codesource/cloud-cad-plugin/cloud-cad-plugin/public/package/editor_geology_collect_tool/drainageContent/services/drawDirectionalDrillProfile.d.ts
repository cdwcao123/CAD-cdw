import { type McCore, type McDbEntity } from 'McCore';
/**
 * 调用 Core 定向钻单孔剖面接口，返回临时实体交给公共预览组件绘制。
 * @param core 所选定向孔所属的图纸内核。
 * @param entityIds 单选或框选后已按设计/实际筛选的正式定向孔 ID，多个时只预览第一个。
 * @returns Core 返回的临时图件列表；接口未生成图件时为空，不向正式数据库写入。
 * @throws 首个定向孔失效或 Core 几何接口执行失败时传播错误。
 */
export declare function createDirectionalDrillProfilePreview(core: McCore, entityIds: string[]): Promise<McDbEntity[]>;
/**
 * 在临时命令内调用 Core 定向钻单孔剖面插入接口，由 Core 完成插入点拾取与入库。
 * @param entityIds 当前预览所选的正式定向孔 ID，多个时只插入第一个，空数组不启动插入。
 * @param drawingKey 发起操作的图纸标识，阻止切换图纸后继续插入。
 * @returns 所选单孔新增图件时返回 true；取消、无图件、换图或失败时返回 false。
 */
export declare function drawDirectionalDrillProfile(entityIds: string[], drawingKey: string): Promise<boolean>;
/**
 * 暂时隐藏公共预览弹框供 Core 拾取插入点，结束后恢复原弹框和选择。
 * @param entityIds 当前预览已选的正式定向孔 ID，多个时使用第一个，不使用预览副本 ID。
 * @param drawingKey 预览所属的图纸标识。
 * @returns 单孔插入成功返回 true，公共确认流程随后关闭预览；取消或失败返回 false 并保留预览。
 */
export declare function insertPreviewDirectionalDrillProfile(entityIds: string[], drawingKey: string): Promise<boolean>;

import type { DrainageBoreholeCategory, DrainageDiagramType } from '../types/type';
/**
 * 启动框选出图，先拾取源对象再打开 Editor 预览，确认插入后才启动 Core 出图命令。
 * @param type 本次菜单对应的图件类型。
 * @param category 开孔和普通孔剖面的菜单孔型，贯穿拾取、预览、导出及确认插入。
 * @returns 拾取结束后打开预览；取消、换图或失败时不打开弹框、不插图。
 */
export declare function pickDrainageDiagram(type: DrainageDiagramType, category?: DrainageBoreholeCategory): Promise<void>;

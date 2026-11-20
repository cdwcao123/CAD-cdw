import type { DrillHoleTemplateEditingOptions, DrillHoleTemplateEditingSession } from '../types';
/** 按当前模板的几何和文字整体范围居中缩放，保留编辑边距。 */
export declare function zoomDrillHoleTemplateEditing(session: DrillHoleTemplateEditingSession): void;
/**
 * 克隆选中几何并隐藏原图纸，提供与块编辑相同的独立图面编辑体验。
 * @param options 来源 Core、几何、中心点，以及修改时的原模板
 * @returns 编辑会话；所有退出路径必须调用 restore
 * @throws 当前图纸已切换或创建副本失败时抛出异常，已完成的图面修改会恢复
 */
export declare function beginDrillHoleTemplateEditing(options: DrillHoleTemplateEditingOptions): DrillHoleTemplateEditingSession;

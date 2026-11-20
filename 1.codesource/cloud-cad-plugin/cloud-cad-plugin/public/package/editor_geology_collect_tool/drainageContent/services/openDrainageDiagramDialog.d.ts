import type { DrainageDiagramSelection } from '../types/interface';
import type { DrainageBoreholeCategory, DrainageDiagramType } from '../types/type';
/**
 * 使用全局外弹框打开抽采图件，包括开孔示意图、剖面图和评价单元三维布置图。
 * @param type 图件类型，决定标题与选择数据。
 * @param selection Editor 拾取结果；传入时固定预览对象并隐藏左侧列表，省略时显示分组选择。
 * @param category 菜单限定孔型，贯穿分组选项、预览和正式插入。
 * @returns 打开或更新公共图件弹框，不修改正式图纸。
 * @throws 钻孔剖面分组所需的 Core 钻孔类型枚举未就绪时抛出错误。
 */
export declare function openDrainageDiagramDialog(type: DrainageDiagramType, selection?: DrainageDiagramSelection, category?: DrainageBoreholeCategory): void;

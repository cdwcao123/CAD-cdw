import { type McCore, type McDbEntity } from 'McCore';
import type { DrainageBoreholeCategory } from '../types/type';
/**
 * 生成临时剖面实体；分组入口按业务组出图，框选入口将所选钻孔作为一组出图。
 * @param core 所选钻孔所属的图纸内核。
 * @param entityIds 选择树或框选得到的正式钻孔 objectId。
 * @param picked 是否来自框选，默认按选择树分组。
 * @param category 菜单限定孔型，省略时保留原有调用范围。
 * @returns Core 生成的未入库剖面实体列表。
 * @throws Core 接口缺失或钻孔已失效时抛出错误。
 */
export declare function createDrillProfilePreview(core: McCore, entityIds: string[], picked?: boolean, category?: DrainageBoreholeCategory): Promise<McDbEntity[]>;
/**
 * 调用 Core 完整命令生成并插入剖面图，分组选择合并为一次出图的钻孔集合。
 * @param entityIds 预览面板已选钻孔 ID，传入 Core 前去重；空数组不进入 Core 拾取。
 * @param drawingKey 发起操作的图纸标识，阻止切换图纸后继续操作。
 * @param category 菜单限定孔型；正式插入前重新读取实体类型。
 * @returns 成功插入返回 true；取消、图纸切换或失败返回 false，并提示业务错误。
 */
export declare function drawDrillProfile(entityIds: string[], drawingKey?: any, category?: DrainageBoreholeCategory): Promise<boolean>;
/**
 * 暂时隐藏预览面板，调用 Core 插入完成后恢复原面板与选择。
 * @param entityIds 分组面板已选各组包含的正式钻孔 ID。
 * @param drawingKey 面板所属图纸标识。
 * @param category 菜单限定孔型，透传至正式插入校验。
 * @returns 成功插入返回 true；取消或失败返回 false。
 */
export declare function insertPreviewDrillProfile(entityIds: string[], drawingKey: string, category?: DrainageBoreholeCategory): Promise<boolean>;

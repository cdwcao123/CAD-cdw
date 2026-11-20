import type { McDbEntity } from 'McCore';
import type { BaseOption } from 'McEditor';
/**
 * 读取关联实体所在图纸的工作面选项，显示名称与编码，关联值只保存工作面编码。
 * @param source 保存工作面关联的图纸实体；未入库的临时实体没有可选工作面。
 * @returns 当前图纸中未删除且具有编码的工作面选项，不修改实体或依赖活动图纸。
 */
export declare function getWorkFaceAssociationOptions(source: McDbEntity): BaseOption[];

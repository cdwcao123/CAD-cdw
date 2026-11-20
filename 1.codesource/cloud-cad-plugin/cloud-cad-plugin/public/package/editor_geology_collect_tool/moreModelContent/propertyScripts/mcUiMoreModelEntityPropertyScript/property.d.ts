import type { GroupPropertyType, McGeoPropertyGroupDescriptor } from './types';
/**
 * 构建地质模型特性面板脚本
 * @description 数据 → 脚本的唯一入口：接收 core 组装的中性分组树描述，
 * hydrate 成编辑器运行时 GroupPropertyType[]（含 getVal/setVal/options 等闭包）。
 * 语义等同于普通实体脚本 property.ts 里导出的固定 propertyPanelScript。
 * @param descriptors 特性面板中性分组树描述
 * @returns 特性面板运行时脚本
 */
export declare const buildMoreModelPropertyScript: (descriptors: McGeoPropertyGroupDescriptor[]) => GroupPropertyType[];
/** 仅构建器入口，模型缓存/初始化逻辑见 modelPropertyLoader.ts */

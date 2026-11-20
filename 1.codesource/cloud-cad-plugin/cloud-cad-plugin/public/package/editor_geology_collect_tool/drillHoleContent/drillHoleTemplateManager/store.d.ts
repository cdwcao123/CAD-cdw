import { type McCore } from 'McCore';
import type { DrillHoleTemplateConfig } from './types';
import type { McDbPlaneTemplateStyleTable } from '@/core_geology_collect_tool/mcGeoDrill/template';
/** 当前图纸样式表的名称列表，供管理器和绘制弹框共同使用。 */
export declare const drillHoleTemplateList: import("vue").Ref<{
    name: string;
}[], DrillHoleTemplateConfig[] | {
    name: string;
}[]>;
/** 当前图纸选中的模板名称，没有活动模板时为空。 */
export declare const currentDrillHoleTemplateName: import("vue").Ref<string, string>;
/**
 * 获取 Core 插件创建的钻孔平面模板样式表。
 * @param core 目标图纸 Core，默认当前活动 Core
 * @returns 样式表；Core 或插件尚未初始化时返回 undefined
 */
export declare function getDrillHoleTemplateTable(core?: McCore | null): McDbPlaneTemplateStyleTable | undefined;
/**
 * 刷新当前图纸的列表投影，不创建独立模板数据。
 * @returns 无返回值
 */
export declare function refreshDrillHoleTemplates(): void;
/**
 * 切换样式表事件订阅，并刷新模板列表。
 * @param core 新活动 Core，null 表示没有活动图纸
 * @returns 无返回值
 */
export declare function bindDrillHoleTemplateTable(core: McCore | null): void;
/**
 * 获取模板列表中的显示项。
 * @param name 样式名称
 * @returns 显示项，不存在时返回 undefined
 */
export declare const getDrillHoleTemplateConfig: (name: string) => DrillHoleTemplateConfig | undefined;
/**
 * 将模板置为当前，并同步列表状态。
 * @param name 当前图纸中的模板名称
 * @returns 样式存在且成功设置时返回 true
 */
export declare function setCurrentDrillHoleTemplate(name: string): boolean;
/**
 * 从 Core 样式表删除模板，遵守内置模板、当前模板和引用限制。
 * @param name 待删除的模板名称
 * @returns 无返回值
 * @throws 模板不存在、是内置模板或样式表拒绝删除时抛出错误
 */
export declare function removeDrillHoleTemplate(name: string): void;

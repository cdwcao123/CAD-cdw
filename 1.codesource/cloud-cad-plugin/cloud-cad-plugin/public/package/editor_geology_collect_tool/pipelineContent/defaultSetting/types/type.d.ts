import type { getCoreGeologyCollectTool } from '@/utils/pluginApi';
import type { McColor } from 'McCore';
import type { menuTriggerType } from 'McEditor';
/**
 * 数值枚举类型
 * @param key 枚举键
 * @param value 枚举值
 */
export type NumericEnumLike = Record<string, string | number>;
/**
 * 管线绘制样式实例
 */
type CoreGeologyCollectToolBase = ReturnType<typeof getCoreGeologyCollectTool>;
type McDbPipelineDrawStyleInstance = CoreGeologyCollectToolBase['McDbPipelineDrawStyle']['instance'];
type McDbPipelineDrawStyleProperty = Parameters<McDbPipelineDrawStyleInstance['setContextStyleProperty']>[0];
/**
 * 管线绘制样式实例
 */
export type { McDbPipelineDrawStyleInstance, McDbPipelineDrawStyleProperty };
/**
 * 管线绘制样式模块
 */
export interface McDbPipelineDrawStyleModule {
    instance: McDbPipelineDrawStyleInstance;
}
/**
 * 管线绘制样式核心API
 */
export type PipelineCoreApi = CoreGeologyCollectToolBase & {
    McDbPipelineDrawStyle: McDbPipelineDrawStyleModule;
    McDbPipelineDrawStylePropertyType: CoreGeologyCollectToolBase['McDbPipelineDrawStylePropertyType'];
    McDbPipelineDrawStylePropertyEvent: CoreGeologyCollectToolBase['McDbPipelineDrawStylePropertyEvent'];
    McPipeSection: CoreGeologyCollectToolBase['McPipeSection'];
    McPipeType: CoreGeologyCollectToolBase['McPipeType'];
    McPipeFlow: CoreGeologyCollectToolBase['McPipeFlow'];
};
/**
 * 管线绘制样式属性值
 */
export type McDbPipelineDrawStylePropertyValue = McDbPipelineDrawStyleProperty['value'];
/**
 * 管线绘制样式属性类型
 */
export type McDbPipelineDrawStylePropertyType = CoreGeologyCollectToolBase['McDbPipelineDrawStylePropertyType'];
/**
 * 管线绘制样式属性事件
 */
export type McDbPipelineDrawStylePropertyEvent = CoreGeologyCollectToolBase['McDbPipelineDrawStylePropertyEvent'];
export type McPipeSectionEnum = CoreGeologyCollectToolBase['McPipeSection']; /** 管截面 */
export type McPipeTypeEnum = CoreGeologyCollectToolBase['McPipeType']; /** 管类型 */
export type McPipeFlowEnum = CoreGeologyCollectToolBase['McPipeFlow']; /** 管流方向 */
export type McPipeSectionValue = McPipeSectionEnum[keyof McPipeSectionEnum]; /** 管截面值 */
export type McPipeTypeValue = McPipeTypeEnum[keyof McPipeTypeEnum]; /** 管类型值 */
export type McPipeFlowValue = McPipeFlowEnum[keyof McPipeFlowEnum]; /** 管流方向值 */
export type McDbPipelineDrawStylePropertyTypeValue = McDbPipelineDrawStylePropertyType[keyof McDbPipelineDrawStylePropertyType]; /** 管线绘制样式属性类型值 */
export type McDbPipelineDrawStylePropertyEventValue = McDbPipelineDrawStylePropertyEvent[keyof McDbPipelineDrawStylePropertyEvent]; /** 管线绘制样式属性事件值 */
/**
 * 颜色或颜色字符串
 */
export type McColorLike = McColor | string;
/**
 * 管线默认设置表单
 */
export interface PipelineDefaultSettingMcColorLike {
    mcColor?: unknown;
}
/**
 * 菜单触发事件
 */
export interface MenuTriggerEventHost {
    on: (eventName: 'menuTrigger', callback: (data: menuTriggerType) => void) => void;
    off: (eventName: 'menuTrigger', callback: (data: menuTriggerType) => void) => void;
}
/**
 * 管线绘制样式属性事件枚举
 */
export type PipelineEventEnum = Record<string, McDbPipelineDrawStylePropertyEventValue>;
/**
 * 管线绘制样式属性类型枚举
 */
type CoreGeologyCollectTool = NonNullable<ReturnType<typeof getCoreGeologyCollectTool>>;
/**
   * 管线绘制样式属性事件类型
   */
export type PipelineDrawStylePropertyEvent = Parameters<NonNullable<Parameters<CoreGeologyCollectTool['McDbPipelineDrawStyle']['instance']['setContextStylePanelFun']>[0]>>[0];

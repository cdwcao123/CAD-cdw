import { type NodeModuleDefine, type TopNodeJsonDefine } from 'McEditor';
import type { DrainageStraightBoreholeCategory, ThroughHoleMode } from '../types/type';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McAlongParameter, McSingleDirectionalParameter, McSingleParameter, McThroughParameter } from '@/core_geology_collect_tool/mcDrainageBorehole/types/interface';
/** 抽采设计参数配置模块的运行时 key。 */
export declare const drainageParameterModuleKeys: {
    readonly throughDrillSite: "drainageThroughHoleDrillSiteModePanel";
    readonly throughRoadway: "drainageThroughHoleRoadwayModePanel";
    readonly along: "drainageAlongHolePanel";
    readonly draw: "drainageDrawHolePanel";
    readonly directional: "drainageDirectionalHolePanel";
    readonly directionalDesign: "drainageDirectionalDesignPanel";
    readonly evaluationUnit: "drainageEvaluationUnitPanel";
};
/** 创建定向钻参数面板，初值由 Core 绘制会话提供。 */
export declare const createDirectionalHoleParameterModule: (onClose: () => void, parameters: McSingleDirectionalParameter, plugin: CoreGeologyCollectTool, onChange: (parameters: McSingleDirectionalParameter) => void) => NodeModuleDefine;
/**
 * 创建钻孔参数面板的操作区，仅提供图标加文字的关闭入口。
 * @param moduleKey 参数面板唯一标识，用于生成关闭项的 key。
 * @param onClose 关闭当前参数面板并返回抽采设计菜单的回调。
 * @returns 使用 Ribbon 图文样式的操作分组。
 */
export declare const createOperationPanel: (moduleKey: string, onClose: () => void) => TopNodeJsonDefine;
/**
 * 创建穿层钻孔参数菜单模块。
 * @param mode 当前穿层孔设计模式，决定参数列的展示范围和顺序。
 * @param onCancel 关闭当前参数面板并返回抽采设计菜单的回调。
 * @param parameters Core 穿层孔参数契约对应的完整初始值。
 * @param onChange 接收字段变更后的完整参数快照，供运行中的命令更新参数。
 * @returns 穿层孔 Ribbon 参数面板定义。
 */
export declare const createThroughHoleParameterModule: (mode: ThroughHoleMode, onCancel: () => void, parameters: McThroughParameter, onChange: (parameters: McThroughParameter) => void) => NodeModuleDefine;
/**
 * 创建顺层钻孔参数菜单模块。
 * @param onClose 关闭面板及其关联的顺层孔绘制会话。
 * @param parameters Core 顺层孔参数契约对应的完整初始值。
 * @param plugin 已安装的 Core 插件 API，提供顺层布孔方式枚举。
 * @param onChange 接收字段变更后的完整参数快照，供运行中的命令更新预览。
 * @returns 顺层孔 Ribbon 参数面板定义。
 */
export declare const createAlongHoleParameterModule: (onClose: () => void, parameters: McAlongParameter, plugin: CoreGeologyCollectTool, onChange: (parameters: McAlongParameter) => void) => NodeModuleDefine;
/**
 * 创建绘制单孔参数菜单模块。
 * 参数变化始终提交完整快照，供运行中的 Core 绘制命令实时更新预览。
 * @param onClose 关闭参数面板及其绘制会话。
 * @param parameters Core 单孔参数契约对应的完整初始值。
 * @param plugin 已安装的 Core 插件 API，提供用途和类型枚举。
 * @param onChange 接收每次编辑后的完整参数；暂时清空数值输入时不发送无效数值。
 * @param category 所属孔型；传入时只允许该孔型的两个子类型，省略时保留通用面板的全部类型。
 * @returns 单孔 Ribbon 参数面板定义。
 */
export declare const createDrawHoleParameterModule: (onClose: () => void, parameters: McSingleParameter, plugin: CoreGeologyCollectTool, onChange: (parameters: McSingleParameter) => void, category?: DrainageStraightBoreholeCategory) => NodeModuleDefine;

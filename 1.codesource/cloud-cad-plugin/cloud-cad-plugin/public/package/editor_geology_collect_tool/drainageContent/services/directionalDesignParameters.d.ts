import type { DirectionalDesignPanelParameters } from '../types/interface';
import type { McDirectionalDesignParameter } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 初始化定向钻参数面板状态。
 * 边界和钻场等待用户绘制或拾取，数值参数使用 Core 契约约定的默认值。
 * @returns 实体引用为空、数值参数已填入默认值的独立面板状态。
 */
export declare function createDirectionalDesignPanelParameters(): DirectionalDesignPanelParameters;
/**
 * 校验 Core 必填数值并提取业务参数；字段名称和取值直接沿用 Core。
 * @param parameters 当前面板状态，实体引用的有效性由设计控制器检查。
 * @returns 不含面积和钻场名称等 Editor 字段的完整 Core 参数。
 * @throws 数值尚未填写或无效时抛出对应字段的错误。
 */
export declare function toDirectionalDesignParameter(parameters: DirectionalDesignPanelParameters): McDirectionalDesignParameter;

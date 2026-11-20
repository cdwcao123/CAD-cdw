import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McSingleDirectionalParameter } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 定向钻面板默认值由 editor 维护，通过现有参数契约传给 Core 绘制命令。 */
export declare function createDirectionalBoreholeParameters(api: CoreGeologyCollectTool): McSingleDirectionalParameter;

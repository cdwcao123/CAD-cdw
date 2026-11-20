import { type McCore } from 'McCore';
import type { EvaluationUnitBoreholeRow, EvaluationUnitBoreholeTarget } from '../types/interface';
import type { EvaluationUnitBoreholeAddMode } from '../types/type';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McDbDrainageBorehole, McDbGasArea } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 当前侧边面板绑定的评价单元；由特性面板入口在打开前更新。 */
export declare const evaluationUnitBoreholeTarget: import("vue").ShallowRef<EvaluationUnitBoreholeTarget | null, EvaluationUnitBoreholeTarget | null>;
/**
 * 设置关联面板目标，图纸和实体标识共同阻止跨图纸误写。
 * @param target 当前单选评价单元及其所属图纸；null 表示关联面板会话已结束。
 * @returns 无返回值。
 */
export declare function setEvaluationUnitBoreholeTarget(target: EvaluationUnitBoreholeTarget | null): void;
/**
 * 读取当前评价单元及图纸中的真实钻孔数据。
 * @param target 面板绑定的评价单元目标。
 * @returns 全部可关联钻孔及当前仍存在的关联实体 ID。
 * @throws 目标图纸或评价单元已失效时抛出错误。
 */
export declare function readEvaluationUnitBoreholes(target: EvaluationUnitBoreholeTarget): {
    rows: EvaluationUnitBoreholeRow[];
    linkedIds: string[];
};
/**
 * 按评价单元边界查询范围内或相交的钻孔，供关联面板及剖面、三维布置图共同使用。
 * @param core 评价单元所属的活动图纸 Core，不启动交互命令或修改选择集。
 * @param area 需要查询空间范围的评价单元，不读取或更新其绑定钻孔列表。
 * @param api 已加载的地质采集 Core 插件 API，提供钻孔实体类型。
 * @returns 区域内被包含或相交的有效钻孔 ID，已去重。
 * @throws 焦点视图不可用或 Core 空间查询失败时抛出错误。
 */
export declare function queryEvaluationUnitBoreholes(core: McCore, area: McDbGasArea, api: CoreGeologyCollectTool): string[];
/**
 * 获取候选钻孔：手动模式启动多选命令，评价单元模式直接按当前面板目标执行 Core 空间查询。
 * @param target 关联面板绑定的图纸与评价单元。
 * @param mode 本次候选钻孔的拾取方式。
 * @returns 拾取到的有效钻孔实体 ID；取消命令或面板会话结束时返回空数组。
 * @throws 当前有其他命令、Core 插件接口缺失、焦点视图不可用或目标图纸失效时抛出错误。
 */
export declare function pickEvaluationUnitBoreholes(target: EvaluationUnitBoreholeTarget, mode: EvaluationUnitBoreholeAddMode): Promise<string[]>;
/**
 * 在临时命令中更新评价单元的关联钻孔，生成可撤销的实体修改记录。
 * @param target 面板绑定的评价单元目标。
 * @param drillIds 更新后的完整钻孔 objectId 列表。
 * @returns 写入完成后无返回值。
 * @throws 当前存在其他命令、图纸切换、评价单元失效或钻孔 ID 非法时抛出错误。
 */
export declare function updateEvaluationUnitBoreholes(target: EvaluationUnitBoreholeTarget, drillIds: string[]): Promise<void>;
/**
 * 从当前图纸解析评价单元已关联的真实钻孔。
 * @param area 特性面板对应的评价单元。
 * @returns 仍存在且类型正确的关联钻孔。
 */
export declare function resolveLinkedBoreholes(area: McDbGasArea): McDbDrainageBorehole[];

import type { BoreholeCorrectionCalculation, BoreholeCorrectionGroups, BoreholeCorrectionSelection } from '../types/interface';
import type { McCore } from 'McCore';
/**
 * 从当前图纸收集两份穿层孔分组，以实体设计标记区分左右列表。
 * @param core 已就绪的原图纸内核。
 * @returns 左侧反演孔和右侧设计孔分组；任一侧没有孔时返回对应空列表。
 * @throws Core 修正 API 未加载时抛出错误，不显示不可提交的旧参数面板。
 */
export declare function collectBoreholeCorrectionGroups(core: McCore): BoreholeCorrectionGroups;
/**
 * 使用两组完整钻孔及最新参数调用 Core，取得设计平面图和修正平面图的临时图件，不应用修正。
 * @param core 计算所属的原图纸内核。
 * @param groups 打开弹框时收集的左右分组选项。
 * @param selection 点击下一步时读取的单选值及完整穿层参数。
 * @returns Core 返回的原孔、修正孔、两份图件及按 ID 匹配的原孔更新和新孔入库计划。
 * @throws 参数无效、组选孔失效、Core 无结果、修正孔 ID 重复或无法匹配原孔、几何计算异常时抛出错误，由首个弹框提示并保留输入。
 */
export declare function calculateBoreholeCorrection(core: McCore, groups: BoreholeCorrectionGroups, selection: BoreholeCorrectionSelection): Promise<BoreholeCorrectionCalculation>;

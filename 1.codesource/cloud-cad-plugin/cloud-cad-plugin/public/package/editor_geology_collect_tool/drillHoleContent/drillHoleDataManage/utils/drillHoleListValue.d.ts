import type { DrillHoleListValues, DrillHoleRow } from '../types';
/**
 * 将钻孔列表值转换为表格和 Excel 共用的展示文本。
 * @param row 已映射的钻孔列表行；不需要完整详情实体。
 * @param prop 列配置对应的基础信息字段。
 * @returns 类型和层位优先显示字典名称，布尔值显示“是/否”，缺省值显示空文本，其余值保留原文本。
 */
export declare function getDrillHoleListValue(row: DrillHoleRow, prop: keyof DrillHoleListValues): string;

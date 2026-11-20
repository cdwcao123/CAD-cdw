import type { DirectionalDesignResultRow, DirectionalDesignResultSheet } from '../types/interface';
import type { DirectionalChartSheet, DirectionalDesignNumericField } from '../types/type';
/**
 * 检查当前图表实际使用的字段，防止数字格清空后被当成零点或导致图表异常。
 * @param sheet 包含当前输入及公式结果的完整工作表，不修改任何数据。
 * @param fields 当前维度绘图使用的孔深或坐标字段。
 * @returns 无返回值，全部绘图数值完整时正常结束。
 * @throws 图表需要的字段为空或非有限数字时提示先补全数据。
 */
export declare function assertDirectionalChartValues<K extends DirectionalDesignNumericField>(sheet: DirectionalDesignResultSheet, fields: K[]): asserts sheet is DirectionalChartSheet<K>;
/**
 * 在主干与分支、相邻不同分支之间插入一个排版空行，供结果表和 Excel 共用。
 * @param rows 按轨迹顺序排列的完整业务行。
 * @returns 保留原行引用的展示序列，undefined 表示分隔空行；首尾不增加空行。
 */
export declare function separateDirectionalResultBranches(rows: DirectionalDesignResultRow[]): (DirectionalDesignResultRow | undefined)[];
/**
 * 为分支起点选择原公式引用的主支测点，精确命中优先，否则取包含该孔深的段首。
 * @param main 按轨迹顺序排列的主支测点，不要求孔深递增。
 * @param depth 分支起点累计孔深，单位米；为空时没有参考点。
 * @returns 主支中已有的测点引用；孔深为空或不在主支范围内时返回 undefined。
 */
export declare function findDirectionalBranchReference(main: DirectionalDesignResultRow[], depth: number | null): DirectionalDesignResultRow | undefined;

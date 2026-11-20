import { McColor } from 'McCore';
/**
 * 将 Core 颜色转换为原生颜色控件可回显的值。
 * @param color 实体当前文本颜色及其颜色模式。
 * @returns 真彩色时为 rgb 字符串，其他模式为颜色索引。
 */
export declare function toColorControlValue(color: McColor): string | number;
/**
 * 单体分组只在选中该类型的一个实体时显示，公共属性仍允许多选聚合。
 * @param selection 当前属性面板的选择集上下文。
 * @returns 恰好一个实体时为 true。
 */
export declare const isSingleEntity: ({ entities }: {
    entities?: unknown[];
}) => boolean;

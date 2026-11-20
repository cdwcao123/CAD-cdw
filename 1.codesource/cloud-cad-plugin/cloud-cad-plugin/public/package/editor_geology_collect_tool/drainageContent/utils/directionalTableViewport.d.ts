import type { Column } from 'McEditor';
/**
 * 将结果数值统一显示为两位小数，格式化不改变原始轨迹数据。
 * @param value 数值、分支文本或空字段；空字段保持空白。
 * @returns 数值的定点文本或原文本，整数也补齐两位小数。
 */
export declare function formatDirectionalResultValue(value: unknown): string;
/**
 * 建立可变行高的累计偏移，供滚动定位和占位高度共用。
 * @param count 包含补齐空行在内的数据行数。
 * @param heights 用户调整后的行高（像素），缺省行使用 32px。
 * @returns 长度为 count + 1 的偏移数组，最后一项为完整表体高度。
 */
export declare function createDirectionalRowOffsets(count: number, heights: number[]): number[];
/**
 * 二分查找指定纵向位置对应的数据行，避免滚动事件遍历全部结果。
 * @param offsets 数据行累计偏移，至少包含起始位置 0。
 * @param position 距表体顶部的像素位置。
 * @returns 从零开始的行序号；空表返回 0，超出表体时返回末行。
 */
export declare function findDirectionalRowIndex(offsets: number[], position: number): number;
/**
 * 按两位小数显示文本测量业务列宽度，不改变底层数值或裁切显示内容。
 * @param columns 模板列配置，索引列保持自身宽度。
 * @param rows 要测量的原始结果行，不需要先渲染到 DOM。
 * @param font 表格实际使用的 CSS 字体描述。
 * @returns 各列所需的最小宽度（像素），包含文本和输入框两侧留白。
 */
export declare function measureDirectionalColumnWidths(columns: Column[], rows: object[], font: string): number[];

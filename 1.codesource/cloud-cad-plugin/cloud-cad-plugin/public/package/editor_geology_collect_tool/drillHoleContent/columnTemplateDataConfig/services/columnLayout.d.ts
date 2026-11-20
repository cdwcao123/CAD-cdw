import type { IColumnInfo } from '@/core_geology_collect_tool/mcGeoDrill/template';
/**
 * 在当前选中显示属性之前插入占位项。
 * @param columns 当前从左至右的列配置。
 * @param index 右侧当前选中索引，必须落在列范围内。
 * @param placeholder Core createUnValidColumn 创建的占位列。
 * @returns 新的列数组；选中索引无效时保持原排列。
 */
export declare function insertPlaceholder(columns: IColumnInfo[], index: number, placeholder: IColumnInfo): IColumnInfo[];
/**
 * 将选中显示属性或占位项向上、向下移动一位。
 * @param columns 当前从左至右的列配置。
 * @param index 右侧选中的列索引；按索引区分多个同名占位项。
 * @param offset -1 表示上移，1 表示下移。
 * @returns 新的有序列数组；越界时保持原排列。
 */
export declare function moveColumn(columns: IColumnInfo[], index: number, offset: -1 | 1): IColumnInfo[];

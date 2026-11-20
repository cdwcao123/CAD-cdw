import { RibbonControlItem, RibbonLabelOptions } from '../types/type';
/**
 * 创建 Ribbon 标签项（label 控件）
 * @param key 控件 key
 * @param label 标签文本
 * @param options 标签选项（displayLabel 展示名 / desc 描述）
 * @returns 标签控件对象
 */
export declare const createRibbonLabelItem: (key: unknown, label: unknown, options?: RibbonLabelOptions) => RibbonControlItem;
/**
 * 归一化任意 Ribbon 控件
 * @description 根据 type 分发到 INPUT/INPUT_NUMBER/SELECT/LABEL/ICON_TEXT 对应归一化逻辑。
 * @param rawItem 原始控件对象
 * @returns 归一化后的控件对象（非对象原样返回）
 */
export declare const normalizeRibbonControl: (rawItem: unknown) => RibbonControlItem | unknown;

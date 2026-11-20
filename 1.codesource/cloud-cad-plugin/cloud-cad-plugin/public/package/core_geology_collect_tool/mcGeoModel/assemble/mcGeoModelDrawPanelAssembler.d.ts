import type { McGeoDrawPanelDescriptor, McGeoPropertyGroupDescriptor } from '../types/interface';
/**
 * 组装绘制面板中性描述
 * @description 与特性面板同源：直接使用特性面板分组树作为字段/样式分组顺序来源，
 * editor 侧据此生成 ribbon module JSON（布局、控件 normalize、close 按钮等由 editor 完成）。
 * @param groups 特性面板分组树描述
 * @returns 绘制面板中性描述
 */
export declare const buildDrawPanelDescriptor: (groups: McGeoPropertyGroupDescriptor[]) => McGeoDrawPanelDescriptor;

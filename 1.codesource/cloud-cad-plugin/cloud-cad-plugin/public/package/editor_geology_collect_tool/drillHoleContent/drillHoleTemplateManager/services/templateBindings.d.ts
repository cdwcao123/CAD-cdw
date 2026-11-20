import { McDbText } from 'McCore';
import type { DrillHoleTemplateEditingSession, DrillHoleTemplatePoint, DrillHoleTemplateText } from '../types';
/**
 * 只拾取当前模板编辑图面中的一个文字实体。
 * @param dialogId 字段绑定弹框标识
 * @param session 编辑会话，限定文字必须属于当前模板
 * @returns 文字实体；取消时返回 undefined
 * @throws 框选多个文字或拾取编辑范围外实体时，由公共拾取流程提示错误
 */
export declare function pickTemplateBindingText(dialogId: string, session: DrillHoleTemplateEditingSession): Promise<DrillHoleTemplateText | undefined>;
/**
 * 在模板编辑图面的拾取坐标处创建可移动文字，默认高度为 20 个图纸单位。
 * 文字使用字段中文名称或自定义输入内容，后续保存按实体标识读取最新位置和文字高度。
 * @param session 编辑会话
 * @param point 拾取的世界坐标
 * @param label 字段中文名称或自定义来源输入内容，用作图面文字内容
 * @returns 已加入编辑图面的临时文字，退出会话时统一清理
 * @throws 当前图纸拒绝创建实体时抛出错误
 */
export declare function createTemplateBindingText(session: DrillHoleTemplateEditingSession, point: DrillHoleTemplatePoint, label: string): McDbText;

import type { DrillHoleTemplateBindingRow, DrillHoleTemplateEditingSession } from '../types';
import type { McDbPlaneTemplateStyle } from '@/core_geology_collect_tool/mcGeoDrill/template';
/**
 * 读取最新编辑实体和绑定文字，构造可加入样式表的完整模板。
 * @param session 模板编辑会话
 * @param rows 当前绑定表，不将临时文字标识写入模板数据
 * @returns 包含几何、属性定义和绑定关系的新模板对象
 * @throws 属性名称为空或重复、绑定文字已删除或被替换为非文字时抛出错误
 */
export declare function createDrillHoleTemplateStyle(session: DrillHoleTemplateEditingSession, rows: DrillHoleTemplateBindingRow[]): Promise<McDbPlaneTemplateStyle>;
/**
 * 将完整模板写入 Core 样式表，已有模板保持对象身份和实体引用。
 * @param session 编辑会话及原模板
 * @param rows 用户确认的绑定行
 * @returns 新增或修改后的真实 Core 模板
 * @throws 样式表不存在、名称冲突、模板已被外部替换或构造校验失败时抛出错误
 */
export declare function saveDrillHoleTemplate(session: DrillHoleTemplateEditingSession, rows: DrillHoleTemplateBindingRow[]): Promise<McDbPlaneTemplateStyle>;

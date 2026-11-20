import type { McDbPlaneTemplateStyle, McDbPlaneTemplateStyleTable } from '@/core_geology_collect_tool/mcGeoDrill/template';
import type { McCore } from 'McCore';
/**
 * 校验新建或编辑模板的名称，编辑时允许沿用自身名称，但不得占用其他模板的名称。
 * @param core 模板所属图纸
 * @param name 用户填写的目标名称
 * @param originalStyle 编辑前的原模板；新建时不传
 * @returns 校验通过的真实样式表，供后续保存使用
 * @throws 名称为空、重名、内置模板禁止改名、原模板已删除或替换时抛出错误
 */
export declare function validateDrillHoleTemplateName(core: McCore, name: string, originalStyle?: McDbPlaneTemplateStyle): McDbPlaneTemplateStyleTable;
/** 重命名原模板并同步钻孔引用，保留几何、属性绑定和样式对象身份。 */
export declare function renameDrillHoleTemplate(core: McCore, style: McDbPlaneTemplateStyle, name: string): void;

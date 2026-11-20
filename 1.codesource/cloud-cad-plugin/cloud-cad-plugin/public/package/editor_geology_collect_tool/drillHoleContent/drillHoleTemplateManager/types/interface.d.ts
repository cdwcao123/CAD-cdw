import type { McDbPlaneTemplateStyle, IMcDbPlaneTemplateStyleAttrBindMap } from '@/core_geology_collect_tool/mcGeoDrill/template';
import type { McCore, McDbEntity } from 'McCore';
import type { DialogData } from 'McEditor';
export type { DialogData };
/** 样式表投影到模板列表的显示数据，不另存一份模板。 */
export interface DrillHoleTemplateConfig {
    /** 模板在当前图纸样式表中的唯一名称。 */
    name: string;
}
/** 新建或编辑模板第一步完成后交给图面配置的数据。 */
export interface DrillHoleTemplateNamePayload {
    /** 去除首尾空白后的模板名称。 */
    name: string;
    /** 新拾取的图纸实体 objectId；复用原模板几何时允许为空。 */
    entityIds: string[];
    /** 编辑模式为 true，始终沿用原模板几何与属性定义。 */
    reuseOriginalGeometry: boolean;
    /** 拾取实体和中心点的 Core 原始实例。 */
    sourceCore: McCore;
    /** 模板中心点，采用图纸世界坐标和图纸单位。 */
    centerPoint: DrillHoleTemplatePoint;
}
/** 模板中心点，单位与图纸一致。 */
export interface DrillHoleTemplatePoint {
    /** 世界坐标 X。 */
    x: number;
    /** 世界坐标 Y。 */
    y: number;
    /** 世界坐标 Z，二维取点也保留实际高程。 */
    z: number;
}
/** 新建或编辑模板的表单草稿，确认前不修改正式样式。 */
export interface DrillHoleTemplateNameForm {
    /** 用户输入的名称，确认时去除首尾空白。 */
    name: string;
    /** 来源实体标识；空数组表示尚未选择。 */
    entityIds: string[];
    /** 中心点；undefined 表示尚未拾取。 */
    centerPoint?: DrillHoleTemplatePoint;
}
/** 实体拾取结果，保存所属 Core 以阻止跨图纸混用标识。 */
export interface DrillHoleTemplateEntitySelection {
    /** 本次拾取所属的 Core。 */
    core: McCore;
    /** 拾取到的实体 objectId。 */
    entityIds: string[];
}
/** 绑定表的编辑行，保存时仅将五个业务绑定字段写入模板。 */
export interface DrillHoleTemplateBindingRow extends IMcDbPlaneTemplateStyleAttrBindMap {
    /** 编辑图面中的文字实体 objectId；保存时必须据此读取最新位置。 */
    textEntityId: string;
    /** 是否由“选择坐标”创建；删除绑定时同步移除这类临时文字。 */
    generatedText: boolean;
}
/** 进入模板编辑场景的输入。 */
export interface DrillHoleTemplateEditingOptions {
    /** 场景所属 Core。 */
    core: McCore;
    /** 新建或编辑的模板名称。 */
    name: string;
    /** 模板插入基点，采用来源图纸世界坐标。 */
    centerPoint: DrillHoleTemplatePoint;
    /** 需要克隆到编辑图面的模板几何。 */
    entities: McDbEntity[];
    /** 修改已有模板时的原样式；新建时不传。 */
    originalStyle?: McDbPlaneTemplateStyle;
}
/** 原图纸实体的显隐快照，退出编辑时恢复。 */
export interface DrillHoleTemplateVisibilityBackup {
    /** 原图纸实体。 */
    entity: McDbEntity;
    /** 原始可见状态。 */
    visible: boolean;
}
/** 模板图面编辑会话，正式图纸保持原状，仅操作副本。 */
export interface DrillHoleTemplateEditingSession {
    /** 承载副本的 Core。 */
    core: McCore;
    /** 模板名称。 */
    name: string;
    /** 模板中心点世界坐标。 */
    centerPoint: DrillHoleTemplatePoint;
    /** 已有模板，保存修改时保持其身份和引用。 */
    originalStyle?: McDbPlaneTemplateStyle;
    /** 从原模板属性定义恢复的绑定行。 */
    initialBindings: DrillHoleTemplateBindingRow[];
    /** 编辑会话是否尚未退出，用于阻止异步保存写回已关闭的图面。 */
    isActive: () => boolean;
    /** 实时获取编辑副本及编辑期间新增、未删除的实体。 */
    getEntities: () => McDbEntity[];
    /** 移除编辑实体并恢复原图纸，允许重复调用。 */
    restore: () => void;
}
/** 管理器内容组件提供给公共弹框按钮的操作。 */
export interface DrillHoleTemplateManagerDialogData extends DialogData {
    /** 获取列表当前选中的模板名称，没有选择时返回空字符串。 */
    getSelectedTemplate: () => string;
    /** 删除当前选择的模板，校验失败时保留列表。 */
    removeSelectedTemplate: () => void;
}
/** Editor 下拉使用的字段选项，沿用 Core 的 field/label 数据契约。 */
export interface DrillHoleTemplateFieldOption {
    /** 相对数据源的字段路径；预定义来源使用计算字段键。 */
    field: string;
    /** 字段的中文显示名称。 */
    label: string;
}
/** 模板编辑副本的命令记录清理器，只清理本次会话产生的实体记录。 */
export interface DrillHoleTemplateHistorySession {
    /** 解除监听并从捕获的命令缓存移除临时实体记录，保留其余记录。 */
    dispose: () => void;
}

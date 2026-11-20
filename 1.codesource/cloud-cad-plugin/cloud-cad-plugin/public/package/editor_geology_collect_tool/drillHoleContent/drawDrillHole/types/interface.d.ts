import type { DrawDrillHoleFieldControl, DrawDrillHoleFieldKey } from './type';
import type { DialogData } from '../../types';
import type { FieldSourceType } from '@/core_geology_collect_tool/mcGeoDrill/template';
/** 绘制钻孔弹框向公共弹框管理器暴露的数据。 */
export interface DrawDrillHoleDialogData extends DialogData {
    /** 打开钻孔模板管理器。 */
    openMoreConfig: () => void;
}
/** 绘制钻孔弹框的表单数据。 */
export interface DrawDrillHoleFormData {
    /** 当前选中的钻孔绘制模板名称。 */
    templateName: string;
}
/** 绘制钻孔弹框数据表的行配置。 */
export interface DrawDrillHoleFieldRow {
    /** 表单字段键。 */
    key: DrawDrillHoleFieldKey;
    /** 界面显示名称。 */
    label: string;
    /** 当前字段使用的控件类型。 */
    control: DrawDrillHoleFieldControl;
    /** 模板绑定的数据来源。 */
    sourceType: FieldSourceType;
    /** 模板绑定的字段路径；自定义来源时为固定文本。 */
    linkField: string;
    /** 自定义属性由模板直接给值，不允许在绘制时修改。 */
    readonly: boolean;
}

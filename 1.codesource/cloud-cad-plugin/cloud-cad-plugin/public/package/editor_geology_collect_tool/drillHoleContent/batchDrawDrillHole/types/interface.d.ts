import type { BatchDrawDrillHoleSource } from './type';
import type { DrillHoleRow } from '../../drillHoleDataManage/types';
import type { DialogData } from '../../types';
import type { McDbGeoDrillInstance } from '@/utils/pluginApi';
/** 每个新建钻孔共用的渲染属性。 */
export interface BatchDrillHoleRenderOptions {
    stratumType: Parameters<McDbGeoDrillInstance['setCurStratumType']>[0];
    showStratum: string;
}
export interface BatchDrillHoleDrawingOptions extends BatchDrillHoleRenderOptions {
    templateName: string;
    angle: number;
}
/** 批量绘制钻孔表格行。 */
export interface BatchDrawDrillHoleRow extends DrillHoleRow {
    /** 界面序号。 */
    no: number;
    /** 是否参与本次批量绘制。 */
    selected: boolean;
    /** 钻孔代码。 */
    drillHoleCode: string;
    /** 钻孔名称。 */
    drillHoleName: string;
    /** 见煤点标高，单位为米。 */
    coalPointElevation: string;
    /** 煤厚，单位为米。 */
    coalThickness: string;
    /** 终孔深度，单位为米。 */
    finalHoleDepth: string;
    /** 孔半径，单位为毫米。 */
    radius: string;
    /** 钻孔位置描述。 */
    location: string;
}
/** 批量绘制钻孔弹框表单。 */
export interface BatchDrawDrillHoleFormData extends BatchDrillHoleRenderOptions {
    /** 当前绘制模板名称。 */
    templateName: string;
    /** 当前数据来源。 */
    source: BatchDrawDrillHoleSource;
    /** 钻孔图例旋转角度，单位为度。 */
    angle: string;
}
/** 批量绘制钻孔弹框暴露给公共弹框管理器的数据。 */
export interface BatchDrawDrillHoleDialogData extends DialogData {
}

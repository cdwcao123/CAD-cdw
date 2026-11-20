import type { DrainageDrawingContext, GasAreaField, GasAreaParameterRow, GasAreaSnapshot } from '../types/interface';
import type { McDbGasArea } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 参数、反演和 Excel 的统一业务字段白名单；顺序同时决定表格和导出列顺序。 */
export declare const gasAreaFields: GasAreaField[];
/**
 * 读取序列化业务白名单，坐标复制为普通 XYZ 对象，避免表格快照持有实体可变引用。
 * @param area 图纸内或临时的评价单元。
 * @returns 保留原始精度的业务快照；不包含父类字段和 drillIDs。
 */
export declare function readGasAreaSnapshot(area: McDbGasArea): GasAreaSnapshot;
/**
 * 生成面板显示值；日产量显示字典文本，坐标始终不进入显示对象。
 * @param snapshot 序列化业务快照。
 * @returns 只包含业务列的显示对象，数值不截断保存精度。
 */
export declare function gasAreaDisplayValues(snapshot: GasAreaSnapshot): Record<string, string | number>;
/**
 * 收集当前图纸内有效评价单元；关联工作面在面板展示名称和编码，Excel 仍保留原编码。
 * @param context 已固定图纸的读取上下文。
 * @returns 参数行快照，不修改或关联任何钻孔。
 */
export declare function collectGasAreaParameters(context: DrainageDrawingContext): GasAreaParameterRow[];
/**
 * 定位并高亮当前图纸中的评价单元。
 * @param drawingKey 参数或反演行所属图纸。
 * @param entityId 正式评价单元 ID。
 * @returns 定位完成后结束。
 * @throws 图纸切换、尚未就绪或实体被删除时抛错。
 */
export declare function locateGasArea(drawingKey: string, entityId: string): void;

import type { DrainageCoalMeasurement, DrainageDrawingContext, DrainageQualificationDrawingRow, DrainageQualificationRow } from '../types/interface';
import type { Column } from 'McEditor';
/**
 * 根据实体当前参数判定；长度和深度误差需要设计对照，实际点距独立检查。
 * @param id 判定行的聚合标识。
 * @param boreholeCode 去除 _fy 后缀的原始孔号。
 * @param design 设计孔当前参数；见止煤深度为零时仍按既有规则视为缺少判定数据。
 * @param actual 反演孔当前参数，深度与半径单位为米。
 * @param distance 反演孔的见止煤点水平距离，米；缺省时跳过点距判定。
 * @returns 实际点距超限时直接不合格；其他情况下缺少对照数据则未判定，导出与最终判定一致。
 */
export declare function evaluateDrainageQualification(id: string, boreholeCode: string, design: DrainageCoalMeasurement, actual: DrainageCoalMeasurement, distance?: number): DrainageQualificationRow;
/**
 * 排除定向钻孔后，按巷道、钻场、原始孔号配对设计孔和反演孔，仅使用实体当前数据。
 * @param context 当前图纸及其钻孔实体集合。
 * @returns 可定位的判定行；缺孔或重号不进行设计对比，但唯一反演孔的实际点距仍独立检查。
 */
export declare function collectDrainageQualification(context: DrainageDrawingContext): DrainageQualificationDrawingRow[];
/**
 * 从完整结果列表导出不合格行，包括缺少设计对照但实际点距超限的反演孔。
 * @param rows 当前图纸的完整判定结果，不受界面孔号、类型、巷道或判定结果筛选影响。
 * @param columns 与界面一致的导出列定义。
 * @returns 实际导出行数；没有不合格结果时返回零且不下载文件。
 * @throws 工作簿生成或下载失败时继续抛出错误。
 */
export declare function exportDrainageUnqualified(rows: DrainageQualificationRow[], columns: Column[]): Promise<number>;

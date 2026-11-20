import ExcelJS from 'exceljs';
import type { DrainageExcelColumn, DrainageReverseRow } from '../types/interface';
import type { DrainageDrillValueMode, DrainageParameterRow, DrainageReverseMode, DrainageStraightBoreholeCategory } from '../types/type';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
/** 与业务提供的《钻场数据.xlsx》《钻孔数据.xlsx》表头、顺序和单位一致。 */
export declare const drainageExcelColumns: Record<DrainageReverseMode, DrainageExcelColumn[]>;
/**
 * 创建可填写的反演模板，下载时包含示例，参数导出时仅复用格式与中文下拉。
 * @param mode 钻场或钻孔模板类型。
 * @param api 已加载 Core 插件的钻孔用途、类型枚举，读取枚举值而非字段名。
 * @param includeExamples 是否添加一条所有模板字段均有值的通用示例，不读取当前矿井或图纸关联；实际参数导出传 false。
 * @param category 钻孔反演菜单所属孔型；限定模板类型选项和示例，省略时保留通用模板。
 * @returns 含前一万条数据行下拉规则和可选示例的工作簿。
 */
export declare function createDrainageTemplate(mode: DrainageReverseMode, api: Pick<CoreGeologyCollectTool, 'McBoreholePurpose' | 'McBoreholeType'>, includeExamples?: boolean, category?: DrainageStraightBoreholeCategory): ExcelJS.Workbook;
/** 共用 Excel 下载出口，不上传任何表格内容。 */
export declare function downloadDrainageWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void>;
/**
 * 复用对应反演模板，以实际参数替换示例，保留格式和中文下拉。
 * @param rows 需要导出的钻场或钻孔参数数据行，须与 mode 一致。
 * @param api 已加载 Core 插件的钻孔用途与类型枚举。
 * @param mode 导出对象类型；省略时沿用钻孔参数导出。
 * @returns 保留模板表头和下拉、仅包含实际参数的工作簿；钻场数值保存及显示两位小数。
 */
export declare function createDrainageParameterWorkbook(rows: DrainageParameterRow[], api: Pick<CoreGeologyCollectTool, 'McBoreholePurpose' | 'McBoreholeType'>, mode?: DrainageReverseMode): ExcelJS.Workbook;
/**
 * 按对应反演模板导出参数，导出的文件可作为后续反演导入底稿。
 * @param rows 参数弹框当前筛选出的真实数据行，须与 mode 一致。
 * @param mode 钻场或钻孔；省略时沿用钻孔导出。
 * @returns 完成下载的行数；没有数据时返回零且不创建文件。
 * @throws 模板生成或浏览器文件下载失败时向调用方传播异常。
 */
export declare function exportDrainageParameters(rows: DrainageParameterRow[], mode?: DrainageReverseMode): Promise<number>;
/** 按表头匹配，允许列顺序变化；格式空白行不会成为导入记录。 */
export declare function readDrainageWorkbook(buffer: ArrayBuffer, mode: DrainageReverseMode): Promise<DrainageReverseRow[]>;
/** 仅检查绘图所需字段及数字格式，不自行限定业务数值范围；另一套参数原样保留。 */
export declare function validateDrainageExcelRow(row: DrainageReverseRow, mode: DrainageReverseMode, valueMode: DrainageDrillValueMode): string[];

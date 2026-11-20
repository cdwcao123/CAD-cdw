import type { DrillHoleExcelImportMode, DrillHoleExcelInspection, DrillHoleRow, GisDrillRecord } from '../types';
/**
 * 按文件格式中显示字段的顺序读取示例文件，供格式弹框生成真实数据预览。
 * @param file 用户选择的 xlsx 示例文件。
 * @param displayFields 右侧显示字段，顺序对应 Excel 从左到右的列。
 * @param dataStartRow 数据首行的 Excel 行号。
 * @returns 最多前 20 条非空数据，每条记录以属性字段名称为键。
 * @throws 文件不是 xlsx、缺少“钻孔”工作表或工作簿解析失败时抛出错误。
 */
export declare function readFileFormatPreview(file: File, sheetName: string, displayFields: string[], dataStartRow: number): Promise<Record<string, string>[]>;
/**
 * 导出当前钻孔列表为 xlsx 文件。
 * @param rows 当前矿井钻孔列表。
 * @param includeRock 是否额外导出“岩层”工作表。
 * @returns 浏览器下载触发完成后结束。
 */
export declare function exportDrillHoleExcel(rows: DrillHoleRow[], includeRock: boolean): Promise<void>;
/**
 * 检查 Excel 文件是否满足钻孔或岩层导入要求。
 * @param file 用户选择的 xlsx 文件。
 * @param mode 钻孔或岩层导入模式。
 * @returns 工作表、有效行数和全部格式错误。
 */
export declare function inspectDrillHoleExcel(file: File, mode: DrillHoleExcelImportMode, formatName: string): Promise<DrillHoleExcelInspection>;
/**
 * 解析 Excel 钻孔；批量绘制可同时读取岩层，解析过程不写服务器或图纸。
 * @param file 包含“钻孔”工作表的 xlsx 文件。
 * @returns 完成格式校验的钻孔记录。
 * @throws 文件字段、钻孔代码或岩层关联无效时抛出错误。
 */
export declare function readDrillHolesFromExcel(file: File, formatName: string, includeRock?: boolean): Promise<GisDrillRecord[]>;
/** 复用本地解析结果，显式调用时才向服务器新增钻孔。 */
export declare function importDrillHolesFromExcel(file: File, formatName: string): Promise<number>;
/**
 * 从 Excel 按钻孔代码替换现有钻孔的全部岩层明细。
 * @param file 包含“岩层”工作表的 xlsx 文件。
 * @param rows 当前矿井钻孔列表，用于限定可导入的钻孔。
 * @returns 成功更新的钻孔数量。
 * @throws 文件校验、钻孔不存在、GetOne 或修改接口失败时停止并抛出错误。
 */
export declare function importDrillHoleRocksFromExcel(file: File, rows: DrillHoleRow[], formatName: string): Promise<number>;

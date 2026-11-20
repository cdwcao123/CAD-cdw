import ExcelJS from 'exceljs';
import type { DrillHoleRow } from '../types';
/**
 * 按管理列表的列顺序创建 Excel，包含全部传入行，不要求行携带详情实体。
 * @param rows 当前列表的全部钻孔行。
 * @returns 仅包含“钻孔”工作表的独立工作簿；代码和名称保留文本格式。
 * @throws Core BaseInfo 字段缺少列表映射时抛出错误。
 */
export declare function createDrillHoleListWorkbook(rows: readonly DrillHoleRow[]): ExcelJS.Workbook;
/**
 * 将管理列表的全部钻孔行下载为 Excel。
 * @param rows 当前列表的全部数据，不依赖单行选择状态。
 * @returns 文件生成并触发下载后结束。
 * @throws 基础字段映射或 Excel 序列化失败时向调用界面透传错误。
 */
export declare function exportDrillHoleListExcel(rows: readonly DrillHoleRow[]): Promise<void>;

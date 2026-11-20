import ExcelJS from 'exceljs';
import type { GasAreaReverseRow, GasAreaSnapshot } from '../types/interface';
import type { EvaluationUnitCoreApi } from '../types/type';
/**
 * 创建单 Sheet 的评价单元工作簿；参数导出和空白模板使用完全相同的字段与格式。
 * @param snapshots 导出快照；省略时只生成表头及填写说明。
 * @returns 每单元一行、最后一列为有序 XYZ JSON 的工作簿。
 * @throws 坐标 JSON 超过 Excel 单元格 32767 字符限制时拒绝导出，避免丢点。
 */
export declare function createGasAreaWorkbook(snapshots?: GasAreaSnapshot[]): ExcelJS.Workbook;
/**
 * 从工作簿中只读取评价单元数据，非评价单元工作表直接跳过，导出仍采用单 Sheet。
 * @param buffer 用户选择的 xlsx 文件内容。
 * @param api 导入所属 Core 的真实类型枚举。
 * @returns 按工作表及原始行号排列的评价单元输入，不包含其他类别和空行。
 * @throws 工作簿损坏、评价单元表头不完整或重复、没有评价单元数据时抛错。
 */
export declare function readGasAreaWorkbook(buffer: ArrayBuffer, api: EvaluationUnitCoreApi): Promise<GasAreaReverseRow[]>;

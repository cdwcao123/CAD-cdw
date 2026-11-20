import { type Worksheet } from '@office-kit/xlsx/worksheet';
import type { DirectionalCadBranchOrigins, DirectionalDesignResultRow, DirectionalDesignResultSheet } from '../types/interface';
import type ExcelJS from 'exceljs';
/**
 * 将原始 CAD 分支起点及其校验输入写入隐藏的 L～Q 列，A～K 的数据和公式保持一致。
 * @param worksheet 正在导出的单孔工作表。
 * @param sheet 已计算的结果快照，可能含原实体起点。
 * @param displayRows 含分支分隔空行的导出行，索引加 3 对应 Excel 行号。
 * @returns 写入后结束；没有原始起点或主孔已编辑时不输出来源数据。
 */
export declare function writeDirectionalCadOrigins(worksheet: Worksheet, sheet: DirectionalDesignResultSheet, displayRows: (DirectionalDesignResultRow | undefined)[]): void;
/**
 * 读取参数导出携带的 CAD 起点，旧模板无来源列时继续沿用可见表格的计算结果。
 * @param worksheet 用户导入的单孔工作表。
 * @param sheet 已通过可见输入校验、尚未重算的参数。
 * @param excelRows 与 sheet.rows 一一对应的 Excel 行号，不包含分隔空行。
 * @returns 原始主孔输入及分支起点；无来源标记或主孔测点数量已编辑时返回 undefined。
 * @throws 已识别的起点辅助数据损坏时抛错，不允许带着损坏来源写入图纸。
 */
export declare function readDirectionalCadOrigins(worksheet: ExcelJS.Worksheet, sheet: DirectionalDesignResultSheet, excelRows: number[]): DirectionalCadBranchOrigins | undefined;

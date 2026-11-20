import type { DrillHoleExcelImportMode, DrillHoleRow, OpenDrillHoleDetailsDialogOptions } from '../types';
/**
 * 打开指定钻孔的详情，传入完整岩层与层位选项；重复打开同一钻孔时复用弹框。
 * @param options 当前钻孔、下拉数据、业务模式及保存回调。
 * @returns 弹框创建或恢复可见后结束
 */
export declare function openDrillHoleDetailsDialog(options: OpenDrillHoleDetailsDialogOptions): Promise<void>;
/**
 * 打开钻孔或岩层 Excel 导入弹框。
 * @param mode 钻孔或岩层导入模式。
 * @param onSubmit 文件检查通过后的实际导入回调。
 * @returns 弹框创建或更新完成后结束。
 */
export declare function openDrillHoleImportDialog(mode: DrillHoleExcelImportMode, onSubmit: (file: File, formatName: string) => void | Promise<void>): Promise<void>;
/**
 * 打开虚拟钻孔源数据选择弹框，下拉展示当前矿井已加载的全部钻孔名称。
 * @param rows 当前钻孔列表。
 * @param onSubmit 确认后复制所选钻孔并创建虚拟钻孔的回调。
 * @returns 弹框创建或更新完成后结束。
 */
export declare function openVirtualDrillHoleDialog(rows: DrillHoleRow[], onSubmit: (row: DrillHoleRow) => void | Promise<void>): Promise<void>;

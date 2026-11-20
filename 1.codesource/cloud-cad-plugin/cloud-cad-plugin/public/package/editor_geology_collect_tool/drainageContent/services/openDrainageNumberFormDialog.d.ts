import type { DrainageNumberFormConfig } from '../types/interface';
/**
 * 使用 Editor 公共弹框打开三项数值表单，由调用方负责提交命令。
 * @param config 弹框 ID、标题、三个字段的初值及提交回调。
 * @returns 无返回值；提交失败时公共弹框保持打开。
 */
export declare function openDrainageNumberFormDialog(config: DrainageNumberFormConfig): void;

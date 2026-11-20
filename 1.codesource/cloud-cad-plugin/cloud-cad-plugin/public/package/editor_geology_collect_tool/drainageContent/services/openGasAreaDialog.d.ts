import type { GasAreaDialogProps } from '../types/interface';
/**
 * 打开或恢复评价单元参数、反演面板，关闭反演面板前必须保存或完整撤销本会话。
 * @param mode 参数只读模式或反演模式。
 * @returns 发起面板显示后结束；会话由弹框 props 持有，最小化不会丢失。
 */
export declare function openGasAreaDialog(mode: GasAreaDialogProps['mode']): void;

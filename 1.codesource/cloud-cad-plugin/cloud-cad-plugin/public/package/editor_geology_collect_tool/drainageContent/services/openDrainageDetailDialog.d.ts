import type { DrainageSyncDetail } from '../types/type';
/**
 * 使用公共弹框打开同步行的只读详情，已有弹框则切换其内容并置顶。
 * @param detail 对应类型的本地、服务器或冲突对照快照；双方共用同一详情组件。
 * @returns 无返回值；关闭后公共弹框销毁组件及其临时预览。
 */
export declare function openDrainageDetailDialog(detail: DrainageSyncDetail): void;

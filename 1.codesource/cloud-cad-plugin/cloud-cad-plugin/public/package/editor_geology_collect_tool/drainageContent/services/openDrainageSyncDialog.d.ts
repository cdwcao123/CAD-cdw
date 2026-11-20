import type { DrainageSyncType } from '../types/type';
/**
 * 打开抽采同步弹框，并将顶部下拉项作为初始同步类型。
 * @param type 顶部同步菜单选择的数据类型。
 * @returns 打开或复用当前画布的同步弹框。
 */
export declare function openDrainageSyncDialog(type: DrainageSyncType): void;

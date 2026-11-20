import type { DrainageDrawingContext } from '../types/interface';
/** 跟随活动图纸和绘图/撤销命令刷新只读表格，卸载时解除所有监听。 */
export declare function useDrainageDrawingRows<T>(collect: (context: DrainageDrawingContext) => T[]): {
    rows: import("vue").ShallowRef<T[], T[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string, string>;
    refresh: () => Promise<void>;
};

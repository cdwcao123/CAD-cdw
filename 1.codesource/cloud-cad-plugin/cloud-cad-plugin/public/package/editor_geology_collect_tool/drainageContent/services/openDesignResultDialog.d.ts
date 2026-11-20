import type { DrainageDesignResultRow } from '../types/interface';
/**
 * 打开智能设计统一结果面板；传入新结果时替换展示，手动打开时保留此前结果。
 * @param rows 新的结果快照；省略表示仅重新打开，空数组表示本次结果为空。
 * @param siteEntityIds 钻场模式本次设计返回的全部钻场实体 objectId；其他模式传空数组。
 * @returns 无返回值；弹框在当前画布内底部展示。
 */
export declare function openDesignResultDialog(rows?: DrainageDesignResultRow[], siteEntityIds?: string[]): void;

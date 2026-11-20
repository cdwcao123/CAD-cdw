/** 关联面板注册、打开及销毁共用的侧栏标识。 */
export declare const evaluationUnitBoreholePanelKey = "EditorEvaluationUnitBoreholePanel";
/**
 * 打开评价单元关联钻孔左侧面板。
 * @param entityId 当前单选评价单元的 objectId。
 * @returns 无返回值。
 */
export declare function openEvaluationUnitBoreholePanel(entityId: string): void;
/**
 * 注册评价单元关联钻孔左侧面板，由单个评价单元的特性面板按钮打开。
 * @returns 无返回值，重新注册前释放原面板会话。
 */
export declare function registerEvaluationUnitBoreholePanel(): void;

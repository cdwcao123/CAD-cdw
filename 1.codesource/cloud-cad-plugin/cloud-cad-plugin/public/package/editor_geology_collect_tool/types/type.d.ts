import type { StratumModel } from './interface';
/** 地层编辑弹框工作模式。 */
export type StratumEditorMode = 'create' | 'edit';
/** 地层列表变化订阅回调，参数始终为列表的独立快照。 */
export type StratumChangeListener = (models: StratumModel[]) => void;

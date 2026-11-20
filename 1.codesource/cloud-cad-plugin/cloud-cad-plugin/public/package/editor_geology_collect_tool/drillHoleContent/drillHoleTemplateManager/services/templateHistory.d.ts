import { type McCore } from 'McCore';
import type { DrillHoleTemplateHistorySession } from '../types';
/**
 * 跟踪模板编辑期间的命令缓存，退出后使撤销/重做无法重新带回编辑副本。
 * @param core 承载模板编辑副本的 Core
 * @param originalIds 进入会话前已存在的图纸实体标识
 * @returns 清理器，编辑副本清理后调用 dispose；不清空原图纸的历史栈
 */
export declare function trackDrillHoleTemplateHistory(core: McCore, originalIds: Set<string>): DrillHoleTemplateHistorySession;

import type { GroupPropertyType } from '../types';
/**
 * 特性面板运行时脚本内存缓存（key = modelId）
 * @description 同一会话内优先命中内存缓存，持久化缓存仅作冷启动兜底
 */
export declare const moreModelPropertyCache: Map<string, GroupPropertyType[]>;
/**
 * 从实体中提取模型 ID
 * @param entity 实体对象
 * @returns 模型 ID（优先直接调用 McDbGeoModel 实例的 getModelId()，兜底从 xData 解析）
 */
export declare const getEntityModelId: (entity: any) => any;
/**
 * 同步尝试初始化模型特性面板脚本（仅依赖 exchange 已有快照，不发起任何异步请求）。
 * @description 解决 MoreModelEntityPropertyScript 构造函数异步回填导致框架首次读取空 panelConfig/groups 的时序问题：
 * 绘制阶段已通过 exchange.init(modelId) 写入快照，特性面板首次打开时直接同步切快照拿描述符并 hydrate，
 * 确保构造函数返回前 groups 已就绪。无快照时返回 false，由调用方回退到异步 initAndCacheModelProperty。
 * @param modelId 模型 ID
 * @returns 是否同步初始化成功
 */
export declare const trySyncInitModelProperty: (modelId: string) => boolean;
/**
 * 初始化并缓存模型属性脚本
 * @description 加载顺序：
 * 1. 内存缓存命中直接返回；
 * 2. 持久化缓存命中 -> hydrate 运行时脚本（不请求接口、不重新组装）；
 * 3. 均未命中 -> 调用 core 单例 McGeoModelUIExchange.init(modelId)
 *    （请求接口 + 解析 + 样式分类 + 组装中性描述），hydrate 后写内存与持久化缓存。
 * @param modelId 模型 ID
 * @returns 是否初始化成功
 */
export declare const initAndCacheModelProperty: (modelId: string) => Promise<boolean>;
/**
 * 清除指定模型的特性面板脚本缓存（含内存与持久化）
 * @param modelId 模型 ID
 */
export declare const clearMoreModelPropertyCache: (modelId: string) => Promise<void>;
/**
 * 清除全部模型的特性面板脚本缓存（含内存与持久化）。
 * 由 CLEARGEOLOGYPANELCACHE 命令调用：清缓存后用户再次点积水区菜单，
 * initAndCacheModelProperty 会强制重新调用 exchange.init 发起接口请求，不再命中旧缓存。
 * @returns 实际删除的持久化缓存条目数
 */
export declare const clearAllMoreModelPropertyCache: () => Promise<number>;
/**
 * 强制刷新（绕过缓存重新 init）并更新持久化缓存
 * @param modelId 模型 ID
 */
export declare const refreshMoreModelProperty: (modelId: string) => Promise<boolean>;

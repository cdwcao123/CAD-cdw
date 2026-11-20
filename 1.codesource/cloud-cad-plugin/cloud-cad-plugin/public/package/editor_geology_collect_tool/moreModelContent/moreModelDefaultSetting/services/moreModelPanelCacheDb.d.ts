import { CacheBinding, ReadCacheOptions, MoreModelPanelCacheRecord, MoreModelTopMenuCacheRecord } from '../types/type';
declare class MoreModelPanelCacheDb {
    #private;
    private db;
    private readonly storeName;
    private readonly topMenuStoreName;
    /**
     * 构造函数：初始化 IndexedDB store
     * @description 两个 store：
     *   - moreModelPanelJsonCache（keyPath=modelId，唯一索引）：ribbon module JSON；
     *   - moreModelTopMenuCache（keyPath=modelId，唯一索引）：顶部菜单动态添加的模型定义；
     * 共用同一个 McCacheDb 单例管理，新增表不影响原有缓存读写。
     */
    constructor();
    /**
     * 获取缓存库单例
     * @returns MoreModelPanelCacheDb 单例
     */
    static getInstance(): MoreModelPanelCacheDb;
    /**
     * 读取指定模型的绘制面板缓存记录
     * @param modelId 模型 ID
     * @returns 缓存记录，不存在返回 undefined
     */
    getRecord(modelId: string): Promise<MoreModelPanelCacheRecord | undefined>;
    /**
     * 写入或更新绘制面板缓存记录
     * @param record 缓存记录（modelId 必填）
     * @returns 写入的模型 ID
     */
    addOrUpdateRecord(record: MoreModelPanelCacheRecord): Promise<string>;
    /**
     * 删除指定模型的绘制面板缓存记录
     * @param modelId 模型 ID
     */
    deleteRecord(modelId: string): Promise<void>;
    /**
     * 清除所有地质模型绘制面板（ribbon module JSON）缓存（与 clearTopMenuCache 对称；写法参考下方被注释的 clearExpiredRecords 遍历删除）
     * @returns 实际删除的条目数
     */
    clearPanelCache(): Promise<number>;
    /**
     * 读取所有"已添加到当前菜单"的模型定义缓存
     * @description 启动时（install）遍历该结果并调用 addMoreModelDefToMenu 还原到顶部菜单。
     */
    getAllTopMenuCache(): Promise<MoreModelTopMenuCacheRecord[]>;
    /**
     * 新增/更新一条顶部菜单动态添加项缓存（"添加到当前菜单"成功后调用）
     * @param record 菜单记录（modelId / name 必填，icon/updatedAt 可选）
     */
    addOrUpdateTopMenuCache(record: MoreModelTopMenuCacheRecord): Promise<string>;
    /**
     * 删除指定模型的顶部菜单缓存（"删除当前模型菜单"时调用；删除面板缓存不会影响此处）
     * @param modelId 模型 ID
     */
    deleteTopMenuCache(modelId: string): Promise<void>;
    /**
     * 清除所有地质模型顶部菜单缓存（参考下方 clearExpiredRecords：selectAll 遍历 + 计数删除）
     * @returns 实际删除的条目数
     */
    clearTopMenuCache(): Promise<number>;
}
/**
 * 唯一的更多模型绘制面板缓存数据库
 */
export declare const mcMoreModelPanelCacheDb: MoreModelPanelCacheDb;
/**
 * 校验更多模型绘制面板缓存记录是否有效
 * @param record 缓存记录
 * @param options 校验选项（schemaDigest：期望的 Schema 摘要，不一致视为失效）
 * @returns 是否有效
 */
export declare const isMoreModelPanelCacheRecordValid: (record: MoreModelPanelCacheRecord | null | undefined, options?: ReadCacheOptions) => boolean;
/**
 * 序列化更多模型绘制面板模块
 * @description 深拷贝并丢弃函数字段，得到可持久化的 module JSON。
 * @param moduleDefinition 模块定义
 * @returns 序列化后的模块定义
 */
export declare const serializeMoreModelPanelModule: <T extends Record<string, unknown>>(moduleDefinition: T) => T;
/**
 * 更多模型绘制面板模块
 * @description 读取缓存后重建运行时函数：遍历节点，按缓存绑定恢复 close 按钮 actionFun，
 * 字段控件绑定交给 onHydrateNode 回调（由构建层重建控件运行时状态）。
 * @param moduleDefinition 缓存的模块定义
 * @param options 选项（closePanel 关闭回调 / onHydrateNode 水合回调）
 * @returns 后的模块定义
 */
export declare const hydrateMoreModelPanelModule: <T extends Record<string, unknown>>(moduleDefinition: T, options: {
    closePanel: () => void;
    onHydrateNode?: (node: Record<string, unknown>, binding: CacheBinding) => void;
}) => T;
/**
 * 读取更多模型绘制面板缓存
 * @description 记录无效（版本不符/schemaDigest 不一致）时删除并返回 null。
 * @param modelId 模型 ID
 * @param options 读取选项（schemaDigest 校验）
 * @returns 有效缓存记录或 null
 */
export declare const readMoreModelPanelModuleCache: (modelId: string, options?: ReadCacheOptions) => Promise<MoreModelPanelCacheRecord | null>;
/**
 * 写入更多模型绘制面板缓存
 * @param params 写入参数（modelId/moduleDefinition 必填，schemaDigest 可选）
 */
export declare const writeMoreModelPanelModuleCache: (params: {
    modelId: string;
    modelName?: string;
    moduleDefinition: Record<string, unknown>;
    schemaDigest?: string;
}) => Promise<void>;
/**
 * 读取所有已添加到顶部菜单的模型定义缓存（启动 restore 阶段用）
 */
export declare const readAllMoreModelTopMenuCache: () => Promise<MoreModelTopMenuCacheRecord[]>;
/**
 * 写入/更新 1 条顶部菜单缓存（添加到当前菜单后调用）
 */
export declare const writeMoreModelTopMenuCache: (params: {
    modelId: string;
    name: string;
    icon?: string;
}) => Promise<string>;
/**
 * 删除指定 modelId 的顶部菜单缓存（同时不影响绘制面板缓存）
 */
export declare const deleteMoreModelTopMenuCache: (modelId: string) => Promise<void>;
/**
 * 清除所有地质模型顶部菜单缓存（对外暴露给 CLEARGEOLOGYTOPMENUCACHE 命令调用）
 * @returns 实际删除的条目数
 */
export declare const clearMoreModelTopMenuCache: () => Promise<number>;
/**
 * 删除指定 modelId 的绘制面板 ribbon JSON 缓存（不影响顶部菜单缓存）
 */
export declare const deleteMoreModelPanelCache: (modelId: string) => Promise<void>;
/**
 * 清除所有地质模型绘制面板 ribbon JSON 缓存（不影响顶部菜单缓存）
 * @returns 实际删除的条目数
 */
export declare const clearMoreModelPanelCache: () => Promise<number>;
export {};

import type { McGeoPropertyGroupDescriptor } from '../types';
/**
 * 特性面板脚本持久化缓存记录
 * @description propertyJson 为去除函数后的最终分组树描述符，读取时仅做 hydrate
 */
export interface MoreModelPropertyCacheRecord {
    /** 模型 ID（唯一键） */
    modelId: string;
    /** 模型名称 */
    modelName?: string;
    /** 特性面板分组树描述符（可序列化，不含函数） */
    propertyJson?: McGeoPropertyGroupDescriptor[] | null;
    /** 缓存版本 */
    cacheVersion?: string;
    /** 更新时间 */
    updatedAt?: string;
}
/**
 * 特性面板脚本缓存数据库单例
 * @description 与绘制面板缓存（moreModelPanelJsonCache）同库，store 名 moreModelPropertyJsonCache，
 * 以 modelId 为唯一键；缓存内容为可序列化的中性分组树描述符。
 */
declare class MoreModelPropertyCacheDb {
    #private;
    private db;
    constructor();
    /**
     * 获取单例
     */
    static getInstance(): MoreModelPropertyCacheDb;
    /**
     * 读取特性面板脚本缓存记录
     * @param modelId 模型 ID
     * @returns 缓存记录
     */
    getRecord(modelId: string): Promise<MoreModelPropertyCacheRecord | undefined>;
    /**
     * 写入或更新特性面板脚本缓存记录
     * @param record 缓存记录
     */
    addOrUpdateRecord(record: MoreModelPropertyCacheRecord): Promise<string>;
    /**
     * 删除特性面板脚本缓存记录
     * @param modelId 模型 ID
     */
    deleteRecord(modelId: string): Promise<void>;
    /**
     * 清除全部特性面板脚本缓存记录（selectAll 遍历 + 计数删除；写法对齐 clearPanelCache/clearTopMenuCache）
     * @returns 实际删除的条目数
     */
    clearAllRecords(): Promise<number>;
}
/** 特性面板脚本缓存数据库单例 */
export declare const mcMoreModelPropertyCacheDb: MoreModelPropertyCacheDb;
/**
 * 校验特性面板脚本缓存记录是否有效
 * @param record 缓存记录
 * @returns 是否有效
 */
export declare const isMoreModelPropertyCacheRecordValid: (record: MoreModelPropertyCacheRecord | null | undefined) => boolean;
/**
 * 读取特性面板脚本缓存
 * @param modelId 模型 ID
 * @returns 有效的缓存记录，无效时删除并返回 null
 */
export declare const readMoreModelPropertyCache: (modelId: string) => Promise<MoreModelPropertyCacheRecord | null>;
/**
 * 写入特性面板脚本缓存
 * @param params 写入参数
 */
export declare const writeMoreModelPropertyCache: (params: {
    modelId: string;
    modelName?: string;
    propertyJson: McGeoPropertyGroupDescriptor[];
}) => Promise<void>;
export {};

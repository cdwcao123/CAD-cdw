import type { Options } from 'McEditor';
type ListSourceConfig = {
    sourceType: string;
    sourceCode: string;
    sourceCodes?: string[];
    labelKey: string;
    valueKey: string;
    fieldKey?: string;
};
/**
 * 获取数据源选项
 * @description 仅保留下拉控件运行时加载数据源的能力；
 * 模型 Schema/要素类/样式解析已迁移至 core 包 McGeoModelUIExchange，本文件不再承担解析职责。
 * @param params 数据源参数（编码 + label/value 映射字段）
 * @param onLoaded 加载完成回调
 * @returns 数据源选项数组（未加载完成时返回空数组，加载完成后缓存命中）
 */
export declare const getListSourceOptions: (params: ListSourceConfig, onLoaded?: () => void) => Options[];
export declare const preloadListSourceOptions: (params: ListSourceConfig) => Promise<Options[]>;
export {};

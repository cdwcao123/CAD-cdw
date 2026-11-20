import type { DrillHoleFileFormatConfig } from './types';
export declare const fileFormatList: import("vue").Ref<{
    name: string;
}[], {
    name: string;
}[] | {
    name: string;
}[]>;
export declare const currentFileFormatName: import("vue").Ref<string, string>;
export declare const fileFormatConfigList: import("vue").Ref<{
    name: string;
    dataStartRow: number;
    displayFields: string[];
    delimiter?: "tab" | "semicolon" | "comma" | "space" | "other" | undefined;
    otherDelimiter?: string | undefined;
    treatContinuousDelimiterAsOne?: boolean | undefined;
    trimSides?: boolean | undefined;
    mappings?: {
        target: string;
        field: string;
    }[] | undefined;
}[], DrillHoleFileFormatConfig[] | {
    name: string;
    dataStartRow: number;
    displayFields: string[];
    delimiter?: "tab" | "semicolon" | "comma" | "space" | "other" | undefined;
    otherDelimiter?: string | undefined;
    treatContinuousDelimiterAsOne?: boolean | undefined;
    trimSides?: boolean | undefined;
    mappings?: {
        target: string;
        field: string;
    }[] | undefined;
}[]>;
/**
 * 按名称读取钻孔数据文件格式。
 * @param name 格式名称。
 * @returns 对应配置；未找到时返回 undefined。
 */
export declare const getFileFormatConfig: (name: string) => DrillHoleFileFormatConfig | undefined;
/**
 * 确保格式名称存在于管理器列表。
 * @param name 格式名称。
 * @returns 无返回值。
 */
export declare const upsertFileFormat: (name: string) => void;
/**
 * 新增或覆盖钻孔数据文件格式配置。
 * @param config 完整格式配置。
 * @returns 无返回值。
 */
export declare const upsertFileFormatConfig: (config: DrillHoleFileFormatConfig) => void;
/**
 * 重命名文件格式，并同步其详情配置和当前格式引用。
 * @param oldName 修改前的格式名称。
 * @param newName 去除两端空格后的新名称。
 * @returns 重命名成功返回 true；原格式不存在或新名称重复时返回 false。
 */
export declare const renameFileFormat: (oldName: string, newName: string) => boolean;
/**
 * 删除钻孔数据文件格式，并同步清理详情配置和当前格式引用。
 * @param name 待删除的格式名称。
 * @returns 删除成功返回 true；仅剩一个格式或名称不存在时返回 false。
 */
export declare const removeFileFormat: (name: string) => boolean;

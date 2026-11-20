import type { DictItem } from './types/type';
export declare const rules: {
    horizontal_name: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    work_face_name: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    mining_area_name: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    support_pattern: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    into_or_out_wind: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    laneway_use: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    excavation_status: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    excavation_type: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    return_air_type: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    laneway_sec_style: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    series_ventilation: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    laneway_height: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    laneway_width: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    current_footage: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
    nodeBotAltitude: {
        validator: (rule: unknown, value: unknown, callback: (err?: Error) => void) => void;
        trigger: string[];
    }[];
};
/**
 * 枚举对象转换为下拉选项数组
 * @param enumObj 枚举对象
 * @returns 下拉选项数组
 */
export declare function enumToOptions<T extends Record<string, string>>(enumObj: T): {
    label: string;
    value: string;
}[];
/**
 * 获取高程类型下拉选项数组
 */
export declare const getTunnelNodeElevationTypeOptions: () => {
    label: string;
    value: import("../../../core_geology_collect_tool/mcTunnel").TunnelNodeElevationType;
}[];
/**
 * 获取地质类型下拉选项数组 seriesVentilationList
 */
export declare const getSeriesVentilationListOptions: () => {
    label: string;
    value: import("../../../core_geology_collect_tool/mcTunnel").McSeriesVentilation;
}[];
/**
 * 将数组转换为下拉选项数组
 * @param arr
 * @returns
 */
export declare const toDictItems: (arr: any[]) => DictItem[];

export declare const setChangeTunnelInfo: (engine: any, oldVal: any, newVal: any) => void;
type ValueOf<T> = T[keyof T];
type KeyToValue<T> = {
    [P in keyof T]: T[P];
};
export declare function createObjectFromKey<T extends Record<string, any>>(key: keyof T, value: ValueOf<KeyToValue<T>>): KeyToValue<T>;
export declare function getObjectByUuid(engine: any, uuid: string): any;
export declare const validateMaxLength: (rule: any, value: string, callback: Function) => void;
export declare const rules: {
    horizontal_name: {}[];
    mining_area_name: {}[];
    work_face_name: {
        validator: (rule: any, value: any, callback: any) => void;
        trigger: string[];
    }[];
    laneway_code: {
        validator: (rule: any, value: any, callback: any) => void;
        trigger: string[];
    }[];
    laneway_width: {
        validator: (rule: any, value: any, callback: any) => void;
        trigger: string[];
    }[];
    laneway_height: {
        validator: (rule: any, value: any, callback: any) => void;
        trigger: string[];
    }[];
};
export declare const series_ventilationList: import("vue").Reactive<{
    F_ItemName: string;
    F_ItemValue: string;
}[]>;
export declare const return_air_typeList: import("vue").Reactive<{
    F_ItemName: string;
    F_ItemValue: string;
}[]>;
export declare const excavation_statusList: import("vue").Reactive<{
    F_ItemName: string;
    F_ItemValue: string;
}[]>;
export declare const excavation_typeList: import("vue").Reactive<{
    F_ItemName: string;
    F_ItemValue: string;
}[]>;
export declare const mergeArrays: (array1: any[], array2: any[], key: string) => any[];
export declare const traversePointList: import("vue").Ref<any, any>;
export declare function setupTunnelPanel(): {
    horizontalList: import("vue").Ref<any[], any[]>;
    miningAreaList: import("vue").Ref<any[], any[]>;
    workFaceMiningAreaList: import("vue").Ref<any[], any[]>;
    workFaceHorizontalList: import("vue").Ref<any[], any[]>;
    workingFaceList: import("vue").Ref<any[], any[]>;
    regionList: import("vue").Ref<any[], any[]>;
    specialMiningList: import("vue").Ref<any[], any[]>;
    miningList: import("vue").Ref<any[], any[]>;
    coalSeamList: import("vue").Ref<any[], any[]>;
    fusionData: () => void;
    getDataModelBaseInfoList: () => Promise<void>;
    getWorkingFaceList: () => Promise<void>;
    getCoalSeamInfo: () => void;
    getMiningInfo: () => void;
};
export {};

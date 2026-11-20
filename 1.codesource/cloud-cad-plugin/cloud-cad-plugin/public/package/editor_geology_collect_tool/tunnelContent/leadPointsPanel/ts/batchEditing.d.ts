import type { NameCodeItem } from '../../batchEditTunnels/types/type';
export declare const lanewayList: import("vue").Ref<any, any>;
export declare const attributeTypeList: any;
export declare const lanewayTypeList: any;
export declare const getLaneway: (engine: any, type: string, val: string) => void;
export declare const series_ventilationList: import("vue").Reactive<{
    id: string;
    name: string;
    typeCode: string;
}[]>;
export declare const return_air_typeList: import("vue").Reactive<{
    id: string;
    name: string;
    typeCode: string;
}[]>;
export declare const excavation_statusList: import("vue").Reactive<{
    id: string;
    name: string;
    typeCode: string;
}[]>;
export declare const excavation_typeList: import("vue").Reactive<{
    id: string;
    name: string;
    typeCode: string;
}[]>;
export declare const leadPointsTypeList: any;
export declare function setupBatchEditing(): {
    horizontalNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    miningAreaNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    horizontalNameCodeArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    workFaceNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    regionCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    miningNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    miningAreaCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    mineCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    specialMiningNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    coalSeamNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
    }[], NameCodeItem[] | {
        name: string;
        typeCode: string;
    }[]>;
    getLevelWorkFceMiningArea: () => void;
};

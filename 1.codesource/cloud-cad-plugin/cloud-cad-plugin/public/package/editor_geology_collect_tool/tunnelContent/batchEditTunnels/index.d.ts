import type { LabelCode, NameCode, SelectOption, TunnelData } from './types';
export declare const lanewayList: import("vue").Ref<{
    [x: string]: unknown;
    uuid: string;
    lanewayCode: string;
    lanewayName: string;
    horizontalName: string;
    miningAreaName: string;
    workFaceName: string;
}[], TunnelData[] | {
    [x: string]: unknown;
    uuid: string;
    lanewayCode: string;
    lanewayName: string;
    horizontalName: string;
    miningAreaName: string;
    workFaceName: string;
}[]>;
export declare const attributeTypeList: import("vue").Reactive<LabelCode[]>;
export declare const lanewayTypeList: import("vue").Reactive<LabelCode[]>;
export declare const getLaneway: (type: string, val: unknown) => Promise<void>;
export declare const seriesVentilationList: import("vue").Reactive<SelectOption[]>;
export declare const returnAirTypeList: import("vue").Reactive<SelectOption[]>;
export declare const excavationStatusList: import("vue").Reactive<SelectOption[]>;
export declare const excavationTypeList: import("vue").Reactive<SelectOption[]>;
export declare const leadPointsTypeList: import("vue").Reactive<LabelCode[]>;
export declare function setupBatchEditing(): {
    horizontalNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    miningAreaNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    horizontalNameCodeArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    workFaceNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    regionCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    miningNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    miningAreaCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    mineCodeNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    specialMiningNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    coalseamNameArr: import("vue").Ref<{
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[], NameCode[] | {
        name: string;
        typeCode: string;
        id?: string | undefined;
    }[]>;
    getLevelWorkFceMiningArea: () => Promise<void>;
};

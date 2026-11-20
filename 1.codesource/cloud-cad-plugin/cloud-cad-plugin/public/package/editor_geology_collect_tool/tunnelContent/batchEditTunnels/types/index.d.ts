import type { McColor } from 'McCore';
export type { DialogData } from 'McEditor';
export type DictItem = Record<string, string>;
export type InitialData = {
    supportPatternList: DictItem[];
    windDirectionList: DictItem[];
    lanewayUseList: DictItem[];
    lanewaySecStyleList: DictItem[];
    traversePointTypeList: DictItem[];
};
export type TreeDataType = {
    label: string;
    id: string;
    children?: TreeDataType[];
};
export type LeadPointField = 'x' | 'y' | 'z_top' | 'z_bottom' | 'leftSide' | 'rightSide';
export type LabelCode = {
    name: string;
    code: string;
};
export type NameCode = {
    name: string;
    typeCode: string;
    id?: string;
};
export type SelectOption = {
    id?: string;
    name: string;
    typeCode: string;
};
export type BatchEditLoadingState = {
    showName: boolean;
    color: boolean;
    showSideLine: boolean;
    showCenterLine: boolean;
    traverse_point_type: boolean;
    nodeColor: boolean;
    showNodeName: boolean;
    showNodeAltitude: boolean;
    showBottomElevation: boolean;
};
export type BatchEditFormData = {
    attributeType: string;
    typeVlue: string;
    lanewayType: string;
    lanewayTypeVlue: string | number;
    color: McColor;
    showName: boolean;
    showCenterLine: boolean;
    showSideLine: boolean;
    showElevationType: string;
    traverse_point_type: string;
    nodeColor: McColor;
    showNodeName: boolean;
    showNodeAltitude: boolean;
    showBottomElevation: boolean;
    leadPointsType: LeadPointField;
    leadPointsTypeValue: string | number;
};
export type TunnelData = Record<string, unknown> & {
    uuid: string;
    lanewayCode: string;
    lanewayName: string;
    horizontalName: string;
    miningAreaName: string;
    workFaceName: string;
};
export type WorkFaceData = Record<string, unknown>;
export type EngineLike = unknown;

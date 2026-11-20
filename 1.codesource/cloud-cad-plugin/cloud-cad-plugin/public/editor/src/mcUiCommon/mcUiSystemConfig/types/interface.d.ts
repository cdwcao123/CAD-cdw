import { SystemVarDefinition } from 'McCore';
import { Options } from '../../../mcUiMain';
export interface GroupInfo {
    GroupName: string;
    ID?: string;
    ParentID?: string;
    [property: string]: any;
}
export interface DictInTypeInfo {
    DictDesc?: string;
    DictName?: string;
    DictType?: string;
    Editable?: string;
    GroupID?: string;
    ID?: string;
    keyValue?: string;
    Status?: string;
    ValueType?: number;
    Visibility: number;
    [property: string]: any;
}
export interface DictInfo {
    DictID: string;
    EnumCode: string;
    EnumValue: string;
    EnumName: string;
    [property: string]: any;
}
export interface CursorStyleInfo {
    size: number;
    isShow: boolean;
    mcColor: string;
    cross: number;
    crossColor: string;
    customColor: Options[];
    [property: string]: any;
}
export interface TempSystemVarDefinition extends SystemVarDefinition {
    isColor: boolean;
    valueTypeDesc: string;
    valueTypeOptions?: Options[];
}
export interface DrawingSystemConfig {
    colorTheme?: string;
    view2dBackgroundColor?: string;
    view3dBackgroundColor?: string;
    autoSnapMarkerSize: number;
    autoSnapMarkerColor: string;
    targetFrameSize: number;
    crosshairSize: number;
    crosshairColor: string;
    pickBoxSize: number;
    gripSize: number;
    unselectedGripColor: string;
    hoverGripColor: string;
    selectedGripColor: string;
    gripOutlineColor: string;
    highLightColor: string;
    hoverColor: string;
    [property: string]: any;
}
export interface DrawingIconSize {
    autoSnapMarkerSizeMax: number;
    autoSnapMarkerSizeMin: number;
    targetFrameSizeMax: number;
    targetFrameSizeMin: number;
    crosshairSizeMax: number;
    crosshairSizeMin: number;
    pickBoxSizeMax: number;
    pickBoxSizeMin: number;
    gripSizeMax: number;
    gripSizeMin: number;
    [property: string]: any;
}

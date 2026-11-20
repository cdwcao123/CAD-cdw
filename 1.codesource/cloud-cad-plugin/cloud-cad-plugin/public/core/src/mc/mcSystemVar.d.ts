import { McColor } from './mcColor';
export interface tempLateInfo {
    name: string;
    file: string;
    desc: string;
}
export interface McSystemVal {
    toleranceAngle: number;
    toleranceDistance: number;
    toleranceDouble: number;
    isShowLineWeight: boolean;
    isShowTransparency: boolean;
    isOrthoMode: boolean;
    isSnapMode: boolean;
    snapModeType: number;
    isDynInput: boolean;
    isAxisTrack: boolean;
    axisTrackAngle: number;
    isGridMode: boolean;
    lineWight: number;
    textSize: number;
    pointStyle: number | string;
    mode: number;
    asyncLoadSize: number;
    fontsPath: string;
    entityColor: McColor;
    lineTypeScale: number;
    enableGroupSelect: boolean;
    enableGroupBox: boolean;
    mcdVersion: number;
    theme: string;
    colorTheme?: McColor;
    view2dBackgroundColor?: McColor;
    view3dBackgroundColor?: McColor;
    autoSnapMarkerSize: number;
    autoSnapMarkerColor: McColor;
    targetFrameSize: number;
    targetFrameShow: boolean;
    crosshairSize: number;
    crosshairColor: McColor;
    pickBoxSize: number;
    gripSize: number;
    unselectedGripColor: McColor;
    hoverGripColor: McColor;
    selectedGripColor: McColor;
    gripOutlineColor: McColor;
    trimMode: boolean;
    requestTimeout: number;
    highLightColor: McColor;
    hoverColor: McColor;
    tileSize: number;
    indexTileSize: number;
    circleSegments: number;
    enableSearchCommandPanel: boolean;
}
export declare enum SystemValType {
    standard = 0,
    extends = 1
}
export interface SystemVarDefinition {
    code: string;
    displayName: string;
    valueType: number;
    description: string;
    defaultValue: any;
    value: any;
    minValue?: number;
    maxValue?: number;
    options?: Array<{
        label: string;
        value: any;
    }>;
    isReadOnly: boolean;
    type: SystemValType;
    validate?: (value: any) => boolean;
}

export interface FormState {
    blockId: number;
    label: string;
    attr: any;
    textOptions: any;
    feature: any;
}
export interface AttrForm {
    height: number;
    angle: number;
    value: number;
}
export interface FeatureForm {
    layer: string | number;
    linetype: string;
    color: string;
    lineWeight: number;
}
export interface TextOptionsForm {
    style: string;
    align: string;
    height: number;
    textHeight: number;
    rotate: number;
    tilt: number;
    boundaryWidth: number;
    mirrorX: boolean;
    mirrorY: boolean;
}

import { Options } from '../../../mcUiMain';
import { HatchGradientConfig } from './interface';
export declare const hatchSettingsGroups: {
    label: string;
    key: string;
    icon: string;
    children: {
        label: string;
        key: string;
        icon: string;
        value: number;
    }[];
}[];
export declare const hatchStyleOptions: Options[];
export declare const HatchPatternTypeOptions: Options[];
export declare const defaultColors: number[];
export declare const gradientPatternList: import('vue').Ref<{
    type: number;
    name: string;
    size: number;
    color1: number;
    color2: number;
    angle: number;
}[], HatchGradientConfig[] | {
    type: number;
    name: string;
    size: number;
    color1: number;
    color2: number;
    angle: number;
}[]>;

import { PropType } from 'vue';
import { McColor } from 'McCore';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    isLayerPalette: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultColor: {
        type: PropType<McColor | string>;
        default: McColor;
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    changeData: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    isLayerPalette: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultColor: {
        type: PropType<McColor | string>;
        default: McColor;
    };
}>> & Readonly<{
    onChangeData?: ((...args: any[]) => any) | undefined;
}>, {
    isLayerPalette: boolean;
    defaultColor: string | McColor;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    canvasSaturationRef: HTMLCanvasElement;
    canvasHueRef: HTMLCanvasElement;
}, HTMLDivElement>;
export default _default;

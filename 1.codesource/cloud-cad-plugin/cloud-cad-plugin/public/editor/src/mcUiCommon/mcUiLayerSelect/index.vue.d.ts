import { McDbLayer } from 'McCore';
import { Layer } from './components/mcUiLayerItem/type/interface';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    options: {
        type: () => Layer[];
        default: () => never[];
    };
}>, {
    layers: import('vue').Ref<{
        id: string;
        name: string;
        color: {
            colorIndex: import('McCore').McColorIndex;
            colorMethod: import('McCore').McColorMethod;
            color?: {
                r: number;
                g: number;
                b: number;
            } | undefined;
            getColorMethod: () => import('McCore').McColorMethod;
            setColorMethod: (value: import('McCore').McColorMethod) => void;
            isByLayer: () => boolean;
            isByBlock: () => boolean;
            isByAci: () => boolean;
            isByColor: () => boolean;
            isForeground: () => boolean;
            isNull: () => boolean;
            getColorIndex: () => number;
            setColorIndex: (colorIndex: number) => import('McCore').McReturnStatus<string>;
            setTHREEColor: (color: import('McCore/lib/ThreeJS/utils').ColorRepresentation) => import('McCore').McColor;
            setRgb: (r: number, g: number, b: number) => void;
            getMcRGB: (layer?: McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore').McRGB | null;
            getThreeColor: (layer?: McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore/lib/ThreeJS/Three').Color | null | undefined;
            fromCssStyleColor: (color: string) => import('McCore').McColor;
            toJson: () => import('McCore').IMcColor;
            fromJson: (cl: import('McCore').IMcColor) => import('McCore').McColor;
            isEqual: (color: import('McCore').McColor) => boolean;
            copy: (color: import('McCore').McColor) => void;
            clone: () => import('McCore').McColor;
        };
        isOff: boolean;
        locked: boolean;
        frozen: boolean;
        lineType?: string | undefined;
        lineWidth?: import('McCore').McDbLineWeight | undefined;
        transparency?: number | undefined;
        desc?: string | undefined;
        index?: number | undefined;
    }[], Layer[] | {
        id: string;
        name: string;
        color: {
            colorIndex: import('McCore').McColorIndex;
            colorMethod: import('McCore').McColorMethod;
            color?: {
                r: number;
                g: number;
                b: number;
            } | undefined;
            getColorMethod: () => import('McCore').McColorMethod;
            setColorMethod: (value: import('McCore').McColorMethod) => void;
            isByLayer: () => boolean;
            isByBlock: () => boolean;
            isByAci: () => boolean;
            isByColor: () => boolean;
            isForeground: () => boolean;
            isNull: () => boolean;
            getColorIndex: () => number;
            setColorIndex: (colorIndex: number) => import('McCore').McReturnStatus<string>;
            setTHREEColor: (color: import('McCore/lib/ThreeJS/utils').ColorRepresentation) => import('McCore').McColor;
            setRgb: (r: number, g: number, b: number) => void;
            getMcRGB: (layer?: McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore').McRGB | null;
            getThreeColor: (layer?: McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore/lib/ThreeJS/Three').Color | null | undefined;
            fromCssStyleColor: (color: string) => import('McCore').McColor;
            toJson: () => import('McCore').IMcColor;
            fromJson: (cl: import('McCore').IMcColor) => import('McCore').McColor;
            isEqual: (color: import('McCore').McColor) => boolean;
            copy: (color: import('McCore').McColor) => void;
            clone: () => import('McCore').McColor;
        };
        isOff: boolean;
        locked: boolean;
        frozen: boolean;
        lineType?: string | undefined;
        lineWidth?: import('McCore').McDbLineWeight | undefined;
        transparency?: number | undefined;
        desc?: string | undefined;
        index?: number | undefined;
    }[]>;
    selectedLayer: import('vue').ShallowRef<string, string>;
    selectLayer: (layerId: string) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    options: {
        type: () => Layer[];
        default: () => never[];
    };
}>> & Readonly<{}>, {
    options: Layer[];
    modelValue: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;

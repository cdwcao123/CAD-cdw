type __VLS_Props = {
    size?: string;
    disabled?: boolean;
    entityIds?: any;
    modelValue?: string | number | {
        colorIndex: number;
        colorMethod: number;
        color: {
            r: number;
            g: number;
            b: number;
        };
    };
    getOptions?: () => {
        label: string;
        value: string;
    }[];
    disabledColor?: any[];
    isHatchBackground?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: any) => any;
    "update:modelValue": (val: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: any) => any) | undefined;
    "onUpdate:modelValue"?: ((val: any) => any) | undefined;
}>, {
    size: string;
    disabled: boolean;
    getOptions: () => {
        label: string;
        value: string;
    }[];
    disabledColor: any[];
    isHatchBackground: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
